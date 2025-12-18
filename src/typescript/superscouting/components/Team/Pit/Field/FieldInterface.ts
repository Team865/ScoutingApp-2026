export default interface FieldInterface {
    name: string,
    domElement: HTMLDivElement,
    value: [isIncomplete: boolean, data: any]
}