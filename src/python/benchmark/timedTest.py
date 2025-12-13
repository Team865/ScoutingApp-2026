from typing import Callable
from time import time

def timedTest(function_to_call: Callable[[None], None], num_trials: int):
    totalTime = 0

    for _ in range(num_trials):
        startTime = time()
        function_to_call()
        endTime = time()
        totalTime += endTime - startTime

    return totalTime / num_trials