from typing import Literal, TypedDict
from .apiHelpers.TBAApi import get_teams, get_matches
from time import time

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
    match_data: list[MatchData]

    def __init__(self):
        self.fetched_team_data = []
        self.match_data = []

    @property
    def serialized(self):
        return {
            "fetched_team_data": self.fetched_team_data,
            "match_data": self.match_data
        }

class AppData:
    event_key: str
    superscouting_data: SuperScoutingData

    def __init__(self, event_key: str):
        fetchedTeamData = {}
        self.event_key = event_key
        self.superscouting_data = SuperScoutingData()
        self.fetchTBAData()

    def fetchTBAData(self):
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