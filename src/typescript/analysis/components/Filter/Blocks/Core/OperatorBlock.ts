import BlockInterface, { BlockType, BlockValueGetter, SetSelectedBlock } from "./BlockInterface";
import BlockSlot from "./BlockSlot";

export default abstract class OperatorBlock implements BlockInterface {
    public abstract readonly type: BlockType;
    public readonly parentSlot?: BlockSlot;

    public abstract get domElement(): HTMLElement;
    public abstract getValueForTeam(teamNumber: number): ReturnType<BlockValueGetter>;
}