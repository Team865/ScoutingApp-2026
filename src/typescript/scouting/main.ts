import AppData from "./AppData";
import { PageManager } from "./managers/PageManager";
import { getScoutingRotation, ScoutingRotation } from "./util/APIHelper";

AppData.scouterName = prompt("What is your name?") || "Unset";

(async () => {
    const scoutingRotationRequest = await getScoutingRotation();

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
    }

    PageManager.begin(scoutingRotation);
})()