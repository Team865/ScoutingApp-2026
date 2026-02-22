

def evenly_divide_into_groups(quantity: int, num_groups: int):
    """
    Divides a `quantity` of `item`s into num_groups amount of `group`s evenly.
    
    This function returns a sequence of tuples representing the info of each `group` sequentially,
    and the sum of the sequence will total to `quantity`

    The tuple is in the form of (current_item_index, batch_size)
    
    :param quantity: The quantity of `item`s
    :type quantity: int
    :param num_groups: The amount of `group`s to divide into
    :type num_groups: int
    """

    extra_chunk_size = quantity % num_groups
    evenly_divisible_chunk_size = quantity - extra_chunk_size
    min_batch_size = evenly_divisible_chunk_size // num_groups
    item_index = 0

    for group_index in range(num_groups):
        batch_size = min_batch_size
        
        if(group_index < extra_chunk_size): batch_size += 1
        
        yield (item_index, batch_size)
        item_index += batch_size

def download_images(teams: list[int], thread_count: int):
    for start_index, batch_size in evenly_divide_into_groups(len(teams), thread_count)