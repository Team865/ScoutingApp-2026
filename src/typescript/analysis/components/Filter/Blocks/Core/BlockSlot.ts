import { BlockInterface, SetSelectedBlock } from "./BlockCore";
import OperatorBlock from "./OperatorBlock";

type BlockSlotType = "text" | "number" | "boolean" | "list" | "any";

export default class BlockSlot {
    private readonly slotType: BlockSlotType;
    private readonly setSelectedBlock: SetSelectedBlock;
    public parent: OperatorBlock;
    public readonly domElement = document.createElement("div");
    private readonly textElement = document.createElement("span");
    public child: BlockInterface | null;

    constructor(slotType: BlockSlotType, setSelectedBlock: SetSelectedBlock) {
        this.slotType = slotType;
        this.setSelectedBlock = setSelectedBlock;

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

    public removeChildBlock() {
        if(!this.child) return;

        this.child.domElement.remove();
        this.child = null;
        this.domElement.appendChild(this.textElement);
    }

    public clone(): BlockSlot {
        const clonedSlot = new BlockSlot(this.slotType, this.setSelectedBlock);

        if(this.child) clonedSlot.addChildBlock(this.child.clone());

        return clonedSlot;
    }
}