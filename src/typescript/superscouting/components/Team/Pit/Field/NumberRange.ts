import Field from "./FieldInterface";

export default class NumberRangeField implements Field {
    public name: string;
    private readonly fieldContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly rangeContainer = document.createElement("div");
    private readonly input = document.createElement("input");
    private readonly output = document.createElement("output");

    constructor(teamNumber: number, name: string, min: number, max: number) {
        this.name = name;

        this.title.innerText = name;
        this.input.type = "range";
        this.input.min = min.toString();
        this.input.max = max.toString();
        this.input.addEventListener("input", () => this.output.value = this.input.value);
        this.input.value = min.toString();
        this.output.value = this.input.value;

        this.fieldContainer.append(
            this.title,
            this.input,
            this.output
        );
    }

    public setValue(value: number) {
        this.input.value = value.toString();
        this.output.value = this.input.value;
    }

    get value(): [isIncomplete: boolean, data: number] {
        const strValue = this.input.value;

        return [false, Number.parseFloat(strValue)];
    }

    get domElement() {
        return this.fieldContainer;
    }
}