import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamCard from "../components/TeamCard";
import TeamPage from "../components/TeamPage";

const mainContentContainer = document.querySelector("div#main-content") as HTMLDivElement;
const teamCardsPageContainer = document.querySelector("div#team-cards-page-container") as HTMLDivElement;
const teamCardsList = document.querySelector("div#team-cards-list") as HTMLDivElement;

let searchBar: SearchBar;
let teamPage: TeamPage;

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

            teamCard.domElement.addEventListener("click", () => {
                teamPage.open(teamData.number);
            });
        }
    }

    export function start() {
        searchBar = new SearchBar();
        teamPage = new TeamPage();

        teamCardsPageContainer.insertBefore(
            searchBar.containerElement,
            teamCardsList
        );

        mainContentContainer.appendChild(teamPage.domElement);

        searchBar.inputElement.addEventListener("input", applySearch);
    }
}