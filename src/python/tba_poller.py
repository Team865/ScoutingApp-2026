import time
import json
from queue import Queue
from typing import List
from .apiHelpers.TBAApi import get_matches

MATCH_POLL_INTERVAL = 5
completed_matches = set()
sse_clients: List[Queue] = []

def is_match_complete(match_json):
    red_score = match_json["alliances"]["red"]["score"]
    return red_score is not None and red_score >= 0

def register_sse_client(q: Queue):
    sse_clients.append(q)
    

def broadcast_match_update(appData, match_key: str):
    match_obj = next(
        (m for m in appData.superscouting_data.match_data if m["key"] == match_key),
        None
    )
    if not match_obj:
        return

    payload = "data: " + json.dumps(match_obj) + "\n\n"

    dead = []
    for q in sse_clients:
        try:
            q.put(payload)
        except:
            dead.append(q)

    for q in dead:
        if q in sse_clients:
            sse_clients.remove(q)

def poll_tba_matches(appData, event_key: str):
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
                            t for t in appData.superscouting_data.fetched_team_data
                            if t["key"] == team_key
                        )
                        if key not in team_data["match_keys"]:
                            team_data["match_keys"].append(key)

                        teams_in_match.append({
                            "team_number": team_data["number"],
                            "alliance": alliance
                        })

                appData.superscouting_data.match_data.append({
                    "key": key,
                    "number": match_json["match_number"],
                    "comp_level": match_json["comp_level"],
                    "red_score": match_json["alliances"]["red"]["score"],
                    "blue_score": match_json["alliances"]["blue"]["score"],
                    "teams": teams_in_match
                })

                broadcast_match_update(appData, key)

            time.sleep(MATCH_POLL_INTERVAL)
        except Exception as e:
            print("Error polling TBA:", e)
            time.sleep(MATCH_POLL_INTERVAL)
