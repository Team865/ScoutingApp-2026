from flask import Flask, jsonify, render_template, send_from_directory, url_for
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("TBA_API_KEY")
ROOT_URL = "https://www.thebluealliance.com/api/v3"

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
