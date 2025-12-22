import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import { bindAccordionBehavior } from "../../lib/components/Accordion";
import BlockInterface, { SetSelectedBlock } from "../components/Filter/Blocks/Core/BlockInterface";
import { BlockProducer } from "../components/Filter/Blocks/Core/BlockProducer";
import BlockSlot from "../components/Filter/Blocks/Core/BlockSlot";

const filterMenuToggleButton = document.querySelector("button#filter-button") as HTMLButtonElement;
const filterMenu = document.querySelector("div#filter-menu") as HTMLDivElement;

const filterEditorContainer = document.querySelector("div#filter-editor") as HTMLDivElement;
const filterBlockProducersMenu = document.querySelector("div#filter-blocks-menu") as HTMLDivElement;
const deleteFilterBlockButton = document.querySelector("button#delete-filter-block") as HTMLButtonElement;
const testFilterBlockButton = document.querySelector("button#test-filter-block") as HTMLButtonElement;

const filterContentContainer = document.querySelector("div#filter-content-container") as HTMLDivElement;
const filterContentDisplay =  document.querySelector("div#filter-content-display") as HTMLDivElement;

const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

let topLevelBlock: BlockInterface | null = null;
let currentlySelectedBlock: BlockInterface | BlockSlot | null = null;

const setSelectedBlock: SetSelectedBlock = (newSelection) => {
    if(currentlySelectedBlock !== null)
        currentlySelectedBlock.domElement.classList.toggle("selected", false);
    
    
    if(currentlySelectedBlock === newSelection) currentlySelectedBlock = null;
    else currentlySelectedBlock = newSelection;
    
    if(currentlySelectedBlock !== null) newSelection.domElement.classList.toggle("selected", true);

    filterBlockProducersMenu.hidden = topLevelBlock !== null && currentlySelectedBlock === null;
    console.log(currentlySelectedBlock);
}

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

function initFilterEditor() {
    BlockProducer.setSelectedBlock = setSelectedBlock;
    BlockProducer.getTarget = () => {
        if(currentlySelectedBlock !== null)
            return currentlySelectedBlock;
        else if(!topLevelBlock)
            return filterContentDisplay;
        else
            return null;
    }
    BlockProducer.setTopLevelBlock = (block) => topLevelBlock = block;

    BlockProducer.createComparatorBlockProducers();
    BlockProducer.createMathBlockProducers();
    BlockProducer.createDataBlockProducers();
    BlockProducer.createConstantBlockProducers();
    BlockProducer.setPage(BlockProducer.comparatorsPageElements);
}

export namespace FilterManager {
    export function start() {
        bindAccordionBehavior(filterMenu, filterMenu);
        initSortOptions();
        initFilterEditor();

        deleteFilterBlockButton.addEventListener("click", () => {
            if(currentlySelectedBlock === null) return;
            if(currentlySelectedBlock["type"] === undefined) return; // Block slot and not a block
            const block = currentlySelectedBlock as BlockInterface;
            if(block.parentSlot)
                block.parentSlot.removeChildBlock(block);
            else // Top level block
                block.domElement.remove();
                topLevelBlock = null;

            currentlySelectedBlock = null;
        });

        testFilterBlockButton.addEventListener("click", () => {
            if(topLevelBlock === null) return;

            const teamNumber = Number.parseInt(prompt("Enter Team Number:"));
            alert(topLevelBlock.getValueForTeam(teamNumber));
        });

        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });

        sortOrderButton.addEventListener("click", () => sortOrderButton.classList.toggle("descending"));
    }
}