import { BlockInterface, BlockType, BlockValueGetter, setBlockHTMLClass, SetSelectedBlock } from "./Core/BlockCore";
import BlockSlot from "./Core/BlockSlot";

export default class DataBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    public readonly domElement = document.createElement("span");
    public parentSlot?: BlockSlot;
    private readonly label: string;
    private readonly setSelectedBlock: SetSelectedBlock;
    private readonly valueGetter: BlockValueGetter;

    constructor(label: string, setSelectedFunction: SetSelectedBlock, valueGetter: BlockValueGetter) {
        setBlockHTMLClass(this);
        this.label = label;
        this.setSelectedBlock = setSelectedFunction;
        this.valueGetter = valueGetter;

        this.domElement.innerText = label.replaceAll(" ", "\n");

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedFunction(this);
        });
    }

    public getValueForTeam(teamNumber: number) {
        return this.valueGetter(teamNumber);
    }

    public clone(): DataBlock {
        const clonedBlock = new DataBlock(this.label, this.setSelectedBlock, this.valueGetter);

        return clonedBlock;
    }
}