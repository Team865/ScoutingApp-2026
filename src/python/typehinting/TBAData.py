from typing import TypedDict, Literal

__all__ = ["TBATeamData" "TBAMatchData"]

class TBATeamData(TypedDict):
    key: str
    team_number: int
    nickname: str
    name: str
    city: str
    state_prov: str
    country: str

class TBAMatchData(TypedDict):
    class _Alliances(TypedDict):
        class _Alliance(TypedDict):
            score: int
            team_keys: list[str]
            surrogate_team_keys: list[str]
            dq_team_keys: list[str]

        red: _Alliance
        blue: _Alliance

    key: str
    comp_level: Literal["qm", "ef", "qf", "sf", "f"]
    set_number: int
    match_number: int
    alliances: _Alliances
    winning_alliance: Literal["red", "blue"]
    event_key: str
    time: int
    predicted_time: int
    actual_time: int