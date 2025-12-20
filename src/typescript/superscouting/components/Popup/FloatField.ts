import Field, {FieldInstance} from "./FieldInterface";

export type FloatFieldParams = {
    header: string, 
    value?: number, 
    placeholderText?: string
}

export default class FloatField implements Field {
    public id;
    public instanceParams: FloatFieldParams;

    constructor(id: string, instanceParams?: FloatFieldParams) {
        this.id = id;
        this.instanceParams = instanceParams || {
            header: "Number Field: ",
            value: 0
        };
    }

    public validateInput(input: string): string {
        if(Number.isNaN(input)) return "0";

        return Number.parseFloat(input).toString();
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

        let value: number = this.instanceParams.value || 0;
        const placeholderText = this.instanceParams.placeholderText || null

        input.type = "number";
        input.id = this.id;
        input.name = this.id;
        input.value = value.toString();
        input.placeholder = placeholderText;
        input.style.fontSize = "1rem";
        input.addEventListener("focusout", () => {
            input.value = this.validateInput(input.value);
            value = Number.parseFloat(input.value);
        });

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        parent.appendChild(fieldDiv);

        return {
            getValue: () => value,
            remove: () => fieldDiv.remove()
        };
    }
}