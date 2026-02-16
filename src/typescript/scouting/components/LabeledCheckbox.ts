export default class LabeledCheckbox {
    private readonly mainContainer = document.createElement("div");

    private readonly label = document.createElement("label");
    private readonly checkBox = document.createElement("input");

    constructor(labelText) {
        this.mainContainer.classList.add("label-checkbox");

        const uniqueHash = crypto.randomUUID();

        this.label.innerText = labelText;
        this.label.htmlFor = labelText + uniqueHash;
        this.checkBox.type = "checkbox";
        this.checkBox.id = labelText + uniqueHash;

        this.mainContainer.append(
            this.label,
            this.checkBox
        );
    }

    public get checkbox() {
        return this.checkBox;
    }

    public get domElement() {
        return this.mainContainer;
    }

    public get isChecked() {
        return this.checkBox.checked;
    }
}