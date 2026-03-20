from typing import Any

from src.python.util import ListUtil
from ..typehinting.StatboticsData import StatboticsTeamEventData, StatboticsTeamData
from requests import get
from threading import Thread

_STATBOTICS_ROOT = "https://api.statbotics.io/v3"

__all__ = ["_statbotics_request"]

def _statbotics_request(path: str) -> tuple[Any, int]:
    resp = get(f"{_STATBOTICS_ROOT}/{path}")

    if(not resp.ok):
        print(f"GET failed with HTTP code {resp.status_code} ({resp.reason})")
        return None, resp.status_code
    
    return resp.json(), 200

def update_epa(app_data, event_key: str):
    # Get event data first
    data, status_code = _statbotics_request(f"team_events?event={event_key}")

    if(status_code != 200):
        print(f"\u001B[31mFAILED TO FETCH STATBOTICS EPA FOR {event_key} \u001B[01m")
        return

    team_event_data: list[StatboticsTeamEventData] = data

    if(len(team_event_data) > 0): # Event data exists
        for team_data in team_event_data:
            app_team_data = ListUtil.find(app_data.superscouting_data.fetched_team_data, lambda team: team["number"] == team_data["team"])
            assert app_team_data is not None

            app_team_data["epa"] = team_data["epa"]["total_points"]["mean"]
            app_team_data["normalized_epa"] = team_data["epa"]["norm"]
    else: # Event data doesn't exist (offseason)
        # Fetch individual team data
        threads: list[Thread] = []

        # Create and start threads
        for atd in app_data.superscouting_data.fetched_team_data:
            def fetch_and_set_team_data(app_team_data):
                data, status_code = _statbotics_request(f"team/{app_team_data['number']}")

                if(status_code != 200):
                    print(f"\u001B[31mFAILED TO FETCH STATBOTICS EPA FOR TEAM {app_team_data["number"]} \u001B[01m")
                    return

                statbotics_team_data: StatboticsTeamData = data
                app_team_data["normalized_epa"] = statbotics_team_data["norm_epa"]["current"]

            thread = Thread(target=lambda: fetch_and_set_team_data(atd))
            thread.start()
            threads.append(thread)

        # Join threads
        for thread in threads:
            thread.join()