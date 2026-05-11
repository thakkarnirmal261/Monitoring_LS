import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT", 5432)
)

cur = conn.cursor()

# Create table if not exists
cur.execute("""
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    ram_used INTEGER,
    load_avg FLOAT,
    disk_used_percent FLOAT,
    load1 FLOAT,
    load5 FLOAT,
    load15 FLOAT,
    cpu_percent FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Add missing columns safely
cur.execute("""
ALTER TABLE metrics
ADD COLUMN IF NOT EXISTS disk_used_percent FLOAT,
ADD COLUMN IF NOT EXISTS load1 FLOAT,
ADD COLUMN IF NOT EXISTS load5 FLOAT,
ADD COLUMN IF NOT EXISTS load15 FLOAT,
ADD COLUMN IF NOT EXISTS cpu_percent FLOAT;
""")

conn.commit()

cur.close()
conn.close()

print("Metrics table ready successfully")