import { Extension } from "../../../../node_modules/typescript/lib/typescript.js";
import AppData from "../AppData.js";
import { sendMatchNotesFromClient, sendPitScoutingNotesFromClient } from "../util/APIHelper.js";

export namespace TeamNotesManager {
    export function setMatchNotesFromClient(teamNumber: number, matchNumber: number, notes: string) {
        AppData.matchNotes[teamNumber][matchNumber] = notes;
        // Send data to server
        sendMatchNotesFromClient({
            team_number: teamNumber,
            match_number: matchNumber,
            notes: notes
        });
    }

    export function setPitScoutingFromClient(teamNumber: number, pitScoutingNotes: {[key: string]: any}) {
        AppData.matchNotes[teamNumber] = pitScoutingNotes;

        sendPitScoutingNotesFromClient({
            team_number: teamNumber,
            data: pitScoutingNotes
        });
    }

    export function incomingMatchNotesFromServer(teamNumber: number, matchNumber: number, notes: string) {
        // Data from SSE
        AppData.matchNotes[teamNumber][matchNumber] = notes;
        AppData.serverMatchNotesChanged.emit([teamNumber, matchNumber]);
    }

    export function getMatchNotes(teamNumber: number, matchNumber: number) {
        return AppData.matchNotes[teamNumber][matchNumber];
    }

    export function incomingPitScoutingNotesFromServer(teamNumber: number, notes: {[key: string]: any}) {
        // Data from SSE
        AppData.pitScoutingNotes[teamNumber] = notes;
        AppData.serverPitScoutingNotesChanged.emit(teamNumber);
    }

    export function getPitScoutingNotes(teamNumber) {
        return AppData.pitScoutingNotes[teamNumber];
    }
}