"""
This script will generate test data for the app.
"""

import sys
import re
from pprint import pprint
from os import chdir
import random
import string
from threading import Thread

sys.path.append("..")

from src.python.AppData import AppData
from src.python.util import PitScoutingFieldsParser
from src.python.api_helpers.GoogleSheetsAPI import GoogleSpreadsheet, BackendWorksheet
from src.python.util.ConfigParser import parse_config
from typing import Any, Callable

chdir("..")

config = parse_config("config.txt")
spreadsheet_manager = GoogleSpreadsheet(config["SHEETS_ID"])
pit_scouting_fields = PitScoutingFieldsParser.get_fields()

match_number_regex = re.compile(r"\d+$")

test_app_data = AppData(config["EVENT_KEY"])

teams = [team_data["number"] for team_data in test_app_data.superscouting_data.fetched_team_data]

_pit_scouting_field_generator: dict[str, Callable[[PitScoutingFieldsParser._FieldConfig], Any]] = {
    "BOOLEAN": lambda _: True if random.random() > 0.5 else False,
    "TEXT": lambda _: "".join(random.choices(string.ascii_letters + string.digits, k=20)),
    "NUMBER": lambda _: random.random() * 100,
    "NUMBER_RANGE": lambda field_config: int(random.random() * (field_config["max"] - field_config["min"] + 1) + field_config["min"]),
    "SINGLE_CHOICE": lambda field_config: random.choice(field_config["choices"]),
    "MULTIPLE_CHOICE": lambda field_config: [choice for choice in field_config["choices"] if random.random() > 0.5]
}

def generate_scouting_data():
    pass

def generate_superscouting_data():
    generator_threads: list[Thread] = []

    for team_data in test_app_data.superscouting_data.fetched_team_data:
        def generate_data(team_data):
            team_number = team_data["number"]
            matches = [int(match_number_regex.search(match_key).group()) for match_key in team_data["match_keys"]]

            for match_number in matches:
                test_app_data.superscouting_data.match_notes[team_number][match_number] = f"Test notes for match {match_number} of team {team_number}"

        thread = Thread(target=generate_data, args=[team_data], daemon=True)
        thread.start()
        generator_threads.append(thread)

    for thread in generator_threads: thread.join()

def generate_pit_scouting_data():
    generator_threads: list[Thread] = []

    for team_number in teams:
        def generate_data(team_number):
            notes = {}

            for fieldConfig in pit_scouting_fields:
                notes[fieldConfig["name"]] = _pit_scouting_field_generator[fieldConfig["type"]](fieldConfig)
                test_app_data.superscouting_data.pit_scouting_notes[team_number] = notes

        thread = Thread(target=generate_data, args=[team_number], daemon=True)
        thread.start()
        generator_threads.append(thread)

    for thread in generator_threads: thread.join()
            

def main():
    generate_scouting_data()
    generate_superscouting_data()
    generate_pit_scouting_data()

    spreadsheet_manager.set_row_col_values(BackendWorksheet.MATCH_NOTES, test_app_data.superscouting_data.get_match_notes_csv)
    spreadsheet_manager.set_row_col_values(BackendWorksheet.PIT_SCOUTING, test_app_data.superscouting_data.get_pit_scouting_notes_csv)

if __name__ == "__main__":
    main()