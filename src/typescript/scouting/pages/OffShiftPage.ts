import CheckboxGroup from "../components/CheckboxGroup";
import Page from "./Page";

export default class OffShiftPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly nextButton = document.createElement("button");

    private readonly intakeChoices = new CheckboxGroup("Intake", ["Depot", "Neutral Zone", "Outpost", "Opponent Alliance"]);
    private readonly stockpilingChoices = new CheckboxGroup("Stockpiling", ["Deposit at Outpost", "Stockpile in Alliance Zone", "Stockpile in Robot"]);
    private readonly defenseChoices = new CheckboxGroup("Defense", ["Depot", "Neutral Zone", "Outpost"]);

    constructor() {
        super("INACTIVE HUB PERIOD");
        this.backButton.textContent = "BACK";
        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.append(this.backButton, this.nextButton);

        this.domElement.append(
            this.intakeChoices.domElement,
            this.stockpilingChoices.domElement,
            this.defenseChoices.domElement
        );
    }
}