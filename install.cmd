@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT%install.ps1" %*
if errorlevel 1 exit /b 1

endlocal
