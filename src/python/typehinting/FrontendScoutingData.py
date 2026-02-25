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

    class _TeleopDefense(TypedDict):
        depot: bool
        outpost: bool
        trench: bool
        bump: bool
        other: bool # pyright: ignore[reportGeneralTypeIssues]

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

    # Auto
    autoFuelScored: int
    autoIntake: _AutoIntake
    autoClimb: _AutoClimb
    # Transition phase
    transitionFuelScored: int
    transitionIntake: _TeleopIntake
    transitionPasser: bool
    transitionDefense: bool
    transitionFouls: _Fouls
    # Tele-op
    teleopFuelScored: int
    teleopIntake: _TeleopIntake
    teleopDefense: _TeleopDefense
    teleopPasser: bool
    teleopHumanPlayerDeposit: bool
    teleopFouls: _Fouls
    # Endgame
    endgameFuelScored: int
    endgameIntake: _TeleopIntake
    endgameDefense: _TeleopDefense
    endgamePasser: bool
    endgameFouls: _Fouls
    
    endgameClimbType: Literal["No Attempt", "Level 1", "Level 2", "Level 3"]
    endgameClimbFailed: bool
    endgameClimbTimeRemaining: float