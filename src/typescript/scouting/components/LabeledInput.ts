import { getRandomUUID } from "../../lib/Randomizer";

export default class LabeledInput {
    private readonly mainContainer = document.createElement("div");

    private readonly label = document.createElement("label");
    protected readonly input = document.createElement("input");

    constructor(labelText: string, inputFirst?: boolean) {
        this.mainContainer.classList.add("labeled-input");

        const uniqueHash = getRandomUUID();

        this.label.innerText = labelText;
        this.label.htmlFor = labelText + uniqueHash;
        this.input.id = labelText + uniqueHash;

        if(inputFirst) {
            this.mainContainer.append(this.input, this.label);
        } else {
            this.mainContainer.append(this.label, this.input);
        }
    }

    public get inputElement() {
        return this.input;
    }

    public get value() {
        return this.input.value;
    }

    public get domElement() {
        return this.mainContainer;
    }
}