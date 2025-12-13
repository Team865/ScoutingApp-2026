import Field, {FieldInstance} from "./FieldInterface.js";

export type TextFieldParams = {
    header: string, 
    value?: string, 
    placeholderText?: string
}

export default class TextField implements Field {
    public id;
    public instanceParams: TextFieldParams;

    constructor(id: string, instanceParams?: TextFieldParams) {
        this.id = id;
        this.instanceParams = instanceParams || {
            header: "Text Field",
            value: ""
        };
    }

    public instance(parent: HTMLElement): FieldInstance {
        const fieldDiv = document.createElement("div")
        const label = document.createElement("label");
        const input = document.createElement("input");
        fieldDiv.style.display = "inline-block";
        fieldDiv.style.margin = "0 auto";

        label.htmlFor = this.id;
        label.innerText = this.instanceParams.header;
        label.style.fontSize = "1rem";

        let value = this.instanceParams.value || "";
        const placeholderText = this.instanceParams.placeholderText || null

        input.type = "text";
        input.id = this.id;
        input.name = this.id;
        input.value = value;
        input.placeholder = placeholderText;
        input.style.fontSize = "1rem";
        input.addEventListener("input", () => value = input.value);

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        parent.appendChild(fieldDiv);

        return {
            getValue: () => value,
            remove: () => fieldDiv.remove()
        };
    }
}