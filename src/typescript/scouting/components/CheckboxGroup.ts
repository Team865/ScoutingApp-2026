import LabeledCheckbox from "./LabeledCheckbox";

export default class CheckboxGroup {
    private readonly mainContainer = document.createElement("div");
    private readonly header = document.createElement("h1");

    private readonly checkboxes: Map<string, HTMLInputElement> = new Map();

    constructor(title: string, options: string[]) {
        this.mainContainer.classList.add("checkbox-group");

        this.header.textContent = title;

        this.mainContainer.appendChild(this.header);
        
        for(const optionName of options) {
            const labeledCheckbox = new LabeledCheckbox(optionName);

            this.checkboxes.set(optionName, labeledCheckbox.inputElement);
            this.mainContainer.appendChild(labeledCheckbox.domElement);
        }
    }

    public get selectedOptions(): string[] {
        const selected: string[] = [];

        for(const [optionName, checkbox] of this.checkboxes.entries()) {
            if(checkbox.checked) selected.push(optionName);
        }

        return selected;
    }

    public get domElement(): HTMLDivElement {
        return this.mainContainer;
    }
}