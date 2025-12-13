import AppData, { MatchData } from "./AppData.js";
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

async function initNotedData() {
    AppData.notedTeamData.clear();

    for(const match of AppData.matches) {
        AppData.notedTeamData.set(match.number, new Map(match.teams.map(team => [team.team_number, ""])));
    }
}

function handleMatchUpdate(e: MessageEvent) {
    const newMatchData: MatchData = e.data;
    const matchIndex = AppData.matches.findIndex(match => match.key === newMatchData.key);

    AppData.matches[matchIndex] = newMatchData;
}

TeamListManager.start();
refreshTBAData().then(initNotedData).then(TeamListManager.createTeamDivs).then(refreshStatboticsData);