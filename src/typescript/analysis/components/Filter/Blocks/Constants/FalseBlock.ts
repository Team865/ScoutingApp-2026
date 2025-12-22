import BlockInterface, { BlockType, SetSelectedBlock } from "../Core/BlockInterface";

export default class FalseBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    
    public readonly mainContainer = document.createElement("span");

    constructor(setSelectedBlock: SetSelectedBlock) {
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
}