import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        dbname=os.getenv("DB_NAME"),
        port=os.getenv("DB_PORT")
    )

def insert_metric(ram, load):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO metrics (ram_used, load_avg) VALUES (%s, %s)",
        (ram, load)
    )

    conn.commit()
    cur.close()
    conn.close()


def get_metrics():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM metrics ORDER BY created_at DESC LIMIT 10")
    data = cur.fetchall()

    cur.close()
    conn.close()

    return data