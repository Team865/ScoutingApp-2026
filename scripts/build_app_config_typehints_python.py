"""
This script will convert the TypeScript appConfig files to python for provide helpful typehinting.
"""

from pathlib import Path
import re
from typing import Any
from chompjs import chompjs

_project_root = Path(__file__).parent.parent
_ts_app_config_path = _project_root / "src/typescript/appConfig"
_pit_scouting_fields_config_path =  _ts_app_config_path / "PitScoutingFields.ts"
_quantitative_scouting_fields_config_path = _ts_app_config_path / "QuantitativeScoutingFields.ts"
_python_typehint_file_path = _project_root / "src/python/typehinting/ScoutingFields.py"

_fields_list_regex = re.compile(r"(?<=: FieldConfig\[\] = )\[.*\]", re.RegexFlag.DOTALL)
_field_type_stripper = re.compile(r"(?<=FieldType\.).*")

def parse_config_file(config_path: Path) -> list[dict[str, Any]]:
    with config_path.open("r") as file:
        text_data = file.read()
        fields_list_match = _fields_list_regex.search(text_data)
        if(fields_list_match is None):
            raise RuntimeError(f"Failed to parse fields of {config_path.name}")
        
        fields_list_str = fields_list_match.group().replace("\n", "").replace("\t", "")
        fields = chompjs.parse_js_object(fields_list_str)
        
        for field in fields:
            field_type = _field_type_stripper.search(field["type"])

            if(field_type):
                field["type"] = field_type.group()
        
        return fields

# _quantitative_fields = parse_config_file(_quantitative_scouting_fields_config_path)
_pitscouting_fields = parse_config_file(_pit_scouting_fields_config_path)

def typehint_fields(fields_name: str, fields: list[dict[str, Any]]):
    typehint_text = ""
    fields_as_python_tuple = []

    ## Type fields first
    for field_index, field in enumerate(fields):
        typehint_text += f"class _{fields_name}_F{field_index}(TypedDict):\n"
        field_as_python_dict = {}

        for key, value in field.items():
            type_str: str

            if(isinstance(value, list)):
                type_str = f'tuple[{", ".join(f"Literal[{list_item.__repr__()}]" for list_item in value)}]'
                field_as_python_dict[key] = tuple(value)
            else:
                type_str = f'Literal[{value.__repr__()}]'
                field_as_python_dict[key] = value

            typehint_text += f"\t{key}: {type_str}\n"

        fields_as_python_tuple.append(field_as_python_dict)

    typehint_text += f"type {fields_name}_t = tuple[{", ".join([f"_{fields_name}_F{i}" for i in range(len(fields_as_python_tuple))])}]"
    typehint_text += f"\n{fields_name}: tuple[FieldConfig, ...] = "
    typehint_text += f"({", ".join(str(field) for field in fields_as_python_tuple)})"
    return typehint_text

with _python_typehint_file_path.open("wt+") as python_typehint_file:
    python_typehint_file.write("""
__all__ = ["PitScoutingFields", "PitScoutingFields_t"]

from typing import TypedDict, Literal, NotRequired, Union
    """.strip())

    # Typehint field types
    python_typehint_file.write("\n\n")
    python_typehint_file.write("""
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
    """.strip())

    # # Quantitative Scouting Fields
    # python_typehint_file.write("\n\n# Quantitative Scouting Fields\n")
    # python_typehint_file.write(typehint_fields("QuantitativeScoutingFields", _quantitative_fields))

    # Pit Scouting Fields
    python_typehint_file.write("\n\n# Pit Scouting Fields\n")
    python_typehint_file.write(typehint_fields("PitScoutingFields", _pitscouting_fields))