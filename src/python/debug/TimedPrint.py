from time import time
from math import floor, ceil, copysign
from typing import Callable
import functools

__all__ = ["start", "end", "timed"]

_time_starts: dict[str, float] = {}

def conventional_round(number: float, n_decimals: int = 0):
    shift_factor = (10 ** n_decimals)
    shifted_magnitude = abs(number * shift_factor)

    if abs(number - int(number)) < 0.5:
        return copysign(int(shifted_magnitude) / shift_factor, number)
    
    return copysign(ceil(shifted_magnitude) / shift_factor, number)

def start(label: str = "default"):
    """
    Starts a timer.
    
    :param label: The label for the timer. The label is "default" by default.
    :type label: str
    """
    _time_starts[label] = time()

def end(label: str = "default", num_decimals: int = None):
    """
    Ends a timer. Raises a `KeyError` if the timer doesn't exist.
    
    :param label: The label of the timer. "default" by default
    :type label: str
    :param num_decimals: How many decimals you want to display. 
    The value is None by default, meaning it will display as many as possible.
    :type num_decimals: int
    """
    if(label not in _time_starts):
        raise KeyError(f"The {label} timer has not been started.")
    
    time_taken = time() - _time_starts[label]
    
    if num_decimals:
        time_taken = conventional_round(time_taken, num_decimals)

    del _time_starts[label]
    
    print(f"Time taken{f" for timer {label}" if label != "default" else ""}: {time_taken} seconds")

def timed(print_msg: str | Callable[[float], str] = None, num_decimals: int = None):
    """
    Makes a function print the time it takes to complete in seconds.
    
    :param print_msg: A string to print before printing the time taken, or a function that takes in the time taken to return the string to print.
    :type print_msg: str
    :param num_decimals: How many decimals do you want to print. Is None by default, meaning it prints as many as it can.
    :type num_decimals: int
    """

    def timed(function_to_time: Callable):
        @functools.wraps(function_to_time)
        def wrapper(*args, **kwargs):
            start_time = time()
            function_to_time(*args, **kwargs)
            time_taken = time() - start_time

            msg: str

            if num_decimals:
                time_taken = conventional_round(time_taken, num_decimals)

            if isinstance(print_msg, str):
                msg = print_msg + f"{time_taken}s"
            elif isinstance(print_msg, Callable):
                msg = print_msg(time_taken)
            else:
                msg = f"{function_to_time.__name__}: {time_taken}s"

            print(msg)

        return wrapper
    
    return timed