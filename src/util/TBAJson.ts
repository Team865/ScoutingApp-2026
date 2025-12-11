const rootUrl = "/api/event";

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

export type TBATeamJSon = {
    key: string;
    team_number: number;
    nickname: string;
    name: string;
    city: string;
    state_prov: string;
    country: string;
};

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
    return await genericGetRequest(`${rootUrl}/${competitionKey}/info`);
}

export async function getTeams(competitionKey: string): Promise<TBATeamJSon[]> {
    return await genericGetRequest(`${rootUrl}/${competitionKey}/teams`);
}

export async function getMatches(competitionKey: string): Promise<TBAMatchJSon[]> {
    return await genericGetRequest(`${rootUrl}/${competitionKey}/matches`);
}

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
