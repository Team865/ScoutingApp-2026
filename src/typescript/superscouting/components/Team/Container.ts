import AppData from "../../AppData";
import { TeamNotesManager } from "../../managers/TeamNotesManager";
import { bindAccordionBehavior } from "../../../lib/components/Accordion";
import MatchesPage from "./Match/Page";
import Page from "./Page";
import SummaryPage from "./SummaryPage";
import PitScoutingPage from "./Pit/Page";
import FieldInterface from "./Pit/Field/FieldInterface";

export default class TeamContainer {
    private readonly containerDiv = document.createElement("div");
    private readonly toggleButton = document.createElement("button");
    private readonly teamImage = document.createElement("img");
    private readonly teamHeader = document.createElement("h1");
    // private readonly tagsDisplay = document.createElement("div");
    private readonly contentsDiv = document.createElement("div");

    private readonly tabsContainer = document.createElement("div");
    private readonly pageContainer = document.createElement("div");

    private readonly pages: Map<string, {
        tabButton?: HTMLButtonElement,
        page: Page
    }>;

    private currentPageName: string;

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

        this.pages = new Map<string, {
            tabButton?: HTMLButtonElement,
            page: Page
        }>([
            ["Summary", { page: new SummaryPage(teamNumber) }],
            ["Matches", { page: new MatchesPage(teamNumber) }],
            ["Pit Scouting", { page: new PitScoutingPage(teamNumber) }]
        ]);
        this.currentPageName = "Summary";

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
        for (const pageName of this.pages.keys()) {
            this.createPageButton(pageName);
        }

        this.pages.get(this.currentPageName).page.show(this.pageContainer);

        {
            // Set pit scouting submit button
            const pitScoutingPageInfo = (this.pages.get("Pit Scouting"));
            const pitScoutingPage = pitScoutingPageInfo.page as PitScoutingPage
            pitScoutingPage.submitPitScoutingButton.addEventListener("click", () => this.submitPitScouting(pitScoutingPageInfo));

            // Check for preexisting notes
            if(TeamNotesManager.getPitScoutingNotes(this.teamNumber)) {
                this.enableSubmittedAppearance(pitScoutingPageInfo);
                pitScoutingPage.serverNotesReceived(teamNumber);
            }

            // Pit scouting notes from the server
            AppData.serverPitScoutingNotesChanged.connect((teamNumber) => {
                if(teamNumber !== this.teamNumber) return;

                this.enableSubmittedAppearance(pitScoutingPageInfo);
                pitScoutingPage.serverNotesReceived(teamNumber);
            });
        }

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

    private createPageButton(pageName: string) {
        const pageInfo = this.pages.get(pageName);
        const page = pageInfo.page
        const tabButton = document.createElement("button");
        tabButton.value = page.id;
        tabButton.innerText = page.id;
        tabButton.classList.add("tab-button");
        tabButton.addEventListener("click", () => this.switchToPage(pageName));
        this.tabsContainer.appendChild(tabButton);

        pageInfo.tabButton = tabButton;

        if (pageName === this.currentPageName) tabButton.classList.add("selected");
    } 

    public updateStatboticStats() {
        (this.pages.get("Summary").page as SummaryPage).updateData()
    }

    private enableSubmittedAppearance(pitScoutingPageInfo: {tabButton?: HTMLButtonElement, page: Page}) {
        pitScoutingPageInfo.tabButton.classList.add("complete");
        (pitScoutingPageInfo.page as PitScoutingPage).submitPitScoutingButton.innerText = "Resubmit";
    }

    public submitPitScouting(pitScoutingPageInfo: {tabButton?: HTMLButtonElement, page: Page}) {
        const pitScoutingPage = pitScoutingPageInfo.page as PitScoutingPage;

        const scoutingData = pitScoutingPage.getData;

        if(scoutingData.isIncomplete) {
            const missingField = scoutingData.data as FieldInterface;
            missingField.domElement.scrollIntoView();
            alert(`Missing field: ${missingField.name}`);
            return;
        }

        this.enableSubmittedAppearance(pitScoutingPageInfo);

        TeamNotesManager.setPitScoutingFromClient(this.teamNumber, scoutingData.data);

        this.containerDiv.scrollIntoView();
        this.switchToPage("Summary");
    }

    private switchToPage(pageName: string): void {
        if (this.currentPageName === pageName) return;
        const previousPageInfo = this.pages.get(this.currentPageName);
        if (this.currentPageName !== null) {
            previousPageInfo.page.hide();
            previousPageInfo.tabButton.classList.remove("selected");
        }

        this.currentPageName = pageName;
        const currentPageInfo = this.pages.get(pageName);
        currentPageInfo.page.show(this.pageContainer);
        currentPageInfo.tabButton.classList.add("selected");
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
