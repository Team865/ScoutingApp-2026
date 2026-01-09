type ConnectionTarget<EmitMessage> = ((emittedMessage: EmitMessage) => void) | Signal<EmitMessage>

export default class Signal<EmitMessage> {
    private connectedFunctions: ((emittedMessage: EmitMessage) => void)[];

    constructor() {
        this.connectedFunctions = [];
    }

    /** Connects a function or Signal to this Signal. 
     * 
     * If the `target` is a function, it will be called whenever this Signal emits a value.
     * 
     * If the `target` is a Signal, any emitted messages from this Signal will propagate to the target Signal.
     * 
     * @param target The `target` to connect this Signal to
     * @returns A function which will disconnect the `target`
     * */
    public connect(target: ConnectionTarget<EmitMessage>) {
        const functionToConnect: (emittedMessage: EmitMessage) => void = (target instanceof Signal) ? (target.emit.bind(target)) : target

        this.connectedFunctions.push(functionToConnect);
        return (() => this.disconnect(functionToConnect));
    }

    public disconnect(target: ConnectionTarget<EmitMessage>) {
        const functionToConnect: (emittedMessage: EmitMessage) => void = (target instanceof Signal) ? (target.emit) : target

        this.connectedFunctions.splice(this.connectedFunctions.indexOf(functionToConnect), 1)
    }

    public emit(messageToEmit: EmitMessage) {
        for(const functionToCall of this.connectedFunctions) {
            (async () => functionToCall(messageToEmit))();
        }
    }
}