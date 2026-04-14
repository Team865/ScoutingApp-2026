import AppData from "../../../AppData";
import { titleCase } from "../../../util/StringManipulation";
import Page from "../Page";
import TeamMatchContainer from "./TeamMatchContainer";

type MatchKey = string;

export default class MatchesPage implements Page {
    public readonly id = "Matches";
    public readonly teamNumber: number;
    public readonly teamMatchContainers: Map<MatchKey, TeamMatchContainer> = new Map();
    private readonly toolbar = document.createElement("div");
    private readonly expandAllButton = document.createElement("button");
    private readonly expandNonEmptyButton = document.createElement("button");
    private readonly collapseAllButton = document.createElement("button");
    private readonly matchList = document.createElement("div");

    constructor(teamNumber: number) {
        this.teamNumber = teamNumber;
        const teamData = AppData.fetched_team_data.find((teamData) => teamData.number === teamNumber);

        this.toolbar.classList.add("match-toolbar");
        this.matchList.classList.add("match-list");

        this.toolbar.append(this.expandNonEmptyButton, this.expandAllButton, this.collapseAllButton);

        this.expandNonEmptyButton.innerText = "Expand Only Non-Empty";
        this.expandAllButton.innerText = "Expand All";
        this.collapseAllButton.innerText = "Collapse All";

        this.expandNonEmptyButton.addEventListener("click", () => this.teamMatchContainers.forEach(container => container.toggle(container.getText().trim().length > 0)));
        this.expandAllButton.addEventListener("click", () => this.teamMatchContainers.forEach(container => container.toggle(true)));
        this.collapseAllButton.addEventListener("click", () => this.teamMatchContainers.forEach(container => container.toggle(false)));

        for(const matchKey of teamData.match_keys) {
            const matchData = AppData.matches.find(v => v.key === matchKey);
            this.teamMatchContainers.set(matchKey, new TeamMatchContainer(teamNumber, matchData.number, this.matchList));
        }
    }

    public show(pageContainer: HTMLDivElement): void {
        pageContainer.appendChild(this.toolbar);
        pageContainer.appendChild(this.matchList);
    }

    public hide(): void {
        this.toolbar.remove();
        this.matchList.remove();
    }
}