from flask import Flask, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_url_path="", static_folder=".")

API_KEY = os.getenv("TBA_API_KEY")
ROOT_URL = "https://www.thebluealliance.com/api/v3"

@app.route("/")
def scouting():
    return app.send_static_file("scouting.html")

@app.route("/superscouting")
def superscouting():
    return app.send_static_file("superscouting.html")

@app.route("/analysis")
def analysis():
    return app.send_static_file("analysis.html")

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
