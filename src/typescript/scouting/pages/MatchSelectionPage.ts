import Page from "./Page";
import Signal from "../../lib/dataTypes/Signal";
import AppData from "../AppData";

export default class MatchSelectionPage extends Page {
    public readonly manualInputButton = document.createElement("button");
    public readonly matchSelected = new Signal<"Red" | "Blue">();

    constructor(scouterName: string) {
        super("Name: " + scouterName);
        
        this.manualInputButton.textContent = "Manual";
        this.manualInputButton.classList.add("match-selection");
        this.domElement.append(this.manualInputButton);
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

        this.domElement.append(button);
    }
}