@echo off
set npmEnvName=npm
set npxEnvName=npx
set uvEnvName=uv

:: Check for npm and install modules
WHERE %npmEnvName%>nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    call:echoWarning "npm not found, are you sure you have NodeJS installed?"
    start "" https://nodejs.org/en/download
) else (
    echo Downloading Node dependencies...
    call npm i
)

:: Check for npx
WHERE %npxEnvName%>nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    call:echoWarning "npx not found, are you sure you have NodeJS installed?"
    start "" https://nodejs.org/en/download
)

:: Check for uv
WHERE %uvEnvName% >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    call:echoWarning "uv not found, find how to download uv at https://docs.astral.sh/uv/getting-started/installation/"
    start "" https://docs.astral.sh/uv/getting-started/installation/
)

::Skip over functions
GOTO:EOF

:echoWarning
echo [91m%~1[0m
GOTO:EOF