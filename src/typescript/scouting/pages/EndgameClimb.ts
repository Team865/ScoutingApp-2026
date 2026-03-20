import AppData, { ClimbHeight } from "../AppData";
import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import LabeledInput from "../components/LabeledInput";
import NumberSlider from "../components/NumberSlider";
import RadioGroup from "../components/RadioGroup";
import Page from "./Page";

export default class EndgameClimbPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly submitButton = document.createElement("button");

    private readonly climbChoices = new RadioGroup("CLIMB", ["No Attempt", "Level 1", "Level 2", "Level 3"]);
    private readonly failedClimb = new LabeledCheckbox("Failed Climb?");
    private readonly climbTime = new LabeledInput("Time remaining at start of attempt (seconds)");
    private readonly driverSkill = new NumberSlider("Drive Skill", 0, 10);
    private readonly defenseSkill = new NumberSlider("Defense Skill", 0, 10);

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
            this.driverSkill.domElement,
            this.defenseSkill.domElement,
            commentContainer,
            this.submitButton
        );
    }

    public override updateAppData(): void {
        switch(this.climbChoices.selectedOption) {
            case "No Attempt":
                AppData.endgame_climb_type = ClimbHeight.NO_ATTEMPT
                break;
            case "Level 1":
                AppData.endgame_climb_type = ClimbHeight.L1
                break;
            case "Level 2":
                AppData.endgame_climb_type = ClimbHeight.L2
                break;
            case "Level 3":
                AppData.endgame_climb_type = ClimbHeight.L3
                break;
        }

        AppData.endgame_climb_failed = this.failedClimb.isChecked;
        AppData.endgame_climb_time_remaining = this.climbTime.value ? Number.parseFloat(this.climbTime.value) : -1;

        AppData.driver_skill = this.driverSkill.value;
        AppData.defense_skill = this.defenseSkill.value;
        AppData.comments = this.commentInput.value;
    }
}