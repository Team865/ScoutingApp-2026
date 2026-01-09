import { BlockType, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class NotBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");

    public constructor(slot?: BlockSlot) {
        slot = slot || new BlockSlot("boolean");

        super([slot]);
        setBlockHTMLClass(this);

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.classList.add("block-container");

        this.textLabel.innerText = "NOT";

        this.mainContainer.append(
            this.textLabel,
            this.slots[0].domElement
        );
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override getValueForTeam(teamNumber: number) {
        const value = this.slots[0].child.getValueForTeam(teamNumber);

        return !value;
    }

    public override clone() {
        return new NotBlock(this.slots[0].clone());
    }
}