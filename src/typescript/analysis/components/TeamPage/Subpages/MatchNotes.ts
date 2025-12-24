import AppData from "../../../AppData";
import SubpageInterface from "./SubpageInterface";

export default class MatchNotesSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");
    private readonly tempContainer = document.createElement("div");
    
    public constructor() {
        this.mainContainer.append(
            this.tempContainer
        );
    }

    public setTeam(teamNumber: number) {
        const matchNotesOfTeam = AppData.superscouting.match_notes[teamNumber];

        const matchNoteStrings = Object.entries(matchNotesOfTeam).map(([matchNumberString, notes]) => `Q${matchNumberString}:\n${notes}\n`);

        this.tempContainer.innerText = matchNoteStrings.join("\n");
    }

    public get domElement() {
        return this.mainContainer;
    }
}