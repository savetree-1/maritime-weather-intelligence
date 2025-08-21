@echo off
REM Start Next.js frontend
start cmd /k "cd /d %~dp0web-frontend && npm run dev"
REM Start FastAPI backend (api-backend)
start cmd /k "cd /d %~dp0api-backend && call venv\Scripts\activate && uvicorn main:app --reload --port 3001"
REM Start FastAPI ML engine (ml-engine)
start cmd /k "cd /d %~dp0ml-engine && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"
