import { BlockInterface, BlockType, setBlockHTMLClass, SetSelectedBlock } from "../Core/BlockCore";

export default class FalseBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    
    public readonly mainContainer = document.createElement("span");
    private readonly setSelectedBlock: SetSelectedBlock;

    constructor(setSelectedBlock: SetSelectedBlock) {
        setBlockHTMLClass(this)
        this.setSelectedBlock = setSelectedBlock;
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.mainContainer.innerText = "False";
    }

    public getValueForTeam(teamNumber: number) {
        return false;
    }

    public get domElement() {
        return this.mainContainer;
    }

    public clone(): FalseBlock {
        return new FalseBlock(this.setSelectedBlock);
    }
}