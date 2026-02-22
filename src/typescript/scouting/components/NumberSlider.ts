export default class NumberSlider {
    private readonly mainContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly input = document.createElement("input");
    private readonly output = document.createElement("output");

    constructor(labelText: string, min: number, max: number) {
        this.mainContainer.classList.add("number-slider");

        this.title.innerText = labelText;
        this.input.type = "range";
        this.input.min = min.toString();
        this.input.max = max.toString();
        this.input.addEventListener("input", () => this.output.value = this.input.value);
        this.input.value = min.toString();
        this.output.value = this.input.value;

        this.mainContainer.append(
            this.title,
            this.input,
            this.output
        );
    }
    

    public setValue(value: number) {
        this.input.value = value.toString();
        this.output.value = this.input.value;
    }

    get value(): number {
        const strValue = this.input.value;

        return Number.parseFloat(strValue);
    }

    get domElement() {
        return this.mainContainer;
    }
}