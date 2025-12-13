from typing import Literal, TypedDict
from .apiHelpers.TBAApi import get_teams, get_matches, get_event_info
from .apiHelpers.StatboticsAPI import update_epa
from time import time
from threading import Thread
"""
This python class will act as a container for all of the App Data used by the backend
"""

__all__ = ["AppData"]

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
    #     match_number: {
    #         team_number: notes
    #     }
    # }
    match_notes: dict[int, dict[int, str]]

    match_data: list[MatchData]
    event_name: str

    def __init__(self):
        self.fetched_team_data = []
        self.match_notes = {}
        self.match_data = []
    
    def set_match_notes(self, team_number: int, match_number: int, notes: str):
        self.match_notes[team_number][match_number] = notes

    @property
    def serialized(self):
        return {
            "fetched_team_data": self.fetched_team_data,
            "match_notes": self.match_notes,
            "match_data": self.match_data,
            "event_name": self.event_name
        }

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
