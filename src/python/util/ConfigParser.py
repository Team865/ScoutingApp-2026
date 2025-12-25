from functools import cache
from turtle import st
from dotenv import load_dotenv
from os import getenv
from typing import TypedDict

class _Config(TypedDict):
    API_KEY: str
    EVENT_KEY: str
    SHEETS_ID: str
    TEST_MODE: str

_config: _Config | dict[str, str] = {}

def parse_config(config_txt) -> _Config:
    global _config

    if(_config): return _config

    load_dotenv()

    # .env
    _config.update({
        "API_KEY": getenv("TBA_API_KEY"),
        "EVENT_KEY": getenv("EVENT_KEY"),
        "SHEETS_ID": getenv("SHEETS_ID")
    })

    # config.txt
    with open(config_txt, "r") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue

            if "=" not in line:
                continue  

            key, value = line.split("=", 1)
            _config[key.strip()] = value.strip()

    return _config