import time
from flask import Flask, jsonify, render_template, request, Response
import os
import sys
import requests
from dotenv import load_dotenv
import geoip2.database
import re
import gspread
from werkzeug.middleware.proxy_fix import ProxyFix
from google.oauth2.service_account import Credentials
from waitress import serve
from src.python.AppData import AppData
from pprint import pprint
from queue import Queue
from src.python.sse.TBAPoller import poll_tba_matches
from src.python.sse.TBAPoller import sse_manager as tba_sse_manager
import threading
import json
from pathlib import Path
from src.python.ConfigParser import parse_config
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
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


### Check for prerequisite files
try: 
    creds = Credentials.from_service_account_file("service_account.json", scopes=SCOPES)
except:
    print('WARNING: Google credentials not found. Have you set up the service_account JSON?')
    sys.exit(0)

gc = gspread.authorize(creds)
try: 
    sheet = gc.open_by_key(SHEETS_ID).sheet1
except:
    print('WARNING: Google sheet not set. Have you set the id in .env?')
    sys.exit(0)
###

# Create App Data
appData = AppData(EVENT_KEY)

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
    return jsonify(appData.superscouting_data.serialized), 200

#SSE feed for TBA data  to clients
@app.route("/api/sse/tba-match-updates")
def match_updates():
    stream = tba_sse_manager.register_client()

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

        message = f"data: {json.dumps(payload)}\n\n"

        tba_sse_manager.add_payload(message)

if __name__ == "__main__":
    threading.Thread(target=poll_tba_matches, args=(appData, EVENT_KEY), daemon=True).start()

    #Put anything  that needs  to run only for testing here
    if  int(config["TEST_MODE"]) > 0:
        threading.Thread(target=send_test_messages, daemon=True).start()
        serve(app, host="0.0.0.0", port=5005, threads=16, trusted_proxy="127.0.0.1", trusted_proxy_headers=trusted_proxy_headers)
    else:
        serve(app, host="0.0.0.0", port=5000, threads=16, trusted_proxy="127.0.0.1", trusted_proxy_headers=trusted_proxy_headers)