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
const eventSource = new EventSource("/api/sse/match-updates");

eventSource.onmessage = function handleMatchUpdate(e: MessageEvent) {
    const newMatchData: MatchData = JSON.parse(e.data);

    console.log("Received SSE message:", newMatchData);

    const matchIndex = AppData.matches.findIndex(
        match => match.key === newMatchData.key
    );

    if (matchIndex !== -1) {
        //Update in place
        Object.assign(AppData.matches[matchIndex], newMatchData);
    } else {
        //push new data
        AppData.matches.push(newMatchData);
    }
};

TeamListManager.start();
refreshTBAData().then(initNotedData).then(TeamListManager.createTeamDivs).then(refreshStatboticsData);