import sqlite3
import os
from datetime import datetime, date, timedelta
import random
from config import DATABASE_PATH

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            user_query TEXT,
            session_date TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS conversations (
            conversation_id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            user_query TEXT,
            agent_response TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        );

        CREATE TABLE IF NOT EXISTS thoughts (
            thought_id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            agent_name TEXT,
            thinking_stage TEXT,
            thought_content TEXT,
            output_content TEXT,
            created_date TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
        );

        CREATE TABLE IF NOT EXISTS reports (
            report_id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            file_path TEXT,
            blob_url TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (session_id) REFERENCES sessions(session_id)
        );

        CREATE TABLE IF NOT EXISTS equipment_schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            vendor_country TEXT NOT NULL,
            project_country TEXT NOT NULL,
            expected_date TEXT,
            actual_date TEXT,
            status TEXT,
            risk_level INTEGER DEFAULT 1
        );
    """)

    conn.commit()
    _seed_equipment_schedule(conn)
    conn.close()

def _seed_equipment_schedule(conn):
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM equipment_schedule")
    count = c.fetchone()[0]
    if count > 0:
        return

    today = date.today()

    equipment_data = [
        ("High-Pressure Pump Assembly", "China", "United States", today + timedelta(days=45), today + timedelta(days=60), "delayed", 4),
        ("Industrial Control Panel", "Germany", "Canada", today + timedelta(days=30), today + timedelta(days=32), "on_track", 1),
        ("Turbine Rotor Set", "Japan", "Australia", today + timedelta(days=90), today + timedelta(days=105), "delayed", 3),
        ("Heat Exchanger Unit", "South Korea", "United Kingdom", today + timedelta(days=20), today + timedelta(days=20), "on_track", 2),
        ("Pipeline Valve Cluster", "Mexico", "United States", today + timedelta(days=15), today + timedelta(days=25), "delayed", 3),
        ("Electrical Switchgear", "China", "Brazil", today + timedelta(days=60), today + timedelta(days=85), "at_risk", 4),
        ("Compressor Module", "India", "Germany", today + timedelta(days=40), today + timedelta(days=43), "on_track", 2),
        ("Structural Steel Frame", "Russia", "France", today + timedelta(days=70), today + timedelta(days=95), "delayed", 5),
        ("Hydraulic Actuator System", "Taiwan", "Japan", today + timedelta(days=25), today + timedelta(days=26), "on_track", 1),
        ("Generator Set", "Philippines", "Singapore", today + timedelta(days=55), today + timedelta(days=70), "at_risk", 4),
        ("Instrumentation Package", "Malaysia", "Indonesia", today + timedelta(days=35), today + timedelta(days=36), "on_track", 2),
        ("Cooling Tower Assembly", "Vietnam", "Thailand", today + timedelta(days=80), today + timedelta(days=100), "delayed", 3),
        ("Pressure Vessel", "Brazil", "United States", today + timedelta(days=50), today + timedelta(days=52), "on_track", 2),
        ("Motor Control Center", "India", "Canada", today + timedelta(days=10), today + timedelta(days=18), "at_risk", 3),
    ]

    c.executemany(
        """INSERT INTO equipment_schedule
           (item_name, vendor_country, project_country, expected_date, actual_date, status, risk_level)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        [(row[0], row[1], row[2], str(row[3]), str(row[4]), row[5], row[6]) for row in equipment_data]
    )
    conn.commit()
