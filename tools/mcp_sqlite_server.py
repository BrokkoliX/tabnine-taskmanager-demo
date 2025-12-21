#!/usr/bin/env python3
"""
Minimal MCP server (STDIO) exposing read-only SQLite tools for Tabnine Agent demos.

IMPORTANT:
- Writes ONLY JSON-RPC/MCP messages to stdout.
- Logs go to stderr.
"""
import json
import os
import re
import sqlite3
import sys
from typing import Any, Dict, List, Optional

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB = os.path.join(ROOT, "data", "taskdemo.db")
DB_PATH = os.environ.get("DB_PATH", DEFAULT_DB)

SELECT_ONLY = re.compile(r"^\s*select\b", re.IGNORECASE)

def log(*args):
    print(*args, file=sys.stderr, flush=True)

def send(msg: Dict[str, Any]):
    sys.stdout.write(json.dumps(msg) + "\n")
    sys.stdout.flush()

def ok(id_: Any, result: Any):
    send({"jsonrpc": "2.0", "id": id_, "result": result})

def err(id_: Any, code: int, message: str, data: Any = None):
    e = {"code": code, "message": message}
    if data is not None:
        e["data"] = data
    send({"jsonrpc": "2.0", "id": id_, "error": e})

def connect() -> sqlite3.Connection:
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"DB not found at {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

TOOLS = [
    {
        "name": "db_list_tables",
        "description": "List tables in the SQLite database.",
        "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "db_describe_table",
        "description": "Describe columns for a given table (name, type, nullability, PK).",
        "inputSchema": {
            "type": "object",
            "properties": {"table": {"type": "string"}},
            "required": ["table"],
            "additionalProperties": False,
        },
    },
    {
        "name": "db_sample_rows",
        "description": "Return up to N sample rows from a table.",
        "inputSchema": {
            "type": "object",
            "properties": {"table": {"type": "string"}, "limit": {"type": "integer", "minimum": 1, "maximum": 50}},
            "required": ["table"],
            "additionalProperties": False,
        },
    },
    {
        "name": "db_query_readonly",
        "description": "Run a read-only SQL query (SELECT only).",
        "inputSchema": {
            "type": "object",
            "properties": {"sql": {"type": "string"}, "params": {"type": "object"}},
            "required": ["sql"],
            "additionalProperties": False,
        },
    },
]

def list_tables() -> List[str]:
    with connect() as conn:
        rows = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall()
        return [r["name"] for r in rows]

def describe_table(table: str) -> List[Dict[str, Any]]:
    # Validate table name to prevent SQL injection
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', table):
        raise ValueError(f"Invalid table name: {table}")
    with connect() as conn:
        cols = conn.execute(f"PRAGMA table_info({table})").fetchall()
        if not cols:
            raise ValueError(f"Table '{table}' not found.")
        return [
            {"name": c["name"], "type": c["type"], "notnull": bool(c["notnull"]), "pk": bool(c["pk"])}
            for c in cols
        ]

def sample_rows(table: str, limit: int = 5) -> List[Dict[str, Any]]:
    # Validate table name to prevent SQL injection
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', table):
        raise ValueError(f"Invalid table name: {table}")
    with connect() as conn:
        rows = conn.execute(f"SELECT * FROM {table} LIMIT ?", (limit,)).fetchall()
        return [dict(r) for r in rows]

def query_readonly(sql: str, params: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not SELECT_ONLY.match(sql):
        raise ValueError("Only SELECT queries are allowed in this demo MCP server.")
    with connect() as conn:
        cur = conn.execute(sql, params or {})
        rows = cur.fetchall()
        return [dict(r) for r in rows]

def handle_tools_call(name: str, arguments: Dict[str, Any]) -> Any:
    if name == "db_list_tables":
        return {"tables": list_tables(), "dbPath": DB_PATH}
    if name == "db_describe_table":
        return {"table": arguments["table"], "columns": describe_table(arguments["table"])}
    if name == "db_sample_rows":
        return {"table": arguments["table"], "rows": sample_rows(arguments["table"], int(arguments.get("limit", 5)))}
    if name == "db_query_readonly":
        return {"rows": query_readonly(arguments["sql"], arguments.get("params"))}
    raise ValueError(f"Unknown tool: {name}")

def main():
    log(f"[mcp_sqlite_server] Starting. DB_PATH={DB_PATH}")
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            method = req.get("method")
            id_ = req.get("id")

            if method == "initialize":
                ok(id_, {
                    "protocolVersion": "2024-11-05",
                    "serverInfo": {"name": "demo-sqlite-mcp", "version": "1.0.0"},
                    "capabilities": {"tools": {}}
                })
                continue

            if method == "tools/list":
                ok(id_, {"tools": TOOLS})
                continue

            if method == "tools/call":
                params = req.get("params") or {}
                name = params.get("name")
                arguments = params.get("arguments") or {}
                result = handle_tools_call(name, arguments)
                ok(id_, {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]})
                continue

            err(id_, -32601, f"Method not found: {method}")

        except Exception as e:
            # best-effort id
            err(req.get("id") if isinstance(req, dict) else None, -32000, "Server error", str(e))

if __name__ == "__main__":
    main()
