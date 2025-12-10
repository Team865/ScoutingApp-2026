import AppData from "../../../AppData.js";
import Page from "../Page.js";
import PitScoutingFields, { FieldType } from "../../../appConfig/PitScoutingFields.js";
import SingleChoiceField from "./Field/SingleChoice.js";
import TextField from "./Field/Text.js";
import FieldInterface from "./Field/FieldInterface.js";
import NumberRangeField from "./Field/NumberRange.js";
import MultipleChoiceField from "./Field/MultipleChoice.js";
import BooleanField from "./Field/Boolean.js";

export default class PitScoutingPage implements Page {
    public readonly id = "Pit Scouting";
    private readonly mainContainer = document.createElement("div");

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

            if(field) this.mainContainer.appendChild(field.domElement);
        }
    }

    public show(pageContainer: HTMLDivElement): void {
        pageContainer.appendChild(this.mainContainer);
    }

    public hide(): void {
        this.mainContainer.remove();
    }
}