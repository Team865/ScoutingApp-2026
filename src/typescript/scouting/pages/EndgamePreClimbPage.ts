import AppData from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import Page from "./Page";

export default class EndgamePreClimbPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Home Alliance", "Opponent Alliance"]);
    private readonly defenseChoices = new CheckboxGroup("Defense", ["Depot", "Outpost", "Trench", "Bump", "Other"]);
    private readonly passerChoice = new LabeledCheckbox("Passer/Feeder?");
    private readonly foulChoices = new CheckboxGroup("Fouls", ["Minor", "Major"]);

    constructor() {
        super("ENDGAME PRE-CLIMB");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.defenseChoices.domElement,
            this.passerChoice.domElement,
            this.foulChoices.domElement
        );
    }
    
    public override updateAppData(): void {
        AppData.endgameFuelScored = this.fuelCounter.fuelScored;

        AppData.endgameIntake = {
            depot: this.intakeChoices.isChecked("Depot"),
            neutralZone: this.intakeChoices.isChecked("Neutral Zone"),
            outpost: this.intakeChoices.isChecked("Outpost"),
            homeAlliance: this.intakeChoices.isChecked("Home Alliance"),
            opponentAlliance: this.intakeChoices.isChecked("Opponent Alliance")
        };

        AppData.endgameDefense = {
            depot: this.defenseChoices.isChecked("Depot"),
            outpost: this.defenseChoices.isChecked("Outpost"),
            trench: this.defenseChoices.isChecked("Trench"),
            bump: this.defenseChoices.isChecked("Bump"),
            other: this.defenseChoices.isChecked("Other")
        }

        AppData.endgamePasser = this.passerChoice.isChecked;

        AppData.endgameFouls = {
            minor: this.foulChoices.isChecked("Minor"),
            major: this.foulChoices.isChecked("Major")
        };
    }
}