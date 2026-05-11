from app.worker import celery
from app.metrics import get_all_metrics
from app.database import insert_metric


@celery.task
def collect_metrics():
    print("Task running...")

    data = get_all_metrics()

    insert_metric(
        data["ram"],
        data["load"],
        data["disk_used_percent"],
        data["load1"],
        data["load5"],
        data["load15"],
        data["cpu_percent"],
    )

    return data