from typing import Literal, TypedDict, Any, Callable
from .sse import MatchNotes as MatchNotesSSE, PitScoutingNotes as PitScoutingSSE
from .api_helpers.TBAApi import get_teams, get_matches, get_event_info
from .api_helpers.StatboticsAPI import update_epa
from .util import PitScoutingFieldsParser
from time import time
from threading import Thread
import re

"""
This python class will act as a container for all of the App Data used by the backend
"""

__all__ = ["AppData"]

_pit_scouting_fields = PitScoutingFieldsParser.get_fields()
_match_notes_csv_match_number_regex = re.compile(r"[\d]+\n")
_pit_scouting_csv_field_type_regex = re.compile(r"(?<=Type: ).+\n")

_pit_scouting_field_value_parser: dict[str, Callable[[str], Any]] = {
    "BOOLEAN": lambda value: value.lower() != "false" if value is not None else False,
    "TEXT": lambda value: value if value is not None else None,
    "NUMBER": lambda value: (float(value) if "." in value else int(value)) if value is not None else None,
    "NUMBER_RANGE": lambda value: int(value) if value is not None else None,
    "SINGLE_CHOICE": lambda value: value if value is not None else None,
    "MULTIPLE_CHOICE": lambda value: (value.split(", ") if value is not None else [])
}

class FetchedTeamData(TypedDict):
    name: str
    number: int
    key: str
    match_keys: list[str]
    epa: int | None
    normalized_epa: int | None

class MatchData(TypedDict):
    class Team(TypedDict):
        team_number: int
        alliance: Literal["red", "blue"]

    key: str
    number: int
    comp_level: str
    red_score: int
    blue_score: int
    teams: list[Team]

class MatchNotesChunkJSon(TypedDict):
    team_number: int
    match_number: int
    notes: str

class PitScoutingNotesChunkJSon(TypedDict):
    team_number: int
    data: dict[str, Any]

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
    #     team_number: {
    #         field_name: field_value
    #     }
    # }
    pit_scouting_notes: dict[int, dict[str, Any]]

    match_data: list[MatchData]

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

        # Lock notes
        self.data_received_timestamps[f"pit_scouting_notes/{team_number}"] = time()

        # Update notes
        self.pit_scouting_notes[team_number] = notes
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

        def parse_team_match_notes(row: list[str]) -> tuple[int, dict[int, str]] | None:
            if(len(row) < 2): return # No match notes

            team_number = int(row[0])
            match_note_cells = row[1:]

            changed_notes_match_numbers: list[int] = []

            for match_note_cell in match_note_cells:
                match_number_match = _match_notes_csv_match_number_regex.search(match_note_cell)

                if(match_number_match is None): continue

                match_number = int(match_number_match.group())

                if(self._is_client_data_lockedout(f"match_notes/{team_number}/{match_number}")): return

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
        
        def parse_team_row(row: list[str]) -> tuple[int, dict[str, Any]] | None:
            team_number = int(row[0])
            
            if(self._is_client_data_lockedout(f"pit_scouting_notes/{team_number}")): return

            fields = row[1:]

            preexisting_notes = team_number in self.pit_scouting_notes and self.pit_scouting_notes[team_number]
            has_changed = False
            team_notes: dict[str, Any] = {}

            for field_index, field_value_cell in enumerate(fields):
                field_type_match = _pit_scouting_csv_field_type_regex.search(field_value_cell)
                field_name = _pit_scouting_fields[field_index]["name"]
                field_value: Any

                if field_type_match is not None:
                    field_type = field_type_match.group().strip()
                    field_value_str = field_value_cell[field_type_match.end():]
                    field_value = _pit_scouting_field_value_parser[field_type](field_value_str)
                else:
                    field_value = None

                if(not has_changed):
                    if(not preexisting_notes):
                        has_changed = True
                    elif(field_value != preexisting_notes[field_name]):
                        has_changed = True

                team_notes[field_name] = field_value

            if(has_changed): 
                self.pit_scouting_notes[team_number] = team_notes
                return team_number

        team_rows = csv[1:]

        for team_row in team_rows:
            team_number = parse_team_row(team_row)

            if(team_number is None): continue # Notes didn't change
            
            PitScoutingSSE.broadcast_pit_scouting_notes({
                "team_number": team_number,
                "data": self.pit_scouting_notes[team_number]
            })

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
        field_names = [field["name"] for field in _pit_scouting_fields]

        return [["Team Number"] + [field_name for field_name in field_names]] + \
            [
                [team_number]+
                [
                    f"Type: {_pit_scouting_fields[field_index]["type"]}\n" + \
                        PitScoutingFieldsParser.get_field_value_as_str(field_value) 
                    for field_index, field_value in enumerate(team_pit_scouting_notes.values())
                ] 
                for team_number, team_pit_scouting_notes in self.pit_scouting_notes.items()
            ]

class AppData:
    event_key: str
    superscouting_data: SuperScoutingData

    def __init__(self, event_key: str):
        self.event_key = event_key
        self.superscouting_data = SuperScoutingData()
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
                "match_keys": []
            })

        # Fetch matches data
        tbaMatches = get_matches(self.event_key)
        tbaMatches = [match for match in tbaMatches if match["comp_level"] == "qm"] # Keep only qualifier matches
        tbaMatches.sort(key=lambda matchData: matchData["match_number"])

        for match_json in tbaMatches:
            match_key = match_json["key"]
            teams_in_match: list[MatchData.Team] = []

            # Loop through red alliance
            for team_key in match_json["alliances"]["red"]["team_keys"]:
                team_data = next(team for team in self.superscouting_data.fetched_team_data if team["key"] == team_key)
                team_data["match_keys"].append(match_key)
                teams_in_match.append({
                    "team_number": team_data["number"],
                    "alliance": "red"
                })

            # Loop through blue alliance
            for team_key in match_json["alliances"]["blue"]["team_keys"]:
                team_data = next(team for team in self.superscouting_data.fetched_team_data if team["key"] == team_key)
                team_data["match_keys"].append(match_key)
                teams_in_match.append({
                    "team_number": team_data["number"],
                    "alliance": "blue"
                })

            self.superscouting_data.match_data.append({
                "key": match_json["key"],
                "number": match_json["match_number"],
                "comp_level": match_json["comp_level"],
                "red_score": match_json["alliances"]["red"]["score"],
                "blue_score": match_json["alliances"]["blue"]["score"],
                "teams": teams_in_match
            })

    @property
    def serialized(self):
        return {
            "superscouting": self.superscouting_data.serialized
        }