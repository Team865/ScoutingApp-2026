import AppData from "../../AppData";
import MatchDataSubpage from "./Subpages/MatchData";
import MatchNotesSubpage from "./Subpages/MatchNotes";
import PitScoutingSubpage from "./Subpages/PitScoutingNotes";
import SubpageInterface from "./Subpages/SubpageInterface";

export default class TeamPageContainer {
    private readonly pageContainer = document.createElement("div");

    public readonly exitButton = document.createElement("button");
    private readonly pageTitle = document.createElement("h1");
    private readonly tabsContainer = document.createElement("div");
    private readonly subpageContents = document.createElement("div");

    /** The currently open subpage as its string name */
    private currentSubpage: string;

    /** subpageName: [tabButton, subpageObject] */
    private readonly subpages = new Map<string, [HTMLButtonElement, SubpageInterface]>([
        ["Visualizer", [document.createElement("button"), null]],
        ["Match Data", [document.createElement("button"), new MatchDataSubpage()]],
        ["Match Notes", [document.createElement("button"), new MatchNotesSubpage()]],
        ["Pit Scouting Notes", [document.createElement("button"), new PitScoutingSubpage()]]
    ]);

    constructor() {
        this.pageContainer.id = "team-page";
        this.pageContainer.hidden = true;

        this.exitButton.id = "exit-page";
        this.exitButton.innerText = "Return";
        this.exitButton.addEventListener("click", () => this.pageContainer.hidden = true);
        
        this.tabsContainer.id = "subpage-tab-buttons-container";
        this.subpageContents.id = "team-page-subpage-container";

        for(const [subpageName, [tabButton, subpage]] of this.subpages.entries()) {
            tabButton.innerText = subpageName;
            tabButton.classList.add("subpage-tab-button");

            tabButton.addEventListener("click", () => {
                if(!subpage) return;
                this.setPage(subpageName);
            });

            this.tabsContainer.appendChild(tabButton);
        }

        this.setPage("Match Notes");

        this.pageContainer.append(
            this.exitButton,
            this.pageTitle,
            this.tabsContainer,
            this.subpageContents
        );
    }

    private setPage(pageName: string) {
        if(pageName === this.currentSubpage) return;
        if(this.currentSubpage) {
            const [previousSubpageTabButton, previousSubpage] = this.subpages.get(this.currentSubpage);
            previousSubpageTabButton.classList.remove("selected");
            previousSubpage.domElement.remove();
        }
        
        const [newSubpageTabButton, newSubpage] = this.subpages.get(pageName);

        this.currentSubpage = pageName;

        newSubpageTabButton.classList.add("selected");
        this.subpageContents.appendChild(newSubpage.domElement);
    }

    public open(teamNumber: number) {
        const teamData = AppData.superscouting.fetched_team_data.find(
            (team) => team.number === teamNumber
        );

        for(const [_, subpage] of this.subpages.values()) {
            if(!subpage) continue;
            subpage.setTeam(teamNumber);
        }
        
        this.pageTitle.innerText = `${teamData.number}: ${teamData.name}`;
        this.pageContainer.hidden = false;
    }

    public get domElement() {
        return this.pageContainer;
    }
}