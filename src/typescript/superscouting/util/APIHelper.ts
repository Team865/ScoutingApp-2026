import { MatchNotesRequest, PitScoutingNotesRequest } from "../../lib/APITypes";
import AppData from "../AppData";

const backendAPIRoot = "/api"
const superscoutingAPIRoot = `${backendAPIRoot}/superscouting`
const tbaAPIRoot = `${backendAPIRoot}/tba`;
const statboticsAPIRoot = "https://api.statbotics.io/v3";

async function genericGetRequest(apiEndpoint: string) {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
        throw new Error(`GET request for ${apiEndpoint} failed with status code: ${response.status}`);
    }
    return await response.json();
}

async function genericPostRequest(apiEndpoint: string, data: string) {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: data
    });

    if(!response.ok) {
        throw new Error(`POST request for ${apiEndpoint} failed with status code: ${response.status}`);
    }

    return await response.json();
}

export async function fetchBackendData() {
    return await genericGetRequest(`${superscoutingAPIRoot}`);
}

export async function updateEPA() {
    const epaData: {[key: number]: {epa?: number, normalized_epa: number}} = await genericGetRequest(`${superscoutingAPIRoot}/epa`);

    for(const [teamNumber, {epa, normalized_epa}] of Object.entries(epaData)) {
        const teamData = AppData.fetchedTeamData.find(team => team.number === Number.parseInt(teamNumber));
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
