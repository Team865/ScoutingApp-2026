import { BlockType, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class DivideBlock extends OperatorBlock {
    public override readonly type = BlockType.MATH;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("number"), 
            new BlockSlot("number")
        ];

        super(slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.classList.add("block-container");

        this.textLabel.innerText = "DIVIDED BY";

        this.mainContainer.append(
            this.slots[0].domElement,
            this.textLabel,
            this.slots[1].domElement
        );
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override getValueForTeam(teamNumber: number) {
        const value1 = this.slots[0].child.getValueForTeam(teamNumber);
        if(typeof value1 !== 'number') return null;
        const value2 = this.slots[1].child.getValueForTeam(teamNumber);
        if(typeof value2 !== 'number') return null;

        return value1 / value2;
    }

    public override clone(): DivideBlock {
        return new DivideBlock(this.cloneSlots());
    }
}