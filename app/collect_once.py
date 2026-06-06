"""Collect one round of metrics from the production host and store it.

Run on a schedule by cron (every minute) on monitoringLS. This replaces the
old Celery beat/worker/redis stack:

    python -m app.collect_once
"""
from app.metrics import get_all_metrics
from app.database import insert_metric


def main():
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
    print("Collected:", data)


if __name__ == "__main__":
    main()
