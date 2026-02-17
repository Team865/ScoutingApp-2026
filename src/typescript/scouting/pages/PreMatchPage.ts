import Signal from "../../lib/dataTypes/Signal";
import Vector2 from "../../lib/dataTypes/Vector2";
import { absolutePosition } from "../../lib/DOMHelper";
import AppData, { RobotPosition } from "../AppData";
import Page from "./Page";

export default class PreMatchPage extends Page {
    public goToNextPage = new Signal<void>();

    constructor() {
        super("PRE-MATCH");

        const topRowYPos = 0.2;
        const bottomRowYPos = 0.8;

        const leftColumnXPos = 0.05;
        const middleColumnXPos = 0.5;
        const rightColumnXPos = 0.95;

        const fieldDiagramContainer = document.createElement("div");
        const fieldImage = document.createElement("img");
        const topLeftButton = this.createPositionButton(
            new Vector2(leftColumnXPos, topRowYPos), 
            new Vector2(0, 0.5), 
            RobotPosition.RED_RIGHT
        );

        const topMiddleButton = this.createPositionButton(
            new Vector2(middleColumnXPos, topRowYPos), 
            new Vector2(0.5, 0.5),
            RobotPosition.RED_MIDDLE
        );

        const topRightButton = this.createPositionButton(
            new Vector2(rightColumnXPos, topRowYPos), 
            new Vector2(1, 0.5),
            RobotPosition.RED_LEFT
        );

        const bottomLeftButton = this.createPositionButton(
            new Vector2(leftColumnXPos, bottomRowYPos), 
            new Vector2(0, 0.5), 
            RobotPosition.BLUE_LEFT
        );

        const bottomMiddleButton = this.createPositionButton(
            new Vector2(middleColumnXPos, bottomRowYPos), 
            new Vector2(0.5, 0.5),
            RobotPosition.BLUE_MIDDLE
        );

        const bottomRightButton = this.createPositionButton(
            new Vector2(rightColumnXPos, bottomRowYPos), 
            new Vector2(1, 0.5),
            RobotPosition.BLUE_RIGHT
        );

        fieldDiagramContainer.classList.add("field-diagram-container");

        fieldImage.src = "./static/deploy/rebuiltBackground.png";

        fieldDiagramContainer.append(
            fieldImage, 
            topLeftButton, topMiddleButton, topRightButton,
            bottomLeftButton, bottomMiddleButton, bottomRightButton
        );
        this.domElement.appendChild(fieldDiagramContainer);
    }
    
    private createPositionButton(position: Vector2, anchorPoint: Vector2, robotPosition: RobotPosition): HTMLButtonElement {
        const button = document.createElement("button");
        const pointerImage = document.createElement("img");

        pointerImage.src = "./static/deploy/icons/pointer.svg";
        button.appendChild(pointerImage);

        absolutePosition(button, position, anchorPoint);

        button.addEventListener("click", _ => this.setRobotPosition(robotPosition));

        return button
    }

    private setRobotPosition(robotPosition: RobotPosition) {
        AppData.robotPosition = robotPosition;

        this.goToNextPage.emit();
    }
}