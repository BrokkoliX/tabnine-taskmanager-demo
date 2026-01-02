# MCP Server for SQLite - Overview

## What Was Added

A complete Model Context Protocol (MCP) server has been created to provide AI-assisted access to your TaskManager SQLite database.

## Directory Structure

```
TaskManager.Api/
├── mcp-sqlite-server/           # MCP Server (Node.js)
│   ├── index.js                 # Main server implementation
│   ├── test-server.js           # Test/verification script
│   ├── package.json             # Node.js dependencies
│   ├── README.md                # Server documentation
│   ├── SETUP_GUIDE.md          # Step-by-step setup instructions
│   ├── claude_desktop_config.example.json  # Configuration example
│   ├── .gitignore              # Git ignore rules
│   └── node_modules/           # Dependencies (after npm install)
├── taskmanager.db              # SQLite database (created by .NET app)
└── ... (existing .NET files)
```

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol developed by Anthropic that enables AI assistants to securely connect to external tools and data sources. Think of it as a standardized way for AI to interact with your applications.

### Key Concepts

- **Server**: Provides tools and resources (your SQLite database in this case)
- **Client**: Uses the tools (Claude Desktop, or other MCP-compatible AI assistants)
- **Tools**: Actions the AI can perform (create_task, update_task, etc.)
- **Resources**: Data the AI can read (database schema, task lists)
- **Transport**: How they communicate (stdio - standard input/output)

## Features of This MCP Server

### 🛠️ Tools (7 available)

1. **query** - Execute read-only SQL queries
2. **list_tasks** - Get all tasks
3. **get_task** - Get a specific task by ID
4. **create_task** - Create a new task
5. **update_task** - Update an existing task
6. **delete_task** - Delete a task
7. **search_tasks** - Search tasks by title/description

### 📚 Resources (2 available)

1. **sqlite://taskmanager/schema** - Database structure
2. **sqlite://taskmanager/tasks** - All task data

## How It Works

```
┌──────────────────────────────────────────────────────────┐
│                     User Request                          │
│        "Claude, show me all my incomplete tasks"          │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                  Claude Desktop                           │
│              (MCP Client)                                 │
│  - Interprets the request                                │
│  - Decides which tool to use                             │
│  - Calls: search_tasks(query="", onlyIncomplete=true)   │
└───────────────────────┬──────────────────────────────────┘
                        │ stdio (JSON-RPC)
┌───────────────────────▼──────────────────────────────────┐
│              MCP SQLite Server                            │
│              (Node.js - index.js)                         │
│  - Receives tool call                                    │
│  - Validates parameters                                  │
│  - Executes SQL query                                    │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│              taskmanager.db                               │
│              (SQLite Database)                            │
│  - Returns matching tasks                                │
└───────────────────────┬──────────────────────────────────┘
                        │
                   Results flow back up
                        │
┌───────────────────────▼──────────────────────────────────┐
│                  Claude Desktop                           │
│  - Formats results                                       │
│  - Presents to user in natural language                  │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│              User sees response:                          │
│  "You have 3 incomplete tasks:                           │
│   1. Buy groceries                                       │
│   2. Finish project documentation                        │
│   3. Schedule team meeting"                              │
└──────────────────────────────────────────────────────────┘
```

## Use Cases

### Task Management
- "What tasks do I have today?"
- "Create a task to review the code"
- "Mark task 5 as complete"
- "Show me all tasks containing 'meeting'"

### Data Analysis
- "How many incomplete tasks do I have?"
- "What's the oldest uncompleted task?"
- "Show me the database schema"

### Bulk Operations
- "Create tasks for: meeting, documentation, testing"
- "Update all tasks with 'urgent' in the title"

### Custom Queries
- "Run a SQL query to show tasks created this week"
- "Show me the structure of the Tasks table"

## Technology Stack

### MCP Server (Node.js)
- **@modelcontextprotocol/sdk** - Official MCP SDK
- **better-sqlite3** - Fast SQLite bindings
- **zod** - Schema validation

### Communication
- **Transport**: stdio (standard input/output)
- **Protocol**: JSON-RPC 2.0
- **Format**: MCP specification v1.0

## Security Considerations

✅ **Safe**:
- stdio transport (no network exposure)
- Only SELECT queries allowed via the `query` tool
- Local execution only
- Same permissions as the Node.js process

⚠️ **Be Aware**:
- The AI can read all data in the database
- The AI can modify/delete tasks (via tools)
- No authentication (assumes trusted local environment)
- Database must not be locked by other processes

## Files Created

1. **mcp-sqlite-server/index.js** (436 lines)
   - Main MCP server implementation
   - Handles all tool calls and resource requests
   - Database connection management

2. **mcp-sqlite-server/test-server.js** (66 lines)
   - Verification script
   - Checks database existence and connectivity
   - Validates table structure

3. **mcp-sqlite-server/package.json**
   - Node.js project configuration
   - Dependencies and scripts

4. **mcp-sqlite-server/README.md**
   - Server documentation
   - Tool and resource reference

5. **mcp-sqlite-server/SETUP_GUIDE.md**
   - Step-by-step setup instructions
   - Troubleshooting guide
   - Usage examples

6. **mcp-sqlite-server/claude_desktop_config.example.json**
   - Example Claude Desktop configuration

7. **mcp-sqlite-server/.gitignore**
   - Node.js ignore rules

## Dependencies Installed

```json
{
  "@modelcontextprotocol/sdk": "^1.25.1",
  "better-sqlite3": "^12.5.0",
  "zod": "^4.3.4"
}
```

## Getting Started

### Quick Start (3 steps)

1. **Create the database**:
   ```bash
   dotnet run
   ```
   (Press Ctrl+C after it starts)

2. **Test the MCP server**:
   ```bash
   cd mcp-sqlite-server
   npm test
   ```

3. **Configure Claude Desktop**:
   - See `mcp-sqlite-server/SETUP_GUIDE.md`
   - Restart Claude Desktop
   - Ask: "Show me all my tasks"

### Manual Testing

You can also test the server directly:

```bash
cd mcp-sqlite-server
node index.js
```

Then send MCP protocol messages via stdin (JSON-RPC format).

## Comparison: With vs Without MCP

### Without MCP (Traditional)
```
User → Manual HTTP requests (curl/Postman) → API → Database
```
- Must know exact endpoints
- Must format requests correctly
- Must parse JSON responses
- Technical knowledge required

### With MCP
```
User → Natural language → Claude → MCP Server → Database
```
- Ask in plain English
- AI handles the technical details
- Results in readable format
- No API knowledge needed

## Example Conversation

**You**: "Claude, what tasks do I have?"

**Claude**: *Calls list_tasks tool*

**You**: "Create a task called 'Review pull requests'"

**Claude**: *Calls create_task tool with title="Review pull requests"*

**You**: "Show me tasks with 'review' in them"

**Claude**: *Calls search_tasks tool with query="review"*

**You**: "Mark task 5 as done"

**Claude**: *Calls update_task tool with id=5, isCompleted=true*

## Troubleshooting

Run the test script for diagnostics:

```bash
cd mcp-sqlite-server
npm test
```

Common issues:
- Database not found → Run .NET app first
- Permission denied → Run `chmod +x index.js`
- Server not appearing → Check Claude config path
- Database locked → Close .NET app before using MCP

## Future Enhancements

Possible additions:
- Task priorities and due dates
- Task categories/tags
- Recurring tasks
- Task statistics and analytics
- Export/import functionality
- Task sharing between users

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)
- [MCP SDK Documentation](https://github.com/anthropics/mcp-sdk)

## Support

See the detailed setup guide:
```
mcp-sqlite-server/SETUP_GUIDE.md
```

For server documentation:
```
mcp-sqlite-server/README.md
```

---

**Created**: January 2025  
**Purpose**: AI-assisted task management via MCP  
**License**: ISC
