import Field, { FieldInstance } from "./FieldInterface.js";

export enum PopupExitCode {
    SUBMITTED,
    CANCELLED
}

type DialogField = {
    header: string,
    type: "text" | "number" | "color",
    id: string,
    value?: string,
    placeholder?: string
}

export default class PopupDialog {
    title: string;
    fields: Field[];

    constructor(title: string, fields: Field[]){
        this.title = title;
        this.fields = fields;
    }

    /** onExit is a function that takes in two arguments:
     * - exitCode: The exit code of the dialog. Determines whether the dialog was submitted or cancelled
     * - fieldValues: A record that has a string key representing the id of the field, and any return type
     */
    public instance(onExit: (exitCode: PopupExitCode, fieldValues: Record<string, any>) => void) {
        const mainContainer = document.createElement("div");
        mainContainer.style.position = "fixed";
        mainContainer.style.top = "0px";
        mainContainer.style.left = "0px";
        mainContainer.style.width = "100dvw";
        mainContainer.style.height = "100dvh";
        mainContainer.style.display = "flex";
        mainContainer.style.alignItems = "center";
        mainContainer.style.justifyContent = "center";
        mainContainer.style.transition = "background-color 0.2s ease-in-out"
        mainContainer.style.backgroundColor = "rgba(0, 0, 0, 0%)";

        const dialogContainer = document.createElement("div");
        dialogContainer.style.display = "flex";
        dialogContainer.style.flexFlow = "column";
        dialogContainer.style.alignItems = "center";
        dialogContainer.style.justifyContent = "start";
        dialogContainer.style.width = "fit-content";
        dialogContainer.style.padding = "10px 25px";
        dialogContainer.style.height = "fit-content";
        dialogContainer.style.backgroundColor = "var(--bg)";
        dialogContainer.style.borderRadius = "10px";

        const titleHeader = document.createElement("h1");
        titleHeader.innerText = this.title;

        const fieldsContainer = document.createElement("div");
        fieldsContainer.style.width = "100%";
        fieldsContainer.style.height = "100%";
        fieldsContainer.style.display = "flex";
        fieldsContainer.style.flexFlow = "column";
        fieldsContainer.style.alignItems = "center";
        fieldsContainer.style.justifyContent = "start";
        fieldsContainer.style.overflow = "auto";
        fieldsContainer.style.gap = "10px";

        const buttonsFooter = document.createElement("div");
        buttonsFooter.style.display = "flex";
        buttonsFooter.style.flexFlow = "row";
        buttonsFooter.style.alignItems = "center";
        buttonsFooter.style.justifyContent = "end";
        buttonsFooter.style.gap = "10px";
        buttonsFooter.style.padding = "10px";
        buttonsFooter.style.marginTop = "auto";
        buttonsFooter.style.width = "100%";
        buttonsFooter.style.height = "15%";
        buttonsFooter.style.boxSizing = "border-box";

        const submitButton = document.createElement("button");
        submitButton.innerText = "SUBMIT";
        submitButton.style.height = "100%";
        submitButton.style.aspectRatio = "2";
        submitButton.style.fontWeight = "bold";
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "CANCEL";
        cancelButton.style.height = "100%";
        cancelButton.style.aspectRatio = "2";
        cancelButton.style.fontWeight = "bold";

        const fieldInstances: Map<string, FieldInstance> = new Map();

        // Create fields
        for(const field of this.fields) {
            fieldInstances.set(field.id, field.instance(fieldsContainer));
        }

        buttonsFooter.appendChild(submitButton);
        buttonsFooter.appendChild(cancelButton);

        dialogContainer.appendChild(titleHeader);
        dialogContainer.appendChild(fieldsContainer);
        dialogContainer.appendChild(buttonsFooter);
        mainContainer.appendChild(dialogContainer);
        document.body.appendChild(mainContainer);
        setTimeout(() => mainContainer.style.backgroundColor = "rgba(0, 0, 0, 50%)", 0);

        function fieldsToJSon() {
            const JSonToReturn: Record<string, any> = {};

            for(const [fieldId, fieldInstance] of fieldInstances.entries()) {
                JSonToReturn[fieldId] = fieldInstance.getValue();
            }

            return JSonToReturn;
        }

        submitButton.onclick = () => {mainContainer.remove(); onExit(PopupExitCode.SUBMITTED, fieldsToJSon())};
        cancelButton.onclick = () => {mainContainer.remove(); onExit(PopupExitCode.CANCELLED, fieldsToJSon())};
    }
}