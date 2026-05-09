from celery import Celery
import os

# Redis is used as both the broker and result backend for Celery.
# The value is loaded from the .env file via REDIS_URL.
celery = Celery(
    "worker",
    broker=os.getenv("REDIS_URL"),
    backend=os.getenv("REDIS_URL")
)

# Discover Celery tasks inside app/ so @celery.task decorators are registered.
celery.autodiscover_tasks(['app'])

# Periodic schedule for Celery Beat: run the collect_metrics task every 10 seconds.
celery.conf.beat_schedule = {
    "collect-every-10-sec": {
        "task": "app.tasks.collect_metrics",
        "schedule": 10.0,  # seconds
    }
}