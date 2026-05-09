from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.tasks import collect_metrics
from app.database import get_metrics

app = FastAPI()

# Enable CORS for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"msg": "Monitoring running"}

# Manual trigger (keep it for testing)
@app.get("/trigger")
def trigger():
    collect_metrics.delay()
    return {"msg": "Task sent to worker"}

@app.get("/metrics")
def metrics():
    try:
        data = get_metrics()
        return [
            {
                "ram": d[1],
                "load": d[2],
                "time": str(d[3])
            }
            for d in data
        ]
    except Exception as e:
        print(f"Error fetching metrics: {e}")
        # Return mock data for local testing
        return [
            {"ram": "45.2", "load": "1.23", "time": "2024-01-15 10:30:45"},
            {"ram": "48.5", "load": "1.45", "time": "2024-01-15 10:30:50"},
            {"ram": "42.1", "load": "1.10", "time": "2024-01-15 10:31:00"}
        ]