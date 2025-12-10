import Color from "../../dataTypes/Color.js";
import Field, {FieldInstance} from "./FieldInterface.js";

export type ColorFieldParams = {
    header: string, 
    value?: Color
}

export default class ColorField implements Field {
    public id;
    public instanceParams: ColorFieldParams;

    constructor(id: string, instanceParams?: ColorFieldParams) {
        this.id = id;
        this.instanceParams = instanceParams || {
            header: "Color Field: ",
            value: new Color(0)
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

        let value: Color = this.instanceParams.value || new Color(0);

        input.type = "color";
        input.id = this.id;
        input.name = this.id;
        input.value = value.hexString;
        input.style.fontSize = "1rem";
        input.addEventListener("focusout", () => value = Color.fromHexCodeString(input.value));

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        parent.appendChild(fieldDiv);

        return {
            getValue: () => value,
            remove: () => fieldDiv.remove()
        };
    }
}