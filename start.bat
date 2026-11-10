@echo off
title APEX Athletic Apparel Local Server
echo Starting APEX Athletic Apparel Store on http://localhost:8080/ ...
start "" http://localhost:8080/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
