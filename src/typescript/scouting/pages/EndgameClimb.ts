import AppData, { ClimbHeight } from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import LabeledInput from "../components/LabeledInput";
import RadioGroup from "../components/RadioGroup";
import Page from "./Page";

export default class EndgameClimbPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly submitButton = document.createElement("button");

    private readonly climbChoices = new RadioGroup("CLIMB", ["No Attempt", "Level 1", "Level 2", "Level 3"]);
    private readonly failedClimb = new LabeledCheckbox("Failed Climb?");
    private readonly climbTime = new LabeledInput("Time remaining at start of attempt (seconds)");

    private readonly commentInput = document.createElement("textarea");

    constructor() {
        super("ENDGAME CLIMB");

        const commentContainer = document.createElement("div");
        const commentHeader = document.createElement("h1");

        commentContainer.classList.add("comments-container");
        this.climbTime.domElement.classList.add("climb-time-container");
        this.climbTime.inputElement.type = "number";

        this.backButton.textContent = "BACK";
        commentHeader.textContent = "COMMENTS";
        this.submitButton.textContent = "SUBMIT";

        this.commentInput.style.overflowY = "hidden";
        this.commentInput.addEventListener("input", _ => {
            this.commentInput.style.height = "auto";
            this.commentInput.style.height = this.commentInput.scrollHeight.toString() + "px";
        });

        this.bottomBar.domElement.appendChild(this.backButton);

        commentContainer.append(commentHeader, this.commentInput);

        this.domElement.append(
            this.climbChoices.domElement,
            this.failedClimb.domElement,
            this.climbTime.domElement,
            commentContainer,
            this.submitButton
        );
    }

    public override updateAppData(): void {
        switch(this.climbChoices.selectedOption) {
            case "No Attempt":
                AppData.endgameClimbType = ClimbHeight.NO_ATTEMPT
                break;
            case "Level 1":
                AppData.endgameClimbType = ClimbHeight.L1
                break;
            case "Level 2":
                AppData.endgameClimbType = ClimbHeight.L2
                break;
            case "Level 3":
                AppData.endgameClimbType = ClimbHeight.L3
                break;
        }

        AppData.endgameClimbFailed = this.failedClimb.isChecked;
        AppData.endgameClimbTimeRemaining = this.climbTime.value ? Number.parseFloat(this.climbTime.value) : -1;
        AppData.comments = this.commentInput.value;
    }
}