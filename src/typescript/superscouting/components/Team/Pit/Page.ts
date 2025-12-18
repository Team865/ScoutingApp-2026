import AppData from "../../../AppData.js";
import Page from "../Page.js";
import PitScoutingFields, { FieldConfig, FieldType } from "../../../appConfig/PitScoutingFields.js";
import SingleChoiceField from "./Field/SingleChoice.js";
import TextField from "./Field/Text.js";
import FieldInterface from "./Field/FieldInterface.js";
import NumberRangeField from "./Field/NumberRange.js";
import MultipleChoiceField from "./Field/MultipleChoice.js";
import BooleanField from "./Field/Boolean.js";
import NumberField from "./Field/Number.js";

type PitScoutingResults = {
    isIncomplete: boolean, // Whether required fields are missing values
    data?: { // Either a dictionary containing the values of each field, or a reference to the Field object of the first required field with a missing value
        [key: string]: any
    } | FieldInterface;
}

export default class PitScoutingPage implements Page {
    public readonly id = "Pit Scouting";
    private readonly mainContainer = document.createElement("div");
    public readonly submitPitScoutingButton = document.createElement("button");
    
    private readonly fields: Map<FieldConfig, FieldInterface> = new Map();

    constructor(teamNumber: number) {
        this.mainContainer.classList.add("pit-scouting-container");
        
        // Create fields
        for(const fieldConfig of PitScoutingFields) {
            let field: FieldInterface = null;
            switch(fieldConfig.type) {
                case FieldType.BOOLEAN:
                    field = new BooleanField(teamNumber, fieldConfig.name);
                    break;
                case FieldType.TEXT:
                    field = new TextField(teamNumber, fieldConfig.name);
                    break;
                case FieldType.NUMBER:
                    field = new NumberField(teamNumber, fieldConfig.name)
                    break;
                case FieldType.NUMBER_RANGE:
                    field = new NumberRangeField(teamNumber, fieldConfig.name, fieldConfig.min as number, fieldConfig.max as number);
                    break;
                case FieldType.SINGLE_CHOICE:
                    field = new SingleChoiceField(teamNumber, fieldConfig.name, fieldConfig.choices as string[]);
                    break;
                case FieldType.MULTIPLE_CHOICE:
                    field = new MultipleChoiceField(teamNumber, fieldConfig.name, fieldConfig.choices as string[]);
                    break;
            }

            if(field) {
                this.mainContainer.appendChild(field.domElement);
                this.fields.set(fieldConfig, field);
            }
        }

        // Create complete button
        this.submitPitScoutingButton.classList.add("submit-pit-scouting");
        this.submitPitScoutingButton.innerText = "Submit";

        this.mainContainer.appendChild(this.submitPitScoutingButton);
    }

    public show(pageContainer: HTMLDivElement): void {
        pageContainer.appendChild(this.mainContainer);
    }

    public get getData(): PitScoutingResults {
        const fieldData: PitScoutingResults = {
            isIncomplete: false,
            data: {}
        };

        for(const [fieldConfig, field] of this.fields.entries()) {
            const [isIncomplete, fieldValue] = field.value;

            if(isIncomplete && !fieldConfig.isOptional)
                return {isIncomplete: true, data: field};
            
            fieldData.data[fieldConfig.name] = fieldValue;
        }

        return fieldData;
    }

    public hide(): void {
        this.mainContainer.remove();
    }
}