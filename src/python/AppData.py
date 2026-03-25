from math import ceil
from typing import Literal, Mapping, Optional, TypedDict, Any, Callable, cast

from src.python.typehinting.ScoutingData import RobotPosition, ScoutingMatchData
from src.python.typehinting.ScoutingFields import PitScoutingFields
from src.python.util import ListUtil
from .sse import MatchNotes as MatchNotesSSE, PitScoutingNotes as PitScoutingSSE
from .api_helpers.TBAApi import get_teams, get_matches, get_event_info
from .api_helpers.StatboticsAPI import update_epa
from time import time
from threading import Thread
import re

"""
This python class will act as a container for all of the App Data used by the backend
"""

__all__ = ["AppData"]

_match_notes_csv_match_number_regex = re.compile(r"[\d]+\n")

_scouting_field_value_parser: dict[str, Callable[[str], Any]] = {
    "BOOLEAN": lambda value: value.lower() != "false" if value is not None else False,
    "TEXT": lambda value: value if value is not None else None,
    "NUMBER": lambda value: (float(value) if "." in value else int(value)) if value is not None else None,
    "NUMBER_RANGE": lambda value: int(value) if value is not None else None,
    "SINGLE_CHOICE": lambda value: value if value is not None else None,
    "MULTIPLE_CHOICE": lambda value: (value.split(", ") if value is not None else [])
}

_scouting_data_csv_cell_parser: dict[type, Callable[[str], Any]] = {
    str: _scouting_field_value_parser["TEXT"],
    bool: _scouting_field_value_parser["BOOLEAN"],
    int: lambda value: int(value) if value is not None else None,
    float: lambda value: float(value) if value is not None else None
}

def get_field_value_as_str(field_value):
    if(isinstance(field_value, list | tuple)):
        return ", ".join(field_value)
    elif(field_value is None):
        return ""
    else:
        return str(field_value)

class FetchedTeamData(TypedDict):
    name: str
    number: int
    key: str
    match_keys: list[str]
    epa: Optional[int]
    normalized_epa: Optional[int]

class Scouting_TBAMatchData(TypedDict):
    red_team_numbers: list[int]
    blue_team_numbers: list[int]

class Superscouting_TBAMatchData_Team(TypedDict):
    team_number: int
    alliance: Literal["red", "blue"]

class Superscouting_TBAMatchData(TypedDict):
    key: str
    number: int
    comp_level: str
    red_score: int
    blue_score: int
    teams: list[Superscouting_TBAMatchData_Team]

class MatchNotesChunkJSon(TypedDict):
    team_number: int
    match_number: int
    notes: str

class PitScoutingNotesChunkJSon(TypedDict):
    team_number: int
    is_complete: bool
    data: dict[str, Any]

class QuantitativeScoutingData:
    type _Alliance = Literal["Red", "Blue"]
    type _AllianceInfo = Literal["Red 1", "Red 2", "Red 3", "Blue 1", "Blue 2", "Blue 3"]

    # {
    #     scouter_name: {
    #         match_number: (team_number, alliance)
    #     }
    # }
    rotations: dict[str, 
                    dict[
                        int, tuple[
                            int, 
                            _Alliance
                        ]
                    ]]

    tba_match_data: dict[int, Scouting_TBAMatchData]
    data: list[ScoutingMatchData]
    num_matches: int

    _alliance_regex = re.compile(r"^[a-zA-Z]+")
    _alliance_index_regex = re.compile(r"\d$")

    # [
    #   (
    #       column_header: string,
    #       value_getter: (FrontendScoutingData) -> cell value
    #   )
    # ]
    _csv_columns: list[tuple[str, list[str], type]] = [
        ("Match Number", ["match_number"], int),
        ("Team Number", ["team_number"], int),
        ("Scouter Name", ["scouter_name"], str),
        ("Robot Position", ["robot_position"], str),
        ("Driver Skill", ["driver_skill"], int),
        ("Defense Skill", ["defense_skill"], int),
        ("Auto Fuel Scored", ["auto_fuel_scored"], int),
        ("Auto Intake Depot", ["auto_intake", "depot"], bool),
        ("Auto Intake Neutral Zone", ["auto_intake", "neutral_zone"], bool),
        ("Auto Intake Human Player", ["auto_intake", "human_player"], bool),
        ("Auto Climb Attempted", ["auto_climb", "attempted"], bool),
        ("Auto Climb Failed", ["auto_climb", "failed"], bool),
        ("Teleop Fuel Scored", ["teleop_fuel_scored"], int),
        ("Teleop Intake Depot", ["teleop_intake", "depot"], bool),
        ("Teleop Intake Neutral Zone", ["teleop_intake", "neutral_zone"], bool),
        ("Teleop Intake Human Player", ["teleop_intake", "human_player"], bool),
        ("Teleop Intake Home Alliance", ["teleop_intake", "home_alliance"], bool),
        ("Teleop Intake Opponent Alliance", ["teleop_intake", "opponent_alliance"], bool),
        ("Teleop Defense", ["teleop_defense"], bool),
        ("Teleop Passer", ["teleop_passer"], bool),
        ("Teleop Snowploughing", ["teleop_snowploughing"], bool),
        ("Teleop Human Player Deposit", ["teleop_human_player_deposit"], bool),
        ("Teleop Minor Foul", ["teleop_fouls", "minor"], int),
        ("Teleop Major Foul", ["teleop_fouls", "major"], int),
        ("Endgame Climb Type", ["endgame_climb_type"], str),
        ("Endgame Climb Failed", ["endgame_climb_failed"], bool),
        ("Endgame Climb Time Remaining", ["endgame_climb_time_remaining"], float),
        ("Comments", ["comments"], str)
    ]

    def __init__(self) -> None:
        self.data = []
        self.rotations = {}
        self.tba_match_data = {}

    def set_rotation(
        self, 
        scouter_name: str, 
        match_number: int, 
        team_number: int,
        alliance: _Alliance
    ):
        if(scouter_name not in self.rotations):
            self.rotations[scouter_name] = {}
        
        self.rotations[scouter_name][match_number] = (team_number, alliance)

    def set_scouting_rotation_from_csv(self, csv: list[list[str]]):
        if(len(csv) < 2): return # No rotation

        self.rotations = {}

        column_index_to_alliance: dict[int, QuantitativeScoutingData._AllianceInfo] = {}

        # Parse columns
        for column_index in range(1, 7):
            column_index_to_alliance[column_index] = cast(QuantitativeScoutingData._AllianceInfo, csv[0][column_index])
        
        def parse_shift(row: list[str]) -> int | None:
            raw_match_range = row[0].split("-")
            starting_match = int(raw_match_range[0].strip())
            ending_match = int(raw_match_range[1].strip())

            # {
            #   scouter_name: (alliance, alliance_index)
            # }
            assigned_matches: dict[str, tuple[Literal["Red", "Blue"], int]] = {}

            for column_index in range(1, len(row)):
                scouter_name = row[column_index]

                if(not scouter_name) or (scouter_name.lower() == "unset"): continue

                alliance_info = column_index_to_alliance[column_index]
                alliance = self._alliance_regex.search(alliance_info).group() # type: ignore
                alliance_index = int(self._alliance_index_regex.search(alliance_info).group()) - 1 # type: ignore
                assigned_matches[scouter_name] = (alliance, alliance_index) # type: ignore
            
            for match_number in range(starting_match, ending_match + 1):
                if(match_number not in self.tba_match_data):
                    # print("Match data could not be found for match", match_number)
                    continue

                match_data = self.tba_match_data[match_number]

                for scouter_name, assigned_match in assigned_matches.items():
                    alliance = assigned_match[0]
                    alliance_index = assigned_match[1]

                    team_number = (
                        match_data["red_team_numbers"][alliance_index]
                        if assigned_match[0] == "Red" else
                        match_data["blue_team_numbers"][alliance_index]
                    )

                    self.set_rotation(scouter_name, match_number, team_number, alliance)

        for row in csv[1:]:
            parse_shift(row)

    def set_scouting_data_from_csv(self, csv: list[list[str]]):
        if(len(csv) < 2): return # No data

        self.data = []
        min_cells = len(self._csv_columns)

        def parse_row(row: list[str]):
            if(len(row) < min_cells): return

            match_data: ScoutingMatchData = {} # type: ignore

            for cell_index in range(min_cells):
                cell = row[cell_index]
                key_sequence = self._csv_columns[cell_index][1]
                entry_type = self._csv_columns[cell_index][2]
                num_keys = len(key_sequence)
                current_dict = match_data

                for key_index, key in enumerate(key_sequence):
                    if(key_index < num_keys - 1):
                        if(key not in current_dict):
                            current_dict[key] = {}

                        current_dict = current_dict[key]
                    else:
                        current_dict[key] = _scouting_data_csv_cell_parser[entry_type](cell)

            self.data.append(match_data)

        for row in csv[1:]:
            parse_row(row)

    def add_scouting_data(self, frontend_data: ScoutingMatchData) -> list:
        """
        Returns the data as a CSV row
        """

        def get_dict_entry(key_sequence: list[str]):
            entry = frontend_data

            for key in key_sequence:
                entry = entry[key]

            return entry

        self.data.append(frontend_data) # type: ignore

        return [
            get_dict_entry(column_specs[1]) for column_specs in self._csv_columns
        ]

    def generate_scouting_rotation_csv(self):
        csv: list[list[str]] = [["Matches", "Blue 1", "Blue 2", "Blue 3", "Red 1", "Red 2", "Red 3"]]\

        shift_size = 3

        num_shifts = ceil(self.num_matches / shift_size)

        for shift_index in range(0, num_shifts):
            starting_match = 1 + shift_index * shift_size
            ending_match = min(starting_match + shift_size - 1, self.num_matches)
            csv.append([f"{starting_match} - {ending_match}"])

        return csv

    @property
    def get_header(self):
        return [
            [column_specs[0] for column_specs in self._csv_columns]
        ]

    @property
    def serialized(self):
        return self.data

class SuperScoutingData:
    data_received_timestamps: dict[str, float] = {}
    """
    A dictionary of recently pushed data and the time it was sent at. This allows
    the class the put a "lock" on the data, so when it receives data from the remote spreadsheet,
    it will reject the data if there was data recently sent from a frontend.
    """

    data_lockout_time_s = 5

    fetched_team_data: list[FetchedTeamData]

    # {
    #     team_number: {
    #         match_number: notes
    #     }
    # }
    match_notes: dict[int, dict[int, str]]

    # {
    #     team_number: ({
    #         field_name: field_value
    #     }, is_complete: bool)
    # }
    pit_scouting_notes: dict[int, tuple[dict[str, Any], bool]]

    match_data: list[Superscouting_TBAMatchData]

    def __init__(self):
        self.fetched_team_data = []
        self.match_notes = {}
        self.match_data = []
        self.pit_scouting_notes = {}
    
    def set_match_notes(self, match_notes_chunk: MatchNotesChunkJSon):
        # Create aliases for cleaner code
        team_number = match_notes_chunk["team_number"]
        match_number = match_notes_chunk["match_number"]
        notes = match_notes_chunk["notes"]

        # Lock notes
        self.data_received_timestamps[f"match_notes/{team_number}/{match_number}"] = time()

        # Update notes
        self.match_notes[team_number][match_number] = notes
        # Resort notes
        self.match_notes[team_number] = dict(sorted(self.match_notes[team_number].items()))
        # Broadcast updates
        MatchNotesSSE.broadcast_match_notes(match_notes_chunk)

    def set_pit_scouting_notes(self, pit_scouting_notes: PitScoutingNotesChunkJSon):
        team_number = pit_scouting_notes["team_number"]
        notes = pit_scouting_notes["data"]
        is_complete = pit_scouting_notes["is_complete"]

        # Lock notes
        self.data_received_timestamps[f"pit_scouting_notes/{team_number}"] = time()

        # Update notes
        self.pit_scouting_notes[team_number] = (notes, is_complete)
        # Resort notes
        self.pit_scouting_notes = dict(sorted(self.pit_scouting_notes.items()))
        # Broadcast updates
        PitScoutingSSE.broadcast_pit_scouting_notes(pit_scouting_notes)

    def _is_client_data_lockedout(self, timestamp_key: str) -> bool:
        # Check for lockout
        last_timestamp = timestamp_key in self.data_received_timestamps and self.data_received_timestamps[timestamp_key]

        if last_timestamp:
            time_since_last_client_update = time() - last_timestamp
            if(time_since_last_client_update < self.data_lockout_time_s): return True # Not enough time has passed yet, lock the data

        return False

    def set_match_notes_from_csv(self, csv: list[list[str]]):
        if(len(csv) < 2): return # No match notes

        def parse_team_match_notes(row: list[str]) -> Optional[tuple[int, list[int]]]:
            if(len(row) < 2): return None # No match notes

            team_number = int(row[0])
            match_note_cells = row[1:]

            changed_notes_match_numbers: list[int] = []

            for match_note_cell in match_note_cells:
                match_number_match = _match_notes_csv_match_number_regex.search(match_note_cell)

                if(match_number_match is None): continue

                match_number = int(match_number_match.group())

                if(self._is_client_data_lockedout(f"match_notes/{team_number}/{match_number}")): return None

                match_notes = match_note_cell[match_number_match.end():]

                preexisting_match_notes = match_number in self.match_notes[team_number] and self.match_notes[team_number]
                
                if(not(preexisting_match_notes) or (match_notes != preexisting_match_notes[match_number])):
                    changed_notes_match_numbers.append(match_number)
                    self.match_notes[team_number][match_number] = match_notes

            return team_number, changed_notes_match_numbers

        team_rows = csv[1:]

        for team_row in team_rows:
            parsed_team_row = parse_team_match_notes(team_row)

            if(parsed_team_row is None): continue

            team_number, changed_notes_match_numbers = parsed_team_row

            for match_number in changed_notes_match_numbers:
                MatchNotesSSE.broadcast_match_notes({
                    "team_number": team_number,
                    "match_number": match_number,
                    "notes": self.match_notes[team_number][match_number]
                })

    def set_pit_scouting_from_csv(self, csv: list[list[str]]):
        if(len(csv) < 2): return # No pit scouting data
        
        def parse_team_row(row: list[str]) -> Optional[tuple[int, bool]]:
            team_number = int(row[0])
            
            if(self._is_client_data_lockedout(f"pit_scouting_notes/{team_number}")): return None

            num_fields = len(PitScoutingFields)

            fields = row[1:1 + num_fields]
            
            is_complete = True if (len(row) >= (num_fields + 2) and row[len(row) - 1].lower() == "true") else False

            preexisting_notes = team_number in self.pit_scouting_notes and self.pit_scouting_notes[team_number]
            has_changed = False
            team_notes: dict[str, Any] = {}

            for field_index, field_value_str in enumerate(fields):
                field_name = PitScoutingFields[field_index]["name"]
                field_value: Any

                field_type = PitScoutingFields[field_index]["type"]
                field_value = _scouting_field_value_parser[field_type](field_value_str)

                if(not has_changed):
                    if(not preexisting_notes):
                        has_changed = True
                    elif(field_value != preexisting_notes[0][field_name]):
                        has_changed = True

                team_notes[field_name] = field_value

            if(has_changed): 
                self.pit_scouting_notes[team_number] = (team_notes, is_complete)
                return team_number, is_complete

        team_rows = csv[1:]

        for team_row in team_rows:
            parsed_row = parse_team_row(team_row)

            if(parsed_row is None): continue # Notes didn't change

            [team_number, is_complete] = parsed_row

            pit_scouting_notes_json: PitScoutingNotesChunkJSon = {
                "team_number": team_number,
                "is_complete": is_complete,
                "data": self.pit_scouting_notes[team_number][0]
            }
            
            PitScoutingSSE.broadcast_pit_scouting_notes(pit_scouting_notes_json)

    @property
    def serialized(self):
        return {
            "fetched_team_data": self.fetched_team_data,
            "match_notes": self.match_notes,
            "pit_scouting_notes": self.pit_scouting_notes,
            "match_data": self.match_data
        }
    
    @property
    def get_match_notes_csv(self):
        most_matches = max(len(team_notes) for team_notes in self.match_notes.values())

        return [["Team Number"] + [f"Match {i+1}" for i in range(most_matches)]] + \
            [
                [team_number]+
                [f"Q{match_number}\n{team_match_notes}" for match_number, team_match_notes in team_notes.items()] 
                for team_number, team_notes in self.match_notes.items()
            ]
    
    @property
    def get_pit_scouting_notes_csv(self):
        field_names = [field["name"] for field in PitScoutingFields]

        return [["Team Number"] + [field_name for field_name in field_names]] + \
            [
                [team_number]+
                [
                    get_field_value_as_str(field_value)
                    for field_value in team_pit_scouting_notes[0].values()
                ] +
                [team_pit_scouting_notes[1]]
                for team_number, team_pit_scouting_notes in self.pit_scouting_notes.items()
            ]

class AppData:
    event_key: str
    superscouting_data: SuperScoutingData
    quantitative_scouting_data: QuantitativeScoutingData

    def __init__(self, event_key: str):
        self.event_key = event_key
        self.superscouting_data = SuperScoutingData()
        self.quantitative_scouting_data = QuantitativeScoutingData()
        self.fetch_TBA_data()

        # Create match notes dictionaries
        for team in self.superscouting_data.fetched_team_data:
            self.superscouting_data.match_notes[team["number"]] = {}

        self.fetch_statbotics_data_async()
        
    def fetch_statbotics_data_async(self):
        # Fetch on a different thread
        Thread(target=lambda: update_epa(self, self.event_key)).start()

    def fetch_TBA_data(self):
        event_info = get_event_info(self.event_key)
        self.event_name = event_info.get("name", "No event found")
        
        # Fetch team data first
        tbaTeams = get_teams(self.event_key)
        tbaTeams.sort(key=lambda team: team["team_number"])
        
        for teamJSon in tbaTeams:
            self.superscouting_data.fetched_team_data.append({
                "name": teamJSon["nickname"],
                "number": teamJSon["team_number"],
                "key": teamJSon["key"],
                "match_keys": [],
                "epa": None,
                "normalized_epa": None
            })

        self.quantitative_scouting_data.num_matches = len(tbaTeams) * 2

        # Fetch matches data
        tbaMatches = get_matches(self.event_key)
        tbaMatches = [match for match in tbaMatches if match["comp_level"] == "qm"] # Keep only qualifier matches
        tbaMatches.sort(key=lambda matchData: matchData["match_number"])

        for match_json in tbaMatches:
            match_key = match_json["key"]
            teams_in_match: list[Superscouting_TBAMatchData_Team] = []

            # Loop through red alliance
            for team_key in match_json["alliances"]["red"]["team_keys"]:
                team_data = ListUtil.find(self.superscouting_data.fetched_team_data, lambda team: team["key"] == team_key)
                assert team_data is not None
                
                team_data["match_keys"].append(match_key)
                teams_in_match.append({
                    "team_number": team_data["number"],
                    "alliance": "red"
                })

            # Loop through blue alliance
            for team_key in match_json["alliances"]["blue"]["team_keys"]:
                team_data = ListUtil.find(self.superscouting_data.fetched_team_data, lambda team: team["key"] == team_key)
                assert team_data is not None

                team_data["match_keys"].append(match_key)
                teams_in_match.append({
                    "team_number": team_data["number"],
                    "alliance": "blue"
                })

            tba_match_data = {
                "key": match_json["key"],
                "number": match_json["match_number"],
                "comp_level": match_json["comp_level"],
                "red_score": match_json["alliances"]["red"]["score"],
                "blue_score": match_json["alliances"]["blue"]["score"],
                "teams": teams_in_match
            }

            self.quantitative_scouting_data.tba_match_data[match_json["match_number"]] = {
                "red_team_numbers": [
                    int(team_key.removeprefix("frc"))
                    for team_key in match_json["alliances"]["red"]["team_keys"]
                ],
                "blue_team_numbers": [
                    int(team_key.removeprefix("frc"))
                    for team_key in match_json["alliances"]["blue"]["team_keys"]
                ]
            }

            self.superscouting_data.match_data.append(tba_match_data) # type: ignore

    @property
    def serialized(self):
        return {
            "quantitative_data": self.quantitative_scouting_data.serialized,
            "superscouting": self.superscouting_data.serialized
        }