@echo off
:: Change Directory to the root directory
cd %~dp0..\
set PYTHON_PATH = %~dp0

call uv run py -m scripts.sanity_check_python

if %ERRORLEVEL% == 0 (
    echo ===SANITY CHECKS PASSED===
)