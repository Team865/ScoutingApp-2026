from queue import Queue
from typing import Generator, Any, NoReturn
import json

"""
A helper class for managing SSE clients for a given route
"""
class SSEManager:
    sse_clients: list[Queue]

    def __init__(self):
        self.sse_clients = []
    
    def register_client(self, client_queue: Queue = None) -> Generator[Any, Any, NoReturn]:
        """
        Registers a client queue to the manager. Returns a generator function for the stream
        
        Args:
            client_queue (`Queue`, optional): The client queue to register. Automatically creates a client queue if none is provided.

        Returns:
            `Generator`: The generator stream. Can be used as the response argument when creating a Response object for an SSE route
        """

        client_queue = client_queue or Queue()
        self.sse_clients.append(client_queue)

        def stream():
            try:
                while True:
                    yield client_queue.get()
            finally:
                if client_queue in self.sse_clients:
                    self.sse_clients.remove(client_queue)

        return stream

    def add_payload(self, payload: dict):
        payloadStr = "data: " + json.dumps(payload) + "\n\n"

        dead_clients: list[Queue] = []
        for q in self.sse_clients:
            try:
                q.put(payloadStr)
            except:
                dead_clients.append(q)

        for q in dead_clients:
            if q in self.sse_clients:
                self.sse_clients.remove(q)