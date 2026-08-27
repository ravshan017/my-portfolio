@echo off
cd /d "%~dp0"

echo === Stopping old servers on ports 3000/3001...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr /C:":3000" /C:":3001" ^| findstr "LISTENING"') do (
  taskkill /PID %%a /F >nul 2>&1
)
timeout /t 3 >nul

echo === Cleaning .next cache...
rmdir /s /q ".next" >nul 2>&1

echo === Starting dev server (window will stay open with logs)...
start "Portfolio Dev" cmd /k "npm run dev -- -p 3000"

echo === Waiting for http://localhost:3000 to be ready...
:wait
timeout /t 3 >nul
curl -s --max-time 4 -o nul -w "%%{http_code}" http://localhost:3000 2>nul | findstr /r "^200$" >nul
if errorlevel 1 goto wait

echo === Opening in Google Chrome...
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if defined CHROME (
  start "" "%CHROME%" "http://localhost:3000"
) else (
  echo Chrome not found, opening default browser.
  start "" "http://localhost:3000"
)
