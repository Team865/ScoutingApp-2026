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
    scouter_name: string,
    match_number: number,
    team_number: number,
    robot_position: RobotPosition,
    driver_skill: number,
    defense_skill: number,
    comments: string,

    // Auto
    auto_fuel_scored: number,
    auto_intake: {
        depot: boolean,
        neutral_zone: boolean,
        human_player: boolean
    },
    auto_climb: {
        attempted: boolean,
        failed: boolean
    },
    // Tele-op
    teleop_fuel_scored: number,
    teleop_intake: {
        depot: boolean,
        neutral_zone: boolean,
        human_player: boolean,
        home_alliance: boolean,
        opponent_alliance: boolean
    },
    teleop_defense: boolean,
    teleop_passer: boolean,
    teleop_snowploughing: boolean,
    teleop_human_player_deposit: boolean,
    teleop_fouls: {
        minor: number,
        major: number
    },
    // Endgame
    endgame_climb_type: ClimbHeight,
    endgame_climb_failed: boolean,
    endgame_climb_time_remaining: number
}

const AppData: ScoutingData = {
    scouter_name: "",
    match_number: -1,
    team_number: -1,
    robot_position: RobotPosition.UNSET,
    driver_skill: 0,
    defense_skill: 0,
    auto_fuel_scored: 0,
    auto_intake: {
        depot: false,
        neutral_zone: false,
        human_player: false
    },
    auto_climb: {
        attempted: false,
        failed: false
    },
    teleop_fuel_scored: 0,
    teleop_intake: {
        depot: false,
        neutral_zone: false,
        human_player: false,
        home_alliance: false,
        opponent_alliance: false
    },
    teleop_defense: false,
    teleop_passer: false,
    teleop_snowploughing: false,
    teleop_human_player_deposit: false,
    teleop_fouls: {
        minor: 0,
        major: 0
    },
    endgame_climb_type: ClimbHeight.NO_ATTEMPT,
    endgame_climb_failed: false,
    endgame_climb_time_remaining: -1,
    comments: ""
};

export const scouterNameChanged = new Signal<void>();

export function getScouterName() {
    const xorKey = "d67t819yhusaid";

    if(!removePrefix(document.cookie, "username=")) {
        const scouterName = prompt("Enter your name as shown on the scouting rotation");

        AppData.scouter_name = (scouterName || "Unset").toUpperCase();

        document.cookie = "username=" + encrypt(AppData.scouter_name, xorKey);
    } else {
        AppData.scouter_name = decrypt(removePrefix(document.cookie, "username="), xorKey).toUpperCase();
    }
}

export default AppData;