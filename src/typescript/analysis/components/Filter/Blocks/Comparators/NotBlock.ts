import { BlockType, SetSelectedBlock } from "../Core/BlockInterface";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class NotBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");
    public readonly slot: BlockSlot;

    public constructor(setSelectedBlock: SetSelectedBlock) {
        super();

        this.slot = new BlockSlot(this, "boolean", setSelectedBlock);

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.classList.add("block-container");

        this.textLabel.innerText = "NOT";

        this.mainContainer.append(
            this.textLabel,
            this.slot.domElement
        );
    }

    override get domElement() {
        return this.mainContainer;
    }

    override getValueForTeam(teamNumber: number) {
        const value = this.slot.child.getValueForTeam(teamNumber);

        return !value;
    }
}