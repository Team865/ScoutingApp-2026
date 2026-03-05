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
    defenseSkill: number,
    comments: string,

    // Auto
    autoFuelScored: number,
    autoIntake: {
        depot: boolean,
        neutralZone: boolean,
        humanPlayer: boolean
    },
    autoClimb: {
        attempted: boolean,
        failed: boolean
    },
    // Tele-op
    teleopFuelScored: number,
    teleopIntake: {
        depot: boolean,
        neutralZone: boolean,
        humanPlayer: boolean,
        homeAlliance: boolean,
        opponentAlliance: boolean
    },
    teleopDefense: boolean,
    teleopPasser: boolean,
    teleopSnowploughing: boolean,
    teleopHumanPlayerDeposit: boolean,
    teleopFouls: {
        minor: boolean,
        major: boolean
    },
    // Endgame
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
    defenseSkill: 0,
    autoFuelScored: 0,
    autoIntake: {
        depot: false,
        neutralZone: false,
        humanPlayer: false
    },
    autoClimb: {
        attempted: false,
        failed: false
    },
    teleopFuelScored: 0,
    teleopIntake: {
        depot: false,
        neutralZone: false,
        humanPlayer: false,
        homeAlliance: false,
        opponentAlliance: false
    },
    teleopDefense: false,
    teleopPasser: false,
    teleopSnowploughing: false,
    teleopHumanPlayerDeposit: false,
    teleopFouls: {
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