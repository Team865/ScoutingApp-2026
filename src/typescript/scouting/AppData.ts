/** The robot position relative to the alliance's Driver Station */
export enum RobotPosition {
    UNSET,

    RED_LEFT = "Red Left",
    RED_MIDDLE = "Red Middle",
    RED_RIGHT = "Red Right",

    BLUE_LEFT = "Blue Left",
    BLUE_MIDDLE = "Blue Middle",
    BLUE_RIGHT = "Blue Right"
}

export enum ClimbHeight {
    NO_ATTEMPT = "No Attempt",
    L1 = "Level 1",
    L2 = "Level 2",
    L3 = "Level 3"
}

export type ScoutingData = {
    scouterName: string,
    matchNumber: number,
    teamNumber: number,
    robotPosition: RobotPosition,
    // Auto
    autoFuelScored: number,
    autoIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean
    },
    autoClimb: {
        attempted: boolean,
        failed: boolean
    },
    // Transition phase
    transitionFuelScored: number,
    transitionIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean,
        homeAlliance: boolean,
        oppoAlliance: boolean
    },
    transitionPasser: boolean,
    transitionDefense: boolean,
    // Tele-op
    teleopFuelScored: number,
    teleopIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean,
        homeAlliance: boolean,
        oppoAlliance: boolean
    },
    teleopDefense: {
        depot: boolean,
        outpost: boolean,
        trench: boolean,
        bump: boolean,
        other: boolean
    },
    teleopPasser: boolean,
    teleopHumanPlayerDeposit: boolean,
    // Endgame
    endgameFuelScored: number,
    endgameIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean,
        homeAlliance: boolean,
        oppoAlliance: boolean
    },
    endgameDefense: {
        depot: boolean,
        outpost: boolean,
        trench: boolean,
        bump: boolean,
        other: boolean
    },
    endgamePasser: boolean,
    
    endgameClimbType: ClimbHeight,
    endgameClimbFailed: boolean,
    endgameClimbTimeRemaining: number,
    comments: string
}

type ClientAppData = ScoutingData & {
    // Signals
}

const AppData: ClientAppData = {
    scouterName: "",
    matchNumber: -1,
    teamNumber: -1,
    robotPosition: RobotPosition.UNSET,
    autoFuelScored: 0,
    autoIntake: {
        depot: false,
        neutralZone: false,
        outpost: false
    },
    autoClimb: {
        attempted: false,
        failed: false
    },
    transitionFuelScored: 0,
    transitionIntake: {
        depot: false,
        neutralZone: false,
        outpost: false,
        homeAlliance: false,
        oppoAlliance: false
    },
    transitionPasser: false,
    transitionDefense: false,
    teleopFuelScored: 0,
    teleopIntake: {
        depot: false,
        neutralZone: false,
        outpost: false,
        homeAlliance: false,
        oppoAlliance: false
    },
    teleopDefense: {
        depot: false,
        outpost: false,
        trench: false,
        bump: false,
        other: false
    },
    teleopPasser: false,
    teleopHumanPlayerDeposit: false,
    endgameFuelScored: 0,
    endgameIntake: {
        depot: false,
        neutralZone: false,
        outpost: false,
        homeAlliance: false,
        oppoAlliance: false
    },
    endgameDefense: {
        depot: false,
        outpost: false,
        trench: false,
        bump: false,
        other: false
    },
    endgamePasser: false,
    endgameClimbType: ClimbHeight.NO_ATTEMPT,
    endgameClimbFailed: false,
    endgameClimbTimeRemaining: -1,
    comments: ""
};

export default AppData;