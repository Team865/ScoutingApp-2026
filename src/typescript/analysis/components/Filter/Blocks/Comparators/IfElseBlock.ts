import { BlockType, SetSelectedBlock, setBlockHTMLClass } from "../Core/BlockCore";
import BlockSlot from "../Core/BlockSlot";
import OperatorBlock from "../Core/OperatorBlock";

export default class IfElseBlock extends OperatorBlock {
    public override readonly type = BlockType.COMPARATOR;

    private readonly mainContainer = document.createElement("div");
    private readonly ifLabel = document.createElement("span");
    private readonly thenLabel = document.createElement("span");
    private readonly elseLabel = document.createElement("span");

    public constructor(setSelectedBlock: SetSelectedBlock, slots?: BlockSlot[]) {
        slots = slots || [
            new BlockSlot("boolean", setSelectedBlock),
            new BlockSlot("any", setSelectedBlock),
            new BlockSlot("any", setSelectedBlock)
        ];

        super(setSelectedBlock, slots);
        setBlockHTMLClass(this)

        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.classList.add("block-container");

        this.ifLabel.innerText = "IF";
        this.thenLabel.innerText = "THEN USE";
        this.elseLabel.innerText = "ELSE USE";

        this.mainContainer.append(
            this.ifLabel,
            this.slots[0].domElement,
            this.thenLabel,
            this.slots[1].domElement,
            this.elseLabel,
            this.slots[2].domElement
        );
    }

    override get domElement() {
        return this.mainContainer;
    }

    override getValueForTeam(teamNumber: number) {
        const conditionPassed = this.slots[0].child.getValueForTeam(teamNumber);

        return conditionPassed ? 
            this.slots[1].child.getValueForTeam(teamNumber) :
            this.slots[2].child.getValueForTeam(teamNumber);
    }

    override clone(): IfElseBlock {
        return new IfElseBlock(this.setSelectedBlock, this.cloneSlots());
    }
}