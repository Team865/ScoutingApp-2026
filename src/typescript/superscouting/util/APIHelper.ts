import { genericGetRequest, genericPostRequest } from "../../lib/APIHelper";
import { MatchNotesRequest, PitScoutingNotesRequest } from "../../lib/APITypes";
import AppData from "../AppData";

const backendAPIRoot = "/api"
const superscoutingAPIRoot = `${backendAPIRoot}/superscouting`

export async function fetchBackendData() {
    return await genericGetRequest(`${superscoutingAPIRoot}`);
}

export async function updateEPA() {
    const epaData: {[key: number]: {epa?: number, normalized_epa: number}} = await genericGetRequest(`${superscoutingAPIRoot}/epa`);

    for(const [teamNumber, {epa, normalized_epa}] of Object.entries(epaData)) {
        const teamData = AppData.fetched_team_data.find(team => team.number === Number.parseInt(teamNumber));
        teamData.epa = epa;
        teamData.normalized_epa = normalized_epa;
    }
}

export async function sendMatchNotesFromClient(matchNotes: MatchNotesRequest) {
    return await genericPostRequest(`${superscoutingAPIRoot}/match-notes`, JSON.stringify(matchNotes));
}

export async function sendPitScoutingNotesFromClient(pitScoutingNotes: PitScoutingNotesRequest) {
    return await genericPostRequest(`${superscoutingAPIRoot}/pit-scouting-notes`, JSON.stringify(pitScoutingNotes));
}

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
