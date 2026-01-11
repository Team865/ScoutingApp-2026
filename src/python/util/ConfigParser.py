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

def get_required_config_var(var_name: str):
    var_value = getenv(var_name)

    if(var_value is None):
        raise LookupError(f"Missing field {var_name} in .env")
    
    return var_value

def parse_config() -> _Config:
    global _config

    if(_config is not None): return _config

    load_dotenv()

    _config = {
        "API_KEY": get_required_config_var("TBA_API_KEY"),
        "EVENT_KEY": get_required_config_var("EVENT_KEY"),
        "SHEETS_ID": get_required_config_var("SHEETS_ID"),
        "IS_PROD": int(get_required_config_var("IS_PROD")) > 0
    }

    return _config