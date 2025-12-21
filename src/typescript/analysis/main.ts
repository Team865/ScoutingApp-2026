import AppData from "./AppData";
import { FilterManager } from "./managers/FilterManager";
import { TeamListManager } from "./managers/TeamListManager";
import { fetchBackendData } from "./util/APIHelper";

async function refreshAppDataFromBackend() {
    const backendData = await fetchBackendData();

    AppData.superscouting = backendData["superscouting"];
}

refreshAppDataFromBackend().then(TeamListManager.createTeamDivs);

FilterManager.start();
TeamListManager.start();