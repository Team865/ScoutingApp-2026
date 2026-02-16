import Signal from "../../lib/dataTypes/Signal";

export default class StartingShiftPrompt {
    private readonly inputBlocker = document.createElement('div');
    private readonly popupContainer = document.createElement("div");
    private readonly mainSection = document.createElement("div");
    private readonly header = document.createElement("h1");
    private readonly confirmationDesc = document.createElement("p");

    private readonly onAllianceButton = document.createElement("button");
    private readonly offAllianceButton = document.createElement("button");
    
    private readonly confirmButton = document.createElement("button");
    private readonly returnButton = document.createElement("button");

    public readonly allianceConfirmed = new Signal<boolean>();

    private isOnAlliance = false;

    constructor() {
        this.inputBlocker.classList.add("popup-input-blocker");
        this.popupContainer.classList.add("starting-shift-prompt-container");

        this.confirmationDesc.innerHTML = "You won't be able<br>to change your choice."

        this.onAllianceButton.textContent = "ON ALLIANCE";
        this.offAllianceButton.textContent = "OFF ALLIANCE";
        this.confirmButton.textContent = "CONFIRM";
        this.returnButton.textContent = "RETURN";

        this.onAllianceButton.addEventListener("click", _ => this.confirmAlliance(true));
        this.offAllianceButton.addEventListener("click", _ => this.confirmAlliance(false));

        this.returnButton.addEventListener("click", _ => {
            if(this.confirmButton.parentElement === null) {
                this.hide();
            } else {
                this.header.textContent = "ALLIANCE TYPE";
                this.mainSection.replaceChildren(this.onAllianceButton, this.offAllianceButton);
            }
        });

        this.confirmButton.addEventListener("click", _ => {
            this.allianceConfirmed.emit(this.isOnAlliance);
            this.hide();
        });

        this.popupContainer.append(this.header, this.mainSection, this.returnButton);
        this.inputBlocker.appendChild(this.popupContainer);
    }

    public confirmAlliance(isOnAlliance: boolean): void {
        this.isOnAlliance = isOnAlliance;
        this.header.textContent = "ARE YOU SURE?";
        this.mainSection.replaceChildren(this.confirmationDesc, this.confirmButton);
    }

    public show(): void {
        this.header.textContent = "ALLIANCE TYPE";
        this.mainSection.replaceChildren(this.onAllianceButton, this.offAllianceButton);

        document.body.appendChild(this.inputBlocker);
    }

    public hide(): void {
        this.inputBlocker.remove();
    }
}