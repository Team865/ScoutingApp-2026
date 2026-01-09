import { BlockType, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class ExistsBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(slot?: BlockSlot) {
        slot = slot || new BlockSlot("any");

        super([slot]);
        setBlockHTMLClass(this);

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.classList.add("block-container", "horizontal");

        this.textLabel.innerText = "EXISTS?";

        this.mainContainer.append(
            this.slots[0].domElement,
            this.textLabel
        );
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override getValueForTeam(teamNumber: number) {
        const value = this.slots[0].child.getValueForTeam(teamNumber);

        return (value !== undefined) && (value !== null);
    }

    public override clone() {
        return new ExistsBlock(this.slots[0].clone());
    }
}