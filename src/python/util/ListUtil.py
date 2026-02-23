__all__ = ["find"]

from typing import Callable, Optional, TypeVar

T = TypeVar("T")

def find(list: list[T], predicate: Callable[[T], bool]) -> Optional[T]:
    return next((v for v in list if predicate(v)), None)