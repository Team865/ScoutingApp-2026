import { BlockType, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class MaxBlock extends OperatorBlock {
    public override readonly type = BlockType.MATH;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("list")
        ];

        super(slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.classList.add("block-container", "horizontal");

        this.textLabel.innerText = "MAX OF";

        this.mainContainer.append(
            this.textLabel,
            this.slots[0].domElement
        );
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override getValueForTeam(teamNumber: number) {
        const array = this.slots[0].child.getValueForTeam(teamNumber) as number[];
        if(array === undefined || array === null) return null;

        return Math.max(...array);
    }

    public override clone(): MaxBlock {
        return new MaxBlock(this.cloneSlots());
    }
}