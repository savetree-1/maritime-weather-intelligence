# Maritime Weather Intelligence

## Project Summary
This project is a modular weather integration system for maritime operations, designed for the IME Oceanova tool. It provides real-time weather alerts, 10-day forecasts, optimal speed suggestions, and a user dashboard. The system integrates trusted weather APIs and leverages AI/ML for document analysis and prediction.

## Tech Stack
- **Frontend:** React.js (with optional TailwindCSS)
- **Backend:** PHP Laravel (with optional Python microservice for ML)
- **Database:** MySQL
- **Cloud:** Microsoft Azure

## Architecture Overview
- **Frontend:** User dashboard, file uploads, data tables, REST API communication
- **Backend:** API endpoints for weather, document processing, authentication, queue system for background tasks
- **ML Service:** Python microservice for AI/ML/NLP tasks (document parsing, event detection)
- **Database & Storage:** MySQL for structured data, Azure Blob Storage for documents

## Setup Instructions
### Prerequisites
- Node.js & npm
- PHP & Composer
- Python 3.x
- MySQL
- Azure account (for cloud deployment)

### 1. Frontend Setup
```
cd frontend
npx create-react-app .
# (Optional) Install TailwindCSS
```

### 2. Backend Setup
```
cd backend
composer create-project --prefer-dist laravel/laravel .
```

### 3. ML Service Setup
```
cd ml_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Database Setup
- Create a MySQL database and update backend `.env` accordingly.

### 5. Cloud Deployment
- Use Azure Web Apps for backend/frontend hosting.
- Use Azure Blob Storage for document uploads.

## Submission Requirements (Round 1)
- [x] GitHub repository with structured code
- [ ] Demo/Architecture video (3–6 min)
- [ ] Live URL (hosted version)
- [x] README.md with summary, setup, links

## Links
- **Demo Video:** _[Add link here]_ 
- **Live URL:** _[Add link here]_

---
For more details, see `hackathon_instructions.txt`.
