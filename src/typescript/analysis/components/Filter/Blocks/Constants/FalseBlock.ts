import { BlockCore, BlockType, setBlockHTMLClass } from "../Core/BlockCore";

export default class FalseBlock extends BlockCore {
    public override readonly type = BlockType.VALUE;
    
    public readonly mainContainer = document.createElement("span");

    constructor() {
        super();
        setBlockHTMLClass(this);
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.clicked.emit(this);
        });

        this.mainContainer.innerText = "False";
    }

    public getValueForTeam(_: number) {
        return false;
    }

    public get domElement() {
        return this.mainContainer;
    }

    public clone(): FalseBlock {
        return new FalseBlock();
    }
}