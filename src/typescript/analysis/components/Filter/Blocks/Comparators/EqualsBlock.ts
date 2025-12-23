import { BlockType, SetSelectedBlock, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class EqualsBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(setSelectedBlock: SetSelectedBlock, slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("any", setSelectedBlock), 
            new BlockSlot("any", setSelectedBlock)
        ];

        super(setSelectedBlock, slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.classList.add("block-container", "horizontal");

        this.textLabel.innerText = "==";

        this.mainContainer.append(
            this.slots[0].domElement,
            this.textLabel,
            this.slots[1].domElement
        );
    }

    override get domElement() {
        return this.mainContainer;
    }

    override getValueForTeam(teamNumber: number) {
        const value1 = this.slots[0].child.getValueForTeam(teamNumber);
        const value2 = this.slots[1].child.getValueForTeam(teamNumber);

        return value1 === value2;
    }

    override clone(): EqualsBlock {
        return new EqualsBlock(this.setSelectedBlock, this.cloneSlots());
    }
}