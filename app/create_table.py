import psycopg2

conn = psycopg2.connect(
    host="database-1.c3wca4ccwqq9.ap-south-1.rds.amazonaws.com",
    database="postgres",
    user="postgres",
    password="RDS25802580",
    port=5432
)

cur = conn.cursor()

cur.execute("""
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    ram_used INTEGER,
    load_avg FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

conn.commit()
cur.close()
conn.close()

print("Table created successfully")