import { ScoutingData } from "../scouting/AppData";
import AppData from "./AppData";
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

        AppData.quantitative_data.get(data.team_number).push(data);
    }

    console.log(AppData);
}

refreshAppDataFromBackend().then(TeamListManager.createTeamDivs);

FilterManager.start();
TeamListManager.start();