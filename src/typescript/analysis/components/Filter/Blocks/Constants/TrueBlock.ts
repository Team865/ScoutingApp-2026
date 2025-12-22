import BlockInterface, { BlockType, SetSelectedBlock } from "../Core/BlockInterface";

export default class TrueBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    
    public readonly mainContainer = document.createElement("span");

    constructor(setSelectedBlock: SetSelectedBlock) {
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
}