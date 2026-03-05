import { genericPostRequest } from "../../lib/APIHelper";
import AppData from "../AppData";

const apiRoot = "api/scouting";

export type AssignedMatch = {
    teamNumber: number,
    alliance: "Red" | "Blue"
};

export type ScoutingRotation = Map<number, AssignedMatch>

export async function getScoutingRotation(): Promise<ScoutingRotation> {
    const scoutingRotationRequest = await fetch(`${apiRoot}/rotation`, {
        headers: {"X-Request-ID": AppData.scouterName}
    });

    let scoutingRotation: ScoutingRotation = new Map();

    if(scoutingRotationRequest.status == 200) {
        const scoutingRotationJSon: {
            [matchNumber: string]: [number, "Red" | "Blue"]
        } = await scoutingRotationRequest.json();

        for(const [matchNumber, assignedMatch] of Object.entries(scoutingRotationJSon)) {
            scoutingRotation.set(Number.parseInt(matchNumber), {
                teamNumber: assignedMatch[0],
                alliance: assignedMatch[1]
            });
        }
    } else {
        console.error(await scoutingRotationRequest.json());
    }

    return scoutingRotation;
}

export async function uploadScoutingData() {
    return await genericPostRequest(`${apiRoot}/match-data`, AppData);
}