import { bindAccordionBehavior } from "../../lib/components/Accordion";

const filterMenuToggleButton: HTMLButtonElement = document.querySelector("button#filter-button") as HTMLButtonElement;
const filterMenu: HTMLDivElement = document.querySelector("div#filter-menu") as HTMLDivElement;

export namespace FilterManager {
    export function start() {
        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });
        bindAccordionBehavior(filterMenu, filterMenu);
    }
}