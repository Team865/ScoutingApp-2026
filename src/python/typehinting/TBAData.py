__all__ = ["TBATeamData", "TBAMatchData"]

from typing import TypedDict, Literal

class TBATeamData(TypedDict):
    key: str
    team_number: int
    nickname: str
    name: str
    city: str
    state_prov: str
    country: str

class _TBAMatchData_Alliances_Alliance(TypedDict):
    score: int
    team_keys: list[str]
    surrogate_team_keys: list[str]
    dq_team_keys: list[str]

class _TBAMatchData_Alliances(TypedDict):
    red: _TBAMatchData_Alliances_Alliance
    blue: _TBAMatchData_Alliances_Alliance

class TBAMatchData(TypedDict):
    key: str
    comp_level: Literal["qm", "ef", "qf", "sf", "f"]
    set_number: int
    match_number: int
    alliances: _TBAMatchData_Alliances
    winning_alliance: Literal["red", "blue"]
    event_key: str
    time: int
    predicted_time: int
    actual_time: int