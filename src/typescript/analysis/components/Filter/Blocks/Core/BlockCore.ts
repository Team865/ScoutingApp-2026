import Signal from "../../../../../lib/dataTypes/Signal";
import BlockSlot from "./BlockSlot";

export enum BlockType {
    COMPARATOR,
    MATH,
    VALUE
}

export type SetSelectedBlock = (newSelection: BlockCore | BlockSlot | null) => void;
export type BlockValueGetter = (teamNumber: number) => (string | number | boolean | any[] | null);

export function setBlockHTMLClass(block: BlockCore) {
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

export abstract class BlockCore {
    public abstract readonly type: BlockType;
    public abstract get domElement(): HTMLElement;
    public parentSlot?: BlockSlot;
    public readonly clicked = new Signal<BlockCore | BlockSlot>();
    public abstract getValueForTeam(teamNumber: number): ReturnType<BlockValueGetter>;
    public abstract clone(): BlockCore;
}