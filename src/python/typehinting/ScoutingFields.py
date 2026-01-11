__all__ = ["QuantitativeScoutingFields", "QuantitativeScoutingFields_t", "PitScoutingFields", "PitScoutingFields_t"]

from typing import TypedDict, Literal, NotRequired, Union

class FieldsConfigBase(TypedDict):
	name: str
	isOptional: NotRequired[bool]

class FieldConfigPartial1(FieldsConfigBase):
    type: Literal["BOOLEAN", "TEXT", "NUMBER"]

class FieldConfigPartial2(FieldsConfigBase):
    type: Literal["NUMBER_RANGE"]
    min: int
    max: int

class FieldConfigPartial3(FieldsConfigBase):
    type: Literal["SINGLE_CHOICE", "MULTIPLE_CHOICE"]
    choices: tuple[str, ...]

type FieldConfig = Union[FieldConfigPartial1, FieldConfigPartial2, FieldConfigPartial3]

# Quantitative Scouting Fields
type QuantitativeScoutingFields_t = tuple[]
QuantitativeScoutingFields: tuple[FieldConfig, ...] = ()

# Pit Scouting Fields
class _PitScoutingFields_F0(TypedDict):
	name: Literal['Drivetrain']
	type: Literal['SINGLE_CHOICE']
	choices: tuple[Literal['Swerve'], Literal['Westcoast'], Literal['Mechanum'], Literal['Kitbot']]
class _PitScoutingFields_F1(TypedDict):
	name: Literal['Robot Size']
	type: Literal['TEXT']
class _PitScoutingFields_F2(TypedDict):
	name: Literal['/w Bumpers?']
	type: Literal['BOOLEAN']
class _PitScoutingFields_F3(TypedDict):
	name: Literal['Coral Scoring Locations']
	type: Literal['MULTIPLE_CHOICE']
	choices: tuple[Literal['L1'], Literal['L2'], Literal['L3'], Literal['L4']]
class _PitScoutingFields_F4(TypedDict):
	name: Literal['Driveteam Experience']
	type: Literal['TEXT']
class _PitScoutingFields_F5(TypedDict):
	name: Literal['Mechanical Rating']
	type: Literal['NUMBER_RANGE']
	min: Literal[0]
	max: Literal[10]
class _PitScoutingFields_F6(TypedDict):
	name: Literal['Electrical Rating']
	type: Literal['NUMBER_RANGE']
	min: Literal[0]
	max: Literal[10]
type PitScoutingFields_t = tuple[_PitScoutingFields_F0, _PitScoutingFields_F1, _PitScoutingFields_F2, _PitScoutingFields_F3, _PitScoutingFields_F4, _PitScoutingFields_F5, _PitScoutingFields_F6]
PitScoutingFields: tuple[FieldConfig, ...] = ({'name': 'Drivetrain', 'type': 'SINGLE_CHOICE', 'choices': ('Swerve', 'Westcoast', 'Mechanum', 'Kitbot')}, {'name': 'Robot Size', 'type': 'TEXT'}, {'name': '/w Bumpers?', 'type': 'BOOLEAN'}, {'name': 'Coral Scoring Locations', 'type': 'MULTIPLE_CHOICE', 'choices': ('L1', 'L2', 'L3', 'L4')}, {'name': 'Driveteam Experience', 'type': 'TEXT'}, {'name': 'Mechanical Rating', 'type': 'NUMBER_RANGE', 'min': 0, 'max': 10}, {'name': 'Electrical Rating', 'type': 'NUMBER_RANGE', 'min': 0, 'max': 10})