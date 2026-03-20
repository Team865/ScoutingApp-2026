import { ScoutingData } from "../scouting/AppData";
import { SuperscoutingData } from "../superscouting/AppData";

type CompleteAppData = {
    superscouting: SuperscoutingData,
    quantitative_data: Map<number, ScoutingData[]>
}

const AppData: CompleteAppData = {
    superscouting: {
        fetched_team_data: [],
        match_notes: {},
        pit_scouting_notes: {},
        matches: []
    },
    quantitative_data: new Map()
};

export default AppData;