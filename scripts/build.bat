@echo off
echo ===BEGINNING BUILD PROCESS===

call scripts\clearBuild.bat
echo Build folder cleared
call npx tsc

if %ERRORLEVEL% == 0 (
    echo TypeScript Transpiled
    echo ===BUILD COMPLETE===
) else if %ERRORLEVEL% == 1 (
    :: Error Level of 1 means the command couldnt be run
    echo [91mTypeScript Compiler couldn't be found, did you make sure to run .\scripts\setup.bat beforehand?[0m
)