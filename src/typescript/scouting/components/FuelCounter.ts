import Signal from "../../lib/dataTypes/Signal";
import { makeInputIntegerOnly } from "../../lib/DOMHelper";

class BatchCounter {
    private readonly inputBlocker = document.createElement('div');
    private readonly popupContainer = document.createElement("div");
    private readonly header = document.createElement("h1");
    private readonly fieldsContainer = document.createElement("div");
    private readonly startScoreInput = document.createElement("input");
    private readonly endScoreInput = document.createElement("input");
    private readonly scorePercentInput = document.createElement("input");

    private readonly submitButton = document.createElement("button");
    private readonly discardButton = document.createElement("button");

    public readonly onSubmit = new Signal<number>();

    constructor() {
        const startScoreLabel = document.createElement("label");
        const endScoreLabel = document.createElement("label");
        const scorePercentLabel = document.createElement("label");

        this.inputBlocker.classList.add("popup-input-blocker");
        this.popupContainer.classList.add("batch-score-container");

        this.header.textContent = "BATCH SCORER";

        startScoreLabel.textContent = "Start Score: ";
        endScoreLabel.textContent = "End Score: ";
        scorePercentLabel.textContent = "Percentage: ";

        this.submitButton.textContent = "SUBMIT";
        this.discardButton.textContent = "DISCARD"

        startScoreLabel.htmlFor = "start-score";
        this.startScoreInput.id = "start-score";
        this.startScoreInput.type = "number";
        endScoreLabel.htmlFor = "end-score";
        this.endScoreInput.id = "end-score";
        this.endScoreInput.type = "number";
        scorePercentLabel.htmlFor = "score-percentage";
        this.scorePercentInput.id = "score-percentage";

        this.submitButton.addEventListener("click", _ => {
            this.hide();
            
            const startScore = Number.parseInt(this.startScoreInput.value);
            const endScore = Number.parseInt(this.endScoreInput.value);
            const percentage = Number.parseFloat(this.scorePercentInput.value);

            if(isNaN(startScore)) {
                alert("The Start Score provided is not a number.");
                return;
            } else if(isNaN(endScore)) {
                alert("The End Score provided is not a number.");
                return;
            } else if(isNaN(percentage)) {
                alert("The percentage provided is not a number.");
                return;
            }

            const deltaScore = endScore - startScore;

            this.onSubmit.emit(Math.round((percentage / 100) * deltaScore));
        });

        this.discardButton.addEventListener("click", _ => this.hide());

        this.fieldsContainer.append(
            startScoreLabel, this.startScoreInput,
            endScoreLabel, this.endScoreInput,
            scorePercentLabel, this.scorePercentInput,
            this.submitButton, this.discardButton
        );
        this.popupContainer.append(this.header, this.fieldsContainer);
        this.inputBlocker.appendChild(this.popupContainer);
    }

    public show(): void {
        this.startScoreInput.value = "0";
        this.endScoreInput.value = "0";
        this.scorePercentInput.value = "100";

        document.body.appendChild(this.inputBlocker);

        this.startScoreInput.focus();
    }

    public hide(): void {
        this.inputBlocker.remove();
    }
}

export default class FuelCounter {
    private fuelScoredCount: number = 0;
    private readonly mainContainer = document.createElement("div");

    private readonly header = document.createElement("h1");
    private readonly textInput = document.createElement("input");
    private readonly decrementButton = document.createElement("button");
    private readonly incrementButton = document.createElement("button");
    private readonly batchButton = document.createElement("button");
    private readonly batchCounter = new BatchCounter();

    constructor() {
        this.mainContainer.classList.add("fuel-counter");

        this.header.innerText = "FUEL SCORED"
        this.decrementButton.innerText = "-";
        this.incrementButton.innerText = "+";
        this.batchButton.innerText = "Add Batch";
        this.textInput.value = "0";
        makeInputIntegerOnly(this.textInput);

        this.decrementButton.addEventListener("click", _ => this.textInput.value = Math.max(Number.parseInt(this.textInput.value) - 1, 0).toString());
        this.incrementButton.addEventListener("click", _ => this.textInput.value = (Number.parseInt(this.textInput.value) + 1).toString());
        this.batchButton.addEventListener("click", _ => this.batchCounter.show());

        this.batchCounter.onSubmit.connect(scoreContribution => this.textInput.value = (Number.parseInt(this.textInput.value) + scoreContribution).toString());

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