#!/usr/bin/env python3
import os, sqlite3
from datetime import datetime, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
DB_PATH = os.path.join(DATA_DIR, "taskdemo.db")

os.makedirs(DATA_DIR, exist_ok=True)

schema = """
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Pending',
  priority    TEXT NOT NULL DEFAULT 'Medium',
  due_date    TEXT,                  -- ISO8601 string for demo simplicity
  created_by  TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT
);
"""

def seed(conn: sqlite3.Connection):
    now = datetime.utcnow()
    rows = [
        ("Prepare Tabnine demo", "C# API + MCP DB context", "InProgress", "High",
         (now + timedelta(days=2)).isoformat(), "robbie", now.isoformat(), None),
        ("Review PRs", "Check main repo PRs", "Pending", "Medium",
         (now + timedelta(days=7)).isoformat(), "robbie", now.isoformat(), None),
        ("Fix flaky test", "Stabilize CI test", "Pending", "Critical",
         (now + timedelta(days=1)).isoformat(), "qa-team", now.isoformat(), None),
    ]
    conn.executemany(
        """
        INSERT INTO tasks(title, description, status, priority, due_date, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        rows
    )
    conn.commit()

with sqlite3.connect(DB_PATH) as conn:
    conn.executescript(schema)
    seed(conn)

print(f"✅ SQLite DB created: {DB_PATH}")
