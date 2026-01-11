from functools import cache
from turtle import st
from dotenv import load_dotenv
from os import getenv
from typing import Optional, TypedDict, cast

class _Config(TypedDict):
    API_KEY: str
    EVENT_KEY: str
    SHEETS_ID: str
    IS_PROD: bool

_config: Optional[_Config] = None

def parse_config() -> _Config:
    global _config

    if(_config is not None): return _config

    load_dotenv()

    loaded_config = {
        "API_KEY": getenv("TBA_API_KEY"),
        "EVENT_KEY": getenv("EVENT_KEY"),
        "SHEETS_ID": getenv("SHEETS_ID"),
        "IS_PROD": getenv("IS_PROD")
    }

    missing_fields = []

    for field_name, field_value in loaded_config.items():
        if(field_value is None): missing_fields.append(field_name)

    if(len(missing_fields) > 0): raise LookupError(f"Required fields missing: {", ".join(missing_fields)}")

    loaded_config = cast(_Config, loaded_config)
    loaded_config["IS_PROD"] = int(loaded_config["IS_PROD"]) > 0

    # .env
    _config = loaded_config

    return _config