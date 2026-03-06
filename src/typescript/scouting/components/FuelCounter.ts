import Signal from "../../lib/dataTypes/Signal";
import { makeInputIntegerOnly } from "../../lib/DOMHelper";
import NumberSlider from "./NumberSlider";

class BatchCounter {
    private readonly inputBlocker = document.createElement('div');
    private readonly popupContainer = document.createElement("div");
    private readonly header = document.createElement("h1");
    private readonly fieldsContainer = document.createElement("div");
    private readonly startScoreInput = document.createElement("input");
    private readonly endScoreInput = document.createElement("input");
    private readonly scorePercentageSlider = new NumberSlider("Contribution %", 0, 20, 5);

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
        makeInputIntegerOnly(this.startScoreInput);
        endScoreLabel.htmlFor = "end-score";
        this.endScoreInput.id = "end-score";
        this.endScoreInput.type = "number";
        makeInputIntegerOnly(this.endScoreInput);

        this.startScoreInput.addEventListener("keypress", e => {
            if(e.key === "Enter") {
                e.preventDefault();
                this.endScoreInput.focus();
            }
        });

        this.submitButton.addEventListener("click", _ => {
            this.hide();
            
            const startScore = Number.parseInt(this.startScoreInput.value || this.startScoreInput.placeholder);
            const endScore = Number.parseInt(this.endScoreInput.value || this.endScoreInput.placeholder);
            const percentage = this.scorePercentageSlider.value;

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
            this.scorePercentageSlider.domElement,
            this.discardButton, this.submitButton
        );
        this.popupContainer.append(this.header, this.fieldsContainer);
        this.inputBlocker.appendChild(this.popupContainer);
    }

    public show(): void {
        this.startScoreInput.value = "";
        this.endScoreInput.value = "";
        this.startScoreInput.placeholder = "0";
        this.endScoreInput.placeholder = "0";
        this.scorePercentageSlider.setValue(100);

        document.body.appendChild(this.inputBlocker);

        this.startScoreInput.focus();
    }

    public hide(): void {
        this.inputBlocker.remove();
    }
}

export default class FuelCounter {
    private readonly mainContainer = document.createElement("div");

    private readonly header = document.createElement("h1");
    private readonly textInput = document.createElement("input");
    private readonly decrement1Button = document.createElement("button");
    private readonly decrement5Button = document.createElement("button");
    private readonly increment1Button = document.createElement("button");
    private readonly increment5Button = document.createElement("button");
    private readonly batchButton = document.createElement("button");
    private readonly batchCounter = new BatchCounter();

    constructor() {
        this.mainContainer.classList.add("fuel-counter");

        this.header.innerText = "FUEL SCORED"
        this.decrement1Button.innerText = "-1";
        this.decrement5Button.innerText = "-5";
        this.increment1Button.innerText = "+1";
        this.increment5Button.innerText = "+5";
        this.batchButton.innerText = "Add Batch";
        this.textInput.value = "0";
        makeInputIntegerOnly(this.textInput);

        this.decrement1Button.addEventListener("click", _ => this.changeCount(-1));
        this.decrement5Button.addEventListener("click", _ => this.changeCount(-5));
        this.increment1Button.addEventListener("click", _ => this.changeCount(+1));
        this.increment5Button.addEventListener("click", _ => this.changeCount(+5));
        this.batchButton.addEventListener("click", _ => this.batchCounter.show());

        this.batchCounter.onSubmit.connect(scoreContribution => this.textInput.value = (Number.parseInt(this.textInput.value) + scoreContribution).toString());

        this.mainContainer.append(
            this.header,
            this.decrement1Button,
            this.decrement5Button,
            this.textInput,
            this.increment1Button,
            this.increment5Button,
            this.batchButton
        );
    }
    
    private changeCount(changeAmount: number) {
        this.textInput.value = Math.max(0, this.fuelScored + changeAmount).toString();
    }

    public get domElement() {
        return this.mainContainer;
    }

    public get fuelScored() {
        return Number.parseInt(this.textInput.value);
    }
}