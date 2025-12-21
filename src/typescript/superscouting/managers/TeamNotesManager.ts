import { Extension } from "../../../../node_modules/typescript/lib/typescript";
import AppData from "../AppData";
import { sendMatchNotesFromClient, sendPitScoutingNotesFromClient } from "../util/APIHelper";

export namespace TeamNotesManager {
    export function setMatchNotesFromClient(teamNumber: number, matchNumber: number, notes: string) {
        AppData.match_notes[teamNumber][matchNumber] = notes;
        // Send data to server
        sendMatchNotesFromClient({
            team_number: teamNumber,
            match_number: matchNumber,
            notes: notes
        });
    }

    export function setPitScoutingFromClient(teamNumber: number, pitScoutingNotes: {[key: string]: any}) {
        AppData.match_notes[teamNumber] = pitScoutingNotes;

        sendPitScoutingNotesFromClient({
            team_number: teamNumber,
            data: pitScoutingNotes
        });
    }

    export function incomingMatchNotesFromServer(teamNumber: number, matchNumber: number, notes: string) {
        // Data from SSE
        AppData.match_notes[teamNumber][matchNumber] = notes;
        AppData.serverMatchNotesChanged.emit([teamNumber, matchNumber]);
    }

    export function getMatchNotes(teamNumber: number, matchNumber: number) {
        return AppData.match_notes[teamNumber][matchNumber];
    }

    export function incomingPitScoutingNotesFromServer(teamNumber: number, notes: {[key: string]: any}) {
        // Data from SSE
        AppData.pit_scouting_notes[teamNumber] = notes;
        AppData.serverPitScoutingNotesChanged.emit(teamNumber);
    }

    export function getPitScoutingNotes(teamNumber) {
        return AppData.pit_scouting_notes[teamNumber];
    }
}