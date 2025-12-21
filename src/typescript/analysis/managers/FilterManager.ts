import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import { bindAccordionBehavior } from "../../lib/components/Accordion";

const filterMenuToggleButton = document.querySelector("button#filter-button") as HTMLButtonElement;
const filterMenu = document.querySelector("div#filter-menu") as HTMLDivElement;
const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

function convertToOptionValue(value: string) {
    return value.toLowerCase().split(" ").join("-");
}

export namespace FilterManager {
    function initSortOptions() {
        // Metadata options
        {
            const metadataOptionGroup = document.createElement("optgroup");
            metadataOptionGroup.label = "Metadata";

            const teamNumberOption = document.createElement("option");
            teamNumberOption.value = "Metadata/Team Number";
            teamNumberOption.innerText = "Team Number";

            const epaOption = document.createElement("option");
            epaOption.value = "Metadata/EPA";
            epaOption.innerText = "EPA";

            metadataOptionGroup.append(
                teamNumberOption,
                epaOption
            );

            sortBySelection.appendChild(metadataOptionGroup);
        }

        // Scouting (WIP)

        // Superscouting/Pit Scouting
        {
            const pitscoutingGroup = document.createElement("optgroup");
            pitscoutingGroup.label = "Pit Scouting";

            for(const pitscoutingField of PitScoutingFields) {
                if(
                    pitscoutingField.type !== FieldType.NUMBER && 
                    pitscoutingField.type !== FieldType.NUMBER_RANGE
                ) continue;

                const fieldOption = document.createElement("option");
                fieldOption.value = "Pitscouting/" + pitscoutingField.name;
                fieldOption.innerText = pitscoutingField.name;
                pitscoutingGroup.appendChild(fieldOption);
            }

            sortBySelection.appendChild(pitscoutingGroup);
        }
    }

    export function start() {
        bindAccordionBehavior(filterMenu, filterMenu);
        initSortOptions();

        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });

        sortOrderButton.addEventListener("click", () => sortOrderButton.classList.toggle("descending"));
    }
}