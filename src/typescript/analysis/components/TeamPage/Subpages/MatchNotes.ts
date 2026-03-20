import AppData from "../../../AppData";
import SubpageInterface from "./SubpageInterface";

export default class MatchNotesSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");
    private readonly superscoutingContainer = document.createElement("div");
    private readonly scoutingContainer = document.createElement("div");

    private readonly superscoutingHeader = document.createElement("h1");
    private readonly superscoutingTextBody = document.createElement("p");

    private readonly scoutingHeader = document.createElement("h1");
    private readonly scoutingTextBody = document.createElement("p");
    
    public constructor() {
        this.mainContainer.classList.add("match-notes-page");

        this.mainContainer.append(
            this.superscoutingContainer,
            this.scoutingContainer
        );

        this.superscoutingContainer.append(
            this.superscoutingHeader,
            this.superscoutingTextBody
        );
        
        this.scoutingContainer.append(
            this.scoutingHeader,
            this.scoutingTextBody
        );
    }

    public setTeam(teamNumber: number) {
        const matchNotesOfTeam = AppData.superscouting.match_notes[teamNumber];

        if(Object.keys(matchNotesOfTeam).length === 0) {
            this.superscoutingHeader.innerText = "NO DATA FOUND";
            this.superscoutingTextBody.innerText = "";
        } else {
            this.superscoutingHeader.innerText = "SUPERSCOUTING";
            const superscoutingNoteStrings = Object.entries(matchNotesOfTeam)
                .map(([matchNumberString, notes]) => `Q${matchNumberString}:\n${notes}\n`);

            this.superscoutingTextBody.innerText = superscoutingNoteStrings.join("\n");
        }

        if(!AppData.quantitative_data.has(teamNumber) || AppData.quantitative_data.get(teamNumber).length === 0) {
            this.scoutingHeader.innerText = "NO DATA FOUND";
            this.scoutingTextBody.innerText = "";
        } else {
            this.scoutingHeader.innerText = "SCOUTING COMMENTS";
            const scoutingNoteStrings = AppData.quantitative_data.get(teamNumber)
            .toSorted((o1, o2) => o1.match_number - o2.match_number)
            .map(data => `Q${data.match_number}:\n${data.comments}\n`);
        
            this.scoutingTextBody.innerText = scoutingNoteStrings.join("\n");
        }
    }

    public get domElement() {
        return this.mainContainer;
    }
}