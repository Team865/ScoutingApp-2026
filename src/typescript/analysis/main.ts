import { FilterManager } from "./managers/FilterManager";
import { fetchBackendData } from "./util/APIHelper";

fetchBackendData().then(response => console.log(response));

FilterManager.start();