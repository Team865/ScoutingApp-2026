import PitScoutingFields, { FieldType } from "../../appConfig/PitScoutingFields";
import { bindAccordionBehavior } from "../../lib/components/Accordion";
import { BlockCore, SetSelectedBlock } from "../components/Filter/Blocks/Core/BlockCore";
import { BlockProducer } from "../components/Filter/Blocks/Core/BlockProducer";
import BlockSlot from "../components/Filter/Blocks/Core/BlockSlot";
import { HistoryManager } from "./HistoryManager";

const filterMenuToggleButton = document.querySelector("button#filter-button") as HTMLButtonElement;
const filterMenu = document.querySelector("div#filter-menu") as HTMLDivElement;

const filterEditorContainer = document.querySelector("div#filter-editor") as HTMLDivElement;
const filterBlockProducersMenu = document.querySelector("div#filter-blocks-menu") as HTMLDivElement;
const closeBlockProducersButton = document.querySelector("button#close-block-producers-page") as HTMLButtonElement;

const testFilterBlockButton = document.querySelector("button#test-filter-block") as HTMLButtonElement;

const undoButton = document.querySelector("button#undo-action") as HTMLButtonElement;
const redoButton = document.querySelector("button#redo-action") as HTMLButtonElement;

const deleteFilterBlockButton = document.querySelector("button#delete-filter-block") as HTMLButtonElement;
const copyFilterButton = document.querySelector("button#copy-filter-block") as HTMLButtonElement;
const pasteFilterButton = document.querySelector("button#paste-filter-block") as HTMLButtonElement;

const filterContentContainer = document.querySelector("div#filter-content-container") as HTMLDivElement;
const filterContentDisplay =  document.querySelector("div#filter-content-display") as HTMLDivElement;

const isMobileQuery = window.matchMedia("(width <= 700px)");
let topLevelBlock: BlockCore | null = null;
let disconnectTopLevelBlockClickConnection: (() => void) | null = null
let currentlySelectedBlock: BlockCore | BlockSlot | null = null;
let copiedBlock: BlockCore = null;
let historyManager: HistoryManager = null;

const sortOrderButton = document.querySelector("button#sort-order") as HTMLButtonElement;
const sortBySelection = document.querySelector("select#sorted-by") as HTMLSelectElement;

abstract class ModifyFilterBlocks {
    public static copyBlock(block: BlockCore) {
        copyFilterButton.classList.remove("selected");
        pasteFilterButton.classList.remove("disabled");
        // Store a clone of the block so future modifications 
        // to the reference block won't affect the copied block
        copiedBlock = block.clone();
    }
    public static pasteBlock(block: BlockCore | BlockSlot) {
        pasteFilterButton.classList.remove("selected");
        const target = block || BlockProducer.getTarget();
        if(target === null) return;
        BlockProducer.addBlock(copiedBlock.clone(), target);
    }
    public static deleteBlock(block: BlockCore) {
        historyManager.actionCommitted({
            type: "remove",
            blockRemoved: block,
            parent: block.parentSlot
        });

        if(block.parentSlot) {
            block.parentSlot.removeChildBlock();
        } else { // Top level block
            BlockProducer.setTopLevelBlock(null);
        }

        currentlySelectedBlock = null;
        deleteFilterBlockButton.classList.remove("selected");
    }
};

function bufferButton(button: HTMLButtonElement, allowBlockSlot: boolean, onTrueFunction: (block: BlockCore | BlockSlot) => void) {
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

    onTrueFunction(currentlySelectedBlock as BlockCore);
    setSelectedBlock(null);
}

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
                ModifyFilterBlocks.deleteBlock(target as BlockCore);
                newSelection = null;
            } else {
                deleteFilterBlockButton.classList.remove("selected");
            }
        }

        if(
            copyFilterButton.classList.contains("selected") && // Copy button buffered
            !isBlockSlot // Not targetting a block slot
        ) {
            ModifyFilterBlocks.copyBlock(target as BlockCore);
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
    BlockProducer.setTopLevelBlock = (block: BlockCore | null) => {
        if(topLevelBlock) {
            topLevelBlock.domElement.remove();
            disconnectTopLevelBlockClickConnection();
        }
        
        if(block) {
            filterContentDisplay.appendChild(block.domElement);
            testFilterBlockButton.classList.remove("disabled");
        } else {
            testFilterBlockButton.classList.add("disabled");
        }

        topLevelBlock = block;
        disconnectTopLevelBlockClickConnection = topLevelBlock.clicked.connect(setSelectedBlock);
    }
    BlockProducer.start();
}

function initKeybinds() {
    window.addEventListener("keyup", (e) => {
        if(!currentlySelectedBlock) return;
        if(e.key === "Backspace") {
            if(currentlySelectedBlock["type"] !== undefined) {
                e.preventDefault();
                ModifyFilterBlocks.deleteBlock(currentlySelectedBlock as BlockCore);
                return;
            }
        }

        if(e.ctrlKey) {
            switch(e.key) {
                case "c":
                    if(currentlySelectedBlock["type"] === undefined) return;
                    e.preventDefault();
                    ModifyFilterBlocks.copyBlock(currentlySelectedBlock as BlockCore);
                    return;
                case "v":
                    if(!copiedBlock) return;
                    e.preventDefault();
                    ModifyFilterBlocks.pasteBlock(currentlySelectedBlock);
                    return;
            }
        }
    });
}

export namespace FilterManager {
    export function getTopLevelBlock() {
        return topLevelBlock;
    }

    export function testTeam(teamNumber: number) {
        return topLevelBlock.getValueForTeam(teamNumber);
    }

    export function start() {
        bindAccordionBehavior(filterMenu, filterMenu);
        initSortOptions();
        initFilterEditor();

        historyManager = new HistoryManager(
            2 ** 16,
            setSelectedBlock,
            undoButton,
            redoButton
        );
        BlockProducer.blockAdded.connect((blockAdded) => {
            historyManager.actionCommitted({
                type: "add",
                blockAdded: blockAdded,
                parent: blockAdded.parentSlot
            });
        });

        BlockProducer.blockReplaced.connect(([originalBlock, newBlock]) => {
            historyManager.actionCommitted({
                type: "replace",
                originalBlock: originalBlock,
                newBlock: newBlock
            });
        });

        filterMenuToggleButton.addEventListener("click", () => {
            filterMenu.classList.toggle("active");
        });

        closeBlockProducersButton.addEventListener("click", () => {
            if(!topLevelBlock) return;

            setSelectedBlock(null);
            filterBlockProducersMenu.hidden = true;
        });
        
        testFilterBlockButton.addEventListener("click", () => {
            if(testFilterBlockButton.classList.contains("disabled")) return;

            const teamNumber = Number.parseInt(prompt("Enter Team Number:"));
            
            alert(testTeam(teamNumber));
        });

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

        initKeybinds();
    }
}