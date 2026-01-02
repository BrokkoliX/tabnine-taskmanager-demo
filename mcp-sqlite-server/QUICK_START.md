# Quick Start - MCP SQLite Server

Get your MCP server running in 3 simple steps!

## Step 1: Create the Database

Run the TaskManager.Api to create the SQLite database:

```bash
# From the TaskManager.Api directory
dotnet run
```

Wait for it to start (you'll see "Now listening on..."), then press `Ctrl+C`.

The database file `taskmanager.db` should now exist in the project root.

## Step 2: Test the MCP Server

```bash
cd mcp-sqlite-server
npm test
```

Expected output:
```
🔍 Testing MCP SQLite Server Setup

Database path: /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/taskmanager.db
✅ Database file exists

✅ Successfully connected to database

✅ Tasks table exists

📋 Table Schema:
CREATE TABLE "Tasks" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Tasks" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Description" TEXT NULL,
    "IsCompleted" INTEGER NOT NULL
)

📊 Current task count: 0

✅ All checks passed!

🎉 The MCP server should work correctly.
```

## Step 3: Configure Claude Desktop

### A. Find your Claude Desktop config file:

**macOS:**
```bash
open ~/Library/Application\ Support/Claude/
```

**Windows:**
```
%APPDATA%\Claude\
```

**Linux:**
```bash
~/.config/Claude/
```

### B. Edit `claude_desktop_config.json`:

If the file doesn't exist, create it. Add this configuration:

```json
{
  "mcpServers": {
    "sqlite-taskmanager": {
      "command": "node",
      "args": [
        "/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/mcp-sqlite-server/index.js"
      ]
    }
  }
}
```

**Important:** Update the path to match your actual project location!

### C. Restart Claude Desktop

**Completely quit** Claude Desktop (not just close the window) and restart it.

## Step 4: Test with Claude

Open Claude Desktop and try these commands:

1. **List tasks:**
   ```
   Can you show me all my tasks from the database?
   ```

2. **Create a task:**
   ```
   Create a new task called "Test the MCP server" with description "Verify that the integration works"
   ```

3. **Search tasks:**
   ```
   Search for tasks containing "test"
   ```

4. **Get database info:**
   ```
   Show me the database schema
   ```

## Troubleshooting

### ❌ "Database not found"
**Solution:** Go back to Step 1 and run the .NET app

### ❌ "MCP server not showing in Claude"
**Solutions:**
1. Check the path in `claude_desktop_config.json` is correct
2. Completely restart Claude Desktop
3. Check Claude logs: `~/Library/Logs/Claude/` (macOS)

### ❌ "Permission denied"
**Solution:**
```bash
chmod +x /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/mcp-sqlite-server/index.js
```

## What's Happening?

```
You ask Claude ───→ Claude Desktop ───→ MCP Server ───→ SQLite DB
                        ↓                    ↓              ↓
You get answer ←─── Formats result ←─── Executes SQL ←─── Returns data
```

Claude uses the MCP server as a tool to interact with your database, just like it would use a calculator or web search!

## Example Use Cases

Once working, you can:
- "What's my oldest incomplete task?"
- "Create 5 sample tasks for testing"
- "Show me all completed tasks"
- "Update task 3 to mark it as done"
- "Delete all completed tasks"
- "Run a custom SQL query to..."

## Next Steps

- See [README.md](README.md) for full documentation
- See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting
- See [../MCP_SERVER_OVERVIEW.md](../MCP_SERVER_OVERVIEW.md) for architecture details

---

**Need help?** Check the full documentation or run `npm test` to verify your setup.
