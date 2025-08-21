@echo off
start cmd /k "cd /d %~dp0frontend && npm start"
start cmd /k "cd /d %~dp0backend && node server.js"
start cmd /k "cd /d %~dp0ml_service && call venv\Scripts\activate && python -m uvicorn main:app --reload --port 8000"
