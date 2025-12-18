import FieldInterface from "./FieldInterface.js";

export default class BooleanField implements FieldInterface {
    public name;
    private readonly mainContainer = document.createElement("div");
    private readonly title = document.createElement("label");
    private readonly checkbox = document.createElement("input");

    constructor(teamNumber: number, name: string) {
        this.name = name;

        this.mainContainer.style.display = "flex";
        this.mainContainer.style.flexFlow = "row";
        this.mainContainer.style.alignItems = "center";

        this.checkbox.type = "checkbox";
        this.checkbox.id = `${teamNumber}-${name}`;
        this.title.htmlFor = `${teamNumber}-${name}`;
        this.title.innerText = name;
        this.mainContainer.append(this.checkbox, this.title);
    }
    
    public setValue(value: boolean) {
        this.checkbox.checked = value;
    }

    get value(): [isIncomplete: boolean, data: boolean] {
        return [false, this.checkbox.checked];
    }

    get domElement() {
        return this.mainContainer;
    }
}