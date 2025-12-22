import { BlockType, SetSelectedBlock } from "../Core/BlockInterface";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class OrBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");
    public readonly slots: [BlockSlot, BlockSlot];

    public constructor(setSelectedBlock: SetSelectedBlock) {
        super();

        this.slots = [
            new BlockSlot(this, "boolean", setSelectedBlock), 
            new BlockSlot(this, "boolean", setSelectedBlock)
        ];

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
}