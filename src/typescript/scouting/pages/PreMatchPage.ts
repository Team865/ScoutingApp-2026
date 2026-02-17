import CheckboxGroup from "../components/CheckboxGroup";
import FuelCounter from "../components/FuelCounter";
import Page from "./Page";

export default class PreMatchPage extends Page {
    public readonly nextButton = document.createElement("button");

    constructor() {
        super("PRE-MATCH");

        const fieldDiagramContainer = document.createElement("div");
        const fieldImage = document.createElement("img");
        const testButton = document.createElement("button");

        fieldDiagramContainer.classList.add("field-diagram-container");

        fieldImage.src = "./static/deploy/rebuiltBackground.png";

        this.nextButton.textContent = "NEXT";

        this.bottomBar.domElement.appendChild(this.nextButton);

        fieldDiagramContainer.append(fieldImage, testButton);
        this.domElement.appendChild(fieldDiagramContainer);
    }
}