from functools import cache
from turtle import st
from dotenv import load_dotenv
from os import getenv
from typing import TypedDict

class _Config(TypedDict):
    API_KEY: str
    EVENT_KEY: str
    SHEETS_ID: str
    IS_PROD: bool

_config: _Config | dict[str, str] = {}

def parse_config() -> _Config:
    global _config

    if(_config): return _config

    load_dotenv()

    # .env
    _config.update({
        "API_KEY": getenv("TBA_API_KEY"),
        "EVENT_KEY": getenv("EVENT_KEY"),
        "SHEETS_ID": getenv("SHEETS_ID"),
        "IS_PROD": int(getenv("IS_PROD"))
    })

    return _config