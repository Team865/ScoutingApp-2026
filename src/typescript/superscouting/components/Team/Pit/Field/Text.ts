import Field from "./FieldInterface.js";

export default class TextField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly textInput = document.createElement("input");

    constructor(teamNumber: number, name: string) {
        this.name = name;

        this.title.innerText = name;
        this.fieldContainer.appendChild(this.title);
        this.fieldContainer.appendChild(this.textInput);
    }

    public setValue(value: string) {
        this.textInput.value = value;
    }

    get value(): [isIncomplete: boolean, data: string | undefined] {
        const strValue = this.textInput.value;

        if(!strValue) return [true, undefined];
        
        return [false, strValue];
    }

    get domElement() {
        return this.fieldContainer;
    }
}