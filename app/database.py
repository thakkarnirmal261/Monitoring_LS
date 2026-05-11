import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT", 5432)
    )


def insert_metric(
    ram_used,
    load_avg,
    disk_used_percent=None,
    load1=None,
    load5=None,
    load15=None,
    cpu_percent=None
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO metrics (
            ram_used,
            load_avg,
            disk_used_percent,
            load1,
            load5,
            load15,
            cpu_percent
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        ram_used,
        load_avg,
        disk_used_percent,
        load1,
        load5,
        load15,
        cpu_percent
    ))

    conn.commit()
    cur.close()
    conn.close()


def get_metrics():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            id,
            ram_used,
            load_avg,
            disk_used_percent,
            load1,
            load5,
            load15,
            cpu_percent,
            created_at
        FROM metrics
        ORDER BY created_at DESC
        LIMIT 100
    """)

    data = cur.fetchall()

    cur.close()
    conn.close()

    return data