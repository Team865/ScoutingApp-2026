import Signal from "../../lib/dataTypes/Signal";
import Vector2 from "../../lib/dataTypes/Vector2";
import { makeInputIntegerOnly } from "../../lib/DOMHelper";
import AppData, { RobotPosition } from "../AppData";
import LabeledInput from "../components/LabeledInput";
import createPositionButton from "../util/createPositionSelectionButton";
import Page from "./Page";

export default class ManualInputPage extends Page {
    private readonly matchNumber = new LabeledInput("Match Number:");
    private readonly teamNumber = new LabeledInput("Team Number:");
    
    public goToNextPage = new Signal<void>();

    constructor() {
        super("Manual Match Scouting");

        makeInputIntegerOnly(this.matchNumber.inputElement);
        makeInputIntegerOnly(this.teamNumber.inputElement);

        const topRowYPos = 0.2;
        const bottomRowYPos = 0.8;

        const leftColumnXPos = 0.05;
        const middleColumnXPos = 0.5;
        const rightColumnXPos = 0.95;

        const topLeftButton = createPositionButton(
            new Vector2(leftColumnXPos, topRowYPos), 
            new Vector2(0, 0.5), 
            RobotPosition.RED_RIGHT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const topMiddleButton = createPositionButton(
            new Vector2(middleColumnXPos, topRowYPos), 
            new Vector2(0.5, 0.5),
            RobotPosition.RED_MIDDLE,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const topRightButton = createPositionButton(
            new Vector2(rightColumnXPos, topRowYPos), 
            new Vector2(1, 0.5),
            RobotPosition.RED_LEFT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const bottomLeftButton = createPositionButton(
            new Vector2(leftColumnXPos, bottomRowYPos), 
            new Vector2(0, 0.5), 
            RobotPosition.BLUE_LEFT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const bottomMiddleButton = createPositionButton(
            new Vector2(middleColumnXPos, bottomRowYPos), 
            new Vector2(0.5, 0.5),
            RobotPosition.BLUE_MIDDLE,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const bottomRightButton = createPositionButton(
            new Vector2(rightColumnXPos, bottomRowYPos), 
            new Vector2(1, 0.5),
            RobotPosition.BLUE_RIGHT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const fieldDiagramContainer = document.createElement("div");
        const fieldImage = document.createElement("img");

        fieldDiagramContainer.classList.add("field-diagram-container");
        fieldImage.src = "./static/deploy/fieldImages/full.png";

        fieldDiagramContainer.append(
            fieldImage,
            topLeftButton, topMiddleButton, topRightButton,
            bottomLeftButton, bottomMiddleButton, bottomRightButton
        );
        
        this.domElement.append(this.matchNumber.domElement, this.teamNumber.domElement, fieldDiagramContainer);
    }

    public readyToContinue(): boolean {
        if(this.matchNumber.value.length == 0) return false;
        if(this.teamNumber.value.length == 0) return false;

        return true;
    }

    public override updateAppData(): void {
        AppData.matchNumber = Number.parseInt(this.matchNumber.value);
        AppData.teamNumber = Number.parseInt(this.teamNumber.value);
    }
}