import Field from "./FieldInterface";

export default class SingleChoiceField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly select = document.createElement("select");

    private radioChoices: Map<string, HTMLOptionElement> = new Map();

    constructor(teamNumber: number, name: string, choices: string[]) {
        this.name = name;

        this.title.innerText = name;
        this.fieldContainer.append(this.title, this.select);

        for(const choice of choices) {
            const option = document.createElement("option");

            option.id = `${teamNumber}-${choice}`;
            option.innerText = choice;
            option.value = choice;
            this.select.appendChild(option);

            this.radioChoices.set(choice, option);
        }
    }

    public setValue(choice: string) {
        this.select.value = choice;
    }

    get value(): [isIncomplete: boolean, data: string | null] {
        return [false, this.select.value];
    }

    get domElement() {
        return this.fieldContainer;
    }
}