import Signal from "../../lib/dataTypes/Signal";
import Vector2 from "../../lib/dataTypes/Vector2";
import createPositionButton from "../util/createPositionSelectionButton";
import AppData, { RobotPosition } from "../AppData";
import Page from "./Page";

export default class PreMatchPage extends Page {
    private readonly matchNumberLabel = document.createElement("h2");
    private readonly teamNumberLabel = document.createElement("h2");

    public goToNextPage = new Signal<void>();

    private readonly buttonsYPos = 0.6;
    private readonly fieldImage = document.createElement("img");
    
    private readonly redLeftButton = createPositionButton(
        new Vector2(0.05, this.buttonsYPos),
        new Vector2(0, 0.5),
        RobotPosition.RED_LEFT,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );
    
    private readonly redMiddleButton = createPositionButton(
        new Vector2(0.5, this.buttonsYPos),
        new Vector2(0.5, 0.5),
        RobotPosition.RED_MIDDLE,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );
    
    private readonly redRightButton = createPositionButton(
        new Vector2(0.95, this.buttonsYPos),
        new Vector2(1, 0.5),
        RobotPosition.RED_RIGHT,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );

    private readonly blueLeftButton = createPositionButton(
        new Vector2(0.05, this.buttonsYPos),
        new Vector2(0, 0.5),
        RobotPosition.BLUE_LEFT,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );
    
    private readonly blueMiddleButton = createPositionButton(
        new Vector2(0.5, this.buttonsYPos),
        new Vector2(0.5, 0.5),
        RobotPosition.BLUE_MIDDLE,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );
    
    private readonly blueRightButton = createPositionButton(
        new Vector2(0.95, this.buttonsYPos),
        new Vector2(1, 0.5),
        RobotPosition.BLUE_RIGHT,
        this.goToNextPage.emit.bind(this.goToNextPage)
    );

    constructor() {
        super("PRE-MATCH");
        const fieldDiagramContainer = document.createElement("div");
        const infoContainer = document.createElement("div");

        infoContainer.classList.add("info-container");
        fieldDiagramContainer.classList.add("field-diagram-container");

        this.fieldImage.src = this.getFieldImageLink("red");

        infoContainer.append(this.matchNumberLabel, this.teamNumberLabel);

        fieldDiagramContainer.append(
            this.fieldImage, 
            this.redLeftButton, this.redMiddleButton, this.redRightButton,
            this.blueLeftButton, this.blueMiddleButton, this.blueRightButton
        );
        
        this.domElement.append(infoContainer, fieldDiagramContainer);
    }

    private getFieldImageLink(alliance: string): string {
        return `./static/deploy/fieldImages/${alliance.toLowerCase()}Half.png`;
    }

    public update(alliance: "Red" | "Blue") {
        this.matchNumberLabel.textContent = `Match ${AppData.matchNumber}`;
        this.teamNumberLabel.textContent = `Team ${AppData.teamNumber}`;

        this.fieldImage.src = this.getFieldImageLink(alliance);

        if(alliance == "Red") {
            this.blueLeftButton.hidden = true;
            this.blueMiddleButton.hidden = true;
            this.blueRightButton.hidden = true;

            this.redLeftButton.hidden = false;
            this.redMiddleButton.hidden = false;
            this.redRightButton.hidden = false;
        } else {
            this.blueLeftButton.hidden = false;
            this.blueMiddleButton.hidden = false;
            this.blueRightButton.hidden = false;

            this.redLeftButton.hidden = true;
            this.redMiddleButton.hidden = true;
            this.redRightButton.hidden = true;
        }
    }
}