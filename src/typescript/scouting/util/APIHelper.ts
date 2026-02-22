import AppData from "../AppData";

const apiRoot = "api/scouting";

export type AssignedMatch = {
    teamNumber: number,
    alliance: "Red" | "Blue"
};

export type ScoutingRotation = Map<number, AssignedMatch>

export async function getScoutingRotation() {
    return await fetch(`${apiRoot}/rotation`, {
        headers: {"X-Request-ID": AppData.scouterName}
    });
}