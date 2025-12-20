import AppData, { MatchData } from "./AppData";
import { updateEPA, fetchBackendData } from "./util/APIHelper";
import { MatchNotesRequest, PitScoutingNotesRequest } from "../lib/APITypes";
import { TeamListManager } from "./managers/TeamListManager";
import { setPageTitle } from "./util/PageTitle";
import { TeamNotesManager } from "./managers/TeamNotesManager";

async function refreshStatboticsData() {
    await updateEPA();
    TeamListManager.updateStatboticStats();
}

async function refreshTBAData() {
    const backendData = await fetchBackendData();

    AppData.fetchedTeamData = backendData["fetched_team_data"];
    AppData.matches = backendData["match_data"];
    AppData.matchNotes = backendData["match_notes"];
    AppData.pitScoutingNotes = backendData["pit_scouting_notes"];
    const eventName = backendData["event_name"];

    setPageTitle(eventName);
}

// const tbaMatchDataSource = new EventSource("/api/sse/tba-match-updates");
// const matchNotesSource = new EventSource("/api/sse/server-match-notes");
const superscoutingSSESource = new EventSource("/api/sse/superscouting");

// An intermediary function that converts a value to an integer without type checking (a bit hacky but works)

const matchUpdateReceived = (newMatchData: MatchData) => {
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
}

const matchNotesReceived = (newNotes: MatchNotesRequest) => {
    TeamNotesManager.incomingMatchNotesFromServer(newNotes.team_number, newNotes.match_number, newNotes.notes);
}

const pitScoutingNotesReceived = (newNotes: PitScoutingNotesRequest) => {
    TeamNotesManager.incomingPitScoutingNotesFromServer(newNotes.team_number, newNotes.data);
}

superscoutingSSESource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const eventName: string = data["event_name"];

    switch(eventName) {
        case "match-updates":
            matchUpdateReceived(data["match_updates"]);
            break;
        case "match-notes":
            matchNotesReceived(data["match_notes"]);
            break;
        case "pit-scouting-notes":
            pitScoutingNotesReceived(data["pit_scouting_notes"]);
            break; 
    }
}

TeamListManager.start();
refreshTBAData()
.then(TeamListManager.createTeamDivs)
.then(refreshStatboticsData)