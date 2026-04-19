import re
import traceback
from typing import Optional

from gspread.utils import Dimension, ValidationConditionType

from src.python.util import ListUtil

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
    SCOUTER_NAMES = "Scouter Names"
    SCOUTING_ROTATION = "Scouting Rotation"
    MATCH_DATA = "Match Data"
    MATCH_NOTES = "Match Notes"
    PIT_SCOUTING = "Pit Scouting"
    PER_MATCH_ROTATION = "Per Match Rotation"

class GoogleSpreadsheet:
    sheets_id: str
    spreadsheet: gspread.Spreadsheet

    backend_worksheets: dict[BackendWorksheet, gspread.Worksheet] = {}

    def __init__(self, sheets_id: str):
        self.sheets_id = sheets_id
        self._authenticate()
        self._fetch_backend_worksheets()
        self.generate_per_match_rotation()

    def set_row_col_values(self, worksheetEnum: BackendWorksheet, values: list[list]):
        worksheet = self.backend_worksheets[worksheetEnum]

        worksheet.update(
            values=values,
            range_name=f"{xl_rowcol_to_cell_fast(0, 0)}:{xl_rowcol_to_cell_fast(len(values), len(values[0]))}"
        )
        
        self._style_backend_worksheet(worksheet, values)

    def add_row(self, worksheetEnum: BackendWorksheet, row: list):
        worksheet = self.backend_worksheets[worksheetEnum]
        worksheet.append_row(row)

        self._style_backend_worksheet(worksheet)

    def clear_backend_worksheets(self):
        for backend_sheet_enum in BackendWorksheet:
            self.backend_worksheets[backend_sheet_enum].clear()

    def poll_sheets_data(self, app_data: AppData, poll_period: int | float):
        while True:
            try:
                # Poll scouting rotation
                scouting_rotation_csv = self.backend_worksheets[BackendWorksheet.SCOUTING_ROTATION].get()
                app_data.quantitative_scouting_data.set_scouting_rotation_from_csv(scouting_rotation_csv)
                self.generate_per_match_rotation()

                # Poll quantitative scouting data
                match_data_csv = self.backend_worksheets[BackendWorksheet.MATCH_DATA].get()
                app_data.quantitative_scouting_data.set_scouting_data_from_csv(match_data_csv)

                # Poll match notes
                match_notes_csv = self.backend_worksheets[BackendWorksheet.MATCH_NOTES].get()
                app_data.superscouting_data.set_match_notes_from_csv(match_notes_csv)
                
                # Poll pit scouting notes
                pit_scouting_csv = self.backend_worksheets[BackendWorksheet.PIT_SCOUTING].get()
                app_data.superscouting_data.set_pit_scouting_from_csv(pit_scouting_csv)

                # missed_matches = []
                
                # for fetched_team in app_data.superscouting_data.fetched_team_data:
                #     for match_key in fetched_team["match_keys"]:
                #         match_number = int(re.search(r"(?<=qm)[0-9]+", match_key).group())
                #         team_number = fetched_team["number"]
                #         match_data = ListUtil.find(app_data.quantitative_scouting_data.data, lambda v: (v["match_number"] == match_number) and (v["team_number"] == team_number))
                #         if(match_data is None):
                #             missed_matches.append([match_number, team_number])

                # missed_matches.sort(key=lambda v: v[0])
                # with open("temp.txt", "wt+") as file:
                #     file.write("\n".join([f"{match[0]} {match[1]}" for match in missed_matches]))

                #     print("test")
            except Exception as e:
                print("Error polling sheets data:", traceback.format_exc())

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
            self.backend_worksheets[backend_sheet_enum] = self._fetch_worksheet(backend_sheet_enum.value)

    def _fetch_worksheet(self, worksheet_name: str) -> gspread.Worksheet:
        try:
            preexisting_worksheet = self.spreadsheet.worksheet(worksheet_name)
            return preexisting_worksheet
        except gspread.WorksheetNotFound:
            new_worksheet = self.spreadsheet.add_worksheet(worksheet_name, 1000, 1000)
            return new_worksheet
        
    def _style_backend_worksheet(self, worksheet: gspread.Worksheet, csv: Optional[list[list]] = None):
        csv = csv or worksheet.get()

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

        requests: list[dict] = [
            {
                "autoResizeDimensions": {
                    "dimensions": {
                        "sheetId": worksheet.id,
                        "dimension": Dimension.cols,
                        "startIndex": 0,
                        "endIndex": num_columns
                    }
                }
            }
        ]

        isMatchDataSheet = worksheet == self.backend_worksheets[BackendWorksheet.MATCH_DATA]

        requests.append({
            "updateSheetProperties": {
                "properties": {
                    "sheetId": worksheet.id,
                    "gridProperties": {
                        "frozenRowCount": 1,
                        "frozenColumnCount": 3 if isMatchDataSheet else 1
                    }
                },
                "fields": "gridProperties.frozenRowCount,gridProperties.frozenColumnCount"
            }
        })

        self.spreadsheet.batch_update({"requests": requests})

        # Column auto resize is not great but is better than nothing
        worksheet.columns_auto_resize(0, num_columns)

    def set_scouting_rotation(self, csv: list[list[str]]):
        worksheet = self.backend_worksheets[BackendWorksheet.SCOUTING_ROTATION]
        self.set_row_col_values(BackendWorksheet.SCOUTING_ROTATION, csv)

        requests = [
            {
                "setDataValidation": {
                    "range": {
                        "sheetId": worksheet.id,
                        "startRowIndex": 1,
                        "endRowIndex": len(csv),
                        "startColumnIndex": 1,
                        "endColumnIndex": 7,
                    },
                    "rule": {
                        "showCustomUi": True,
                        "strict": True,
                        "condition": {"values": [{"userEnteredValue": f"='{BackendWorksheet.SCOUTER_NAMES.value}'!A1:A"}], "type": "ONE_OF_RANGE"},
                    },
                }
            },
            {
                "updateDimensionProperties": {    
                    "range": {
                        "sheetId": worksheet.id,
                        "dimension": Dimension.cols,
                        "startIndex": 1,
                        "endIndex": 7
                    },
                    "properties": {
                        "pixelSize": 150
                    },
                    "fields": "pixelSize"
                }
            }
        ]
        self.spreadsheet.batch_update({"requests": requests})

    def generate_per_match_rotation(self):
        worksheet = self.backend_worksheets[BackendWorksheet.PER_MATCH_ROTATION]
        shifts_csv = self.backend_worksheets[BackendWorksheet.SCOUTING_ROTATION].get()
        csv: list[list[str]] = [shifts_csv[0]]

        for shift_row in shifts_csv[1:]:
            shift_range_cell = shift_row[0]
            temp = shift_range_cell.split("-")
            start_match = int(temp[0])
            end_match = int(temp[1])

            for match_number in range(start_match, end_match + 1):
                csv.append([str(match_number)] + shift_row[1:])
        
        def did_rotation_change():
            try:
                preexisiting_csv = worksheet.get()

                for row_index in range(len(csv)):
                    new_row = csv[row_index]

                    for column_index in range(len(new_row)):
                        new_cell = new_row[column_index]

                        if(new_cell != preexisiting_csv[row_index][column_index]):
                            return True
                        
                return False
            except:
                return True

        if(not did_rotation_change()): return

        self.set_row_col_values(BackendWorksheet.PER_MATCH_ROTATION, csv)

        requests = [
            {
                "setDataValidation": {
                    "range": {
                        "sheetId": worksheet.id,
                        "startRowIndex": 1,
                        "endRowIndex": len(csv),
                        "startColumnIndex": 1,
                        "endColumnIndex": 7,
                    },
                    "rule": {
                        "showCustomUi": True,
                        "strict": True,
                        "condition": {"values": [{"userEnteredValue": f"='{BackendWorksheet.SCOUTER_NAMES.value}'!A1:A"}], "type": "ONE_OF_RANGE"},
                    },
                }
            },
            {
                "updateDimensionProperties": {    
                    "range": {
                        "sheetId": worksheet.id,
                        "dimension": Dimension.cols,
                        "startIndex": 1,
                        "endIndex": 7
                    },
                    "properties": {
                        "pixelSize": 150
                    },
                    "fields": "pixelSize"
                }
            }
        ]
        self.spreadsheet.batch_update({"requests": requests})