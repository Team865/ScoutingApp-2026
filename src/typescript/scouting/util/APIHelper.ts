import { genericGetRequest } from "../../lib/APIHelper";
import AppData from "../AppData";


const apiRoot = "api/scouting";

export async function getScoutingRotation() {
    return await fetch(`${apiRoot}/rotation`, {
        headers: {"X-Request-ID": AppData.scouterName}
    });
}