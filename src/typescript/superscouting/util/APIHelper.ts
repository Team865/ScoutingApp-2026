import { genericGetRequest, genericPostRequest } from "../../lib/APIHelper";
import { MatchNotesRequest, PitScoutingNotesRequest } from "../../lib/APITypes";
import AppData from "../AppData";

const apiRoot = "api/superscouting";

export async function fetchBackendData() {
    return await genericGetRequest(`${apiRoot}`);
}

export async function updateEPA() {
    const epaData: {[key: number]: {epa?: number, normalized_epa: number} | null} = await genericGetRequest(`${apiRoot}/epa`);

    for(const [teamNumber, epaInfo] of Object.entries(epaData)) {
        const teamData = AppData.fetched_team_data.find(team => team.number === Number.parseInt(teamNumber));

        if(epaInfo == null) {
            teamData.epa = null;
            teamData.normalized_epa = null
        } else {
            teamData.epa = epaInfo["epa"];
            teamData.normalized_epa = epaInfo["normalized_epa"];
        }
    }
}

export async function sendMatchNotesFromClient(matchNotes: MatchNotesRequest) {
    return await genericPostRequest(`${apiRoot}/match-notes`, matchNotes);
}

export async function sendPitScoutingNotesFromClient(pitScoutingNotes: PitScoutingNotesRequest) {
    return await genericPostRequest(`${apiRoot}/pit-scouting-notes`, pitScoutingNotes);
}

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
