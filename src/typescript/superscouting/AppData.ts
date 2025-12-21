import Signal from "../lib/dataTypes/Signal";

export type FetchedTeamData = {
    name: string,
    number: number,
    key: string,
    match_keys?: string[],
    epa?: number,
    normalized_epa?: number
}

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

export type SuperscoutingData = {
    fetched_team_data: FetchedTeamData[],
    /* Match Notes format:
    {
        team_number: {
            match_number: notes
        }
    }
    */
    match_notes: {[key: number]: {[key: number]: string}},
    pit_scouting_notes: {
        [key: number]: { // Team number
            [key: string]: any, // {field_name: field_value}
        }
    },
    matches: MatchData[]
}

type ClientAppData = SuperscoutingData & {
    serverMatchNotesChanged: Signal<[number, number]>, // [team_number, match_number]
    serverPitScoutingNotesChanged: Signal<number> // team_number
}

const AppData: ClientAppData = {
    fetched_team_data: [],
    match_notes: {},
    pit_scouting_notes: {},
    serverMatchNotesChanged: new Signal(),
    serverPitScoutingNotesChanged: new Signal(),
    matches: []
};

export default AppData;