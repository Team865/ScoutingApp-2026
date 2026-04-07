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
    private readonly otherActions = new CheckboxGroup("Other Actions", ["Defense", "Feeding/Passing", "Snowploughing", "Deposit to Human Player"]);
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
        AppData.teleop_fuel_scored = this.fuelCounter.fuelScored;

        AppData.teleop_intake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutral_zone: this.intakeChoices.isChecked("Neutral Zone"),
            human_player: this.intakeChoices.isChecked("Human Player"),
            home_alliance: this.intakeChoices.isChecked("Home Alliance"),
            opponent_alliance: this.intakeChoices.isChecked("Opponent Alliance")
        };

        AppData.teleop_defense = this.otherActions.isChecked("Defense");

        AppData.teleop_passer = this.otherActions.isChecked("Feeding/Passing");
        AppData.teleop_snowploughing = this.otherActions.isChecked("Snowploughing");
        AppData.teleop_human_player_deposit = this.otherActions.isChecked("Deposit to Human Player");

        AppData.teleop_fouls = {
            minor: this.foulCounter.getMinorFouls(),
            major: this.foulCounter.getMajorFouls()
        };
    }
}