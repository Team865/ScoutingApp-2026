from .SuperScoutingEndpoint import sse_manager

def broadcast_match_notes(match_notes):
    sse_manager.add_payload({
        "event_name": "match-notes",
        "match_notes": match_notes
    })