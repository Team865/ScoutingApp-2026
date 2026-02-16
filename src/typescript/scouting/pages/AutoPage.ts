import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import Page from "./Page";

export default class AutoPage extends Page {
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost"]);
    private readonly climbChoices = new CheckboxGroup("Climb", ["Attempted?", "Failed?"]);

    constructor() {
        super("AUTONOMOUS");
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.appendChild(this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.climbChoices.domElement
        );
    }
}