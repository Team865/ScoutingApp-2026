export default class Signal<EmitMessage> {
    private connectedFunctions: ((emittedMessage: EmitMessage) => void)[];

    constructor() {
        this.connectedFunctions = [];
    }

    public connect(functionToConnect: (emittedMessage: EmitMessage) => void) {
        this.connectedFunctions.push(functionToConnect);
        return {
            disconnect: () => this.connectedFunctions.splice(
                this.connectedFunctions.indexOf(functionToConnect), 1)
        };
    }

    public emit(messageToEmit: EmitMessage) {
        for(const functionToCall of this.connectedFunctions) {
            (async () => functionToCall(messageToEmit))();
        }
    }
}