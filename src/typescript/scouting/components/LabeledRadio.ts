import LabeledInput from "./LabeledInput";

export default class LabeledRadio extends LabeledInput {
    constructor(labelText: string, radioGroupName: string) {
        super(labelText, true);

        this.input.type = "radio";
        this.input.name = radioGroupName;
    }

    public get isChecked() {
        return this.input.checked;
    }
}