import { setBlockHTMLClass } from "../Core/BlockCore";
import { BlockInterface, BlockType, SetSelectedBlock } from "../Core/BlockCore";

export default class TrueBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    
    public readonly mainContainer = document.createElement("span");
    private readonly setSelectedBlock: SetSelectedBlock;

    constructor(setSelectedBlock: SetSelectedBlock) {
        setBlockHTMLClass(this);
        this.setSelectedBlock = setSelectedBlock;
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.innerText = "True";
    }

    public getValueForTeam(teamNumber: number) {
        return true;
    }

    public get domElement() {
        return this.mainContainer;
    }

    public clone(): TrueBlock {
        return new TrueBlock(this.setSelectedBlock);
    }
}