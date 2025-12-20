@echo off
echo ===BEGINNING BUILD PROCESS===

call scripts\clearBuild.bat
echo Build folder cleared
call npx tsc || echo [91mTypeScript couldn't be compiled, did you make sure to run .\scripts\setup.bat beforehand?[0m

if %ERRORLEVEL% == 0 (
    echo TypeScript Transpiled
    echo ===BUILD COMPLETE===
)
