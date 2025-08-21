@echo off
wt -w 0 nt -d "%~dp0frontend" cmd /k "npm start" ^
   ; nt -d "%~dp0backend" cmd /k "node server.js" ^
   ; nt -d "%~dp0ml_service" cmd /k "call venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"
