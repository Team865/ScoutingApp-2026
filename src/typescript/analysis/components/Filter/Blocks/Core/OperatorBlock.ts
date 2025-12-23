import { BlockInterface, BlockType, BlockValueGetter, setBlockHTMLClass, SetSelectedBlock } from "./BlockCore";
import BlockSlot from "./BlockSlot";

export default abstract class OperatorBlock implements BlockInterface {
    public abstract readonly type: BlockType;
    public readonly parentSlot?: BlockSlot;
    protected readonly setSelectedBlock: SetSelectedBlock;
    protected readonly slots: BlockSlot[];

    public constructor(setSelectedBlock: SetSelectedBlock, slots: BlockSlot[]) {
        this.setSelectedBlock = setSelectedBlock;
        
        this.slots = slots;
        slots.forEach(slot => slot.parent = this);
    }

    protected cloneSlots() {
        return this.slots.map(slot => slot.clone());
    }

    public abstract clone(): OperatorBlock;
    public abstract get domElement(): HTMLElement;
    public abstract getValueForTeam(teamNumber: number): ReturnType<BlockValueGetter>;
}