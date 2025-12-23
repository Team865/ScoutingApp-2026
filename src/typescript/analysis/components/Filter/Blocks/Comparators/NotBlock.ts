import { BlockType, SetSelectedBlock, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class NotBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(setSelectedBlock: SetSelectedBlock, slot?: BlockSlot) {
        slot = slot || new BlockSlot("boolean", setSelectedBlock);

        super(setSelectedBlock, [slot]);
        setBlockHTMLClass(this);

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.classList.add("block-container");

        this.textLabel.innerText = "NOT";

        this.mainContainer.append(
            this.textLabel,
            this.slots[0].domElement
        );
    }

    override get domElement() {
        return this.mainContainer;
    }

    override getValueForTeam(teamNumber: number) {
        const value = this.slots[0].child.getValueForTeam(teamNumber);

        return !value;
    }

    override clone() {
        return new NotBlock(this.setSelectedBlock, this.slots[0].clone());
    }
}