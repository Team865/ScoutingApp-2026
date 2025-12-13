import AppData from "../../../AppData.js";
import { titleCase, removeSuffix } from "../../../util/StringManipulation.js";
import { bindAccordionBehavior } from "../../Accordion.js";
import PopupDiv from "../../Popup/PopupDiv.js";
import bindTextEditorBehavior from "./MatchTextEditor.js";

export default class TeamMatchContainer {
    private readonly teamNumber: number;
    private readonly matchNumber: number;

    private readonly matchContainer = document.createElement("div");
    private readonly matchLabel = document.createElement("p");
    private readonly toggleButton = document.createElement("button");
    private readonly viewMatchDataButton = document.createElement("button");
    private readonly accordionBody = document.createElement("div");
    private readonly noteTakingArea = document.createElement("div");

    private readonly matchDataPopupTags = {
        redTitle: document.createElement("h2"),
        redScore: document.createElement("h1"),
        red0TeamLabel: document.createElement("h2"),
        red1TeamLabel: document.createElement("h2"),
        red2TeamLabel: document.createElement("h2"),
        red0TeamImage: document.createElement("img"),
        red1TeamImage: document.createElement("img"),
        red2TeamImage: document.createElement("img"),
        blueTitle: document.createElement("h2"),
        blueScore: document.createElement("h1"),
        blue0TeamLabel: document.createElement("h2"),
        blue1TeamLabel: document.createElement("h2"),
        blue2TeamLabel: document.createElement("h2"),
        blue0TeamImage: document.createElement("img"),
        blue1TeamImage: document.createElement("img"),
        blue2TeamImage: document.createElement("img"),
    };

    private readonly matchDataPopup = new PopupDiv();

    private isActive = false;

    constructor(teamNumber: number, matchNumber: number, listContainer: HTMLDivElement) {
        this.teamNumber = teamNumber;
        this.matchNumber = matchNumber;

        const matchData = AppData.matches.find(v => v.number === matchNumber);
        const alliance = matchData.teams.find(v => v.teamNumber === teamNumber).alliance;

        this.matchContainer.classList.add("team-match");
        this.toggleButton.classList.add("accordion-toggle", `${alliance.toLowerCase()}-alliance`);
        this.viewMatchDataButton.classList.add("view-match-data");
        this.toggleButton.addEventListener("click", () => this.toggle());
        this.matchLabel.innerText = `Q${matchData.number}: ${titleCase(alliance)} Alliance`;

        bindAccordionBehavior(this.matchContainer, this.accordionBody);
        bindTextEditorBehavior(this.noteTakingArea);
        this.initMatchDataPopup();
        this.viewMatchDataButton.addEventListener("click", (e) => this.viewMatchDataClicked(e));

        this.toggleButton.appendChild(this.matchLabel);
        this.toggleButton.appendChild(this.viewMatchDataButton);
        this.accordionBody.appendChild(this.noteTakingArea);
        this.matchContainer.appendChild(this.toggleButton);
        this.matchContainer.appendChild(this.accordionBody);
        listContainer.appendChild(this.matchContainer);
    }

    private initMatchDataPopup() {
        const matchDataContainer = document.createElement("div");
        matchDataContainer.style.display = "grid";
        matchDataContainer.style.gridTemplateColumns = "1fr 1fr";
        matchDataContainer.style.gridTemplateRows = "auto 1fr";

        const initAlliance = (alliance: "red" | "blue") => {
            const initTeam = (index: number) => {
                const teamContainer = document.createElement("div");
                const teamLabel: HTMLHeadingElement = this.matchDataPopupTags[`${alliance}${index}TeamLabel`];
                const teamImage: HTMLImageElement = this.matchDataPopupTags[`${alliance}${index}TeamImage`];

                teamContainer.style.display = "flex";
                teamContainer.style.alignItems = "center";
                teamContainer.style.gap = "5px";
                teamContainer.style.padding = "0 15px";

                teamContainer.style.backgroundColor = `var(--${alliance}-alliance)`;
                teamContainer.style.filter = "drop-shadow(2px 2px 2px rgba(0, 0, 0, 50%))";

                teamContainer.append(teamImage, teamLabel);
                teamsContainer.appendChild(teamContainer);

                teamImage.addEventListener("error", () => teamImage.src = "static/deploy/FIRSTLogo.svg");
            } 

            const topChunk = document.createElement("div");
            const teamsContainer = document.createElement("div");

            const allianceTitle: HTMLHeadingElement = this.matchDataPopupTags[`${alliance}Title`];
            const allianceScoreLabel: HTMLHeadingElement = this.matchDataPopupTags[`${alliance}Score`];

            const columnIndex = (alliance === "red") ? 1 : 2;

            topChunk.style.display = "grid";
            topChunk.style.gridTemplateRows = "1fr auto";
            topChunk.style.backgroundColor = `var(--${alliance}-alliance)`;
            topChunk.style.gridColumn = columnIndex.toString();
            topChunk.style.gridRow = "1";

            teamsContainer.style.display = "flex";
            teamsContainer.style.flexFlow = "column";
            teamsContainer.style.alignItems = "stretch";
            teamsContainer.style.gap = "5px";
            teamsContainer.style.gridColumn = columnIndex.toString();
            teamsContainer.style.gridRow = "2";
            teamsContainer.style.backgroundColor = `var(--${alliance}-alliance-light)`;

            allianceTitle.innerText = titleCase(alliance);
            allianceTitle.style.margin = "auto";
            allianceScoreLabel.style.margin = "auto";

            topChunk.append(allianceTitle, allianceScoreLabel);
            
            for(let i = 0; i < 3; i++){
                initTeam(i);
            }

            matchDataContainer.append(topChunk, teamsContainer);
        }

        matchDataContainer.classList.add("match-data-container");
        
        initAlliance("red");
        initAlliance("blue");
        this.matchDataPopup.appendChild(matchDataContainer);
    }

    private updateMatchDataPopup() {
        const matchData = AppData.matches.find(v => v.number === this.matchNumber);
        const winningAlliance = 
            (matchData.redScore === matchData.blueScore) ? 
            "neither" :
            (matchData.redScore > matchData.blueScore) ? "red" : "blue";

        const updateAlliance = (alliance: "red" | "blue") => {
            const teams = matchData.teams.filter(team => team.alliance === alliance);

            const scoreLabel = this.matchDataPopupTags[`${alliance}Score`];
            
            scoreLabel.innerText = matchData[`${alliance}Score`].toString();

            for(const [teamIndex, team] of teams.entries()) {
                const teamLabel: HTMLHeadingElement = this.matchDataPopupTags[`${alliance}${teamIndex}TeamLabel`];
                const teamImage: HTMLImageElement = this.matchDataPopupTags[`${alliance}${teamIndex}TeamImage`];

                teamImage.src = `https://www.thebluealliance.com/avatar/2025/frc${team.teamNumber}.png`;
                teamLabel.innerText = team.teamNumber.toString();
            }
            
            const allianceTitle = this.matchDataPopupTags[`${alliance}Title`];
            allianceTitle.innerText = removeSuffix(allianceTitle.innerText, " 🏆");

            if(alliance === winningAlliance) {
                allianceTitle.innerText += " 🏆"; 
            }
        }

        updateAlliance("red");
        updateAlliance("blue");
    }

    private viewMatchDataClicked(e: MouseEvent) {
        e.stopPropagation();
        this.updateMatchDataPopup();
        this.matchDataPopup.show();
    }

    public toggle(force?: boolean) {
        this.isActive = (force === null) ? !this.isActive : force;

        this.matchContainer.classList.toggle("active", this.isActive);
    }
}