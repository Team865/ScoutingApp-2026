import { getScouterName } from "./AppData";
import { PageManager } from "./managers/PageManager";
import { getScoutingRotation } from "./util/APIHelper";

(async () => {
    getScouterName();

    PageManager.begin();
})();