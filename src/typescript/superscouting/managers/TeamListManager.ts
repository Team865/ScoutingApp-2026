import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamContainer from "../components/Team/Container";

const teamsList: HTMLDivElement = document.querySelector("#teams-list");
let searchBar: SearchBar;
const expandAllTeamsButton: HTMLButtonElement = document.querySelector("button#expand-all-teams");
const collapseAllTeamsButton: HTMLButtonElement = document.querySelector("button#collapse-all-teams");
const pageHeaderContainer = document.getElementById("page-header");

/** {teamNumber: TeamContainer} */
let teamContainers: Map<number, TeamContainer> = new Map();

function convertToOptionValue(value: string) {
    return value.toLowerCase().split(" ").join("-");
}

function applySearch(){
    const orderedTeamContainers = Array.from(teamContainers.values());
    const searchResults = searchBar.batchSearchTest(
        orderedTeamContainers
        .map(teamContainer => teamContainer.teamString)
    );

    for(const [index, teamContainer] of orderedTeamContainers.entries()) {
        teamContainer.domElement.hidden = !searchResults[index];
    }
}

export namespace TeamListManager {
    export function createTeamDivs() {
        for(const teamContainer of teamContainers.values()) {
            teamContainer.domElement.remove();
        }

        teamContainers.clear();

        for(const team of AppData.fetched_team_data){
            const teamContainer = new TeamContainer(team.number);
            teamsList.appendChild(teamContainer.domElement);
            teamContainers.set(team.number, teamContainer);
        }
    }

    export function updateStatboticStats() {
        for(const teamContainer of teamContainers.values()) {
            teamContainer.updateStatboticStats();
        }
    }

    export function start() {
        // Create search bar
        searchBar = new SearchBar();
        pageHeaderContainer.parentElement.insertBefore(searchBar.containerElement, pageHeaderContainer.nextSibling);

        searchBar.inputElement.addEventListener("input", applySearch);
        expandAllTeamsButton.addEventListener("click", () => teamContainers.forEach(container => container.toggle(true)));
        collapseAllTeamsButton.addEventListener("click", () => teamContainers.forEach(container => container.toggle(false)));
    }
}