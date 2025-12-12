import AppData, { TeamTag } from "../../AppData.js";
import { TeamNotesManager } from "../../managers/TeamNotesManager.js";
import { bindAccordionBehavior } from "../Accordion.js";
import PopupDialog, { PopupExitCode } from "../Popup/PopupDialog.js";
import MatchesPage from "./Match/Page.js";
import Page from "./Page.js";
import SummaryPage from "./SummaryPage.js";
import PitScoutingPage from "./Pit/Page.js";

export default class TeamContainer {
    private readonly containerDiv = document.createElement("div");
    private readonly toggleButton = document.createElement("button");
    private readonly teamImage = document.createElement("img");
    private readonly teamHeader = document.createElement("h1");
    // private readonly tagsDisplay = document.createElement("div");
    private readonly contentsDiv = document.createElement("div");

    private readonly tabsContainer = document.createElement("div");
    private readonly pageContainer = document.createElement("div");

    private readonly pageToTabButtons: Map<Page, HTMLButtonElement>;
    private currentPage: Page;

    private teamName: string;
    private teamNumber: number;
    private active: boolean;

    constructor(teamNumber: number) {
        const teamData = AppData.fetchedTeamData.find(
            (team) => team.number === teamNumber
        );

        this.teamName = teamData.name;

        this.pageContainer = document.createElement("div");

        this.active = false;
        this.teamNumber = teamNumber;

        this.pageToTabButtons = new Map<Page, HTMLButtonElement>([
            [new SummaryPage(teamNumber), null],
            [new MatchesPage(teamNumber), null],
            [new PitScoutingPage(teamNumber), null]
        ]);
        this.currentPage = this.pageToTabButtons.keys().next().value;

        // Set classes
        this.containerDiv.classList.add("team-container");
        this.contentsDiv.classList.add("accordion-body");
        this.tabsContainer.classList.add("tabs-container");
        this.pageContainer.classList.add("page-container");

        // this.tagsDisplay.classList.add("team-tags-display");

        // Customize Button
        this.teamHeader.innerText = this.teamString;
        this.teamImage.addEventListener(
            "error", 
            () => this.teamImage.src = "static/deploy/FIRSTLogo.svg", 
            {once: true}
        );
        this.teamImage.src = `https://www.thebluealliance.com/avatar/2025/frc${teamNumber}.png`;

        // Have to wrap in a lambda function so that "this" still refers to the TeamContainer object
        this.toggleButton.addEventListener("click", () => this.toggle());

        // Customize contents div
        bindAccordionBehavior(this.containerDiv, this.contentsDiv);

        // Create tab buttons
        for (const page of this.pageToTabButtons.keys()) {
            const tabButton = document.createElement("button");
            tabButton.value = page.id;
            tabButton.innerText = page.id;
            tabButton.classList.add("tab-button");
            tabButton.addEventListener("click", () => this.switchToPage(page));
            this.tabsContainer.appendChild(tabButton);

            this.pageToTabButtons.set(page, tabButton);

            if (page === this.currentPage) tabButton.classList.add("selected");
        }

        this.currentPage.show(this.pageContainer);

        // Add child elements
        this.contentsDiv.appendChild(this.tabsContainer);
        this.contentsDiv.appendChild(this.pageContainer);
        this.toggleButton.append(
            this.teamImage,
            this.teamHeader,
            // this.tagsDisplay
        );

        this.containerDiv.appendChild(this.toggleButton);
        this.containerDiv.appendChild(this.contentsDiv);
    }

    private switchToPage(page: Page): void {
        if (this.currentPage === page) return;
        if (this.currentPage !== null) {
            this.currentPage.hide();
            this.pageToTabButtons.get(this.currentPage).classList.remove("selected");
        }
        this.currentPage = page;
        page.show(this.pageContainer);
        this.pageToTabButtons.get(page).classList.add("selected");
    }

    public toggle(force?: boolean) {
        this.active = (force === null) ? !this.active : force;
        this.containerDiv.classList.toggle("active", this.active);
    }

    public setOrder(orderNum: number) {
        this.containerDiv.style.order = orderNum.toString();
    }

    get domElement() {
        return this.containerDiv;
    }

    get teamString() {
        return `${this.teamNumber}: ${this.teamName}`;
    }
}
