from app.worker import celery
from app.metrics import get_ram, get_load
from app.database import insert_metric

@celery.task
def collect_metrics():
    print("Task runnning...")
    ram = get_ram()
    load = get_load()

    insert_metric(ram, load)

    return {"ram": ram, "load": load}