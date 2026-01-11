export default class FuelCounter {
    private fuelScoredCount: number = 0;
    private readonly mainContainer = document.createElement("div");

    private readonly header = document.createElement("h1");
    private readonly textInput = document.createElement("input");
    private readonly decrementButton = document.createElement("button");
    private readonly incrementButton = document.createElement("button");
    private readonly batchButton = document.createElement("button");

    constructor() {
        this.mainContainer.classList.add("fuel-counter");

        this.header.innerText = "FUEL SCORED"
        this.decrementButton.innerText = "-";
        this.incrementButton.innerText = "+";
        this.batchButton.innerText = "Add Batch";
        this.textInput.value = "0";

        this.mainContainer.append(
            this.header,
            this.decrementButton,
            this.textInput,
            this.incrementButton,
            this.batchButton
        );
    }

    public get domElement() {
        return this.mainContainer;
    }

    public get fuelScored() {
        return this.fuelScored
    }
}