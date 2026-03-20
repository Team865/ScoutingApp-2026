from typing import Literal, TypedDict

__all__ = ["FrontendScoutingData"]

class _FrontendScoutingData_auto_intake(TypedDict):
    depot: bool
    neutral_zone: bool
    human_player: bool

class _FrontendScoutingData_auto_climb(TypedDict):
    attempted: bool
    failed: bool

class _FrontendScoutingData_teleop_intake(TypedDict):
    depot: bool
    neutral_zone: bool
    human_player: bool
    home_alliance: bool
    opponent_alliance: bool

class _FrontendScoutingData_teleop_fouls(TypedDict):
    minor: int | float
    major: int | float

class FrontendScoutingData(TypedDict):
    scouter_name: str
    match_number: int | float
    team_number: int | float
    robot_position: Literal["Red Left", "Red Middle", "Red Right", "Blue Left", "Blue Middle", "Blue Right"]
    driver_skill: int | float
    defense_skill: int | float
    comments: str
    auto_fuel_scored: int | float
    auto_intake: _FrontendScoutingData_auto_intake
    auto_climb: _FrontendScoutingData_auto_climb
    teleop_fuel_scored: int | float
    teleop_intake: _FrontendScoutingData_teleop_intake
    teleop_defense: bool
    teleop_passer: bool
    teleop_snowploughing: bool
    teleop_human_player_deposit: bool
    teleop_fouls: _FrontendScoutingData_teleop_fouls
    endgame_climb_type: Literal["No Attempt", "Level 1", "Level 2", "Level 3"]
    endgame_climb_failed: bool
    endgame_climb_time_remaining: int | float