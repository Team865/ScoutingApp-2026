from ..AppData import AppData

from google.oauth2.service_account import Credentials
from xlsxwriter.utility import xl_rowcol_to_cell_fast
from enum import StrEnum
import gspread
import sys
from time import sleep

__all__ = ["GoogleSpreadsheet"]

_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

class BackendWorksheet(StrEnum):
    MATCH_DATA = "Match Data"
    MATCH_NOTES = "Match Notes"
    PIT_SCOUTING = "Pit Scouting"

class GoogleSpreadsheet:
    sheets_id: str
    spreadsheet: gspread.Spreadsheet

    backend_worksheets: dict[BackendWorksheet, gspread.Worksheet] = {}

    def __init__(self, sheets_id: str):
        self.sheets_id = sheets_id
        self._authenticate()
        self._fetch_backend_worksheets()

    def set_row_col_values(self, worksheet: BackendWorksheet, values: list[list]):
        self.backend_worksheets[worksheet].update(
            values=values,
            range_name=f"{xl_rowcol_to_cell_fast(0, 0)}:{xl_rowcol_to_cell_fast(len(values), len(values[0]))}"
        )

    def clear_backend_worksheets(self):
        for backend_sheet_enum in BackendWorksheet:
            self.backend_worksheets[backend_sheet_enum].clear()

    def poll_sheets_data(self, app_data: AppData, poll_period: int | float):
        while True:
            try:
                # Poll match data (UNIMPLEMENTED)
                # Poll match notes
                match_notes_csv = self.backend_worksheets[BackendWorksheet.MATCH_NOTES].get()
                app_data.superscouting_data.set_match_notes_from_csv(match_notes_csv)
                
                # Poll pit scouting notes
                pit_scouting_csv = self.backend_worksheets[BackendWorksheet.PIT_SCOUTING].get()
                app_data.superscouting_data.set_pit_scouting_from_csv(pit_scouting_csv)
            except Exception as e:
                print("Error polling sheets data:", e)

            sleep(poll_period)

    def _authenticate(self):
        ### Check for prerequisite files
        try: 
            creds = Credentials.from_service_account_file("service_account.json", scopes=_SCOPES)
        except:
            print('WARNING: Google credentials not found. Have you set up the service_account JSON?')
            sys.exit(0)

        ### Authorize spreadsheet
        gc = gspread.authorize(creds)
        try:
            self.spreadsheet = gc.open_by_key(self.sheets_id)
        except:
            print('WARNING: Google sheet not set. Have you set the id in .env?')
            sys.exit(0)

    def _fetch_backend_worksheets(self):
        for backend_sheet_enum in BackendWorksheet:
            self.backend_worksheets[backend_sheet_enum] = self._fetch_worksheet(f"{backend_sheet_enum.value} Backend")

    def _fetch_worksheet(self, worksheet_name: str) -> gspread.Worksheet:
        try:
            preexisting_worksheet = self.spreadsheet.worksheet(worksheet_name)
            return preexisting_worksheet
        except gspread.WorksheetNotFound:
            new_worksheet = self.spreadsheet.add_worksheet(worksheet_name, 1000, 1000)
            return new_worksheet