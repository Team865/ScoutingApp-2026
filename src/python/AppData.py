from typing import Literal, TypedDict, Any
from .api_helpers.TBAApi import get_teams, get_matches, get_event_info
from .api_helpers.StatboticsAPI import update_epa
from .util import PitScoutingFieldsParser
from time import time
from threading import Thread
"""
This python class will act as a container for all of the App Data used by the backend
"""

__all__ = ["AppData"]

_pit_scouting_fields = PitScoutingFieldsParser.get_fields()

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

class SuperScoutingData:
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
    event_name: str

    def __init__(self):
        self.fetched_team_data = []
        self.match_notes = {}
        self.match_data = []
        self.pit_scouting_notes = {}
    
    def set_match_notes(self, team_number: int, match_number: int, notes: str):
        self.match_notes[team_number][match_number] = notes
        # Resort notes
        self.match_notes[team_number] = dict(sorted(self.match_notes[team_number].items()))

    def set_pit_scouting_notes(self, team_number: int, notes: dict[str, Any]):
        self.pit_scouting_notes[team_number] = notes
        # Resort notes
        self.pit_scouting_notes = dict(sorted(self.pit_scouting_notes.items()))

    @property
    def serialized(self):
        return {
            "fetched_team_data": self.fetched_team_data,
            "match_notes": self.match_notes,
            "pit_scouting_notes": self.pit_scouting_notes,
            "match_data": self.match_data,
            "event_name": self.event_name
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
        self.superscouting_data.event_name = event_info.get("name", "No event found")
        
        startTime = time()
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
