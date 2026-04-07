import { ScoutingData } from '../scouting/AppData';
import AppData from "./AppData";
import { ComparisonPageManager } from './managers/ComparisonPageManager';
import { FilterManager } from "./managers/FilterManager";
import { TeamListManager } from "./managers/TeamListManager";
import { fetchBackendData } from "./util/APIHelper";

async function refreshAppDataFromBackend() {
    const backendData = await fetchBackendData();

    AppData.superscouting = backendData["superscouting"];

    const quantitiveData: ScoutingData[] = backendData["quantitative_data"]

    for(const data of quantitiveData) {
        if(!AppData.quantitative_data.has(data.team_number))
            AppData.quantitative_data.set(data.team_number, []);

        (AppData.quantitative_data.get(data.team_number)).push(data);
    }

    for(const teamData of AppData.quantitative_data.values()) {
        teamData.sort((matchData1, matchData2) => matchData1.match_number - matchData2.match_number)
    }

    AppData.teamNumbers = AppData.superscouting.fetched_team_data.map(data => data.number);
}

refreshAppDataFromBackend().then(TeamListManager.createTeamDivs);

FilterManager.start();
TeamListManager.start();
ComparisonPageManager.start();