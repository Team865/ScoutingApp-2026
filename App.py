import time
from flask import Flask, jsonify, render_template, request, Response
import os
import sys
import requests
from dotenv import load_dotenv
import geoip2.database
import re
from werkzeug.middleware.proxy_fix import ProxyFix
from waitress import serve
from src.python.AppData import AppData, MatchNotesChunkJSon, PitScoutingNotesChunkJSon
from pprint import pprint
from queue import Queue
from src.python.sse.SuperScoutingEndpoint import sse_manager as SuperScoutingSSEManager
import src.python.sse.TBAPoller as TBAPoller
import src.python.sse.MatchNotes as MatchNotesManager
import src.python.sse.PitScoutingNotes as PitScoutingManager
from src.python.api_helpers.GoogleSheetsAPI import GoogleSpreadsheet, BackendWorksheet
import threading
import json
from typing import TypedDict, Any
from pathlib import Path
from src.python.ConfigParser import parse_config
from src.python.debug.DebugMenu import DebugMenu
load_dotenv()

APP_DIR = Path(__file__).resolve().parent
config = parse_config(APP_DIR / "config.txt")
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)
trusted_proxy_headers = "x-forwarded-for x-forwarded-host x-forwarded-proto x-forwarded-port"

API_KEY = os.getenv("TBA_API_KEY")
EVENT_KEY = os.getenv("EVENT_KEY")
TBA_ROOT_URL = "https://www.thebluealliance.com/api/v3"
LOCAL_HOST_REGEX = re.compile(r"127\.\d+\.\d+\.\d+")
LAN_REGEX = re.compile(r"192\.\d+\.\d+\.\d+")
SHEETS_ID =os.getenv("SHEETS_ID")

print("Authorizing spreadsheet...")
spreadsheet_manager = GoogleSpreadsheet(SHEETS_ID)
# spreadsheet_manager.clear_backend_worksheets() # FOR NOW, CLEAR THE WORKSHEET EVERY TIME THE APP STARTS UP
print("Spreadsheet Authorized!")

app_data: AppData

reader = geoip2.database.Reader("geo/GeoLite2-City.mmdb")
ALLOWED_COUNTRIES = {"US", "CA"}

last_log_time = {}
DEBOUNCE_SECONDS = 5

def get_country_iso(ip):
    try:
        return reader.city(ip).country.iso_code
    except:
        return None

def get_location_details(ip):
    try:

        resp = reader.city(ip)
        country = resp.country.name or "Unknown"
        region = resp.subdivisions.most_specific.name or "Unknown"
        city = resp.city.name or "Unknown"
        return country, region, city
    except:
        return "Unknown", "Unknown", "Unknown"

@app.before_request
def restrict_countries():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    isLocal = LOCAL_HOST_REGEX.match(ip) or LAN_REGEX.match(ip)

    if not isLocal:
        iso = get_country_iso(ip)
        country, region, city = get_location_details(ip)
        NamedLocation = f"{ip} from {country}, {region}, {city}"

        # Debounce logging per IP
        now = time.time()
        if ip not in last_log_time or (now - last_log_time[ip]) > DEBOUNCE_SECONDS:
            print(NamedLocation)
            last_log_time[ip] = now

        if iso not in ALLOWED_COUNTRIES:
            return f"Country Detected: {iso}.\nAccess restricted to USA and Canada only.", 403
        
@app.route("/")
def scouting():
    return render_template("scouting.html")

@app.route("/superscouting")
def superscouting():
    return render_template("superscouting.html")

@app.route("/analysis")
def analysis():
    return render_template("analysis.html")

# TBA Calls
@app.route("/api/tba/event/<competition_key>/info")
def get_event_info(competition_key):
    resp = requests.get(f"{TBA_ROOT_URL}/event/{competition_key}",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/tba/event/<competition_key>/teams")
def get_teams(competition_key):
    resp = requests.get(f"{TBA_ROOT_URL}/event/{competition_key}/teams/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/tba/event/<competition_key>/matches")
def get_matches(competition_key):
    resp = requests.get(f"{TBA_ROOT_URL}/event/{competition_key}/matches/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

# App API Endpoints
@app.route("/api/superscouting")
def get_superscouting_data():
    return jsonify(app_data.superscouting_data.serialized), 200

@app.route("/api/superscouting/epa")
def get_epa_data():
    # Create JSon to return
    class EPAGroup(TypedDict):
        epa: float | None
        normalized_epa: int
    
    epaJSon: dict[int, EPAGroup] = {}

    for app_team_data in app_data.superscouting_data.fetched_team_data:
        while "normalized_epa" not in app_team_data:
            pass

        epaJSon[app_team_data["number"]] = {
            "epa": "epa" in app_team_data and app_team_data["epa"] or None,
            "normalized_epa": app_team_data["normalized_epa"]
        }

    return jsonify(epaJSon)

@app.post("/api/superscouting/match-notes")
def match_notes_from_client():
    match_notes: MatchNotesChunkJSon = request.json
    
    app_data.superscouting_data.set_match_notes(match_notes)
    spreadsheet_manager.set_row_col_values(BackendWorksheet.MATCH_NOTES, app_data.superscouting_data.get_match_notes_csv)

    return {"message": "SUCCESS"}, 200

@app.post("/api/superscouting/pit-scouting-notes")
def pit_scouting_notes_from_client():
    pit_scouting_notes: PitScoutingNotesChunkJSon = request.json

    app_data.superscouting_data.set_pit_scouting_notes(pit_scouting_notes)
    spreadsheet_manager.set_row_col_values(BackendWorksheet.PIT_SCOUTING, app_data.superscouting_data.get_pit_scouting_notes_csv)

    return {"message": "SUCCESS"}, 200

#SSE feed for Superscouting App clients
@app.route("/api/sse/superscouting")
def match_updates():
    stream = TBAPoller.sse_manager.register_client()

    return Response(stream(), mimetype="text/event-stream")

##NOT A PRODUCTION FUNCTION, will remove  later for cleanliness
def send_test_messages():
    match_key = f"{EVENT_KEY}_qm10"

    while True:
        time.sleep(2)
        payload = {
            "key": match_key,
            "red_score": 67,   
            "blue_score": 41,  
            "teams": [
                {"team_number": 9589, "alliance": "red"},
                {"team_number": 6865, "alliance": "red"},
                {"team_number": 7476, "alliance": "red"},
                {"team_number": 7757, "alliance": "blue"},
                {"team_number": 865, "alliance": "blue"},
                {"team_number": 244, "alliance": "blue"}
            ]
        }

        TBAPoller.sse_manager.add_payload({
            "event_name": "match-updates",
            "match_updates": payload
        })

def debug_menu_behavior():
    DEBUG_MENU = DebugMenu()

    def stream():
        while True:
            yield DEBUG_MENU.message_queue.get()

    for message in stream():
        match message:
            case "print_tba_clients":
                print(len(TBAPoller.sse_manager.sse_clients), "match update clients")
            case "print_match_notes_clients":
                print(len(MatchNotesManager.sse_manager.sse_clients), "match note clients")
            case _:
                print("Message received:", message)

if __name__ == "__main__":
    is_test_mode = int(config["TEST_MODE"]) > 0
    port = 5005 if is_test_mode else 5000

    print("Creating App Data...")
    app_data = AppData(EVENT_KEY)
    print("App Data initialized!")

    threading.Thread(target=TBAPoller.poll_tba_matches, args=(app_data, EVENT_KEY), daemon=True).start()
    threading.Thread(target=spreadsheet_manager.poll_sheets_data, args=(app_data, 5), daemon=True).start()

    #Put anything  that needs  to run only for testing here
    if is_test_mode:
        threading.Thread(target=send_test_messages, daemon=True).start()

    print(f"\n===STARTING SERVER ON PORT {port}===\nAccess it locally at http://localhost:{port}")
    serve(app, host="0.0.0.0", port=port, threads=16, trusted_proxy="127.0.0.1", trusted_proxy_headers=trusted_proxy_headers)