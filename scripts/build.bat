@echo off
echo ===BEGINNING BUILD PROCESS===

call scripts\clearBuild.bat
echo Build folder cleared

call npx webpack -c .\webpack.config.js --stats errors-only

if %ERRORLEVEL% == 0 (
    echo TypeScript Transpiled and Bundled with webpack
    echo ===BUILD COMPLETE===
)