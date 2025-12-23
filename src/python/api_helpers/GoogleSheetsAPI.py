from ..AppData import AppData

from google.auth.exceptions import RefreshError
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

    def set_row_col_values(self, worksheetEnum: BackendWorksheet, values: list[list]):
        worksheet = self.backend_worksheets[worksheetEnum]

        worksheet.update(
            values=values,
            range_name=f"{xl_rowcol_to_cell_fast(0, 0)}:{xl_rowcol_to_cell_fast(len(values), len(values[0]))}"
        )
        self._style_backend_worksheet(worksheet, values)

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
        except gspread.exceptions.SpreadsheetNotFound as notFoundE:
            print('WARNING: Google sheet not set. Have you set the id in .env?')
            sys.exit(0)
        except RefreshError as refreshError:
            print(refreshError)
            print("[91mSomething went wrong while trying to open the spreadsheet. Is your clock synced?[0m")
            sys.exit(0)
        except Exception as e:
            print(e)
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
        
    def _style_backend_worksheet(self, worksheet: gspread.Worksheet, csv: list[list]):
        num_rows = len(csv)
        if num_rows < 2: return
        
        num_columns = len(csv[0])

        worksheet.batch_format([
            {
                "range": f"A2:A{num_rows}",
                "format": {
                    "backgroundColor": {
                        "red": 0.7,
                        "green": 0.7,
                        "blue": 0.7
                    }
                }
            },
            {
                "range": f"A1:{xl_rowcol_to_cell_fast(0, num_columns - 1)}",
                "format": {
                    "backgroundColor": {
                        "red": 0.1,
                        "green": 0.27,
                        "blue": 0.53
                    },
                    "textFormat": {
                        "foregroundColor": {
                            "red": 1,
                            "green": 1,
                            "blue": 1
                        }
                    }
                }
            }
        ])

        # Column auto resize is not great but is better than nothing
        worksheet.columns_auto_resize(0, num_columns)