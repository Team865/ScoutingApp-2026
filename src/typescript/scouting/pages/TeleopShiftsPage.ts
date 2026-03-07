import AppData from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FoulCounter from "../components/FoulCounter";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class TeleopShiftsPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Human Player", "Home Alliance", "Opponent Alliance"]);
    private readonly otherActions = new CheckboxGroup("Other Actions", ["Defense (Bump/Trench)", "Feeding/Passing", "Snowploughing", "Deposit to Human Player"]);
    private readonly foulCounter = new FoulCounter();

    constructor() {
        super("TELEOP SHIFTS");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.otherActions.domElement,
            this.foulCounter.domElement
        );
    }
    
    public override updateAppData(): void {
        AppData.teleopFuelScored = this.fuelCounter.fuelScored;

        AppData.teleopIntake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutralZone: this.intakeChoices.isChecked("Neutral Zone"),
            humanPlayer: this.intakeChoices.isChecked("Human Player"),
            homeAlliance: this.intakeChoices.isChecked("Home Alliance"),
            opponentAlliance: this.intakeChoices.isChecked("Opponent Alliance")
        };

        AppData.teleopDefense = this.otherActions.isChecked("Defense (Bump/Trench)");

        AppData.teleopPasser = this.otherActions.isChecked("Feeding/Passing");
        AppData.teleopSnowploughing = this.otherActions.isChecked("Snowploughing");
        AppData.teleopHumanPlayerDeposit = this.otherActions.isChecked("Deposit to Human Player");

        AppData.teleopFouls = {
            minor: this.foulCounter.getMinorFouls(),
            major: this.foulCounter.getMajorFouls()
        };
    }
}