import { BlockType, SetSelectedBlock, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class OrBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(setSelectedBlock: SetSelectedBlock, slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("boolean", setSelectedBlock), 
            new BlockSlot("boolean", setSelectedBlock)
        ];

        super(setSelectedBlock, slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.classList.add("block-container");

        this.textLabel.innerText = "OR";

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

        return value1 || value2;
    }

    override clone(): OrBlock {
        return new OrBlock(this.setSelectedBlock, this.cloneSlots());
    }
}