import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import SearchBar from "../../lib/components/SearchBar";
import AppData from "../AppData";
import TeamCard from "../components/TeamCard";
import TeamPage from "../components/TeamPage";
import { FilterManager } from "./FilterManager";

const mainContentContainer = document.querySelector("div#main-content") as HTMLDivElement;
const teamCardsPageContainer = document.querySelector("div#team-cards-page-container") as HTMLDivElement;
const teamCardsList = document.querySelector("div#team-cards-list") as HTMLDivElement;

const buildFilterButton = document.querySelector("button#build-filter") as HTMLButtonElement;
const toggleFilterButton = document.querySelector("button#toggle-filter") as HTMLButtonElement;

const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

let searchBar: SearchBar;
let teamPage: TeamPage;

/** {teamNumber: TeamCard} */
const teamCards: Map<number, TeamCard> = new Map();

/** {optionValue: SortFunction which returns the sorted teams} */
const sortFunctions: Map<string, (isDescending: boolean) => number[]> = new Map();

let filteredTeams: number[] = null;

function populateSortFunctions() {
    // Metadata options
    sortFunctions.set("Metadata/Team Number", (isDescending) =>
        Array.from(teamCards.keys()).toSorted((teamNumber1, teamNumber2) =>
            isDescending ? (teamNumber2 - teamNumber1) : (teamNumber1 - teamNumber2)
        )
    );
    sortFunctions.set("Metadata/EPA", (isDescending) => {
        const sortedArray = Array.from(teamCards.keys()).toSorted((teamNumber1, teamNumber2) => {
            const teamData1 = AppData.superscouting.fetched_team_data.find(
                (team) => team.number === teamNumber1
            );
            const teamData2 = AppData.superscouting.fetched_team_data.find(
                (team) => team.number === teamNumber2
            );

            const useNormalizedEPA = (teamData1.epa && teamData2.epa) === undefined;
            return useNormalizedEPA ?
                (teamData1.normalized_epa - teamData2.normalized_epa) :
                (teamData1.epa - teamData2.epa);
        });

        if(isDescending) sortedArray.reverse();
        return sortedArray;
    });

    // Pitscouting
    for (const pitscoutingField of PitScoutingFields) {
        if (
            pitscoutingField.type !== FieldType.NUMBER &&
            pitscoutingField.type !== FieldType.NUMBER_RANGE
        ) continue;

        sortFunctions.set(`Pitscouting/${pitscoutingField.name}`, (isDescending) => {
            const teamNumbers = Array.from(teamCards.keys());

            return teamNumbers
            .filter((teamNumber) => AppData.superscouting.pit_scouting_notes[teamNumber])
            .toSorted((teamNumber1, teamNumber2) => {
                const teamData1 = AppData.superscouting.pit_scouting_notes[teamNumber1];
                const teamData2 = AppData.superscouting.pit_scouting_notes[teamNumber2];

                return isDescending ? 
                    (teamData2[pitscoutingField.name] - teamData1[pitscoutingField.name]) : 
                    (teamData1[pitscoutingField.name] - teamData2[pitscoutingField.name]);
            }).concat(teamNumbers.filter((teamNumber) => !AppData.superscouting.pit_scouting_notes[teamNumber]));
        });
    }
}

function sortTeams() {
    const sortFunction = sortFunctions.get(sortBySelection.value);

    if (!sortFunction) {
        alert(`No sort function found for ${sortBySelection.value}`);
        return;
    }

    const sortedNumbers = sortFunction(sortOrderButton.classList.contains("descending"));

    for (const [orderIndex, teamNumber] of sortedNumbers.entries()) {
        teamCards.get(teamNumber).domElement.style.order = orderIndex.toString();
    }
}

function searchFilter(teams?: number[]) {
    teams = teams || Array.from(teamCards.keys());

    const searchResults = searchBar.batchSearchTest(
        teams
            .map(teamNumber => teamCards.get(teamNumber).teamString)
    );

    return teams.filter((_, index) => searchResults[index]);
}

function customFilter(teams?: number[]) {
    if(!FilterManager.getTopLevelBlock()) {
        alert("No filter blocks detected. Open the FILTER menu to create a filter. Make sure to BUILD after you are done.");
        return;
    }

    teams = teams || Array.from(teamCards.keys());

    try {
        return teams.filter((teamNumber) => FilterManager.testTeam(teamNumber));
    } catch (e) {
        if(!(e instanceof Error)) e = new Error(e)
        alert(`Something went wrong: ${e.message}`);
    }
}

function toggleTeamVisibility() {
    const passingTeams = searchFilter(!toggleFilterButton.classList.contains("disabled") && filteredTeams);

    for(const [teamNumber, teamCard] of teamCards.entries()) {
        teamCard.domElement.hidden = !passingTeams.includes(teamNumber);
    }
}

export namespace TeamListManager {
    export function createTeamDivs() {
        for (const teamData of AppData.superscouting.fetched_team_data) {
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

        toggleFilterButton.addEventListener("click", () => {
            if(toggleFilterButton.classList.contains("disabled")) {
                if(filteredTeams !== null) {
                    toggleFilterButton.innerText = "ENABLED";
                    toggleFilterButton.classList.remove("disabled");
                } else {
                    alert("No filter detected. Make sure to BUILD the filter after it is designed.");
                }
            } else {
                toggleFilterButton.innerText = "DISABLED";
                toggleFilterButton.classList.add("disabled");
            }
            toggleTeamVisibility();
        });
        searchBar.inputElement.addEventListener("input", toggleTeamVisibility);

        buildFilterButton.addEventListener("click", () => {
            buildFilterButton.innerText = "...";
            const newFilteredTeams = customFilter();
            if(newFilteredTeams === undefined) {
                buildFilterButton.innerText = "BUILD";
            } else {
                filteredTeams = newFilteredTeams;
                buildFilterButton.innerText = "REBUILD";
            }
            if(!toggleFilterButton.classList.contains("disabled")) toggleTeamVisibility();
        });

        toggleFilterButton.addEventListener("click", toggleTeamVisibility);
        sortOrderButton.addEventListener("click", sortTeams);
        sortBySelection.addEventListener("input", sortTeams);
    }
}