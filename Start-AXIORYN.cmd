@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 24.3 or newer, then open this file again.
  pause
  exit /b 1
)
echo Starting AXIORYN AI. The local address will appear below.
echo Keep this window open while using the app. Press Ctrl+C to stop it.
node server/start.mjs
if errorlevel 1 pause
endlocal
