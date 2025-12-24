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
    type: FieldType,
    isOptional?: boolean,
    [key: string]: unknown
}

const PitScoutingFields: FieldConfig[] = [
    {
        name: "Drivetrain",
        type: FieldType.SINGLE_CHOICE,
        choices: ["Swerve", "Westcoast", "Mechanum", "Kitbot"]
    },
    {
        name: "Robot Size",
        type: FieldType.TEXT
    },
    {
        name: "/w Bumpers?",
        type: FieldType.BOOLEAN,
    },
    {
        name: "Coral Scoring Locations",
        type: FieldType.MULTIPLE_CHOICE,
        choices: ["L1", "L2", "L3", "L4"]
    },
    {
        name: "Driveteam Experience",
        type: FieldType.TEXT
    },
    {
        name: "Mechanical Rating",
        type: FieldType.NUMBER_RANGE,
        min: 0,
        max: 10
    },
    {
        name: "Electrical Rating",
        type: FieldType.NUMBER_RANGE,
        min: 0,
        max: 10
    }
]

export default PitScoutingFields;