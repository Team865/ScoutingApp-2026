import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import LabeledCheckbox from "../components/LabeledCheckbox";
import RadioGroup from "../components/RadioGroup";
import Page from "./Page";

export default class EndgameClimbPage extends Page {
    public readonly backButton = document.createElement("button");
    public readonly submitButton = document.createElement("button");

    private readonly climbChoices = new RadioGroup("CLIMB", ["No Attempt", "Level 1", "Level 2", "Level 3"]);
    private readonly failedClimb = new LabeledCheckbox("Failed Climb?");

    private readonly commentInput = document.createElement("textarea");

    constructor() {
        super("ENDGAME CLIMB");

        const commentContainer = document.createElement("div");
        const commentHeader = document.createElement("h1");

        commentContainer.classList.add("comments-container");

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
            commentContainer,
            this.submitButton
        );
    }
}