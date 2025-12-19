import Field from "./FieldInterface.js";

export default class NumberField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly numberInput = document.createElement("input");

    constructor(teamNumber: number, name: string) {
        this.name = name;

        this.numberInput.type = "number";
        this.title.innerText = name;
        this.fieldContainer.appendChild(this.title);
        this.fieldContainer.appendChild(this.numberInput);
    }

    public setValue(value: number) {
        this.numberInput.value = value.toString();
    }

    get value(): [isIncomplete: boolean, data: number | undefined] {
        const strValue = this.numberInput.value;

        if(!strValue) return [true, null];

        return [false, Number.parseFloat(strValue)];
    }

    get domElement() {
        return this.fieldContainer;
    }
}