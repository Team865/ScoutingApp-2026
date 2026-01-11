from typing import Any, TypedDict
from pathlib import Path
from chompjs import chompjs
import re

_ts_app_config_path = Path(__file__).parent.parent.parent.parent / "src/typescript/appConfig"
_pit_scouting_fields_config_path =  _ts_app_config_path / "PitScoutingFields.ts"
_quantitative_scouting_fields_config_path = _ts_app_config_path / "QuantitativeScoutingFields.ts"
_fields_list_regex = re.compile(r"(?<=: FieldConfig\[\] = )\[.*\]", re.RegexFlag.DOTALL)
_field_type_stripper = re.compile(r"(?<=FieldType\.).*")
    
def get_field_value_as_str(field_value: Any) -> str:
    if(isinstance(field_value, list)):
        return ", ".join(field_value)
    elif(field_value is None):
        return ""
    else:
        return str(field_value)