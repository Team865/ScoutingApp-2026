import AppData from "../AppData.js";
import { sendMatchNotesFromClient } from "../util/APIHelper.js";

export namespace MatchNotesManager {
    export function setMatchNotesFromClient(teamNumber: number, matchNumber: number, notes: string) {
        AppData.matchNotes[teamNumber][matchNumber] = notes;
        // Send data to server
        sendMatchNotesFromClient({
            team_number: teamNumber,
            match_number: matchNumber,
            notes: notes
        });
    }

    export function incomingMatchNotesFromServer(teamNumber: number, matchNumber: number, notes: string) {
        // Data from SSE
        AppData.matchNotes[teamNumber][matchNumber] = notes;
        AppData.serverMatchNotesChanged.emit([teamNumber, matchNumber]);
    }

    export function getNotes(teamNumber: number, matchNumber: number) {
        return AppData.matchNotes[teamNumber][matchNumber];
    }
}