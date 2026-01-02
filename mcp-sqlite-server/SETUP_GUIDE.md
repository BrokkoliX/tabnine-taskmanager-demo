# MCP SQLite Server Setup Guide

This guide will walk you through setting up the MCP server for your TaskManager SQLite database.

## Prerequisites

- Node.js installed (you have this ✅)
- TaskManager.Api .NET application
- Claude Desktop (or another MCP client)

## Step-by-Step Setup

### 1. Create the Database

First, you need to run the TaskManager.Api application to create the SQLite database:

```bash
# From the TaskManager.Api root directory
dotnet run
```

Keep it running for a moment, then press Ctrl+C to stop it. This will create the `taskmanager.db` file.

Alternatively, you can make a test request to ensure the database is created:

```bash
# In another terminal, while the app is running
curl http://localhost:5000/tasks
```

### 2. Verify the Setup

Run the test script to verify everything is working:

```bash
cd mcp-sqlite-server
npm test
```

You should see output like:
```
✅ Database file exists
✅ Successfully connected to database
✅ Tasks table exists
✅ All checks passed!
```

### 3. Configure Claude Desktop

#### macOS
Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Windows
Edit: `%APPDATA%\Claude\claude_desktop_config.json`

#### Linux
Edit: `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

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

**Note**: Update the path if your project is in a different location.

### 4. Restart Claude Desktop

Completely quit and restart Claude Desktop for the changes to take effect.

### 5. Verify in Claude

Start a new conversation in Claude and try:

```
Can you list all my tasks?
```

Claude should respond using the MCP server to query your database!

## Usage Examples

Once configured, you can ask Claude:

### Viewing Tasks
- "Show me all my tasks"
- "What tasks do I have?"
- "List all incomplete tasks"

### Creating Tasks
- "Create a new task called 'Buy groceries'"
- "Add a task: Write documentation for the project"
- "Create a task 'Team meeting' with description 'Discuss Q2 goals'"

### Updating Tasks
- "Mark task 5 as completed"
- "Update task 3's description to 'Updated description'"
- "Change the title of task 2 to 'New title'"

### Searching
- "Search for tasks containing 'meeting'"
- "Find all tasks with 'project' in them"
- "Show me tasks related to 'documentation'"

### Deleting
- "Delete task with ID 7"
- "Remove task 3"

### Advanced Queries
- "Run a SQL query to show all completed tasks"
- "Show me the database schema"

## Troubleshooting

### Issue: Database not found
**Solution**: Run the TaskManager.Api application first to create the database

```bash
cd /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api
dotnet run
```

### Issue: MCP server not showing up in Claude
**Solutions**:
1. Check the path in claude_desktop_config.json is correct
2. Make sure you completely restarted Claude Desktop (not just closed the window)
3. Check Claude Desktop logs for errors:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

### Issue: Permission denied
**Solution**: Make sure the index.js file is executable

```bash
chmod +x /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/mcp-sqlite-server/index.js
```

### Issue: Database locked
**Solution**: Make sure the TaskManager.Api application is not running while using the MCP server

## Architecture

```
┌─────────────────┐
│  Claude Desktop │
│   (MCP Client)  │
└────────┬────────┘
         │ stdio
         │
┌────────▼────────┐
│   MCP Server    │
│   (Node.js)     │
└────────┬────────┘
         │
┌────────▼────────┐
│ taskmanager.db  │
│    (SQLite)     │
└─────────────────┘
```

The MCP server acts as a bridge between Claude Desktop and your SQLite database, exposing standardized tools and resources.

## Development

To run the server in development mode with auto-reload:

```bash
npm run dev
```

## Security Notes

- The `query` tool only allows SELECT statements for safety
- All operations run with the same permissions as the Node.js process
- The server uses stdio transport (no network exposure)
- Consider this for local development use

## Next Steps

- Add authentication if exposing over network (currently stdio only)
- Implement more complex queries
- Add data validation rules
- Create custom prompts for specific workflows

## Support

If you encounter issues:
1. Run `npm test` to verify the setup
2. Check Claude Desktop logs
3. Verify the database path is correct
4. Ensure Node.js and all dependencies are installed

Happy task managing! 🎉
