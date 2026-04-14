import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamContainer from "../components/Team/Container";

const teamsList: HTMLDivElement = document.querySelector("#teams-list");
let searchBar: SearchBar = null;
const expandAllTeamsButton: HTMLButtonElement = document.querySelector("button#expand-all-teams");
const collapseAllTeamsButton: HTMLButtonElement = document.querySelector("button#collapse-all-teams");
const pageHeaderContainer = document.getElementById("page-header");

/** {teamNumber: TeamContainer} */
const teamContainers: Map<number, TeamContainer> = new Map();

const matchSearchingRegex = /Q\d+/i;

function applySearch(){
    const orderedTeamContainers = Array.from(teamContainers.values());
    let searchResults: boolean[];
    
    if(matchSearchingRegex.test(searchBar.inputElement.value)) {
        const matchNumberStr = searchBar.inputElement.value.slice(1);

        // Match number searching
        searchResults = Array.from(teamContainers.keys()).map(teamNumber => 
            AppData.fetched_team_data.find(data => data.number == teamNumber)
            .match_keys.find(key => key.includes(matchNumberStr)) !== undefined
        )
    } else {
        // Team number/name searching
        searchResults = (searchBar.batchSearchTest(
            orderedTeamContainers
            .map(teamContainer => teamContainer.teamString)
        ));
    }

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