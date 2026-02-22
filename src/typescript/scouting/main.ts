import AppData from "./AppData";
import { PageManager } from "./managers/PageManager";
import { getScoutingRotation } from "./util/APIHelper";

AppData.scouterName = prompt("What is your name?") || "Unset";

(async () => {
    const scoutingRotation = await getScoutingRotation();
    const statusCode = scoutingRotation.status;

    console.log(statusCode);
    console.log(await scoutingRotation.json());

    PageManager.begin();
})()