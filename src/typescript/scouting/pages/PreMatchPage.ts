import Signal from "../../lib/dataTypes/Signal";
import Vector2 from "../../lib/dataTypes/Vector2";
import createPositionButton from "../util/createPositionSelectionButton";
import AppData, { RobotPosition } from "../AppData";
import Page from "./Page";

export default class PreMatchPage extends Page {
    public readonly nextButton = document.createElement("button");
    private readonly matchNumberLabel = document.createElement("h2");
    private readonly teamNumberLabel = document.createElement("h2");

    public goToNextPage = new Signal<void>();

    constructor() {
        super("PRE-MATCH");

        this.nextButton.textContent = "NEXT";

        const yPos = 0.6;

        const fieldDiagramContainer = document.createElement("div");
        const fieldImage = document.createElement("img");
        
        const redLeftButton = createPositionButton(
            new Vector2(0.05, yPos),
            new Vector2(0, 0.5),
            RobotPosition.RED_LEFT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );
        
        const redMiddleButton = createPositionButton(
            new Vector2(0.5, yPos),
            new Vector2(0.5, 0.5),
            RobotPosition.RED_MIDDLE,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );
        
        const redRightButton = createPositionButton(
            new Vector2(0.95, yPos),
            new Vector2(1, 0.5),
            RobotPosition.RED_RIGHT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        const blueLeftButton = createPositionButton(
            new Vector2(0.05, yPos),
            new Vector2(0, 0.5),
            RobotPosition.BLUE_LEFT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );
        
        const blueMiddleButton = createPositionButton(
            new Vector2(0.5, yPos),
            new Vector2(0.5, 0.5),
            RobotPosition.BLUE_MIDDLE,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );
        
        const blueRightButton = createPositionButton(
            new Vector2(0.95, yPos),
            new Vector2(1, 0.5),
            RobotPosition.BLUE_RIGHT,
            this.goToNextPage.emit.bind(this.goToNextPage)
        );

        fieldDiagramContainer.classList.add("field-diagram-container");

        fieldImage.src = "./static/deploy/fieldImages/redHalf.png";

        fieldDiagramContainer.append(
            fieldImage, 
            redLeftButton, redMiddleButton, redRightButton,
            blueLeftButton, blueMiddleButton, blueRightButton
        );

        this.bottomBar.domElement.appendChild(this.nextButton);
        this.domElement.append(this.matchNumberLabel, this.teamNumberLabel, fieldDiagramContainer);
    }

    
}