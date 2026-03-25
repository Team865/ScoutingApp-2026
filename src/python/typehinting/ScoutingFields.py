__all__ = ["PitScoutingFields", "PitScoutingFields_t"]

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

# Pit Scouting Fields
class _PitScoutingFields_F0(TypedDict):
	name: Literal['Drivetrain']
	type: Literal['SINGLE_CHOICE']
	choices: tuple[Literal['Swerve'], Literal['Tank'], Literal['Mechanum'], Literal['Kitbot']]
class _PitScoutingFields_F1(TypedDict):
	name: Literal['Robot Size']
	type: Literal['TEXT']
class _PitScoutingFields_F2(TypedDict):
	name: Literal['/w Bumpers?']
	type: Literal['BOOLEAN']
class _PitScoutingFields_F3(TypedDict):
	name: Literal['Autos']
	type: Literal['TEXT']
class _PitScoutingFields_F4(TypedDict):
	name: Literal['Shooter Type']
	type: Literal['SINGLE_CHOICE']
	choices: tuple[Literal['Small Drum'], Literal['Single Turret'], Literal['Dual Turret'], Literal['Single Fixed'], Literal['Double Fixed'], Literal['Triple Fixed'], Literal['Quadruple Fixed']]
class _PitScoutingFields_F5(TypedDict):
	name: Literal['Adjustable Hood?']
	type: Literal['BOOLEAN']
class _PitScoutingFields_F6(TypedDict):
	name: Literal['Traversal']
	type: Literal['MULTIPLE_CHOICE']
	choices: tuple[Literal['Bump'], Literal['Trench']]
class _PitScoutingFields_F7(TypedDict):
	name: Literal['Shoot On The Move?']
	type: Literal['BOOLEAN']
class _PitScoutingFields_F8(TypedDict):
	name: Literal['Climb']
	type: Literal['MULTIPLE_CHOICE']
	choices: tuple[Literal['L1'], Literal['L2'], Literal['L3']]
class _PitScoutingFields_F9(TypedDict):
	name: Literal['Driver Experience']
	type: Literal['TEXT']
class _PitScoutingFields_F10(TypedDict):
	name: Literal['Mechanical Rating']
	type: Literal['NUMBER_RANGE']
	min: Literal[0]
	max: Literal[10]
class _PitScoutingFields_F11(TypedDict):
	name: Literal['Additional Comments']
	type: Literal['TEXT']
type PitScoutingFields_t = tuple[_PitScoutingFields_F0, _PitScoutingFields_F1, _PitScoutingFields_F2, _PitScoutingFields_F3, _PitScoutingFields_F4, _PitScoutingFields_F5, _PitScoutingFields_F6, _PitScoutingFields_F7, _PitScoutingFields_F8, _PitScoutingFields_F9, _PitScoutingFields_F10, _PitScoutingFields_F11]
PitScoutingFields: tuple[FieldConfig, ...] = ({'name': 'Drivetrain', 'type': 'SINGLE_CHOICE', 'choices': ('Swerve', 'Tank', 'Mechanum', 'Kitbot')}, {'name': 'Robot Size', 'type': 'TEXT'}, {'name': '/w Bumpers?', 'type': 'BOOLEAN'}, {'name': 'Autos', 'type': 'TEXT'}, {'name': 'Shooter Type', 'type': 'SINGLE_CHOICE', 'choices': ('Small Drum', 'Single Turret', 'Dual Turret', 'Single Fixed', 'Double Fixed', 'Triple Fixed', 'Quadruple Fixed')}, {'name': 'Adjustable Hood?', 'type': 'BOOLEAN'}, {'name': 'Traversal', 'type': 'MULTIPLE_CHOICE', 'choices': ('Bump', 'Trench')}, {'name': 'Shoot On The Move?', 'type': 'BOOLEAN'}, {'name': 'Climb', 'type': 'MULTIPLE_CHOICE', 'choices': ('L1', 'L2', 'L3')}, {'name': 'Driver Experience', 'type': 'TEXT'}, {'name': 'Mechanical Rating', 'type': 'NUMBER_RANGE', 'min': 0, 'max': 10}, {'name': 'Additional Comments', 'type': 'TEXT'})