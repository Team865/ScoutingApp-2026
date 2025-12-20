:: Delete build folder if it exists
if exist .\static\build\ (rmdir .\static\build /s /q)
md .\static\build