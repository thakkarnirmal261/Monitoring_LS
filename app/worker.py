from celery import Celery
import os

celery = Celery(
    "worker",
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL")
)

celery.autodiscover_tasks(['app'])

# ⬇️ ADD THIS
celery.conf.beat_schedule = {
    "collect-every-10-sec": {
        "task": "app.tasks.collect_metrics",
        "schedule": 10.0,  # seconds
    }
}