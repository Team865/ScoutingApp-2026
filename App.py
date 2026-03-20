import time
from flask import Flask, jsonify, render_template, request, Response
import requests
from dotenv import load_dotenv
import geoip2.database
import re
from werkzeug.middleware.proxy_fix import ProxyFix
from waitress import serve
from src.python.typehinting.ScoutingData import ScoutingMatchData
from src.python.util.ConfigParser import parse_config
from src.python.AppData import AppData, MatchNotesChunkJSon, PitScoutingNotesChunkJSon
import src.python.sse.TBAPoller as TBAPoller
from src.python.api_helpers.GoogleSheetsAPI import GoogleSpreadsheet, BackendWorksheet
import threading
from typing import Optional, TypedDict
from pathlib import Path
import sys

load_dotenv()

log_file_path = Path(__file__).resolve().parent.parent / "log.txt"
log_file = open(log_file_path, "a", encoding="utf-8")

class Tee:
    def __init__(self, *streams):
        self.streams = streams
    def write(self, message):
        for s in self.streams:
            s.write(message)
            s.flush()
    def flush(self):
        for s in self.streams:
            s.flush()

sys.stdout = Tee(sys.stdout, log_file)
sys.stderr = Tee(sys.stderr, log_file)

print(f"Logging started. Output will go to logs.txt")

APP_DIR = Path(__file__).resolve().parent
config = parse_config()
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)
trusted_proxy_headers = "x-forwarded-for x-forwarded-host x-forwarded-proto x-forwarded-port"

TBA_ROOT_URL = "https://www.thebluealliance.com/api/v3"
LOCAL_HOST_REGEX = re.compile(r"127\.\d+\.\d+\.\d+")
LAN_REGEX = re.compile(r"192\.\d+\.\d+\.\d+")

print("Authorizing spreadsheet...")
spreadsheet_manager = GoogleSpreadsheet(config["SHEETS_ID"])
print("Spreadsheet Authorized!")

app_data: AppData

reader = geoip2.database.Reader("geo/GeoLite2-City.mmdb")
ALLOWED_COUNTRIES = {"US", "CA"}

last_log_time: dict[str, float] = {}
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
    if ip is None:
        return "No IP could be found"
    isLocal = LOCAL_HOST_REGEX.match(ip) or LAN_REGEX.match(ip)
    if not isLocal:
        iso = get_country_iso(ip)
        country, region, city = get_location_details(ip)
        NamedLocation = f"{ip} from {country}, {region}, {city}"
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

@app.route("/api/scouting/rotation")
def get_scouting_rotation_data():
    scouter_name = request.headers.get("X-Request-ID")
    rotations = app_data.quantitative_scouting_data.rotations
    if scouter_name not in rotations:
        return jsonify({"Error": f"{scouter_name} does not exist in the rotation."}), 404
    return jsonify(rotations[scouter_name]), 200

@app.route("/api/superscouting")
def get_superscouting_data():
    returnJson = dict(app_data.superscouting_data.serialized, event_name=app_data.event_name)
    return jsonify(returnJson), 200

@app.route("/api/superscouting/epa")
def get_epa_data():
    class EPAGroup(TypedDict):
        epa: Optional[float]
        normalized_epa: Optional[int]
    timeout_seconds = 10
    epaJSon: dict[int, Optional[EPAGroup]] = {}
    for app_team_data in app_data.superscouting_data.fetched_team_data:
        start_time = time.time()
        while (app_team_data["normalized_epa"] is None) and ((time.time() - start_time) < timeout_seconds):
            pass
        if app_team_data["normalized_epa"] is None:
            epaJSon[app_team_data["number"]] = None
        epaJSon[app_team_data["number"]] = {
            "epa": app_team_data.get("epa", None),
            "normalized_epa": app_team_data["normalized_epa"]
        }
    return jsonify(epaJSon)

@app.post("/api/scouting/match-data")
def scouting_data_from_client():
    match_data: ScoutingMatchData = request.json
    spreadsheet_manager.add_row(
        BackendWorksheet.MATCH_DATA, 
        app_data.quantitative_scouting_data.add_scouting_data(match_data)
    )
    return {"message": "SUCCESS"}, 200

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

@app.route("/api/analysis")
def get_analysis_data():
    for app_team_data in app_data.superscouting_data.fetched_team_data:
        while "normalized_epa" not in app_team_data:
            pass
    return app_data.serialized

@app.route("/api/sse/superscouting")
def match_updates():
    stream = TBAPoller.sse_manager.register_client()
    return Response(stream(), mimetype="text/event-stream")

if __name__ == "__main__":
    is_prod = config["IS_PROD"]
    port = 5000 if is_prod else 5005
    print("Creating App Data...")
    app_data = AppData(config["EVENT_KEY"])
    spreadsheet_manager.set_row_col_values(BackendWorksheet.MATCH_DATA, app_data.quantitative_scouting_data.get_header)
    if len(spreadsheet_manager.backend_worksheets[BackendWorksheet.SCOUTING_ROTATION].get()) <= 1:
        spreadsheet_manager.set_scouting_rotation(app_data.quantitative_scouting_data.generate_scouting_rotation_csv())
    print("App Data initialized!")
    threading.Thread(target=TBAPoller.poll_tba_matches, args=(app_data, config["EVENT_KEY"]), daemon=True).start()
    threading.Thread(target=spreadsheet_manager.poll_sheets_data, args=(app_data, 5), daemon=True).start()
    print(f"\n===STARTING SERVER ON PORT {port}===\nAccess it locally at http://localhost:{port}")
    serve(app, host="0.0.0.0", port=port, threads=16, trusted_proxy="127.0.0.1", trusted_proxy_headers=trusted_proxy_headers)
