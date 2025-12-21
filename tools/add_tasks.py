#!/usr/bin/env python3
import os, sqlite3
from datetime import datetime, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
DB_PATH = os.path.join(DATA_DIR, "taskdemo.db")

def add_tasks(conn: sqlite3.Connection):
    now = datetime.utcnow()
    
    tasks = [
        ("Update API documentation", "Add OpenAPI specs for all endpoints", "Pending", "Medium",
         (now + timedelta(days=5)).isoformat(), "alice", now.isoformat(), None),
        
        ("Implement user authentication", "Add JWT-based authentication system", "InProgress", "High",
         (now + timedelta(days=10)).isoformat(), "bob", now.isoformat(), None),
        
        ("Fix database migration script", "Resolve issues with schema migration", "Critical", "Critical",
         (now + timedelta(days=1)).isoformat(), "charlie", now.isoformat(), None),
        
        ("Code review for feature branch", "Review pull request #142", "Pending", "Medium",
         (now + timedelta(days=3)).isoformat(), "diana", now.isoformat(), None),
        
        ("Optimize database queries", "Improve performance of task search endpoint", "InProgress", "High",
         (now + timedelta(days=7)).isoformat(), "alice", now.isoformat(), None),
        
        ("Write unit tests for TaskService", "Achieve 80% code coverage", "Pending", "Medium",
         (now + timedelta(days=6)).isoformat(), "bob", now.isoformat(), None),
        
        ("Deploy to staging environment", "Deploy latest build to staging server", "Completed", "High",
         (now - timedelta(days=2)).isoformat(), "devops", now.isoformat(), now.isoformat()),
        
        ("Update dependencies", "Upgrade all NuGet packages to latest versions", "Pending", "Low",
         (now + timedelta(days=14)).isoformat(), "charlie", now.isoformat(), None),
        
        ("Create user dashboard", "Build frontend dashboard for task management", "InProgress", "High",
         (now + timedelta(days=12)).isoformat(), "diana", now.isoformat(), None),
        
        ("Setup CI/CD pipeline", "Configure GitHub Actions for automated deployment", "Completed", "Critical",
         (now - timedelta(days=5)).isoformat(), "devops", now.isoformat(), now.isoformat()),
        
        ("Refactor TaskRepository", "Improve code structure and error handling", "Pending", "Low",
         (now + timedelta(days=15)).isoformat(), "alice", now.isoformat(), None),
        
        ("Add logging middleware", "Implement request/response logging", "InProgress", "Medium",
         (now + timedelta(days=4)).isoformat(), "bob", now.isoformat(), None),
        
        ("Security audit", "Conduct security review of API endpoints", "Pending", "Critical",
         (now + timedelta(days=3)).isoformat(), "security-team", now.isoformat(), None),
        
        ("Performance testing", "Load test API with 1000 concurrent users", "Pending", "High",
         (now + timedelta(days=8)).isoformat(), "qa-team", now.isoformat(), None),
        
        ("Setup monitoring", "Configure application monitoring and alerts", "InProgress", "High",
         (now + timedelta(days=5)).isoformat(), "devops", now.isoformat(), None),
        
        ("Create API client library", "Build C# client SDK for the API", "Pending", "Medium",
         (now + timedelta(days=20)).isoformat(), "alice", now.isoformat(), None),
        
        ("Database backup strategy", "Implement automated database backups", "Pending", "Critical",
         (now + timedelta(days=2)).isoformat(), "devops", now.isoformat(), None),
        
        ("Update README", "Add installation and usage instructions", "Completed", "Low",
         (now - timedelta(days=1)).isoformat(), "charlie", now.isoformat(), now.isoformat()),
        
        ("Implement task filtering", "Add advanced filtering options to search endpoint", "InProgress", "Medium",
         (now + timedelta(days=9)).isoformat(), "diana", now.isoformat(), None),
        
        ("Setup error tracking", "Integrate Sentry for error monitoring", "Pending", "Medium",
         (now + timedelta(days=6)).isoformat(), "bob", now.isoformat(), None),
    ]
    
    conn.executemany(
        """
        INSERT INTO tasks(title, description, status, priority, due_date, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        tasks
    )
    conn.commit()
    print(f"✅ Added {len(tasks)} tasks to the database")

if __name__ == "__main__":
    with sqlite3.connect(DB_PATH) as conn:
        add_tasks(conn)
    print(f"✅ Database updated: {DB_PATH}")
