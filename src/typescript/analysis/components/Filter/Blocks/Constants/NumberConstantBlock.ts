import { BlockCore, BlockType, setBlockHTMLClass } from "../Core/BlockCore";

export default class NumberBlock extends BlockCore {
    public override readonly type = BlockType.VALUE;
    
    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");
    private readonly input = document.createElement("input");

    constructor(startingValue?: string) {
        super();
        setBlockHTMLClass(this);
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.input.addEventListener("click", e => e.stopPropagation());

        this.mainContainer.classList.add("block-container", "horizontal");

        this.input.type = "number";
        this.input.value = startingValue || "";
        this.textLabel.innerText = "number:";

        this.mainContainer.append(
            this.textLabel,
            this.input
        );
    }

    public override getValueForTeam(_: number) {
        return Number.parseFloat(this.input.value);
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override clone(): NumberBlock {
        return new NumberBlock(this.input.value);
    }
}