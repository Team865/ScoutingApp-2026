from flask import Flask, jsonify, render_template, abort, request
import os
import requests
from dotenv import load_dotenv
import geoip2.database

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("TBA_API_KEY")
ROOT_URL = "https://www.thebluealliance.com/api/v3"

reader = geoip2.database.Reader("geo/GeoLite2-Country.mmdb")
ALLOWED_COUNTRIES = {"US", "CA"}

def get_country(ip):
    try:
        response = reader.country(ip)
        return response.country.iso_code
    except:
        return None

@app.before_request
def restrict_countries():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    country = get_country(ip)
    if country not in ALLOWED_COUNTRIES:
        return "Access restricted to USA and Canada only.", 403

@app.route("/")
def scouting():
    return render_template("scouting.html")

@app.route("/superscouting")
def superscouting():
    return render_template("superscouting.html")

@app.route("/analysis")
def analysis():
    return render_template("analysis.html")

@app.route("/api/event/<competition_key>/info")
def get_event_info(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/event/<competition_key>/teams")
def get_teams(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}/teams/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

@app.route("/api/event/<competition_key>/matches")
def get_matches(competition_key):
    resp = requests.get(f"{ROOT_URL}/event/{competition_key}/matches/simple",
                        headers={"X-TBA-Auth-Key": API_KEY})
    return jsonify(resp.json()), resp.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
