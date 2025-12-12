import AppData, { FetchedTeamData, MatchData } from "./AppData.js";
import {getMatches, getTeams} from "./util/APIHelper.js";
import {TeamListManager} from "./managers/TeamListManager.js";
import PopupDiv from "./components/Popup/PopupDiv.js";

const setCompetitionButton = document.getElementById("set-competition-button");
const refreshDataButton = document.getElementById("refresh-tba-data-button");
const mainTag = document.querySelector("main");

function setCompetition() {
    const userInput = prompt("Enter the competition code:", AppData.competitionKey);

    if(!userInput) return;

    AppData.competitionKey = userInput;
    // getEventInfo(AppData.competitionKey).then(eventInfo => console.log(eventInfo));
    refreshTBAData().then(TeamListManager.createTeamDivs);
}

async function refreshTBAData() {
    console.log("Fetching team data.....");
    const rawTeamsData = await getTeams(AppData.competitionKey);
    console.log("Team Data fetched!");
    const teamsData: FetchedTeamData[] = [];
    const matchesList: MatchData[] = [];

    for(const teamJSon of rawTeamsData){
        teamsData.push({
            name: teamJSon.nickname,
            number: teamJSon.team_number,
            key: teamJSon.key,
            matchKeys: [],
            epa: teamJSon.epa,
            normalized_epa: teamJSon.normalized_epa
        });
    }

    console.log("Retrieving matches....")
    const rawMatchesData = (await getMatches(AppData.competitionKey))
        .filter(match => match.comp_level == "qm")
        .toSorted((a, b) => a.match_number - b.match_number);
    
    for(const matchJSon of rawMatchesData) {
        // Add matches to the matches list
        if(matchJSon.comp_level !== "qm") continue; // Skip any non-quals match

        const matchKey = matchJSon.key;
        const matchTeams: {teamNumber: number, alliance: "red" | "blue"}[] = [];

        for(const teamKey of matchJSon.alliances.red.team_keys) {
            const teamData = teamsData.find(team => team.key == teamKey);
            matchTeams.push({teamNumber: teamData.number, alliance: "red"});
            teamData.matchKeys.push(matchKey);
        }
        
        for(const teamKey of matchJSon.alliances.blue.team_keys) {
            const teamData = teamsData.find(team => team.key == teamKey);
            matchTeams.push({teamNumber: teamData.number, alliance: "blue"});
            teamData.matchKeys.push(matchKey);
        }

        matchesList.push({
            key: matchKey,
            number: matchJSon.match_number,
            compLevel: matchJSon.comp_level,
            redScore: matchJSon.alliances.red.score,
            blueScore: matchJSon.alliances.blue.score,
            teams: matchTeams
        });
    }

    teamsData.sort((a, b) => a.number - b.number);
    matchesList.sort((a, b) => a.number - b.number);

    AppData.fetchedTeamData = teamsData;
    AppData.matches = matchesList;
}

setCompetitionButton.onclick = setCompetition;
TeamListManager.start();