import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import { bindAccordionBehavior } from "../../lib/components/Accordion";
import { BlockInterface, SetSelectedBlock } from "../components/Filter/Blocks/Core/BlockCore";
import { BlockProducer } from "../components/Filter/Blocks/Core/BlockProducer";
import BlockSlot from "../components/Filter/Blocks/Core/BlockSlot";

const filterMenuToggleButton = document.querySelector("button#filter-button") as HTMLButtonElement;
const filterMenu = document.querySelector("div#filter-menu") as HTMLDivElement;

const filterEditorContainer = document.querySelector("div#filter-editor") as HTMLDivElement;
const filterBlockProducersMenu = document.querySelector("div#filter-blocks-menu") as HTMLDivElement;
const closeBlockProducersButton = document.querySelector("button#close-block-producers-page") as HTMLButtonElement;

const enableFilterButton = document.querySelector("button#enable-filter") as HTMLButtonElement;
const disableFilterButton = document.querySelector("button#disable-filter") as HTMLButtonElement;
const testFilterBlockButton = document.querySelector("button#test-filter-block") as HTMLButtonElement;

const deleteFilterBlockButton = document.querySelector("button#delete-filter-block") as HTMLButtonElement;
const copyFilterButton = document.querySelector("button#copy-filter-block") as HTMLButtonElement;
const pasteFilterButton = document.querySelector("button#paste-filter-block") as HTMLButtonElement;

const filterContentContainer = document.querySelector("div#filter-content-container") as HTMLDivElement;
const filterContentDisplay =  document.querySelector("div#filter-content-display") as HTMLDivElement;

const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

const isMobileQuery = window.matchMedia("(width <= 700px)");
let topLevelBlock: BlockInterface | null = null;
let currentlySelectedBlock: BlockInterface | BlockSlot | null = null;
let copiedBlock: BlockInterface = null;

const ModifyFilterBlocks = {
    copyBlock(block: BlockInterface) {
        copyFilterButton.classList.remove("selected");
        pasteFilterButton.classList.remove("disabled");
        // Store a clone of the block so future modifications 
        // to the reference block won't affect the copied block
        copiedBlock = block.clone();
    },
    pasteBlock(block: BlockInterface | BlockSlot) {
        pasteFilterButton.classList.remove("selected");
        const target = block || BlockProducer.getTarget();
        if(target === null) return;
        BlockProducer.addBlock(copiedBlock.clone(), target);
    },
    deleteBlock(block: BlockInterface) {
        if(block.parentSlot) {
            block.parentSlot.removeChildBlock(block);
        } else { // Top level block
            block.domElement.remove();
            topLevelBlock = null;
            filterBlockProducersMenu.hidden = false;
        }

        currentlySelectedBlock = null;
        deleteFilterBlockButton.classList.remove("selected");
    }
};


function bufferButton(button: HTMLButtonElement, allowBlockSlot: boolean, onTrueFunction: (block: BlockInterface | BlockSlot) => void) {
    if(button.classList.contains("selected")) {
        button.classList.remove("selected");
        return;
    }

    if( // Nothing selected or selecting block slot
        currentlySelectedBlock === null ||
        (!allowBlockSlot && currentlySelectedBlock["type"] === undefined)
    ) {
        button.classList.add("selected");
        return;
    }

    onTrueFunction(currentlySelectedBlock as BlockInterface);
    setSelectedBlock(null);
}

Object.freeze(ModifyFilterBlocks);

const setSelectedBlock: SetSelectedBlock = (newSelection) => {
    const previousSelection = currentlySelectedBlock;

    if(previousSelection !== null) {
        previousSelection.domElement.classList.remove("selected");

        if(previousSelection === newSelection) {
            newSelection = null;
        }
    }

    if(newSelection !== null) {
        const target = newSelection;
        const isBlockSlot = target["type"] === undefined;

        if(
            deleteFilterBlockButton.classList.contains("selected") // Delete button buffered
        ) {
            if(!isBlockSlot) { // Not targetting a block slot)
                ModifyFilterBlocks.deleteBlock(target as BlockInterface);
                newSelection = null;
            } else {
                deleteFilterBlockButton.classList.remove("selected");
            }
        }

        if(
            copyFilterButton.classList.contains("selected") && // Copy button buffered
            !isBlockSlot // Not targetting a block slot
        ) {
            ModifyFilterBlocks.copyBlock(target as BlockInterface);
            newSelection = null;
        } else if( // The target block wasn't copied
            pasteFilterButton.classList.contains("selected") && // Paste button buffered
            newSelection !== null // The block hasn't been deleted yet
        ) {
            ModifyFilterBlocks.pasteBlock(target);
            newSelection = null;
        }
    }

    if(newSelection !== null)
        newSelection.domElement.classList.add("selected");

    currentlySelectedBlock = newSelection;
    filterBlockProducersMenu.hidden = isMobileQuery.matches && (topLevelBlock !== null && currentlySelectedBlock === null);
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
    BlockProducer.start();
}

export namespace FilterManager {
    export function start() {
        bindAccordionBehavior(filterMenu, filterMenu);
        initSortOptions();
        initFilterEditor();

        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });

        closeBlockProducersButton.addEventListener("click", () => {
            if(!topLevelBlock) return;

            setSelectedBlock(null);
            filterBlockProducersMenu.hidden = true;
        });
        
        testFilterBlockButton.addEventListener("click", () => {
            if(topLevelBlock === null) return;

            const teamNumber = Number.parseInt(prompt("Enter Team Number:"));
            alert(topLevelBlock.getValueForTeam(teamNumber));
        });

        enableFilterButton;
        disableFilterButton;

        deleteFilterBlockButton.addEventListener("click", () => {
            bufferButton(deleteFilterBlockButton, false, ModifyFilterBlocks.deleteBlock);
        });
        
        copyFilterButton.addEventListener("click", () => {
            bufferButton(copyFilterButton, false, ModifyFilterBlocks.copyBlock); 
        });

        pasteFilterButton.addEventListener("click", () => {
            if(pasteFilterButton.classList.contains("disabled")) return;
            bufferButton(pasteFilterButton, true, ModifyFilterBlocks.pasteBlock);
        });

        sortOrderButton.addEventListener("click", () => sortOrderButton.classList.toggle("descending"));

        window.addEventListener("keyup", (e) => {
            if(!currentlySelectedBlock) return;

            if(e.key === "Backspace") {
                if(currentlySelectedBlock["type"] !== undefined) {
                    e.preventDefault();
                    ModifyFilterBlocks.deleteBlock(currentlySelectedBlock as BlockInterface);
                    return;
                }
            }

            if(e.ctrlKey) {
                switch(e.key) {
                    case "c":
                        if(currentlySelectedBlock["type"] === undefined) break;
                        e.preventDefault();
                        ModifyFilterBlocks.copyBlock(currentlySelectedBlock as BlockInterface);
                        break;
                    case "v":
                        if(!copiedBlock) return;
                        e.preventDefault();
                        ModifyFilterBlocks.pasteBlock(currentlySelectedBlock);
                        break;
                }
            }
        });
    }
}