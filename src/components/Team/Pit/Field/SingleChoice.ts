import Field from "./FieldInterface.js";

export default class SingleChoiceField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");

    private radioChoices: Map<string, HTMLInputElement> = new Map();

    constructor(teamNumber: number, name: string, choices: string[]) {
        this.name = name;

        this.title.innerText = name;
        this.fieldContainer.appendChild(this.title);

        for(const choice of choices) {
            const choiceContainer = document.createElement("div");
            const label = document.createElement("label");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = `${teamNumber}-${this.name}`;
            radio.id = `${teamNumber}-${choice}`;
            label.htmlFor = `${teamNumber}-${choice}`;
            label.innerText = choice;

            choiceContainer.appendChild(radio);
            choiceContainer.appendChild(label);
            this.fieldContainer.appendChild(choiceContainer);

            this.radioChoices.set(choice, radio);
        }
    }

    get domElement() {
        return this.fieldContainer;
    }
}