import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamCard from "../components/TeamCard";

const teamCardsPageContainer = document.querySelector("div#team-cards-page-container") as HTMLDivElement;
const teamCardsList = document.querySelector("div#team-cards-list") as HTMLDivElement;

let searchBar: SearchBar;

/** {teamNumber: TeamCard} */
const teamCards: Map<number, TeamCard> = new Map();

function applySearch() {
    const orderedTeamCards = Array.from(teamCards.values());

    const searchResults = searchBar.batchSearchTest(
        orderedTeamCards
        .map(teamCard => teamCard.teamString)
    );

    for(const [index, teamCard] of orderedTeamCards.entries()) {
        teamCard.domElement.hidden = !searchResults[index];
    }
}

export namespace TeamListManager {
    export function createTeamDivs() {
        for(const teamData of AppData.superscouting.fetched_team_data) {
            const teamCard = new TeamCard(teamData.number);
            teamCards.set(teamData.number, teamCard);
            teamCardsList.appendChild(teamCard.domElement);
        }
    }

    export function start() {
        searchBar = new SearchBar();
        teamCardsPageContainer.insertBefore(
            searchBar.containerElement,
            teamCardsList
        );

        searchBar.inputElement.addEventListener("input", applySearch);
    }
}