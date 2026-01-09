import { setBlockHTMLClass } from "../Core/BlockCore";
import { BlockCore, BlockType } from "../Core/BlockCore";

export default class TrueBlock extends BlockCore {
    public override readonly type: BlockType = BlockType.VALUE;

    public readonly mainContainer = document.createElement("span");

    constructor() {
        super();
        setBlockHTMLClass(this);
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.innerText = "True";
    }

    public override getValueForTeam(_: number) {
        return true;
    }

    public override get domElement() {
        return this.mainContainer;
    }

    public override clone(): TrueBlock {
        return new TrueBlock();
    }
}