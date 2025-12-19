import time
from ..api_helpers.TBAApi import get_matches
from .SuperScoutingEndpoint import sse_manager
from ..AppData import AppData

MATCH_POLL_INTERVAL = 5
completed_matches = set()

def is_match_complete(match_json):
    red_score = match_json["alliances"]["red"]["score"]
    return red_score is not None and red_score >= 0
    
def broadcast_match_update(appData: AppData, match_key: str):
    match_obj = next(
        (m for m in appData.superscouting_data.match_data if m["key"] == match_key),
        None
    )
    if not match_obj:
        return
    
    sse_manager.add_payload({
        "event_name": "match-updates",
        "match_updates": match_obj
    })

def poll_tba_matches(app_data: AppData, event_key: str):
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

                teams_in_match = []
                for alliance in ["red", "blue"]:
                    for team_key in match_json["alliances"][alliance]["team_keys"]:
                        team_data = next(
                            t for t in app_data.superscouting_data.fetched_team_data
                            if t["key"] == team_key
                        )
                        if key not in team_data["match_keys"]:
                            team_data["match_keys"].append(key)

                        teams_in_match.append({
                            "team_number": team_data["number"],
                            "alliance": alliance
                        })

                app_data.superscouting_data.match_data.append({
                    "key": key,
                    "number": match_json["match_number"],
                    "comp_level": match_json["comp_level"],
                    "red_score": match_json["alliances"]["red"]["score"],
                    "blue_score": match_json["alliances"]["blue"]["score"],
                    "teams": teams_in_match
                })

                broadcast_match_update(app_data, key)

            time.sleep(MATCH_POLL_INTERVAL)
        except Exception as e:
            print("Error polling TBA:", e)
            time.sleep(MATCH_POLL_INTERVAL)
