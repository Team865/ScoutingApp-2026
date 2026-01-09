import { BlockCore } from "./BlockCore";
import BlockSlot from "./BlockSlot";

export default abstract class OperatorBlock extends BlockCore {
    protected readonly slots: BlockSlot[];

    public constructor(slots: BlockSlot[]) {
        super();
        
        this.slots = slots;
        slots.forEach(slot => {
            slot.parent = this;
            slot.clicked.connect(this.clicked);
        });
    }

    protected cloneSlots() {
        return this.slots.map(slot => slot.clone());
    }
}