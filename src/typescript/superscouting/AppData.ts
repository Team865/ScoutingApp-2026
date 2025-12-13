import Color from "../lib/dataTypes/Color.js";
import Signal from "../lib/dataTypes/Signal.js";
import { Value } from "../lib/dataTypes/Value.js";

export type FetchedTeamData = {
    name: string,
    number: number,
    key: string,
    match_keys?: string[],
    epa?: number,
    normalized_epa?: number
}

export type TeamTag = {
    name: Value<string>,
    bgColor: Value<Color>,
    textColor: Value<Color>
};
export type NotedMatchData = Map<number, string>; // team_number: notes

export type MatchData = {
    key: string
    number: number,
    comp_level: string,
    red_score: number,
    blue_score: number,
    teams: {
        team_number: number,
        alliance: "red" | "blue"
    }[]
}

const AppData: {
    competitionKey: string,
    fetchedTeamData: FetchedTeamData[],
    notedTeamData: Map<number, NotedMatchData>, // match_number: noted_match_data
    matches: MatchData[]
} = {
    competitionKey: "2025onham2",
    fetchedTeamData: [],
    notedTeamData: new Map(),
    matches: []
};

export default AppData;