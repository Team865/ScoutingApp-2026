from tkinter import Tk, Button
from threading import Thread
from queue import Queue

class DebugMenu:
    application: Tk
    message_queue = Queue()

    def __init__(self):
        Thread(target=self.create_application).start()

    def create_application(self):
        self.application = Tk("TEST")
        self.application.geometry("400x200")
        
        print_tba_clients_button = Button(self.application, text="Print TBA Clients", command=lambda: self.message_queue.put_nowait("print_tba_clients"))
        print_tba_clients_button.grid()

        print_match_notes_clients_button = Button(self.application, text="Print Match Notes Clients", command=lambda: self.message_queue.put_nowait("print_match_notes_clients"))
        print_match_notes_clients_button.grid()

        self.application.mainloop()