@echo off
echo ===BEGINNING BUILD PROCESS===

call scripts\clearBuild.bat
echo Build folder cleared

call npx esbuild^
 src/typescript/scouting/main.ts^
 src/typescript/superscouting/main.ts^
 src/typescript/analysis/main.ts^
 --bundle^
 --minify^
 --sourcemap^
 --outdir=static/build

if %ERRORLEVEL% == 0 (
    echo TypeScript Transpiled and Bundled with esbuild
    echo ===BUILD COMPLETE===
)