from argparse import ArgumentParser
from io import BytesIO
from os import getenv
from pathlib import Path
from PIL import Image
from PIL.ImageFile import ImageFile
from threading import Thread
from typing import Any, Iterable, Optional

from dotenv import load_dotenv
import requests

default_output_dir = "./static/deploy/teamLogos"
default_num_threads = 20

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

def fetch_team_logo(team_key: str) -> Optional[ImageFile]:
    image_url = f"https://www.thebluealliance.com/avatar/2026/{team_key}.png"

    current_status_code = 400
    remaining_attempts = 5

    while current_status_code >= 400:
        image_request = requests.get(image_url)
        remaining_attempts -= 1

        if(image_request.status_code == 403):
            print(team_key, "does not have a logo available")
            return None
        elif(image_request.status_code == 404):
            print("Request for the logo of team", team_key, f"was blocked. Retrying {remaining_attempts} more times.")
        else:
            return Image.open(BytesIO(image_request.content))
        
        if(remaining_attempts == 0): return None

def download_logos(download_directory: str, team_keys: list[str], thread_count: int):
    download_directory_path = Path(download_directory)

    def batch_download(start_index: int, end_index: int):
        for team_index in range(start_index, end_index):
            team_key = team_keys[team_index]
            image = fetch_team_logo(team_key)

            if(image is None): continue

            image.save(download_directory_path / f"{team_key}.png")

    threads = [Thread(target=batch_download, args=[start_index, start_index + batch_size]) for start_index, batch_size in evenly_divide_into_groups(len(team_keys), thread_count)]
    for thread in threads:
        thread.start()

def get_district_teams(district_key: str, headers: dict[str, Any]) -> Optional[list[str]]:
    tba_request = requests.get(
        f"https://www.thebluealliance.com/api/v3/district/{district_key}/teams/keys",
        headers=headers
    )

    if(tba_request.status_code == 200): return tba_request.json()

    if(tba_request.status_code == 304):
        print(f"Request was previously cached for district {district_key}")
    else:
        print(tba_request.json()["Error"])

    return None

def get_event_teams(event_key: str, headers: dict[str, Any]) -> Optional[list[str]]:
    tba_request = requests.get(
        f"https://www.thebluealliance.com/api/v3/event/{event_key}/teams/keys",
        headers=headers
    )

    if(tba_request.status_code == 200): return tba_request.json()
    
    if(tba_request.status_code == 304):
        print(f"Request was previously cached for event {event_key}")
    else:
        print(tba_request.json()["Error"])

    return None

if __name__ == "__main__":
    load_dotenv()

    api_key = getenv("TBA_API_KEY")

    if(api_key is None):
        raise Exception("NO API KEY FOUND IN .env OR IN SYSTEM ENVIRONMENT VARIABLES")

    parser = ArgumentParser(description="Script for downloading team logos from thebluealliance")
    parser.add_argument("-d", "--district", type=str, help="Downloads logos from specific district key(s) (i.e. 2026ont)", nargs="+")
    parser.add_argument("-e", "--event", type=str, help="Downloads logos from specific event(s) (i.e. 2026week0)", nargs="+")
    parser.add_argument("-od", "--outputdir", type=str, help=f"The output directory to output to. Defaults to {default_output_dir}")
    parser.add_argument("-t", "--threads", type=int, help=f"The number of threads to use. Defaults to {default_num_threads}")

    args = parser.parse_args()

    districts: list[str] = args.district
    events: list[str] = args.event
    
    if(districts is None) and (events is None):
        print("NOTHING DOWNLOADED. PLEASE SELECT AT LEAST 1 EVENT OR DISTRICT VIA THE -d OR -e FLAGS")
        exit(1)

    output_dir: str = args.outputdir or default_output_dir
    num_threads: int = args.threads or default_num_threads

    request_header = {"X-TBA-Auth-Key": api_key}

    team_keys: list[str] = []

    # Districts
    if(districts):
        for district_key in districts:
            fetched_teams = get_district_teams(district_key, request_header)

            if(fetched_teams): team_keys.extend(fetched_teams)
            
    # Events
    if(events):
        for event_key in events:
            fetched_teams = get_event_teams(event_key, request_header)

            if(fetched_teams): team_keys.extend(fetched_teams)

    team_keys = list(set(team_keys))

    download_logos(output_dir, team_keys, num_threads)