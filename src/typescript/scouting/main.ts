import { getScouterName } from "./AppData";
import { PageManager } from "./managers/PageManager";

(async () => {
    getScouterName();

    PageManager.begin();
})();