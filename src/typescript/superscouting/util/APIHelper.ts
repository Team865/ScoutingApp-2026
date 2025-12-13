import AppData from "../AppData.js";

const backendAPIRoot = "/api"
const superscoutingAPIRoot = `${backendAPIRoot}/superscouting`
const tbaAPIRoot = `${backendAPIRoot}/tba`;
const statboticsAPIRoot = "https://api.statbotics.io/v3";

export type TBAEventJSon = {
    key: string;
    name: string;
    event_code: string;
    event_type: number;
    district: {
        abbreviation: string;
        display_name: string;
        key: string;
        year: number;
    };
    city: string;
    state_prov: string;
    country: string;
    start_date: string;
    end_date: string;
    year: number;
    short_name: string;
    event_type_string: string;
    week: number;
    address: string;
    postal_code: string;
    gmaps_place_id: string;
    gmaps_url: string;
    lat: number;
    lng: number;
    location_name: string;
    timezone: string;
    website: string;
    first_event_id: string;
    first_event_code: string;
    webcasts: [
        {
            type: string;
            channel: string;
            date: string;
            file: string;
        }
    ];
    division_keys: [string];
    parent_event_key: string;
    playoff_type: number;
    playoff_type_string: string;
    remap_teams: { [key: string]: string };
};

type TBATeamJSon = {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
};

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

export type TeamJSon = TBATeamJSon & {
    epa?: number;
    normalized_epa: number;
}

export type TBAMatchJSon = {
    key: string;
    comp_level: string;
    set_number: number;
    match_number: number;
    alliances: {
        red: {
            score: number;
            team_keys: [string];
            surrogate_team_keys: [string];
            dq_team_keys: [string];
        };
        blue: {
            score: number;
            team_keys: [string];
            surrogate_team_keys: [string];
            dq_team_keys: [string];
        };
    };
    winning_alliance: string;
    event_key: string;
    time: number;
    actual_time: number;
    predicted_time: number;
    post_result_time: number;
    score_breakdown: {
        blue: {
            auto_points: number;
            teleop_points: number;
            container_points: number;
            tote_points: number;
            litter_points: number;
            foul_points: number;
            adjust_points: number;
            total_points: number;
            foul_count: number;
            tote_count_far: number;
            tote_count_near: number;
            tote_set: boolean;
            tote_stack: boolean;
            container_count_level1: number;
            container_count_level2: number;
            container_count_level3: number;
            container_count_level4: number;
            container_count_level5: number;
            container_count_level6: number;
            container_set: boolean;
            litter_count_container: number;
            litter_count_landfill: number;
            litter_count_unprocessed: number;
            robot_set: boolean;
        };
        red: {
            auto_points: number;
            teleop_points: number;
            container_points: number;
            tote_points: number;
            litter_points: number;
            foul_points: number;
            adjust_points: number;
            total_points: number;
            foul_count: number;
            tote_count_far: number;
            tote_count_near: number;
            tote_set: boolean;
            tote_stack: boolean;
            container_count_level1: number;
            container_count_level2: number;
            container_count_level3: number;
            container_count_level4: number;
            container_count_level5: number;
            container_count_level6: number;
            container_set: boolean;
            litter_count_container: number;
            litter_count_landfill: number;
            litter_count_unprocessed: number;
            robot_set: boolean;
        };
        coopertition: string;
        coopertition_points: number;
    };
    videos: [
        {
            type: string;
            key: string;
        }
    ];
};

async function genericGetRequest(apiEndpoint: string) {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
        throw new Error(`Get request for ${apiEndpoint} failed with status code: ${response.status}`);
    }
    return await response.json();
}

export async function getEventInfo(competitionKey: string): Promise<TBAEventJSon> {
    return await genericGetRequest(`${tbaAPIRoot}/event/${competitionKey}/info`);
}

export async function updateEPA(competitionKey: string) {
    const statboticsTeamEventData: StatboticsTeamEventJSon[] = await genericGetRequest(`${statboticsAPIRoot}/team_events?event=${competitionKey}`);
    
    if (statboticsTeamEventData.length > 0) {
        for (const statboticsData of statboticsTeamEventData) {
            const teamData = AppData.fetchedTeamData.find(team => team.number === statboticsData.team);

            teamData.epa = statboticsData.epa.total_points.mean;
            teamData.normalized_epa = statboticsData.epa.norm;
        }
    } else {
        for (const teamData of AppData.fetchedTeamData) {
            const statboticsTeamData: StatboticsTeamData = await genericGetRequest(`${statboticsAPIRoot}/team/${teamData.number}`);
            
            teamData.normalized_epa = statboticsTeamData.norm_epa.current;
        }
    }
}

export async function getTBATeams(competitionKey: string): Promise<TBATeamJSon[]> {
    const tbaTeamData: TBATeamJSon[] = await genericGetRequest(`${tbaAPIRoot}/event/${competitionKey}/teams`);

    return tbaTeamData
}

export async function getMatches(competitionKey: string): Promise<TBAMatchJSon[]> {
    return await genericGetRequest(`${tbaAPIRoot}/event/${competitionKey}/matches`);
}

export async function fetchBackendData() {
    return await genericGetRequest(`${superscoutingAPIRoot}`)
}

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
