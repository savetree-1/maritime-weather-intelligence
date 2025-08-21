from fastapi import FastAPI

app = FastAPI()

@app.get("/api/ml-status")
def ml_status():
    return {"status": "ML service running"}
