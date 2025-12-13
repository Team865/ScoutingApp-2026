import AppData from "../../AppData.js";
import Page from "./Page.js";

export default class SummaryPage implements Page {
    private readonly teamNumber: number;

    public readonly id = "Summary";
    private readonly mainContainer = document.createElement("div");
    private readonly epaP = document.createElement("p");

    constructor(teamNumber: number) {
        this.teamNumber = teamNumber;
        
        this.mainContainer.classList.add("summary-page");

        this.updateData();

        this.mainContainer.append(
            this.epaP
        );
    }

    public updateData() {
        const teamData = AppData.fetchedTeamData.find((teamData) => teamData.number === this.teamNumber);
        const epaDataExists = (teamData.normalized_epa || teamData.epa) !== undefined;
        const isNormalizedEpa = epaDataExists && (teamData.epa === undefined);
        const epaValue = teamData.epa || teamData.normalized_epa;

        this.epaP.innerHTML = `${isNormalizedEpa ? "Normalized " : ""}EPA: <span class="epa-number">${epaDataExists ? epaValue : "Loading..."}</span>`;
    }

    public show(pageContainer: HTMLDivElement): void {
        pageContainer.appendChild(this.mainContainer);
    }

    public hide(): void {
        this.mainContainer.remove();
    }
}