import time
from typing import cast

from flask import app

from src.python.util import ListUtil
from ..api_helpers.TBAApi import get_matches
from .SuperScoutingEndpoint import sse_manager
from ..AppData import AppData, Superscouting_TBAMatchData

MATCH_POLL_INTERVAL = 5
completed_matches = set()

def is_match_complete(match_json):
    red_score = match_json["alliances"]["red"]["score"]
    return red_score is not None and red_score >= 0
    
def broadcast_match_update(appData: AppData, match_key: str):
    match_obj = ListUtil.find(appData.superscouting_data.match_data, lambda m: m["key"] == match_key)
    if not match_obj:
        return
    
    sse_manager.add_payload({
        "event_name": "match-updates",
        "match_updates": match_obj
    })

def poll_tba_matches(app_data: AppData, event_key: str):
    for match in app_data.superscouting_data.match_data:
        if(match["red_score"] and match["red_score"] >= 0):
            completed_matches.add(match["key"])

    while True:
        try:
            matches = get_matches(event_key)
            matches = [m for m in matches if m["comp_level"] == "qm"]
            matches.sort(key=lambda m: m["match_number"])

            for match_json in matches:
                key = match_json["key"]
                if key in completed_matches:
                    continue

                if not is_match_complete(match_json):
                    continue

                completed_matches.add(key)

                print("New match data from match", key)

                teams_in_match = []
                for alliance in ("red", "blue"):
                    for team_key in match_json["alliances"][alliance]["team_keys"]:
                        team_data = ListUtil.find(
                            app_data.superscouting_data.fetched_team_data,
                            lambda t: t["key"] == team_key
                        )
                        if(team_data is None):
                            print(team_key, "could not be found for match", match_json["match_number"])
                            continue

                        if key not in team_data["match_keys"]:
                            team_data["match_keys"].append(key)

                        teams_in_match.append({
                            "team_number": team_data["number"],
                            "alliance": alliance
                        })
                    
                app_data.superscouting_data.match_data.append(cast(Superscouting_TBAMatchData,
                    {
                    "key": key,
                    "number": match_json["match_number"],
                    "comp_level": match_json["comp_level"],
                    "red_score": match_json["alliances"]["red"]["score"],
                    "blue_score": match_json["alliances"]["blue"]["score"],
                    "teams": teams_in_match
                    }
                ))

                broadcast_match_update(app_data, key)

            time.sleep(MATCH_POLL_INTERVAL)
        except Exception as e:
            print("Error polling TBA:", e)
            time.sleep(MATCH_POLL_INTERVAL)
