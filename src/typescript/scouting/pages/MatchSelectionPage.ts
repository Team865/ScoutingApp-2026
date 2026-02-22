import Page from "./Page";
import Signal from "../../lib/dataTypes/Signal";
import AppData from "../AppData";

export default class MatchSelectionPage extends Page {
    public readonly manualInputButton = document.createElement("button");
    public readonly matchSelected = new Signal<void>();

    constructor(scouterName: string) {
        super("Name: " + scouterName);
        
        this.manualInputButton.textContent = "Manual";
        this.manualInputButton.classList.add("match-selection");
        this.domElement.append(this.manualInputButton);
    }

    public addMatch(matchNumber: number, teamNumber: number) {
        const button = document.createElement("button");

        button.addEventListener("click", _ => {
            this.matchSelected.emit();
            AppData.matchNumber = matchNumber;
            AppData.teamNumber = teamNumber;

        });

        button.textContent = `${matchNumber}`;
        button.classList.add("match-selection");

        this.domElement.append(button);
    }
}