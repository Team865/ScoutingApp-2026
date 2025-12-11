import Signal from "../../dataTypes/Signal.js";

export default class PopupDiv {
    private mainContainer = document.createElement("div");
    private popupDivElement = document.createElement("div");
    private closeButton = document.createElement("button");
    public readonly onClose: Signal<void> = new Signal();

    constructor() {
        this.mainContainer.style.position = "fixed";
        this.mainContainer.style.top = "0px";
        this.mainContainer.style.left = "0px";
        this.mainContainer.style.width = "100dvw";
        this.mainContainer.style.height = "100dvh";
        this.mainContainer.style.display = "flex";
        this.mainContainer.style.alignItems = "center";
        this.mainContainer.style.justifyContent = "center";
        this.mainContainer.style.transition = "background-color 0.2s ease-in-out"
        this.mainContainer.style.backgroundColor = "rgba(0, 0, 0, 0%)";
        
        this.popupDivElement.style.display = "flex";
        this.popupDivElement.style.flexFlow = "column";
        this.popupDivElement.style.alignItems = "center";
        this.popupDivElement.style.justifyContent = "start";
        this.popupDivElement.style.width = "fit-content";
        this.popupDivElement.style.padding = "10px 10px";
        this.popupDivElement.style.height = "fit-content";
        this.popupDivElement.style.backgroundColor = "var(--bg)";
        this.popupDivElement.style.borderRadius = "10px";

        this.closeButton.style.alignSelf = "flex-end";
        this.closeButton.style.aspectRatio = "1";
        this.closeButton.style.height = "max-content";
        this.closeButton.style.fontSize = "1rem";
        this.closeButton.style.lineBreak = "1rem";
        this.closeButton.innerText = "❌";

        this.closeButton.addEventListener("click", () => this.hide());

        this.mainContainer.appendChild(this.popupDivElement);
        this.popupDivElement.appendChild(this.closeButton);
    }

    get getDiv() {
        return this.popupDivElement;
    }

    public appendChild(child: HTMLElement) {
        this.popupDivElement.appendChild(child);
    }

    public show() {
        document.body.appendChild(this.mainContainer);
        this.mainContainer.style.backgroundColor = "rgba(0, 0, 0, 50%)";
    }
    
    public hide() {
        this.mainContainer.remove();
        this.onClose.emit();
    }
}