from pathlib import Path
from pprint import pprint
import re
from typing import Mapping, Optional, Self

from chompjs import chompjs

from src.python.AppData import QuantitativeScoutingData
from scripts import build_py_app_data_from_ts

_project_root = Path(__file__).parent.parent
_scouting_app_data_path = _project_root / "src/typescript/scouting/AppData.ts"

_comment_regex = re.compile(r"//\s\b.+?\b\s*\n")
_bloat_regex = re.compile(r"(\s\s+|\n)")

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

        ts_object_type = text_data[starting_index:current_index]

        starting_index = starting_index_of_word(ts_object_type, "{")

        # Remove comments
        ts_object_type = _comment_regex.sub("", ts_object_type)

        # Remove adjacent whitespace
        ts_object_type = _bloat_regex.sub("", ts_object_type)

        return ts_object_type

def validate_entry(dict_def: dict, key_sequence: list[str]) -> bool:
    current_dict = dict_def

    for key in key_sequence:
        if(key not in current_dict):
            return False
        
        current_dict = current_dict[key]

    return True

if __name__ == "__main__":
    build_py_app_data_from_ts.main()

    # Quantitative Scouting
    ts_class_def = get_ts_app_data_typedef(_scouting_app_data_path, "ScoutingData")
    class_def_as_dict = chompjs.parse_js_object(ts_class_def)

    csv_mapping = QuantitativeScoutingData._csv_columns
    checks_passed = True

    for [column_header, key_sequence, _] in csv_mapping:
        is_valid_entry = validate_entry(class_def_as_dict, key_sequence)

        if(not is_valid_entry):
            print(f"\u001b[31m{key_sequence} is not a valid key sequence of quantitative scouting data.\u001b[0m")
            checks_passed = False

    if(not checks_passed):
        print("\u001b[31m\u001b[01mSANITY CHECKS FAILED\u001b[0m")
        exit(1)