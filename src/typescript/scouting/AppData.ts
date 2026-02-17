/** The robot position relative to the alliance's Driver Station */
export enum RobotPosition {
    RED_LEFT = "Red Left",
    RED_MIDDLE = "Red Middle",
    RED_RIGHT = "Red Right",

    BLUE_LEFT = "Blue Left",
    BLUE_MIDDLE = "Blue Middle",
    BLUE_RIGHT = "Blue Right"
}

export type ScoutingData = {
    robotPosition?: RobotPosition
}

type ClientAppData = ScoutingData & {
    // Signals
}

const AppData: ClientAppData = {};

export default AppData;