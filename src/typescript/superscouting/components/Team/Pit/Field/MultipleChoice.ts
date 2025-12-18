import Field from "./FieldInterface.js";

export default class MultipleChoiceField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");

    private checkboxes: Map<string, HTMLInputElement> = new Map();

    constructor(teamNumber: number, name: string, choices: string[]) {
        this.name = name;

        this.title.innerText = name;
        this.fieldContainer.appendChild(this.title);

        for(const choice of choices) {
            const choiceContainer = document.createElement("div");
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            choiceContainer.style.display = "flex";
            choiceContainer.style.flexFlow = "row";
            choiceContainer.style.alignItems = "center";

            checkbox.type = "checkbox";
            checkbox.name = `${teamNumber}-${this.name}`;
            checkbox.id = `${teamNumber}-${choice}`;
            label.htmlFor = `${teamNumber}-${choice}`;
            label.innerText = choice;

            choiceContainer.appendChild(checkbox);
            choiceContainer.appendChild(label);
            this.fieldContainer.appendChild(choiceContainer);

            this.checkboxes.set(choice, checkbox);
        }
    }

    get value(): [isIncomplete: boolean, data: string[]] {
        const selectedChoices: string[] = [];

        for(const [choiceName, checkbox] of this.checkboxes.entries()) {
            if(checkbox.checked) selectedChoices.push(choiceName);
        }

        return [false, selectedChoices];
    }

    get domElement() {
        return this.fieldContainer;
    }
}