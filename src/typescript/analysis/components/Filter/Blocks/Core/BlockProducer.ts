import { replaceWildcards } from "../../../../util/StringFormatter";

import NotBlock from "../Comparators/NotBlock";
import EqualsBlock from "../Comparators/EqualsBlock";
import AndBlock from "../Comparators/AndBlock";
import OrBlock from "../Comparators/OrBlock";
import LessThanBlock from "../Comparators/LessThanBlock";
import GreaterThanBlock from "../Comparators/GreaterThanBlock";
import LEQBlock from "../Comparators/LEQBlock";
import GEQBlock from "../Comparators/GEQBlock";

import AddBlock from "../Math/AddBlock";
import SubtractBlock from "../Math/SubtractBlock";
import MultiplyBlock from "../Math/MultiplyBlock";
import DivideBlock from "../Math/DivideBlock";

import DataBlock from "../DataBlock";

import TextConstantBlock from "../Constants/TextConstantBlock";
import NumberConstantBlock from "../Constants/NumberConstantBlock";
import TrueBlock from "../Constants/TrueBlock";
import FalseBlock from "../Constants/FalseBlock";

import BlockInterface, { SetSelectedBlock } from "./BlockInterface";
import AppData from "../../../../AppData";
import PitScoutingFields, { FieldType } from "../../../../../appConfig/PitScoutingFields";
import BlockSlot from "./BlockSlot";

const comparatorsTabButton = document.querySelector("button#comparators-filter-tab-button") as HTMLButtonElement;
const mathTabButton = document.querySelector("button#math-filter-tab-button") as HTMLButtonElement;
const dataTabButton = document.querySelector("button#data-filter-tab-button") as HTMLButtonElement;
const constantsTabButton = document.querySelector("button#constants-filter-tab-button") as HTMLButtonElement;

const filterBlockPageWrapper = document.querySelector("div#filter-blocks-page-wrapper") as HTMLDivElement;
const filterContentDisplay = document.querySelector("div#filter-content-display") as HTMLDivElement;

export namespace BlockProducer {
    export const comparatorsPageElements: HTMLElement[] = [];
    export const mathPageElements: HTMLElement[] = [];
    export const dataPageElements: HTMLElement[] = [];
    export const constantsPageElement: HTMLElement[] = [];

    export let setTopLevelBlock: (block: BlockInterface) => void;
    export let setSelectedBlock: SetSelectedBlock;
    export let getTarget: () => HTMLElement | BlockInterface | BlockSlot;

    function createProducerElement(producerLabelString: string, createBlockFunction: () => BlockInterface) {
        const producer = document.createElement("button");
        producer.innerText = producerLabelString;
        producer.addEventListener("click", () => {
            const target = getTarget();

            if(target === null) return;
            
            const newBlock = createBlockFunction();
            setSelectedBlock(newBlock);

            if(target instanceof HTMLElement) {
                target.appendChild(newBlock.domElement);
                setTopLevelBlock(newBlock);
            } else if(target["type"] !== undefined) { // Only BlockInterface's have a type member
                const blockToReplace = target as BlockInterface;
                const parentSlot = blockToReplace.parentSlot;

                parentSlot.removeChildBlock(blockToReplace);
                parentSlot.addChildBlock(newBlock);
            } else { // Has to be a block slot
                (target as BlockSlot).addChildBlock(newBlock);
            }
        });

        return producer;
    }

    export function setPage(pageElements: HTMLElement[]) {
        filterBlockPageWrapper.replaceChildren(...pageElements);
    }

    export function createComparatorBlockProducers() {
        comparatorsPageElements.push(
            createProducerElement("not X", () => new NotBlock(setSelectedBlock)),
            createProducerElement("X equals Y", () => new EqualsBlock(setSelectedBlock)),
            createProducerElement("X and Y", () => new AndBlock(setSelectedBlock)),
            createProducerElement("X or Y", () => new OrBlock(setSelectedBlock)),
            createProducerElement("X < Y", () => new LessThanBlock(setSelectedBlock)),
            createProducerElement("X > Y", () => new GreaterThanBlock(setSelectedBlock)),
            createProducerElement("X ≥ Y", () => new LEQBlock(setSelectedBlock)),
            createProducerElement("X ≤ Y", () => new GEQBlock(setSelectedBlock))
        );

        comparatorsTabButton.addEventListener("click", _ => setPage(comparatorsPageElements));
    }

    export function createMathBlockProducers() {
        mathPageElements.push(
            createProducerElement("X + Y", () => new AddBlock(setSelectedBlock)),
            createProducerElement("X - Y", () => new SubtractBlock(setSelectedBlock)),
            createProducerElement("X × Y", () => new MultiplyBlock(setSelectedBlock)),
            createProducerElement("X ÷ Y", () => new DivideBlock(setSelectedBlock))
        );

        mathTabButton.addEventListener("click", _ => setPage(mathPageElements));
    }

    export function createDataBlockProducers() {
        const metadataHeader = document.createElement("h1");
        metadataHeader.innerText = "Metadata";
        const scoutingHeader = document.createElement("h1");
        scoutingHeader.innerText = "Scouting";
        const pitScoutingHeader = document.createElement("h1");
        pitScoutingHeader.innerText = "Pit Scouting";

        // Metadata
        dataPageElements.push(
            metadataHeader,
            createProducerElement("Team Number (number)", () => new DataBlock(
                "Team Number (number)",
                setSelectedBlock, 
                (teamNumber) => teamNumber)
            ),
            createProducerElement("EPA (number)", () => new DataBlock(
                "EPA (number)",
                setSelectedBlock, 
                (teamNumber) => {
                const teamData = AppData.superscouting.fetched_team_data.find(teamData => teamData.number === teamNumber);

                return teamData.epa || teamData.normalized_epa;
            }))
        );

        // Scouting (WIP)
        // Superscouting/Pit Scouting
        dataPageElements.push(pitScoutingHeader);
        PitScoutingFields.forEach(fieldConfig => {
            const blockLabel = `${fieldConfig.name} (${
                fieldConfig.type === FieldType.BOOLEAN ? 
                "boolean" :
                fieldConfig.type === FieldType.TEXT ||
                fieldConfig.type === FieldType.SINGLE_CHOICE ?
                "text" :
                fieldConfig.type === FieldType.NUMBER || 
                fieldConfig.type === FieldType.NUMBER_RANGE ?
                "number" :
                fieldConfig.type === FieldType.MULTIPLE_CHOICE ?
                "array" :
                "unknown"
            })`;

            dataPageElements.push(createProducerElement(blockLabel, () => new DataBlock(
                blockLabel,
                setSelectedBlock, 
                (teamNumber) => AppData.superscouting.pit_scouting_notes[teamNumber][fieldConfig.name]
            )));
        })

        dataTabButton.addEventListener("click", _ => setPage(dataPageElements));
    }

    export function createConstantBlockProducers() {
        constantsPageElement.push(
            createProducerElement("True", () => new TrueBlock(setSelectedBlock)),
            createProducerElement("False", () => new FalseBlock(setSelectedBlock)),
            createProducerElement("Text Constant", () => new TextConstantBlock(setSelectedBlock)),
            createProducerElement("Number Constant", () => new NumberConstantBlock(setSelectedBlock)),
        );

        constantsTabButton.addEventListener("click", _ => setPage(constantsPageElement));
    }
}