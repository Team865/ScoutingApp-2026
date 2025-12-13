from ..typehinting.TBAData import TBATeamData, TBAMatchData
from requests import get
from dotenv import load_dotenv
from os import getenv
load_dotenv()

_TBA_HEADER = {
    "X-TBA-Auth-Key": getenv("TBA_API_KEY")
}

_TBA_API_ROOT = "https://www.thebluealliance.com/api/v3"

__all__ = ["get_teams"]

def _tba_get_request(path: str) -> dict | list:
    resp = get(f"{_TBA_API_ROOT}/{path}",
                        headers=_TBA_HEADER)
    return resp.json()

def get_teams(event_key: str) -> list[TBATeamData]:
    return _tba_get_request(f"event/{event_key}/teams/simple")

def get_matches(event_key: str) -> list[TBAMatchData]:
    return _tba_get_request(f"event/{event_key}/matches/simple")