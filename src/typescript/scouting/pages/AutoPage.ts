import AppData from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import Page from "./Page";

export default class AutoPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");
    
    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Human Player"]);
    private readonly climbChoices = new CheckboxGroup("Climb", ["Attempted?", "Failed?"]);

    constructor() {
        super("AUTONOMOUS");

        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.climbChoices.domElement
        );
    }

    public override updateAppData(): void {
        AppData.autoFuelScored = this.fuelCounter.fuelScored;

        AppData.autoIntake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutralZone: this.intakeChoices.isChecked("Neutral Zone"),
            humanPlayer: this.intakeChoices.isChecked("Human Player")
        };

        AppData.autoClimb = {
            attempted: this.climbChoices.isChecked("Attempted?"),
            failed: this.climbChoices.isChecked("Failed?")
        }
    }
}