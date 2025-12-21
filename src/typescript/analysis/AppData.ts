import { FetchedTeamData, MatchData, SuperscoutingData } from "../superscouting/AppData";

type CompleteAppData = {
    superscouting: SuperscoutingData
}

const AppData: CompleteAppData = {
    superscouting: {
        fetched_team_data: [],
        match_notes: {},
        pit_scouting_notes: {},
        matches: []
    }
};

export default AppData;