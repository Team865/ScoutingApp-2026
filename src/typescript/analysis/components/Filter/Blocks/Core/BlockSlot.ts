import BlockInterface, { SetSelectedBlock } from "./BlockInterface";
import OperatorBlock from "./OperatorBlock";

type BlockSlotType = "text" | "number" | "boolean" | "array" | "any";

export default class BlockSlot {
    public readonly parent: OperatorBlock;
    public readonly domElement = document.createElement("div");
    private readonly textElement = document.createElement("span");
    public child: BlockInterface | null;

    constructor(parent: OperatorBlock, slotType: BlockSlotType, setSelectedBlock: SetSelectedBlock) {
        this.textElement.innerText = slotType;
        this.domElement.classList.add("block-input-slot");
        this.textElement.classList.add("type-text");
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.domElement.appendChild(this.textElement);
    }

    public addChildBlock(child: BlockInterface) {
        this.textElement.remove();
        child.parentSlot = this;
        this.domElement.appendChild(child.domElement);
        this.child = child;
    }

    public removeChildBlock(child: BlockInterface) {
        child.domElement.remove();
        this.child = null;
        this.domElement.appendChild(this.textElement);
    }
}