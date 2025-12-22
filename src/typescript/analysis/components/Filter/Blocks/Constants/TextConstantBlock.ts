import BlockInterface, { BlockType, SetSelectedBlock } from "../Core/BlockInterface";

export default class TextBlock implements BlockInterface {
    public readonly type = BlockType.VALUE;
    
    private readonly mainContainer = document.createElement("div");
    private readonly textLabel = document.createElement("span");
    private readonly input = document.createElement("input");

    constructor(setSelectedBlock: SetSelectedBlock) {
        this.domElement.addEventListener("click", (e) => {
            e.stopPropagation();
            setSelectedBlock(this);
        });

        this.input.addEventListener("click", e => e.stopPropagation());

        this.mainContainer.classList.add("block-container", "horizontal");

        this.textLabel.innerText = "text:";

        this.mainContainer.append(
            this.textLabel,
            this.input
        );
    }

    public getValueForTeam(teamNumber: number) {
        return this.input.value;
    }

    public get domElement() {
        return this.mainContainer;
    }
}