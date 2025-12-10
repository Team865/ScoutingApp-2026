export interface FieldInstance {
    getValue: () => any,
    remove: () => any
}

export default interface Field {
    id: string;
    instanceParams: any

    instance(parent: HTMLElement): FieldInstance;
}