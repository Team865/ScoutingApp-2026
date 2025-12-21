import { bindAccordionBehavior } from "../../lib/components/Accordion";

const filterMenuToggleButton = document.querySelector("button#filter-button") as HTMLButtonElement;
const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const filterMenu = document.querySelector("div#filter-menu") as HTMLDivElement;

export namespace FilterManager {
    export function start() {
        bindAccordionBehavior(filterMenu, filterMenu);

        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });

        sortOrderButton.addEventListener("click", () => sortOrderButton.classList.toggle("descending"));
    }
}