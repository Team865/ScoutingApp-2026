__all__ = ["camel_to_snake_case"]

from typing import Any, cast

def camel_to_snake_case(camel_case: str | dict):
    if(type(camel_case) == dict):
        camel_cased_dict = {}

        for k, v in camel_case.items():
            camel_cased_dict[camel_to_snake_case(k)] = (
                v 
                if type(v) != dict else 
                camel_to_snake_case(v)
            )

        return camel_cased_dict

    words: list[str] = []
    current_word: str = ""

    for letter in camel_case:
        if(letter.upper() == letter):
            words.append(current_word)
            current_word = letter.lower()
        else:
            current_word += letter.lower()

    words.append(current_word)

    return "_".join(words)