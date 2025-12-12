import Color from "../lib/dataTypes/Color.js";
import Signal from "../lib/dataTypes/Signal.js";
import { Value } from "../lib/dataTypes/Value.js";

export type FetchedTeamData = {
    name: string,
    number: number,
    key: string,
    matchKeys?: string[],
    epa?: number,
    normalized_epa: number
}

export type TeamTag = {
    name: Value<string>,
    bgColor: Value<Color>,
    textColor: Value<Color>
};
export type NotedTeamData = {
    
}

export type MatchData = {
    key: string
    number: number,
    compLevel: string,
    redScore: number,
    blueScore: number,
    teams: {
        teamNumber: number,
        alliance: "red" | "blue"
    }[]
}

const AppData: {
    competitionKey: string,
    fetchedTeamData: FetchedTeamData[],
    notedTeamData: Map<number, NotedTeamData>,
    matches: MatchData[]
} = {
    competitionKey: "2025onham2",
    fetchedTeamData: [],
    notedTeamData: new Map(),
    matches: []
};

export default AppData;