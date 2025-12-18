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
    fetchedTeamData: FetchedTeamData[],
    /* Match Notes format:
    {
        team_number: {
            match_number: notes
        }
    }
    */
    matchNotes: {[key: number]: {[key: number]: string}},
    pitScoutingNotes: {
        [key: number]: { // Team number
            [key: string]: any, // {field_name: field_value}
        }
    },
    serverMatchNotesChanged: Signal<[number, number]>, // [team_number, match_number]
    serverPitScoutingNotesChanged: Signal<number>, // team_number
    matches: MatchData[]
} = {
    fetchedTeamData: [],
    matchNotes: {},
    pitScoutingNotes: {},
    serverMatchNotesChanged: new Signal(),
    serverPitScoutingNotesChanged: new Signal(),
    matches: []
};

export default AppData;