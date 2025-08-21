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
- Set up PostgreSQL connection

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
