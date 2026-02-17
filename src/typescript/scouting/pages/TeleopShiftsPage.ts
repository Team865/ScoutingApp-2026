import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class TeleopShiftsPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Opponent Alliance"]);
    private readonly otherActions = new CheckboxGroup("Other Actions", ["Feeding/Passing", "Deposit to Human Player"]);
    private readonly defenseChoices = new CheckboxGroup("Defense", ["Depot", "Outpost", "Trench", "Bump", "Other"]);

    constructor() {
        super("TELEOP SHIFTS");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.defenseChoices.domElement,
            this.otherActions.domElement
        );
    }
}