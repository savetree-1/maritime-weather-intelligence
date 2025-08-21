from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
import os
from asyncpg.exceptions import InvalidCatalogNameError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:adminpost@localhost:5432/maritime_weather")

@app.on_event("startup")
async def startup():
    try:
        app.state.db = await asyncpg.create_pool(DATABASE_URL)
    except InvalidCatalogNameError:
        app.state.db = None
        print("ERROR: Database 'maritime_weather' does not exist. Please create the database and try again.")
    except Exception as e:
        app.state.db = None
        print(f"ERROR: {e}")

@app.on_event("shutdown")
async def shutdown():
    if app.state.db:
        await app.state.db.close()

@app.get("/api/status")
async def status():
    if not app.state.db:
        return {"status": "error", "detail": "Database 'maritime_weather' does not exist. Please create the database and try again."}
    try:
        async with app.state.db.acquire() as conn:
            result = await conn.fetchval("SELECT NOW()")
        return {"status": "Backend running", "db_time": str(result)}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
