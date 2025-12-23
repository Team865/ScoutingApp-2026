import { BlockInterface, SetSelectedBlock } from "../components/Filter/Blocks/Core/BlockCore";
import { BlockProducer } from "../components/Filter/Blocks/Core/BlockProducer";
import BlockSlot from "../components/Filter/Blocks/Core/BlockSlot";

type Action = {
    type: "add",
    blockAdded: BlockInterface,
    parent: BlockSlot | null
} | {
    type: "remove",
    blockRemoved: BlockInterface,
    parent: BlockSlot | null
} | {
    type: "replace",
    originalBlock: BlockInterface,
    newBlock: BlockInterface
}

export class HistoryManager {
    private readonly maximumHistoryLength: number;
    private setSelectedBlock: SetSelectedBlock;

    // History(s) have to be private because they are mutable.
    // The history(s) are mutable because it is faster to just replace the
    // array instead of editting it in place
    // Editting it place with push() can also overflow the stack for some reason
    private internalPastActions: Action[] = [];
    private internalFutureActions: Action[] = [];

    /** 
     * `maximumHistoryLength` is how many actions can be
     *  recorded before the past starts getting truncated. 
    */
    constructor(maximumHistoryLength: number, setSelectedBlock: SetSelectedBlock) {
        this.maximumHistoryLength = maximumHistoryLength;
        this.setSelectedBlock = setSelectedBlock;
    }

    public actionCommitted(action: Action) {
        // Theoretically previousHistory should never exceed maximumHistoryLength
        // but this will just use greater or equal to anyway just in case
        if(this.internalPastActions.length >= this.maximumHistoryLength) {
            this.internalPastActions = [...this.internalPastActions.slice(1).concat(action)];
        } else {
            this.internalPastActions.push(action);
        }

        if(this.internalFutureActions.length > 0) 
            this.internalFutureActions = [];
    }

    public undo() {
        const action = this.internalPastActions.pop();
        this.internalFutureActions.push(action);

        switch(action.type) {
            case "add":
                if(action.parent) {
                    action.parent.removeChildBlock();
                } else {
                    action.blockAdded.domElement.remove();
                    BlockProducer.setTopLevelBlock(null);
                }

                this.setSelectedBlock(null);
                break;
            case "remove":
                if(action.parent) { // Non-top-level block
                    if(action.parent.child)
                        action.parent.removeChildBlock();
                    action.parent.addChildBlock(action.blockRemoved);
                } else {
                    // There must currently be no top-level blocks
                    BlockProducer.setTopLevelBlock(action.blockRemoved);
                }
                
                this.setSelectedBlock(action.blockRemoved);
                break;
            case "replace":
                const parentSlot = action.newBlock.parentSlot;
                if(parentSlot) {
                    parentSlot.removeChildBlock();
                    parentSlot.addChildBlock(action.originalBlock);
                } else {
                    action.newBlock.domElement.remove();
                    BlockProducer.setTopLevelBlock(action.originalBlock);
                }
                
                this.setSelectedBlock(action.originalBlock);
                break;
        }
    }
    public redo() {
        const action = this.internalFutureActions.pop();
        this.internalPastActions.push(action);

        switch(action.type) {
            case "add":
                if(action.parent) { // Non-top-level block
                    if(action.parent.child)
                        action.parent.removeChildBlock();
                    action.parent.addChildBlock(action.blockAdded);
                } else {
                    // There must currently be no top-level blocks
                    BlockProducer.setTopLevelBlock(action.blockAdded);
                }

                this.setSelectedBlock(action.blockAdded);
                break;
            case "remove":
                if(action.parent) {
                    action.parent.removeChildBlock();
                } else {
                    action.blockRemoved.domElement.remove();
                    BlockProducer.setTopLevelBlock(null);
                }

                this.setSelectedBlock(null);
                break;
            case "replace":
                const parentSlot = action.originalBlock.parentSlot;
                if(parentSlot) {
                    parentSlot.removeChildBlock();
                    parentSlot.addChildBlock(action.newBlock);
                } else {
                    action.originalBlock.domElement.remove();
                    BlockProducer.setTopLevelBlock(action.newBlock);
                }
                
                this.setSelectedBlock(action.newBlock);
                break;
        }
    }

    public get pastActions() {
        return this.internalPastActions;
    }

    public get futureActions() {
        return this.internalFutureActions;
    }
}