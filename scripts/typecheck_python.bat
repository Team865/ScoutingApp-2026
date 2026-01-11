@echo off
:: Change Directory to the project root
cd %~dp0..\

call uv run mypy ^
--no-warn-no-return ^
--disable-error-code "import-untyped" ^
--disable-error-code "annotation-unchecked" ^
--disable-error-code "method-assign" ^
.\App.py