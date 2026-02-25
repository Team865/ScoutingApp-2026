import AppData from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class TeleopShiftsPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Home Alliance", "Opponent Alliance"]);
    private readonly otherActions = new CheckboxGroup("Other Actions", ["Feeding/Passing", "Deposit to Human Player"]);
    private readonly defenseChoices = new CheckboxGroup("Defense", ["Depot", "Outpost", "Trench", "Bump", "Other"]);
    private readonly foulChoices = new CheckboxGroup("Fouls", ["Minor", "Major"]);

    constructor() {
        super("TELEOP SHIFTS");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.defenseChoices.domElement,
            this.otherActions.domElement,
            this.foulChoices.domElement
        );
    }
    
    public override updateAppData(): void {
        AppData.teleopFuelScored = this.fuelCounter.fuelScored;

        AppData.teleopIntake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutralZone: this.intakeChoices.isChecked("Neutral Zone"),
            outpost: this.intakeChoices.isChecked("Outpost"),
            homeAlliance: this.intakeChoices.isChecked("Home Alliance"),
            opponentAlliance: this.intakeChoices.isChecked("Opponent Alliance")
        };

        AppData.teleopDefense = {
            depot: this.defenseChoices.isChecked("Depot"),
            outpost: this.defenseChoices.isChecked("Outpost"),
            trench: this.defenseChoices.isChecked("Trench"),
            bump: this.defenseChoices.isChecked("Bump"),
            other: this.defenseChoices.isChecked("Other")
        }

        AppData.teleopPasser = this.otherActions.isChecked("Feeding/Passing");
        AppData.teleopHumanPlayerDeposit = this.otherActions.isChecked("Deposit to Human Player");

        AppData.teleopFouls = {
            minor: this.foulChoices.isChecked("Minor"),
            major: this.foulChoices.isChecked("Major")
        };
    }
}