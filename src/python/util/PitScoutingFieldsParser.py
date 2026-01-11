from typing import Any, TypedDict
from pathlib import Path
from chompjs import chompjs
import re

_pit_scouting_fields_config_path = Path(__file__).parent.parent.parent.parent / Path("src/typescript/appConfig/PitScoutingFields.ts")
_fields_list_regex = re.compile(r"(?<=const PitScoutingFields: FieldConfig\[\] = )\[.*\]", re.RegexFlag.DOTALL)
_field_type_stripper = re.compile(r"(?<=FieldType\.).*")

class _FieldConfig(TypedDict):
    name: str
    type: str

def get_fields() -> list[_FieldConfig]:
    with _pit_scouting_fields_config_path.open("r") as file:
        text_data = file.read()
        fields_list_match = _fields_list_regex.search(text_data)
        if(fields_list_match is None):
            raise RuntimeError("Failed to parse pit scouting fields")
        
        fields_list_str = fields_list_match.group().replace("\n", "").replace("\t", "")
        fields = chompjs.parse_js_object(fields_list_str)
        
        for field in fields:
            field_type = _field_type_stripper.search(field["type"])

            if(field_type):
                field["type"] = field_type.group()
        
        return fields
    
def get_field_value_as_str(field_value: Any) -> str:
    if(isinstance(field_value, list)):
        return ", ".join(field_value)
    elif(field_value is None):
        return ""
    else:
        return str(field_value)