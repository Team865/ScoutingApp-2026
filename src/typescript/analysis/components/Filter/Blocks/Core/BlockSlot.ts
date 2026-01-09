import Signal from "../../../../../lib/dataTypes/Signal";
import { BlockCore, SetSelectedBlock } from "./BlockCore";
import OperatorBlock from "./OperatorBlock";

type BlockSlotType = "text" | "number" | "boolean" | "list" | "any";

export default class BlockSlot {
    private readonly slotType: BlockSlotType;
    public parent: OperatorBlock;
    public readonly domElement = document.createElement("div");
    private readonly textElement = document.createElement("span");
    public child: BlockCore | null;

    public readonly clicked = new Signal<BlockCore | BlockSlot>();
    private disconnectChildClicked?: () => void;

    constructor(slotType: BlockSlotType) {
        this.slotType = slotType;

        this.textElement.innerText = slotType;
        this.domElement.classList.add("block-input-slot");
        this.textElement.classList.add("type-text");
        this.domElement.addEventListener("click", e => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.domElement.appendChild(this.textElement);
    }

    public addChildBlock(child: BlockCore) {
        if(this.child) this.removeChildBlock(); // Remove pre-existing child block

        this.textElement.remove();
        child.parentSlot = this;
        this.disconnectChildClicked = child.clicked.connect(this.clicked);

        this.domElement.appendChild(child.domElement);
        this.child = child;
    }

    public removeChildBlock() {
        if(!this.child) return;

        this.child.domElement.remove();
        this.child = null;
        this.disconnectChildClicked();
        this.domElement.appendChild(this.textElement);
    }

    public clone(): BlockSlot {
        const clonedSlot = new BlockSlot(this.slotType);

        if(this.child) clonedSlot.addChildBlock(this.child.clone());

        return clonedSlot;
    }
}