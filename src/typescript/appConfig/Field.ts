export enum FieldType {
    BOOLEAN,
    TEXT,
    NUMBER,
    NUMBER_RANGE,
    SINGLE_CHOICE,
    MULTIPLE_CHOICE
}

export type FieldConfig = {
    name: string,
    isOptional?: boolean
} & ({
    type: FieldType.BOOLEAN | FieldType.TEXT | FieldType.NUMBER
} | {
    type: FieldType.NUMBER_RANGE,
    min: number,
    max: number
} | {
    type: FieldType.SINGLE_CHOICE | FieldType.MULTIPLE_CHOICE,
    choices: string[]
})