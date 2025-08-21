# PowerShell script to start all services for Maritime Weather Intelligence
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd web-frontend; npm run dev'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd api-backend; venv\Scripts\activate; uvicorn main:app --reload --port 3001'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd ml-engine; venv\Scripts\activate; uvicorn main:app --reload --port 8000'
