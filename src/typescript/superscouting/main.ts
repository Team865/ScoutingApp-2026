import AppData from "./AppData.js";
import {updateEPA, fetchBackendData} from "./util/APIHelper.js";
import {TeamListManager} from "./managers/TeamListManager.js";

const refreshDataButton = document.getElementById("refresh-tba-data-button");
const mainTag = document.querySelector("main");

async function refreshStatboticsData() {
    await updateEPA(AppData.competitionKey);
    TeamListManager.updateStatboticStats();
}

async function refreshTBAData() {
    const backendData = await fetchBackendData();

    AppData.fetchedTeamData = backendData["fetched_team_data"];
    AppData.matches = backendData["match_data"];
}

TeamListManager.start();
refreshTBAData().then(TeamListManager.createTeamDivs).then(refreshStatboticsData);