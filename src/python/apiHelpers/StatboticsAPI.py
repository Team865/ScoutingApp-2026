from statbotics import Statbotics
from typing import TypedDict
from ..typehinting.StatboticsData import StatboticsTeamEventData, StatboticsTeamData
from requests import get
from threading import Thread

_statboticsObj = Statbotics()
_STATBOTICS_ROOT = "https://api.statbotics.io/v3"

__all__ = ["get_epa"]

class EPAData(TypedDict):
    team_number: int
    epa: float
    normalized_epa: int

def _statbotics_request(path: str):
    resp = get(f"{_STATBOTICS_ROOT}/{path}")

    if(not resp.ok):
        raise ValueError(f"GET failed with HTTP code {resp.status_code} ({resp.reason})")
    
    return resp.json()

def update_epa(app_data, event_key: str) -> EPAData:
    # Get event data first
    team_event_data: list[StatboticsTeamEventData] = _statbotics_request(f"team_events?event={event_key}")

    if(len(team_event_data) > 0): # Event data exists
        for team_data in team_event_data:
            app_team_data = next(team for team in app_data.superscouting_data.fetched_team_data if team["number"] == team_data["team"])
            app_team_data["epa"] = team_data["epa"]["total_points"]["mean"]
            app_team_data["normalized_epa"] = team_data["epa"]["norm"]
    else: # Event data doesn't exist (offseason)
        # Fetch individual team data
        threads: list[Thread] = []

        # Create and start threads
        for atd in app_data.superscouting_data.fetched_team_data:
            def fetch_and_set_team_data(app_team_data):
                statbotics_team_data: StatboticsTeamData = _statbotics_request(f"team/{app_team_data['number']}")
                app_team_data["normalized_epa"] = statbotics_team_data["norm_epa"]["current"]

            thread = Thread(target=lambda: fetch_and_set_team_data(atd))
            thread.start()
            threads.append(thread)

        # Join threads
        for thread in threads:
            thread.join()