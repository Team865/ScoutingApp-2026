import Vector2 from "../../lib/dataTypes/Vector2";
import { absolutePosition } from "../../lib/DOMHelper";
import AppData, { RobotPosition } from "../AppData";

export default function createPositionButton(position: Vector2, anchorPoint: Vector2, robotPosition: RobotPosition, callback: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    const pointerImage = document.createElement("img");

    pointerImage.src = "./static/deploy/icons/pointer.svg";
    button.appendChild(pointerImage);

    absolutePosition(button, position, anchorPoint);

    button.addEventListener("click", _ => {
        AppData.robotPosition = robotPosition;
        callback();
    });

    return button
}