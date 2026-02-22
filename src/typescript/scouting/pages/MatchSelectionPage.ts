import Page from "./Page";
import Signal from "../../lib/dataTypes/Signal";
import AppData from "../AppData";

export default class MatchSelectionPage extends Page {
    public readonly manualInputButton = document.createElement("button");
    public readonly matchSelected = new Signal<void>();

    constructor(scouterName: string) {
        super("Name: " + scouterName);
        
        this.manualInputButton.textContent = "Manual";
        this.manualInputButton.style.height = "6rem";
        this.manualInputButton.style.width = "24rem";
        this.manualInputButton.style.fontSize = "2.5rem";

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
        button.style.height = "6rem";
        button.style.width = "24rem";
        button.style.fontSize = "2.5rem";

        this.domElement.append(button);
    }
}