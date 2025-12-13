import AppData, { MatchData } from "./AppData.js";
import { updateEPA, fetchBackendData, MatchNotesRequest } from "./util/APIHelper.js";
import { TeamListManager } from "./managers/TeamListManager.js";
import { setPageTitle } from './util/PageTitle.js';
import { MatchNotesManager } from "./managers/TeamNotesManager.js";
const refreshDataButton = document.getElementById("refresh-tba-data-button");
const mainTag = document.querySelector("main");


async function refreshStatboticsData() {
    await updateEPA();
    TeamListManager.updateStatboticStats();
}

async function refreshTBAData() {
    const backendData = await fetchBackendData();

    AppData.fetchedTeamData = backendData["fetched_team_data"];
    AppData.matches = backendData["match_data"];
    AppData.matchNotes = backendData["match_notes"];
    const eventName = backendData["event_name"];
    setPageTitle(eventName);
}

const tbaMatchDataSource = new EventSource("/api/sse/tba-match-updates");
const matchNotesSource = new EventSource("/api/sse/server-match-notes");

tbaMatchDataSource.onmessage = (e) => {
    const newMatchData: MatchData = JSON.parse(e.data);

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

matchNotesSource.onmessage = (e) => {
    const newNotes: MatchNotesRequest = JSON.parse(e.data);
    
    MatchNotesManager.incomingMatchNotesFromServer(newNotes.team_number, newNotes.match_number, newNotes.notes);
}

TeamListManager.start();
refreshTBAData()
.then(TeamListManager.createTeamDivs)
.then(refreshStatboticsData)