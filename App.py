import time
from flask import Flask, jsonify, render_template, request
import os
import requests
from dotenv import load_dotenv
import geoip2.database
import re
from werkzeug.middleware.proxy_fix import ProxyFix

load_dotenv()

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)
trusted_proxy_headers = "x-forwarded-for x-forwarded-host x-forwarded-proto x-forwarded-port"

API_KEY = os.getenv("TBA_API_KEY")
ROOT_URL = "https://www.thebluealliance.com/api/v3"
LOCAL_HOST_REGEX = re.compile(r"127\.\d+\.\d+\.\d+")
LAN_REGEX = re.compile(r"192\.\d+\.\d+\.\d+")

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

@app.route("/api/tba/event/<competition_key>/info")
def get_event_info(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/tba/event/<competition_key>/teams")
def get_teams(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}/teams/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/tba/event/<competition_key>/matches")
def get_matches(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}/matches/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000, threads=16, trusted_proxy="127.0.0.1", trusted_proxy_headers=trusted_proxy_headers)
