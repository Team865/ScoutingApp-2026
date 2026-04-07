import { ScoutingData } from "../scouting/AppData";
import { SuperscoutingData } from "../superscouting/AppData";

type CompleteAppData = {
    superscouting: SuperscoutingData,
    /** {teamNumber: data[]} */
    quantitative_data: Map<number, ScoutingData[]>,
    teamNumbers: number[]
}

const AppData: CompleteAppData = {
    superscouting: {
        fetched_team_data: [],
        match_notes: {},
        pit_scouting_notes: {},
        matches: []
    },
    quantitative_data: new Map(),
    teamNumbers: []
};

export default AppData;