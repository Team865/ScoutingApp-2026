import { BlockCore, BlockType, BlockValueGetter, setBlockHTMLClass, SetSelectedBlock } from "./Core/BlockCore";
import BlockSlot from "./Core/BlockSlot";

export default class DataBlock extends BlockCore {
    public override readonly type = BlockType.VALUE;
    public override readonly domElement = document.createElement("div");
    private readonly dataNameLabel = document.createElement("span");
    private readonly dataTypeLabel = document.createElement("span");
    private readonly dataType: string;
    private readonly dataName: string;
    private readonly valueGetter: BlockValueGetter;

    constructor(dataType: string, dataName: string, valueGetter: BlockValueGetter) {
        super();
        setBlockHTMLClass(this);
        this.dataType = dataType;
        this.dataName = dataName;
        this.valueGetter = valueGetter;

        this.domElement.classList.add("block-container");
        this.dataTypeLabel.classList.add("data-type");
        this.dataNameLabel.innerText = dataName.replaceAll(" ", "\n");
        this.dataTypeLabel.innerText = dataType;

        this.domElement.append(
            this.dataTypeLabel,
            this.dataNameLabel
        );

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });
    }

    public getValueForTeam(teamNumber: number) {
        return this.valueGetter(teamNumber);
    }

    public clone(): DataBlock {
        const clonedBlock = new DataBlock(
            this.dataType,
            this.dataName,
            this.valueGetter
        );

        return clonedBlock;
    }
}