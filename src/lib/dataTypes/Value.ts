import Signal from "./Signal.js";

export class Value<T> {
    private currentValue;
    private onChangeEvent: Signal<T>;

    constructor(initialValue?: T) {
        this.currentValue = initialValue || null;
        this.onChangeEvent = new Signal();
    }

    /** Returns true if the new value was different */
    public set(newValue: T | null): boolean {
        if(this.currentValue === newValue)
            return false;

        this.currentValue = newValue;
        this.onChangeEvent.emit(newValue);
        return true;
    }

    public get get() {
        return this.currentValue;
    }

    public get onChange() {
        return this.onChangeEvent;
    }
}