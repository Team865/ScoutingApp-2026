export default class Signal<EmitArgument> {
    private connectedFunctions: ((EmitArgument) => void)[];

    constructor() {
        this.connectedFunctions = [];
    }

    public connect(functionToConnect: (EmitArgument) => void) {
        this.connectedFunctions.push(functionToConnect);
        return {
            disconnect: () => this.connectedFunctions.splice(
                this.connectedFunctions.indexOf(functionToConnect), 1)
        };
    }

    public emit(emittedArgument: EmitArgument) {
        for(const functionToCall of this.connectedFunctions) {
            (async () => functionToCall(emittedArgument))();
        }
    }
}