from fastapi import FastAPI
from app.tasks import collect_metrics
from app.database import get_metrics

app = FastAPI()

@app.get("/")
def home():
    return {"msg": "Monitoring running"}

# Manual trigger (keep it for testing)
@app.get("/trigger")
def trigger():
    collect_metrics.delay()
    return {"msg": "Task sent to worker"}

# 🔥 NEW: API for frontend dashboard
@app.get("/metrics")
def metrics():
    data = get_metrics()

    return [
        {
            "ram": d[1],
            "load": d[2],
            "time": str(d[3])
        }
        for d in data
    ]