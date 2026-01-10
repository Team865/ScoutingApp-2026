import PitScoutingFields from "../../../../appConfig/PitScoutingFields";
import { FieldType } from "../../../../appConfig/Field";
import AppData from "../../../AppData";
import SubpageInterface from "./SubpageInterface";

export default class PitScoutingSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");

    private readonly noDataFoundIndicator = document.createElement("h1");
    private readonly fieldElementsContainer = document.createElement("div");
    private readonly fieldElements = new Map<string, [HTMLHeadingElement, HTMLElement, FieldType]>();

    constructor() {
        this.noDataFoundIndicator.innerText = "NO DATA FOUND";

        for(const fieldConfig of PitScoutingFields) {
            const fieldHeader = document.createElement("h1");
            const fieldValueContainer = document.createElement("div");

            fieldHeader.innerText = fieldConfig.name;

            this.fieldElementsContainer.append(
                fieldHeader,
                fieldValueContainer
            );

            this.fieldElements.set(fieldConfig.name, [fieldHeader, fieldValueContainer, fieldConfig.type]);
        }
    }

    private getFieldValueAsHTML(value: any, fieldType: FieldType): string {
        switch(fieldType) {
            case FieldType.BOOLEAN:
                return `${value}`;
            case FieldType.TEXT:
                return value;
            case FieldType.NUMBER:
                return (value as number).toString();
            case FieldType.NUMBER_RANGE:
                return (value as number).toString();
            case FieldType.SINGLE_CHOICE:
                return value;
            case FieldType.MULTIPLE_CHOICE:
                const choices = value as string[];

                return (choices.length > 0) ? `<ul>${choices.map(choice =>
                    `<li>${choice}</li>`
                ).join("")}</ul>` : "None";
        }
    }

    public setTeam(teamNumber: number) {
        const pitScoutingNotes = AppData.superscouting.pit_scouting_notes[teamNumber];
        if(!pitScoutingNotes) {
            this.fieldElementsContainer.remove();
            this.mainContainer.appendChild(this.noDataFoundIndicator);
            return;
        }

        for(const [fieldName, fieldValue] of Object.entries(pitScoutingNotes)) {
            const [_, fieldValueContainer, fieldType] = this.fieldElements.get(fieldName);

            fieldValueContainer.innerHTML = (fieldValue !== null && fieldValue !== undefined) ? this.getFieldValueAsHTML(fieldValue, fieldType) : "None";
        }

        this.noDataFoundIndicator.remove();
        this.mainContainer.appendChild(this.fieldElementsContainer);
    }

    public get domElement() {
        return this.mainContainer;
    }
}