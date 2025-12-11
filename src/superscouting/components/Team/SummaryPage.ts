import Page from "./Page.js";

export default class SummaryPage implements Page {
    public readonly id = "Summary";
    private readonly testDiv = document.createElement("div");

    constructor() {
        this.testDiv.innerHTML = "PLACEHOLDER TEXT";
    }

    public show(pageContainer: HTMLDivElement): void {
        pageContainer.appendChild(this.testDiv);
    }

    public hide(): void {
        this.testDiv.remove();
    }
}