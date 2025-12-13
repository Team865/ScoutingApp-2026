from .SSEManager import SSEManager
import json

sse_manager = SSEManager()

def broadcast_match_notes(match_notes):
    sse_manager.add_payload(match_notes)