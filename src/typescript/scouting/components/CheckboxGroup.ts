import { getRandomUUID } from "../../lib/Randomizer";
import LabeledCheckbox from "./LabeledCheckbox";

export default class CheckboxGroup {
    private readonly mainContainer = document.createElement("div");
    private readonly header = document.createElement("h1");

    private readonly title;

    private readonly checkboxes: Map<string, HTMLInputElement> = new Map();

    constructor(title: string, options: string[]) {
        this.mainContainer.classList.add("checkbox-group");

        this.header.textContent = title;
        this.title = title;

        this.mainContainer.appendChild(this.header);
        
        for(const optionName of options) {
            const uniqueHash = getRandomUUID();

            const label = document.createElement("label");
            label.innerText = optionName;
            label.htmlFor = optionName + uniqueHash;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = optionName + uniqueHash;

            this.checkboxes.set(optionName, checkbox);
            this.mainContainer.append(label, checkbox);
        }
    }

    public get selectedOptions(): string[] {
        const selected: string[] = [];

        for(const [optionName, checkbox] of this.checkboxes.entries()) {
            if(checkbox.checked) selected.push(optionName);
        }

        return selected;
    }

    public isChecked(optionName: string): boolean {
        if(!this.checkboxes.has(optionName)) throw new Error(`${optionName} is not a valid option in checkbox group ${this.title}`);

        return this.checkboxes.get(optionName).checked;
    }

    public get domElement(): HTMLDivElement {
        return this.mainContainer;
    }
}