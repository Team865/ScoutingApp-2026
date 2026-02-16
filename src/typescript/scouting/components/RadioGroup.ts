import { getRandomUUID } from "../../lib/Randomizer";
import LabeledCheckbox from "./LabeledCheckbox";
import LabeledRadio from "./LabeledRadio";

export default class RadioGroup {
    private readonly mainContainer = document.createElement("div");
    private readonly header = document.createElement("h1");

    private readonly radios: Map<string, HTMLInputElement> = new Map();

    constructor(title: string, options: string[]) {
        this.mainContainer.classList.add("radio-group");

        this.header.textContent = title;

        this.mainContainer.appendChild(this.header);

        const radioGroupName = title + getRandomUUID();
        
        for(const optionName of options) {
            const labeledRadio = new LabeledRadio(optionName, radioGroupName);

            this.radios.set(optionName, labeledRadio.inputElement);
            this.mainContainer.appendChild(labeledRadio.domElement);
        }

        this.radios.get(options[0]).checked = true;
    }

    public get selectedOption(): string {
        for(const [optionName, radio] of this.radios.entries()) {
            if(radio.checked) return optionName;   
        }
    }

    public get domElement(): HTMLDivElement {
        return this.mainContainer;
    }
}