# Maritime Weather Intelligence

## Project Overview
A modular system for real-time and predictive maritime weather guidance, featuring:
- Real-time weather alerts (cyclone warnings, swells, currents)
- 10-day weather prediction
- Optimal speed suggestions against wind, waves, and current
- Interactive user dashboard
- Integration with trusted weather APIs (OpenWeather, NOAA, etc.)

## Tech Stack (Recommended)
- **Frontend:** React.js, TailwindCSS (optional)
- **Backend:** Node.js (Express.js)
- **AI/ML Microservice:** Python (FastAPI, spaCy, Transformers, scikit-learn, TensorFlow)
- **Database:** PostgreSQL
- **Cloud Storage:** Azure Blob Storage
- **DevOps/Cloud:** Microsoft Azure, GitHub Actions

## Architecture Overview
- **Frontend:** User dashboard, file uploads, data tables, REST API communication
- **Backend:** API endpoints for weather, document processing, user auth, queue system for background tasks
- **ML Service:** Document parsing, NLP pipelines, weather API connectors
- **Database/Storage:** SQL for structured data, Azure Blob for documents, Redis for caching
- **Reporting:** PDF/Excel/JSON/CSV export

## Setup Instructions
### 1. Frontend
- Navigate to `frontend/`
- Run `npx create-react-app .` to initialize React
- Install TailwindCSS (optional): `npm install -D tailwindcss`

### 2. Backend
- Navigate to `backend/`
- Run `npm init -y` and install Express: `npm install express`
- Set up PostgreSQL connection:
  - Copy `.env.example` to `.env` and fill in your database credentials.
  - Install dependencies: `npm install pg dotenv`
  - See `backend/db.js` for connection setup and `backend/server.js` for usage example.
  - Test with: `node server.js` and visit `/api/test-db` to verify connection.

### 3. ML Microservice
- Navigate to `ml_service/`
- Set up Python virtual environment: `python -m venv venv`
- Install FastAPI and ML libraries: `pip install fastapi spacy transformers scikit-learn tensorflow`

### 4. Database
- Use PostgreSQL (cloud or local)
- Configure connection in backend

### 5. Cloud & DevOps
- Use Azure for hosting, storage, and CI/CD
- Set up GitHub Actions for automated deployment

### How to Run Each Module

#### 1. Frontend (React)
- Navigate to `frontend/`
- Install dependencies: `npm install`
- Start the app: `npm start`
- Open `http://localhost:3000` in your browser

#### 2. Backend (Express)
- Navigate to `backend/`
- Install dependencies: `npm install`
- Start the server: `node server.js`
- Test API: `http://localhost:3001/api/status`

#### 3. ML Service (FastAPI)
- Navigate to `ml_service/`
- Install dependencies: `pip install -r requirements.txt`
- Start the service: `uvicorn main:app --reload --port 8000`
- Test API: `http://localhost:8000/api/ml-status`


### One-Click Start (Windows Command Prompt)
- Run `start-all.cmd` in the project root to launch all services in separate Command Prompt windows:
  1. Frontend (React)
  2. Backend (Express)
  3. ML Service (FastAPI)
- Make sure you have Node.js, Python, and Command Prompt available.

### One-Click Start (Windows Terminal Tabs)
- Run `start-all-wt.cmd` in the project root to launch all services in separate tabs in Windows Terminal:
  1. Frontend (React)
  2. Backend (Express)
  3. ML Service (FastAPI)
- Requires Windows Terminal (`wt` command) installed and available in PATH.
- Both Windows Terminal and Command Prompt scripts now activate the Python virtual environment before starting the ML service.

---
Continuously update this README and instructions as you add features or change the setup.

## Submission Requirements (Round 1)
- Well-structured GitHub repository
- Demo/architecture video (3–6 min)
- Live URL for testing
- This README with summary, setup, and links

## Links
- [Demo Video Placeholder]
- [Live URL Placeholder]

---
For details, see `hackathon_instructions.txt` and `docs/` for architecture diagrams and API references.

#BASE PROJECT DONE ON : 21-08-2025 17:54 IST
