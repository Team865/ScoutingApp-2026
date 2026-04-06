import { ScoutingData } from '../scouting/AppData';
import AppData from "./AppData";
import { FilterManager } from "./managers/FilterManager";
import { TeamListManager } from "./managers/TeamListManager";
import { fetchBackendData } from "./util/APIHelper";

async function refreshAppDataFromBackend() {
    const backendData = await fetchBackendData();

    AppData.superscouting = backendData["superscouting"];

    const quantitiveData: ScoutingData[] = backendData["quantitative_data"]

    for(const data of quantitiveData) {
        if(!AppData.quantitative_data.has(data.team_number))
            AppData.quantitative_data.set(data.team_number, []);

        (AppData.quantitative_data.get(data.team_number)).push(data);
    }

    for(const teamData of AppData.quantitative_data.values()) {
        teamData.sort((matchData1, matchData2) => matchData1.match_number - matchData2.match_number)
    }

    // function getMean(values: number[]) {
    //     values = values.filter((value) => value);

    //     return values.reduce((partialSum, defenseSkill) => partialSum + defenseSkill, 0) / values.length;
    // }

    // function getSortedMean(ogList: [teamNumber: number, values: number[]][]) {
    //     const sortedList = [];

    //     for(const [teamNumber, scoutingDatas] of ogList) {
    //         sortedList.push([teamNumber, getMean(scoutingDatas)]);
    //     }

    //     sortedList.sort((a, b) => a[1] - b[1]);

    //     return sortedList;
    // }

    // const filteredDriveSkills: [number, number[]][] = [];
    // const filteredDefenses: [number, number[]][] = [];

    // for(const [teamNumber, scoutingDatas] of AppData.quantitative_data.entries()) {
    //     filteredDriveSkills.push([teamNumber, scoutingDatas.map(data => data.driver_skill)]);
    //     filteredDefenses.push([teamNumber, scoutingDatas.filter(data => data.defense_skill > 0).map(data => data.defense_skill)]);
    // }

    // const sortedDrive = getSortedMean(filteredDriveSkills);
    // const sortedDefense = getSortedMean(filteredDefenses).filter(([_, defenseSkill]) => !Number.isNaN(defenseSkill));
    // const sortedEPA = AppData.superscouting.fetched_team_data.map(data => [data.number, data.epa]).sort((a, b) => a[1] - b[1]);

    // let text = "";
    // text += "Drive skill:\nTeam Number, Skill\n";
    // for(const [teamNumber, meanSkill] of sortedDrive) {
    //     text += `${teamNumber}, ${meanSkill}\n`;
    // }

    // text += "Defense skill:\nTeam Number, Skill\n";
    // for(const [teamNumber, meanSkill] of sortedDefense) {
    //     text += `${teamNumber}, ${meanSkill}\n`;
    // }

    // text += "EPA:\nTeam Number, Skill\n";
    // for(const [teamNumber, epa] of sortedEPA) {
    //     text += `${teamNumber}, ${epa}\n`;
    // }

    // navigator.clipboard.writeText(text);
}

refreshAppDataFromBackend().then(TeamListManager.createTeamDivs);

FilterManager.start();
TeamListManager.start();