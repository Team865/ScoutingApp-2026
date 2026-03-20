from pathlib import Path
import re
from typing import Literal, Mapping, Optional, Self

_project_root = Path(__file__).parent.parent
_scouting_app_data_path = _project_root / "src/typescript/scouting/AppData.ts"
_typehinting_directory = _project_root / "src/python/typehinting"

_prop_name_regex = re.compile(r"[a-zA-Z](\S)+(?=:)")
_comment_regex = re.compile(r"//\s\b.+?\b\s*\n")
_bloat_regex = re.compile(r"(\s\s+|\n)")
_whitespace_regex = re.compile(r"\s")
_alphabetic_character_regex = re.compile(r"\w")
_word_regex = re.compile(r"\w+")

_ts_type_to_python_type_str: Mapping[str, str] = {
    "string": "str",
    "number": "int | float",
    "boolean": "bool",
}

class TypedObjectTS:
    properties: list[tuple[str, str | Self]]

    def __init__(self) -> None:
        self.properties = []

    def add_property(self, property_name: str, property_type: str | Self):
        self.properties.append((property_name, property_type))

    def get_typed_dict_str(self, name: str):
        main_dict_str: str = f"class {name}(TypedDict):"
        additional_dicts_str: str = ""

        for property_name, property_type in self.properties:
            property_type_py_str: str

            if(isinstance(property_type, TypedObjectTS)):
                property_type_py_str = f"_{name}_{property_name}"
                additional_dicts_str += property_type.get_typed_dict_str(property_type_py_str)
            else:
                property_type_py_str = (
                    _ts_type_to_python_type_str[property_type] if 
                    property_type in _ts_type_to_python_type_str
                    else
                    property_type
                )

            main_dict_str += f"\n    {property_name}: {property_type_py_str}"

        return additional_dicts_str + "\n\n" + main_dict_str

def starting_index_of_word(text: str, target_word: str, start_index: int = 0, end_index: Optional[int] = None) -> Optional[int]:
    end_index = end_index or len(target_word)
    text_letter_index = start_index
    word_letter_index = 0
    word_length = len(target_word)
    text_length = len(text)

    while text_letter_index < text_length:
        target_letter = target_word[word_letter_index]
        current_letter = text[text_letter_index]

        if(target_letter == current_letter):
            word_letter_index += 1

            if(word_letter_index >= word_length):
                return text_letter_index - word_length + 1
        else:
            word_letter_index = 0

        text_letter_index += 1

    return None

def get_ts_app_data_typedef(file_path: Path, type_name: str) -> str:
    with file_path.open("r") as file:
        text_data = file.read()
        starting_index = starting_index_of_word(text_data, type_name)
        if(starting_index is None): raise Exception(f"Could not find type '{type_name}' in file {file_path.as_posix()}")
        current_index = starting_index

        # Increment until you find the first open brace
        while text_data[current_index] != "{": current_index += 1
        current_index += 1

        num_open_brace = 1
        num_closed_brace = 0

        while num_open_brace > num_closed_brace:
            current_letter = text_data[current_index]

            if(current_letter == "{"):
                num_open_brace += 1
            elif(current_letter == "}"):
                num_closed_brace += 1

            current_index += 1

        return text_data[starting_index:current_index]

def parse_object_str(ts_object_type: str, starting_index: int) -> tuple[TypedObjectTS, int]:
    # Find an opening brace first
    current_index = starting_index

    ts_object = TypedObjectTS()

    while current_index < len(ts_object_type):
        # Find a property
        property_name_match = _prop_name_regex.search(ts_object_type, current_index)

        if(property_name_match is None): break

        current_index = property_name_match.end() + 1

        # Find the type of the property
        while _whitespace_regex.match(ts_object_type[current_index]): current_index += 1

        if(ts_object_type[current_index] == "{"):
            property_type, current_index = parse_object_str(ts_object_type, current_index)

            ts_object.add_property(property_name_match.group(), property_type)
        else:
            property_type_match = _word_regex.search(ts_object_type, current_index)

            assert property_type_match is not None

            current_index = property_type_match.end()

            ts_object.add_property(property_name_match.group(), property_type_match.group())

        # Continue until the first alphabetic character
        while not _alphabetic_character_regex.match(ts_object_type[current_index]):
            # print(current_index, ts_object_type[current_index])
            if(ts_object_type[current_index] == "}"):
                return ts_object, current_index + 1
            
            current_index += 1

    return ts_object, current_index
        

def typed_object_to_typed_dict(typed_dict_name: str, ts_object_type: str) -> str:
    type_name = _prop_name_regex.search(ts_object_type)

    assert type_name is not None

    starting_index = starting_index_of_word(ts_object_type, "{")

    if(starting_index is None): return ""

    # Remove comments
    ts_object_type = _comment_regex.sub("", ts_object_type)

    # Remove adjacent whitespace
    ts_object_type = _bloat_regex.sub("", ts_object_type)

    ts_object, _ = parse_object_str(ts_object_type, starting_index)

    # pprint(ts_object.properties)

    return (f"""
from typing import Literal, TypedDict

__all__ = ["{typed_dict_name}"]

type RobotPosition = Literal["Red Left", "Red Middle", "Red Right", "Blue Left", "Blue Middle", "Blue Right"]
type ClimbHeight = Literal["No Attempt", "Level 1", "Level 2", "Level 3"]
""" + 
(ts_object.get_typed_dict_str(typed_dict_name))
).strip()

def main():
    # Quantitative Scouting
    with open(_typehinting_directory / "ScoutingData.py", "w", encoding="utf-8") as file:
        parsed = typed_object_to_typed_dict("ScoutingMatchData", get_ts_app_data_typedef(_scouting_app_data_path, "ScoutingData"))
        file.write(parsed)

if __name__ == "__main__":
    main()