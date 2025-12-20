export type MatchNotesRequest = {
    team_number: number
    match_number: number
    notes: string
}

export type PitScoutingNotesRequest = {
    team_number: number,
    data: {[key: string]: any}
}