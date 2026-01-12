export default class LabelCheckbox {
    private readonly mainContainer = document.createElement("div");

    private readonly label = document.createElement("label");
    private readonly checkBox = document.createElement("input");

    constructor(labelText) {
        this.mainContainer.classList.add("label-checkbox");

        this.label.innerText = labelText;
        this.checkBox.type = "checkbox";

        this.mainContainer.append(
            this.label,
            this.checkBox
        );
    }

    public get domElement() {
        return this.mainContainer;
    }

    public get isChecked() {
        return this.checkBox.checked;
    }
}