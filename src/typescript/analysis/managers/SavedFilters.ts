import Signal from "../../lib/dataTypes/Signal";
import { BlockCore } from "../components/Filter/Blocks/Core/BlockCore";
import FilterListItem from "../components/Filter/FilterListItem";

export namespace SavedFilters {
    export const loadRequested = new Signal<BlockCore>();

    const filterItems: FilterListItem[] = [];

    const dialog: HTMLDialogElement = document.querySelector("dialog#filter-list-dialog");
    const body: HTMLDivElement = document.querySelector("#filter-list-body");

    const filterNameInput: HTMLInputElement = document.querySelector("#filter-name-input");
    const saveFilterButton: HTMLButtonElement = document.querySelector("#save-filter-button");

    export function start(filterBlockGetter: () => BlockCore) {
        saveFilterButton.addEventListener("click", _ => {
            const filter = filterBlockGetter();
            const filterName = filterNameInput.value;

            if (filter === null) {
                alert("There is no filter.");
                return;
            }

            const preexistingFilter = filterItems.find(item => item.filterName == filterName);

            if (preexistingFilter) {
                const shouldOverwrite = prompt(`${filterName} already in use, overwrite?`);

                if (!shouldOverwrite) return;

                preexistingFilter.filter = filter.clone();
            } else {
                const item = new FilterListItem(filterName, filter);

                item.deleteButton.addEventListener("click", _ => {
                    filterItems.splice(filterItems.indexOf(item), 1);
                    item.domElement.remove();
                });

                item.loadButton.addEventListener('click', _ => {
                    const confirmed = confirm("Are you sure?");
                    if (!confirmed) return;

                    dialog.close();
                    loadRequested.emit(item.filter);
                });

                body.appendChild(item.domElement);
                filterItems.push(item);
            }
        });
    }
}