__all__ = ["FrontendScoutingData"]

from typing import Literal, TypedDict

class FrontendScoutingData(TypedDict):
    class _AutoIntake(TypedDict):
        depot: bool
        neutralZone: bool
        outpost: bool # pyright: ignore[reportGeneralTypeIssues]

    class _AutoClimb(TypedDict):
        attempted: bool
        failed: bool # pyright: ignore[reportGeneralTypeIssues]

    class _TeleopIntake(_AutoIntake):
        homeAlliance: bool
        opponentAlliance: bool # pyright: ignore[reportGeneralTypeIssues]

    class _Fouls(TypedDict):
        minor: bool
        major: bool # pyright: ignore[reportGeneralTypeIssues]

    scouterName: str
    matchNumber: int
    teamNumber: int
    robotPosition: Literal[
        "Red Left", "Red Middle", "Red Right",
        "Blue Left", "Blue Middle", "Blue Right"
    ]
    comments: str
    driverSkill: int
    defenseSkill: int

    # Auto
    autoFuelScored: int
    autoIntake: _AutoIntake
    autoClimb: _AutoClimb
    # Tele-op
    teleopFuelScored: int
    teleopIntake: _TeleopIntake
    teleopDefense: bool
    teleopPasser: bool
    teleopSnowploughing: bool
    teleopHumanPlayerDeposit: bool
    teleopFouls: _Fouls
    # Endgame
    endgameClimbType: Literal["No Attempt", "Level 1", "Level 2", "Level 3"]
    endgameClimbFailed: bool
    endgameClimbTimeRemaining: float