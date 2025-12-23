import BlockSlot from "./BlockSlot";

export enum BlockType {
    COMPARATOR,
    MATH,
    VALUE
}

export type SetSelectedBlock = (newSelection: BlockInterface | BlockSlot | null) => void;
export type BlockValueGetter = (teamNumber: number) => string | number | boolean | any[] | null;

export function setBlockHTMLClass(block: BlockInterface) {
    switch(block.type) {
        case BlockType.COMPARATOR:
            block.domElement.classList.add("comparator-block");
            break
        case BlockType.MATH:
            block.domElement.classList.add("math-block");
            break
        case BlockType.VALUE:
            block.domElement.classList.add("value-block");
            break
    }
}

export interface BlockInterface {
    type: BlockType;
    domElement: HTMLElement;
    parentSlot?: BlockSlot;
    getValueForTeam: BlockValueGetter;
    clone: () => BlockInterface;
}