echo ===BEGINNING BUILD PROCESS===

call scripts\clearBuild.bat
echo Build folder cleared
call npx tsc
echo TypeScript Transpiled

echo ===BUILD COMPLETE===