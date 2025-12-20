WHERE .\static\build>nul 2>nul
:: Delete build folder if it exists
if %ERRORLEVEL% == 0 rmdir .\static\build /s /q
md .\static\build