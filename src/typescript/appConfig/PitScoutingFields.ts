import { FieldConfig, FieldType } from "./Field";

const PitScoutingFields: FieldConfig[] = [
    {
        name: "Drivetrain",
        type: FieldType.SINGLE_CHOICE,
        choices: ["Swerve", "Tank", "Mechanum", "Kitbot"]
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
        name: "Autos",
        type: FieldType.TEXT
    },
    {
        name: "Shooter Type",
        type: FieldType.SINGLE_CHOICE,
        choices: [
            "Small Drum", 
            "Wide Drum",
            "Single Turret", 
            "Dual Turret",
            "Single Fixed",
            "Double Fixed",
            "Triple Fixed",
            "Quadruple Fixed",
        ]
    },
    {
        name: "Adjustable Hood?",
        type: FieldType.BOOLEAN
    },
    {
        name: "Traversal",
        type: FieldType.MULTIPLE_CHOICE,
        choices: ["Bump", "Trench"]
    },
    {
        name: "Shoot On The Move?",
        type: FieldType.BOOLEAN
    },
    {
        name: "Climb",
        type: FieldType.MULTIPLE_CHOICE,
        choices: ["L1", "L2", "L3"]
    },
    {
        name: "Driver Experience",
        type: FieldType.TEXT
    },
    {
        name: "Mechanical Rating",
        type: FieldType.NUMBER_RANGE,
        min: 0,
        max: 10
    },
    {
        name: "Additional Comments",
        type: FieldType.TEXT
    }
]

export default PitScoutingFields;