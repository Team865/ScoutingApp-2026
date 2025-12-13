import AppData from "../AppData.js";

export namespace TeamNotesManager {
    export function setMatchNotesFromClient(matchNumber: number, teamNumber: number, notes: string) {
        AppData.notedTeamData.get(matchNumber).set(teamNumber, notes);
        // Send data to server
    }

    export function incomingMatchNotesFromServer(matchNumber: number, teamNumber: number, notes: string) {
        // Data from SSE
        AppData.notedTeamData.get(matchNumber).set(teamNumber, notes);
        AppData.serverMatchNotesChanged.emit([matchNumber, teamNumber]);
    }
}