from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.tasks import collect_metrics
from app.database import get_metrics

app = FastAPI()

# Enable CORS for frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://43.205.203.53", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"msg": "Monitoring running"}


# Manual trigger for testing
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
                "id": d[0],
                "ram": d[1],
                "load": d[2],
                "disk_used_percent": d[3],
                "load1": d[4],
                "load5": d[5],
                "load15": d[6],
                "cpu_percent": d[7],
                "time": str(d[8])
            }
            for d in data
        ]

    except Exception as e:
        print(f"Error fetching metrics: {e}")

        return {
            "error": "Failed to fetch metrics",
            "detail": str(e)
        }