@echo off
rem ---------------------------------------------------------------------------
rem  Pushes YOUR local edits to the working branch
rem  (claude/splitter-interface-improvement-e4zl3u).
rem
rem  HOW TO USE: after editing files (e.g. js/achievements-data.js or
rem  js/achievement-icons.js), double-click this file. It asks for a short
rem  description, saves your changes, pulls the latest, and pushes.
rem
rem  If it prints the word "CONFLICT", stop and tell Claude — do not force
rem  anything; it means the same lines were changed on both sides.
rem ---------------------------------------------------------------------------
setlocal
cd /d "%~dp0"

set "BRANCH=claude/splitter-interface-improvement-e4zl3u"

set /p MSG="Describe your edit (then press Enter): "
if "%MSG%"=="" set "MSG=My edits"

git add -A
git commit -m "%MSG%"

echo.
echo Pulling the latest from the branch...
git pull --no-edit origin %BRANCH%

echo.
echo Pushing your edits...
git push origin %BRANCH%

echo.
echo Done. Press any key to close.
pause >nul
