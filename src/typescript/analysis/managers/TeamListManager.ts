import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamCard from "../components/TeamCard";
import TeamPage from "../components/TeamPage";

const mainContentContainer = document.querySelector("div#main-content") as HTMLDivElement;
const teamCardsPageContainer = document.querySelector("div#team-cards-page-container") as HTMLDivElement;
const teamCardsList = document.querySelector("div#team-cards-list") as HTMLDivElement;

const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

let searchBar: SearchBar;
let teamPage: TeamPage;

/** {teamNumber: TeamCard} */
const teamCards: Map<number, TeamCard> = new Map();

/** {optionValue: SortFunction} */
const sortFunctions: Map<string, (teamNumber1: number, teamNumber2: number) => number> = new Map();

function populateSortFunctions() {
    // Metadata options
    sortFunctions.set("Metadata/Team Number", (teamNumber1, teamNumber2) => teamNumber1 - teamNumber2);
    sortFunctions.set("Metadata/EPA", (teamNumber1, teamNumber2) => {
        const teamData1 = AppData.superscouting.fetched_team_data.find(
            (team) => team.number === teamNumber1
        );
        const teamData2 = AppData.superscouting.fetched_team_data.find(
            (team) => team.number === teamNumber2
        );

        const useNormalizedEPA = (teamData1.epa && teamData2.epa) === undefined;
        console.log(useNormalizedEPA);
        return useNormalizedEPA ?
            (teamData1.normalized_epa - teamData2.normalized_epa) :
            (teamData1.epa - teamData2.epa);
    });

    // Pitscouting
    for(const pitscoutingField of PitScoutingFields) {
        if(
            pitscoutingField.type !== FieldType.NUMBER &&
            pitscoutingField.type !== FieldType.NUMBER_RANGE
        ) continue;

        sortFunctions.set(`Pitscouting/${pitscoutingField.name}`, (teamNumber1, teamNumber2) => {
            const teamData1 = AppData.superscouting.pit_scouting_notes[teamNumber1];
            const teamData2 = AppData.superscouting.pit_scouting_notes[teamNumber2];

            if(!teamData1)
                return -1;
            if(!teamData2)
                return 1;

            return teamData1[pitscoutingField.name] - teamData2[pitscoutingField.name];
        });
    }
}

function sortTeams() {
    const sortFunction = sortFunctions.get(sortBySelection.value);

    if(!sortFunction) {
        alert(`No sort function found for ${sortBySelection.value}`);
        return;
    }

    const sortedNumbers = Array
        .from(teamCards.keys())
        .toSorted(sortFunction);

    const isReversed = sortOrderButton.classList.contains("descending");

    for(const [orderIndex, teamNumber] of sortedNumbers.entries()) {
        teamCards.get(teamNumber).domElement.style.order = (isReversed ? -orderIndex : orderIndex).toString();
    }
}

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
        populateSortFunctions();

        searchBar = new SearchBar();
        teamPage = new TeamPage();

        teamCardsPageContainer.insertBefore(
            searchBar.containerElement,
            teamCardsList
        );

        mainContentContainer.appendChild(teamPage.domElement);

        searchBar.inputElement.addEventListener("input", applySearch);
        sortOrderButton.addEventListener("click", sortTeams);
        sortBySelection.addEventListener("input", sortTeams);
    }
}