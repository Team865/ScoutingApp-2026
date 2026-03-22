from typing import Any, Optional

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

def update_epa(app_data, event_key: str) -> tuple[int, Any]:
    # Get event data first
    data, status_code = _statbotics_request(f"team_events?event={event_key}")

    if(status_code != 200):
        message = f"FAILED TO FETCH STATBOTICS EPA FOR {event_key}: {data}"

        print(f"\u001B[31m{message}\u001b[0m")
        return status_code, message

    team_event_data: list[StatboticsTeamEventData] = data

    if(len(team_event_data) > 0): # Event data exists
        for team_data in team_event_data:
            app_team_data = ListUtil.find(app_data.superscouting_data.fetched_team_data, lambda team: team["number"] == team_data["team"])
            assert app_team_data is not None

            app_team_data["epa"] = team_data["epa"]["total_points"]["mean"]
            app_team_data["normalized_epa"] = team_data["epa"]["norm"]

        return 200, "SUCCESS"
    else: # Event data doesn't exist (offseason)
        # Fetch individual team data
        threads: list[Thread] = []
        failed_requests: list[int] = []

        # Create and start threads
        for atd in app_data.superscouting_data.fetched_team_data:
            def fetch_and_set_team_data(app_team_data):
                data, status_code = _statbotics_request(f"team/{app_team_data['number']}")

                if(status_code != 200):
                    print(f"\u001B[31mFAILED TO FETCH STATBOTICS EPA FOR TEAM {app_team_data["number"]}: {data}\u001b[0m")
                    failed_requests.append(app_team_data["number"])
                    return

                statbotics_team_data: StatboticsTeamData = data
                app_team_data["normalized_epa"] = statbotics_team_data["norm_epa"]["current"]

            thread = Thread(target=lambda: fetch_and_set_team_data(atd))
            thread.start()
            threads.append(thread)

        # Join threads
        for thread in threads:
            thread.join()

        if(len(failed_requests) > 0):
            return 500, f"Request failed for teams: {", ".join([str(v) for v in failed_requests])}"
        else:
            return 200, "SUCCESS"