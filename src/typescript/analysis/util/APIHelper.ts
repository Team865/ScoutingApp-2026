import { genericGetRequest } from "../../lib/APIHelper";

export async function fetchBackendData() {
    return await genericGetRequest("/api/analysis");
}