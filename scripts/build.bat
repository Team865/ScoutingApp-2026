@echo off
:: Change Directory to the project root
cd %~dp0..\
echo ===BEGINNING BUILD PROCESS===

:: Check the .env file to see if the script is being ran in a development or production context
set sourcemapFlag=--sourcemap

for /f "tokens=1* delims==" %%A in (.env) do (
    if "%%A=%%B" == "IS_PROD=1" (
        set sourcemapFlag=
    )
)

call scripts\clearBuild.bat
echo Build folder cleared

call npx esbuild^
 src/typescript/scouting/main.ts^
 src/typescript/superscouting/main.ts^
 src/typescript/analysis/main.ts^
 --bundle^
 %sourcemapFlag%^
 --outdir=static/build

if %ERRORLEVEL% == 0 (
    echo TypeScript Transpiled and Bundled with esbuild
    echo ===BUILD COMPLETE===
)