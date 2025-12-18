from .SuperScoutingEndpoint import sse_manager

def broadcast_pit_scouting_notes(pit_scouting_notes):
    sse_manager.add_payload({
        "event_name": "pit-scouting-notes",
        "pit_scouting_notes": pit_scouting_notes
    })