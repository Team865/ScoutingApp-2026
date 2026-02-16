import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class OnShiftPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Opponent Alliance"]);
    private readonly passerChoice = new LabeledCheckbox("Passer/Feeder?");
    private readonly defenseChoice = new LabeledCheckbox("Defense?");

    constructor() {
        super("ACTIVE HUB PERIOD");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.passerChoice.domElement,
            this.defenseChoice.domElement
        );
    }
}