import AppData from "../AppData.js";

const backendAPIRoot = "/api"
const superscoutingAPIRoot = `${backendAPIRoot}/superscouting`
const tbaAPIRoot = `${backendAPIRoot}/tba`;
const statboticsAPIRoot = "https://api.statbotics.io/v3";

type StatboticsTeamEventJSon = {
    team: number,
    year: number,
    event: string,
    time: number,
    team_name: string,
    event_name: string,
    country: string,
    state: string,
    district: string,
    type: string,
    week: number,
    status: string,
    first_event: boolean,
    epa: {
        total_points: {
            mean: number,
            sd: number
        },
        unitless: number,
        norm: number,
        conf: number[],
        breakdown: {
            total_points: number,
            auto_points: number,
            teleop_points: number,
            endgame_points: number,
            auto_rp: number,
            coral_rp: number,
            barge_rp: number,
            tiebreaker_points: number,
            auto_leave_points: number,
            auto_coral: number,
            auto_coral_points: number,
            teleop_coral: number,
            teleop_coral_points: number,
            coral_l1: number,
            coral_l2: number,
            coral_l3: number,
            coral_l4: number,
            total_coral_points: number,
            processor_algae: number,
            processor_algae_points: number,
            net_algae: number,
            net_algae_points: number,
            total_algae_points: number,
            total_game_pieces: number,
            barge_points: number,
            rp_1: number,
            rp_2: number,
            rp_3: number
        },
        stats: {
            start: number,
            pre_elim: number,
            mean: number,
            max: number
        }
    },
    record: {
        qual: {
            wins: number,
            losses: number,
            ties: number,
            count: number,
            winrate: number,
            rps: number,
            rps_per_match: number,
            rank: number,
            num_teams: number
        },
        elim: {
            wins: number,
            losses: number,
            ties: number,
            count: number,
            winrate: number,
            alliance: null,
            is_captain: null
        },
        total: {
            wins: number,
            losses: number,
            ties: number,
            count: number,
            winrate: number
        }
    },
    district_points: number
}

type StatboticsTeamData = {
    team: number,
    name: string,
    country: string,
    state: string,
    district: string,
    rookie_year: number,
    active: boolean,
    record: {
        wins: number,
        losses: number,
        ties: number,
        count: number,
        winrate: number
    },
    norm_epa: {
        current: number,
        recent: number,
        mean: number,
        max: number
    }
}

async function genericGetRequest(apiEndpoint: string) {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
        throw new Error(`Get request for ${apiEndpoint} failed with status code: ${response.status}`);
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

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
