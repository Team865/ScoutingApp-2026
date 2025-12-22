import BlockInterface, { BlockType, BlockValueGetter, SetSelectedBlock } from "./Core/BlockInterface";
import BlockSlot from "./Core/BlockSlot";

export default class DataBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    public readonly domElement = document.createElement("span");
    public parentSlot?: BlockSlot;
    private readonly valueGetter: BlockValueGetter;

    constructor(label: string, setSelectedFunction: SetSelectedBlock, valueGetter: BlockValueGetter) {
        this.valueGetter = valueGetter;

        this.domElement.innerText = label;

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedFunction(this);
        });
    }

    public getValueForTeam(teamNumber: number) {
        return this.valueGetter(teamNumber);
    }
}