import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import Page from "./Page";

export default class EndgamePreClimbPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly fuelCounter = new FuelCounter();
    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Home Alliance", "Opponent Alliance"]);
    private readonly defenseChoices = new CheckboxGroup("Defense", ["Depot", "Neutral Zone", "Outpost"]);

    constructor() {
        super("ENDGAME PRE-CLIMB");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.fuelCounter.domElement,
            this.intakeChoices.domElement,
            this.defenseChoices.domElement
        );
    }
}