export default class LabelCheckbox {
    private checked: boolean = false;
    private readonly mainContainer = document.createElement("div");

    private readonly header = document.createElement("h1");
    private readonly checkBox = document.createElement("input");

    constructor() {
        this.mainContainer.classList.add("is-checked");

        this.header.innerText = "PLACEHOLDER";
        this.checkBox.type = "checkbox";
        this.checkBox.value = this.checked + "br/>";

        this.mainContainer.append(
            this.header,
            this.checkBox
        );
    }

    public get domElement() {
        return this.mainContainer;
    }

    public get isChecked() {
        return this.checked;
    }
}