import { BlockType, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class EqualsBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("any"), 
            new BlockSlot("any")
        ];

        super(slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.classList.add("block-container", "horizontal");

        this.textLabel.innerText = "==";

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
        const value2 = this.slots[1].child.getValueForTeam(teamNumber);

        return value1 === value2;
    }

    public override clone(): EqualsBlock {
        return new EqualsBlock(this.cloneSlots());
    }
}