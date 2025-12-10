const rootUrl = "https://www.thebluealliance.com/api/v3";
const apiKey =
    "0DowkZk6qFmZnOJNxCbySSjS7qHLOJE6rJwxERfY1pwS25bifGjZa9x7Ax5EVlqc";
const requestInit = {
    method: "GET",
    headers: {
        "X-TBA-Auth-Key": apiKey,
    },
};

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
    "key": string,
    "comp_level": string,
    "set_number": 0,
    "match_number": 0,
    "alliances": {
        "red": {
            "score": 0,
            "team_keys": [
                string
            ],
            "surrogate_team_keys": [
                string
            ],
            "dq_team_keys": [
                string
            ]
        },
        "blue": {
            "score": 0,
            "team_keys": [
                string
            ],
            "surrogate_team_keys": [
                string
            ],
            "dq_team_keys": [
                string
            ]
        }
    },
    "winning_alliance": "red",
    "event_key": string,
    "time": 9007199254740991,
    "actual_time": 9007199254740991,
    "predicted_time": 9007199254740991,
    "post_result_time": 9007199254740991,
    "score_breakdown": {
        "blue": {
            "auto_points": 0,
            "teleop_points": 0,
            "container_points": 0,
            "tote_points": 0,
            "litter_points": 0,
            "foul_points": 0,
            "adjust_points": 0,
            "total_points": 0,
            "foul_count": 0,
            "tote_count_far": 0,
            "tote_count_near": 0,
            "tote_set": true,
            "tote_stack": true,
            "container_count_level1": 0,
            "container_count_level2": 0,
            "container_count_level3": 0,
            "container_count_level4": 0,
            "container_count_level5": 0,
            "container_count_level6": 0,
            "container_set": true,
            "litter_count_container": 0,
            "litter_count_landfill": 0,
            "litter_count_unprocessed": 0,
            "robot_set": true
        },
        "red": {
            "auto_points": 0,
            "teleop_points": 0,
            "container_points": 0,
            "tote_points": 0,
            "litter_points": 0,
            "foul_points": 0,
            "adjust_points": 0,
            "total_points": 0,
            "foul_count": 0,
            "tote_count_far": 0,
            "tote_count_near": 0,
            "tote_set": true,
            "tote_stack": true,
            "container_count_level1": 0,
            "container_count_level2": 0,
            "container_count_level3": 0,
            "container_count_level4": 0,
            "container_count_level5": 0,
            "container_count_level6": 0,
            "container_set": true,
            "litter_count_container": 0,
            "litter_count_landfill": 0,
            "litter_count_unprocessed": 0,
            "robot_set": true
        },
        "coopertition": "None",
        "coopertition_points": 0
    },
    "videos": [
        {
            "type": string,
            "key": string
        }
    ]
}

async function genericGetRequest(apiEndpoint: string) {
    const response = await fetch(apiEndpoint, requestInit);
    if (!response.ok) {
        throw new Error(
            `Get request for ${apiEndpoint} failed with status code: ${response.status}`
        );
    }

    return await response.json();
}

export async function getEventInfo(competitionKey: string): Promise<TBAEventJSon> {
    return await genericGetRequest(`${rootUrl}/event/${competitionKey}`);
}

export async function getTeams(competitionKey): Promise<TBATeamJSon[]> {
    return await genericGetRequest(
        `${rootUrl}/event/${competitionKey}/teams/simple`
    );
}

export async function getMatches(competitionKey: string): Promise<TBAMatchJSon[]> {
    return await genericGetRequest(`${rootUrl}/event/${competitionKey}/matches/simple`);
}

// export async function getMatch(matchKey: string): Promise<TBAMatchJSon> {
//     return await genericGetRequest(`${rootUrl}/match/${matchKey}`);
// }
