import AppData from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class TransitionPhasePage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Home Alliance", "Opponent Alliance"]);
    private readonly passerChoice = new LabeledCheckbox("Passer/Feeder?");
    private readonly defenseChoice = new LabeledCheckbox("Defense?");

    constructor() {
        super("TRANSTION PHASE");

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

    public override updateAppData(): void {
        AppData.transitionFuelScored = this.fuelCounter.fuelScored;

        AppData.transitionIntake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutralZone: this.intakeChoices.isChecked("Neutral Zone"),
            outpost: this.intakeChoices.isChecked("Outpost"),
            homeAlliance: this.intakeChoices.isChecked("Home Alliance"),
            oppoAlliance: this.intakeChoices.isChecked("Opponent Alliance")
        };

        AppData.transitionPasser = this.passerChoice.isChecked;
        AppData.transitionDefense = this.defenseChoice.isChecked;
    }
}