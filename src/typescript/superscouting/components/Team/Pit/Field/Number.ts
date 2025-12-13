import Field from "./FieldInterface.js";

export default class NumberField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly textInput = document.createElement("input");

    constructor(teamNumber: number, name: string) {
        this.name = name;

        this.textInput.type = "number";
        this.title.innerText = name;
        this.fieldContainer.appendChild(this.title);
        this.fieldContainer.appendChild(this.textInput);
    }

    get domElement() {
        return this.fieldContainer;
    }
}