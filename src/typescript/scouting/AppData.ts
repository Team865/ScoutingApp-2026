import Signal from "../lib/dataTypes/Signal";
import { encrypt, decrypt } from "../lib/Randomizer"
import { removePrefix, titleCase } from '../superscouting/util/StringManipulation';

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
    driverSkill: number,
    comments: string,

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
        opponentAlliance: boolean
    },
    transitionPasser: boolean,
    transitionDefense: boolean,
    transitionFouls: {
        minor: boolean,
        major: boolean
    },
    // Tele-op
    teleopFuelScored: number,
    teleopIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean,
        homeAlliance: boolean,
        opponentAlliance: boolean
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
    teleopFouls: {
        minor: boolean,
        major: boolean
    },
    // Endgame
    endgameFuelScored: number,
    endgameIntake: {
        depot: boolean,
        neutralZone: boolean,
        outpost: boolean,
        homeAlliance: boolean,
        opponentAlliance: boolean
    },
    endgameDefense: {
        depot: boolean,
        outpost: boolean,
        trench: boolean,
        bump: boolean,
        other: boolean
    },
    endgamePasser: boolean,
    endgameFouls: {
        minor: boolean,
        major: boolean
    },
    
    endgameClimbType: ClimbHeight,
    endgameClimbFailed: boolean,
    endgameClimbTimeRemaining: number
}

const AppData: ScoutingData = {
    scouterName: "",
    matchNumber: -1,
    teamNumber: -1,
    robotPosition: RobotPosition.UNSET,
    driverSkill: 0,
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
        opponentAlliance: false
    },
    transitionPasser: false,
    transitionDefense: false,
    transitionFouls: {
        minor: false,
        major: false
    },
    teleopFuelScored: 0,
    teleopIntake: {
        depot: false,
        neutralZone: false,
        outpost: false,
        homeAlliance: false,
        opponentAlliance: false
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
    teleopFouls: {
        minor: false,
        major: false
    },
    endgameFuelScored: 0,
    endgameIntake: {
        depot: false,
        neutralZone: false,
        outpost: false,
        homeAlliance: false,
        opponentAlliance: false
    },
    endgameDefense: {
        depot: false,
        outpost: false,
        trench: false,
        bump: false,
        other: false
    },
    endgamePasser: false,
    endgameFouls: {
        minor: false,
        major: false
    },
    endgameClimbType: ClimbHeight.NO_ATTEMPT,
    endgameClimbFailed: false,
    endgameClimbTimeRemaining: -1,
    comments: ""
};

export const scouterNameChanged = new Signal<void>();

export function getScouterName() {
    const xorKey = "d67t819yhusaid";

    if(!removePrefix(document.cookie, "username=")) {
        const scouterName = prompt("What is your FULL name (FirstName LastName)?");

        AppData.scouterName = titleCase(scouterName) || "Unset";

        document.cookie = "username=" + encrypt(AppData.scouterName, xorKey);
    } else {
        AppData.scouterName = decrypt(removePrefix(document.cookie, "username="), xorKey);
    }
}

export default AppData;