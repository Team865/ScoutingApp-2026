from typing import Literal, TypedDict

__all__ = ["FrontendScoutingData"]

class _FrontendScoutingData_autoIntake(TypedDict):
    depot: bool
    neutralZone: bool
    humanPlayer: bool

class _FrontendScoutingData_autoClimb(TypedDict):
    attempted: bool
    failed: bool

class _FrontendScoutingData_teleopIntake(TypedDict):
    depot: bool
    neutralZone: bool
    humanPlayer: bool
    homeAlliance: bool
    opponentAlliance: bool

class _FrontendScoutingData_teleopFouls(TypedDict):
    minor: bool
    major: bool

class FrontendScoutingData(TypedDict):
    scouterName: str
    matchNumber: int | float
    teamNumber: int | float
    robotPosition: Literal["Red Left", "Red Middle", "Red Right", "Blue Left", "Blue Middle", "Blue Right"]
    driverSkill: int | float
    defenseSkill: int | float
    comments: str
    autoFuelScored: int | float
    autoIntake: _FrontendScoutingData_autoIntake
    autoClimb: _FrontendScoutingData_autoClimb
    teleopFuelScored: int | float
    teleopIntake: _FrontendScoutingData_teleopIntake
    teleopDefense: bool
    teleopPasser: bool
    teleopSnowploughing: bool
    teleopHumanPlayerDeposit: bool
    teleopFouls: _FrontendScoutingData_teleopFouls
    endgameClimbType: Literal["No Attempt", "Level 1", "Level 2", "Level 3"]
    endgameClimbFailed: bool
    endgameClimbTimeRemaining: int | float