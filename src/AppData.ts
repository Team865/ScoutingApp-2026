import Color from "./dataTypes/Color.js";
import Signal from "./dataTypes/Signal.js";
import { Value } from "./dataTypes/Value.js";

export type FetchedTeamData = {
    name: string,
    number: number,
    key: string,
    matchKeys?: string[]
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