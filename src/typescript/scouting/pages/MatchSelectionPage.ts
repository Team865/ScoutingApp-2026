import Page from "./Page";
import Signal from "../../lib/dataTypes/Signal";
import AppData, { getScouterName } from "../AppData";
import { ScoutingRotation } from "../util/APIHelper";

export default class MatchSelectionPage extends Page {
    private readonly changeNameButton = document.createElement("button");
    public readonly manualInputButton = document.createElement("button");
    private readonly matchesContainer = document.createElement("div");
    public readonly matchSelected = new Signal<"Red" | "Blue">();

    constructor(scouterName: string) {
        super("Name: " + scouterName);
        
        this.matchesContainer.classList.add("matches-container");
        this.changeNameButton.textContent = "Change Name"
        this.changeNameButton.addEventListener("click", _ => {
            document.cookie = "username=";
            getScouterName();
            AppData.scouterNameChanged.emit();
        });

        this.manualInputButton.textContent = "Manual";
        this.manualInputButton.classList.add("match-selection");
        this.domElement.append(this.changeNameButton, this.manualInputButton, this.matchesContainer);
    }

    public updateMatches(rotation: ScoutingRotation) {
        this.clearMatches();

        for(const [matchNumber, assignedMatch] of rotation.entries()) {
            this.addMatch(matchNumber, assignedMatch.teamNumber, assignedMatch.alliance);
        }
    }

    public addMatch(matchNumber: number, teamNumber: number, alliance: "Red" | "Blue") {
        const button = document.createElement("button");

        button.addEventListener("click", _ => {
            AppData.matchNumber = matchNumber;
            AppData.teamNumber = teamNumber;
            this.matchSelected.emit(alliance);
        });

        button.textContent = `Match ${matchNumber}`;
        button.classList.add("match-selection", alliance.toLowerCase());

        this.matchesContainer.appendChild(button);
    }

    public clearMatches() {
        this.matchesContainer.replaceChildren();
    }
}