import TeamContainer from "../components/Team/Container";
import AppData, { TeamTag } from "../AppData";
import {TeamNotesManager} from "./TeamNotesManager";
import { FetchedTeamData } from '../AppData';
import HTMLClassObserver from "../../lib/dataTypes/HTMLClassObserver";

const teamsList: HTMLDivElement = document.querySelector("#teams-list");
// const filterMenuToggleButton: HTMLButtonElement = document.querySelector("button#filter-button") as HTMLButtonElement;
// const filterMenu: HTMLDivElement = document.querySelector("div#filter-menu") as HTMLDivElement;
const searchBar: HTMLInputElement = document.getElementById("search-bar-input") as HTMLInputElement;
const expandAllTeamsButton: HTMLButtonElement = document.querySelector("button#expand-all-teams");
const collapseAllTeamsButton: HTMLButtonElement = document.querySelector("button#collapse-all-teams");

/** {teamNumber: TeamContainer} */
let teamContainers: Map<number, TeamContainer> = new Map();

function convertToOptionValue(value: string) {
    return value.toLowerCase().split(" ").join("-");
}

function applySearch(){
    if(!searchBar.value) {
        for(const teamContainer of teamContainers.values()) {
            teamContainer.domElement.hidden = false;
        }
        
        return;
    }

    const searchRegex = new RegExp(searchBar.value, "gi");

    for(const teamContainer of teamContainers.values()) {
        if(searchRegex.test(teamContainer.teamString)) {
            teamContainer.domElement.hidden = false;
        } else {
            teamContainer.domElement.hidden = true;
        }
    }
}

export namespace TeamListManager {
    export function createTeamDivs() {
        for(const teamContainer of teamContainers.values()) {
            teamContainer.domElement.remove();
        }

        teamContainers.clear();

        for(const team of AppData.fetchedTeamData){
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
        searchBar.addEventListener("input", applySearch);
        expandAllTeamsButton.addEventListener("click", () => teamContainers.forEach(container => container.toggle(true)));
        collapseAllTeamsButton.addEventListener("click", () => teamContainers.forEach(container => container.toggle(false)));
    }
}