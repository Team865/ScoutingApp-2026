import { makeInputIntegerOnly } from "../../lib/DOMHelper";

export default class FoulCounter {
    public readonly domElement = document.createElement("div");
    private readonly minorFoulInput = document.createElement("input");
    private readonly majorFoulInput = document.createElement("input");

    constructor() {
        this.domElement.classList.add("foul-counter");
        makeInputIntegerOnly(this.minorFoulInput);
        makeInputIntegerOnly(this.majorFoulInput);

        this.minorFoulInput.value = "0";
        this.majorFoulInput.value = "0";

        const mainHeader = document.createElement("h1");
        const minorHeader = document.createElement("h2");
        const majorHeader = document.createElement("h2");

        const addMinorFoulButton = document.createElement("button");
        const addMajorFoulButton = document.createElement("button");
        const removeMinorFoulButton = document.createElement("button");
        const removeMajorFoulButton = document.createElement("button");

        mainHeader.textContent = "FOULS";
        minorHeader.textContent = "Minor";
        majorHeader.textContent = "Major";

        addMinorFoulButton.textContent = "+1";
        addMajorFoulButton.textContent = "+1";
        removeMinorFoulButton.textContent = "-1";
        removeMajorFoulButton.textContent = "-1";

        removeMinorFoulButton.addEventListener("click", () => this.changeCount(this.minorFoulInput, -1));
        addMinorFoulButton.addEventListener("click", () => this.changeCount(this.minorFoulInput, +1));
        removeMajorFoulButton.addEventListener("click", () => this.changeCount(this.majorFoulInput, -1));
        addMajorFoulButton.addEventListener("click", () => this.changeCount(this.majorFoulInput, +1));

        this.domElement.append(
            mainHeader,
            minorHeader,
            removeMinorFoulButton, this.minorFoulInput, addMinorFoulButton,
            majorHeader,
            removeMajorFoulButton, this.majorFoulInput, addMajorFoulButton
        );
    }

    private changeCount(input: HTMLInputElement, increment: number) {
        input.value = Math.max(0, Number.parseInt(input.value) + increment).toString();
    }

    public getMinorFouls(): number {
        return Number.parseInt(this.minorFoulInput.value);
    }

    public getMajorFouls(): number {
        return Number.parseInt(this.majorFoulInput.value);
    }
}