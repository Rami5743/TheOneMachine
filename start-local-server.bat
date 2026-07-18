@echo off
rem ---------------------------------------------------------------------------
rem  Serves "The One Machine" (המכונה האחת) from a local web server, so the
rem  Google sign-in flow works. Google needs a real http:// address — opening
rem  index.html by double-click (file://) will NOT let you sign in.
rem
rem  HOW TO USE: just double-click this file. A small server window opens and
rem  your browser opens at http://localhost:8000/ . To stop, close the server
rem  window (the black one titled "local server").
rem ---------------------------------------------------------------------------

rem Run from this file's own folder, wherever it was copied to.
cd /d "%~dp0"

rem Start the server in its own window. Try "python" first, then the "py"
rem launcher, so it works on either common Windows Python install.
start "The One Machine - local server (close this window to stop)" cmd /k "python -m http.server 8000 || py -m http.server 8000"

rem Give the server a moment to come up, then open the game in the browser.
rem (python's http.server already serves index.html at "/", but we point at it
rem  explicitly so there is no doubt which page loads.)
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000/index.html"

exit
