import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class TransitionPhasePage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly onAllianceButton = document.createElement("button");
    public readonly offAllianceButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Opponent Alliance"]);
    private readonly passerChoice = new LabeledCheckbox("Passer/Feeder?");
    private readonly defenseChoice = new LabeledCheckbox("Defense?");

    constructor() {
        super("TRANSTION PHASE");

        this.backButton.textContent = "BACK";
        this.onAllianceButton.textContent = "ON ALLIANCE";
        this.offAllianceButton.textContent = "OFF ALLIANCE";

        this.bottomBar.domElement.append(this.backButton, this.onAllianceButton, this.offAllianceButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.passerChoice.domElement,
            this.defenseChoice.domElement
        );
    }
}