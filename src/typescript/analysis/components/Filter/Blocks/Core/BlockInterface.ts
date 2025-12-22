import BlockSlot from "./BlockSlot";

export enum BlockType {
    COMPARATOR,
    MATH,
    VALUE
}

export type SetSelectedBlock = (newSelection: BlockInterface | BlockSlot | null) => void;
export type BlockValueGetter = (teamNumber: number) => string | number | boolean | any[] | null;

export default interface BlockInterface {
    type: BlockType;
    domElement: HTMLElement;
    parentSlot?: BlockSlot;
    getValueForTeam: BlockValueGetter;
}