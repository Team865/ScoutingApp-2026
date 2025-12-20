@echo off
call scripts\build.bat

:: Only run python app if the build was successful
if %ERRORLEVEL% == 0 (
    echo.
    echo ===STARTING PYTHON APP===
    call uv run App.py
)