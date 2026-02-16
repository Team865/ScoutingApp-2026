import LabeledInput from "./LabeledInput";

export default class LabeledCheckbox extends LabeledInput {
    constructor(labelText: string, inputFirst?: boolean) {
        super(labelText, inputFirst);

        this.input.type = "checkbox";
    }

    public get isChecked() {
        return this.input.checked;
    }
}