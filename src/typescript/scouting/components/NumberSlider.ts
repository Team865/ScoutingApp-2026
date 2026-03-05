export default class NumberSlider {
    private readonly mainContainer = document.createElement("div");
    private readonly title = document.createElement("h2");
    private readonly input = document.createElement("input");
    private readonly output = document.createElement("output");
    private readonly scale: number;

    constructor(labelText: string, min: number, max: number, scale?: number) {
        this.scale = scale || 1;
        this.mainContainer.classList.add("number-slider");

        this.title.innerText = labelText;
        this.input.type = "range";
        this.input.min = min.toString();
        this.input.max = max.toString();
        this.input.addEventListener("input", () => this.updateOutput());
        this.input.value = min.toString();
        this.updateOutput();

        this.mainContainer.append(
            this.title,
            this.input,
            this.output
        );
    }
    
    private updateOutput() {
        this.output.value = (Number.parseInt(this.input.value) * this.scale).toString();
    }

    public setValue(value: number) {
        this.input.value = (value / this.scale).toString();
        this.updateOutput();
    }

    get value(): number {
        const strValue = this.input.value;

        return Number.parseInt(strValue) * this.scale;
    }

    get domElement() {
        return this.mainContainer;
    }
}