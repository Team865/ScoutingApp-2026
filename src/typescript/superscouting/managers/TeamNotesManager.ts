import AppData from "../AppData.js";

export namespace TeamNotesManager {
    export function setTeamNotes(matchNumber: number, teamNumber: number, notes: string) {
        AppData.notedTeamData.get(matchNumber).set(teamNumber, notes);
    }
}