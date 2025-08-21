@echo off
wt -w 0 nt -d "%~dp0web-frontend" cmd /k "npm run dev" ^
   ; nt -d "%~dp0api-backend" cmd /k "call venv\Scripts\activate && uvicorn main:app --reload --port 3001" ^
   ; nt -d "%~dp0ml-engine" cmd /k "call venv\Scripts\activate && uvicorn main:app --reload --port 8000"
