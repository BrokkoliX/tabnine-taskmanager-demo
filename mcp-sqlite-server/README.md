# MCP SQLite Server for TaskManager

This is a Model Context Protocol (MCP) server that provides access to the TaskManager SQLite database. It allows MCP clients (like Claude Desktop) to interact with your task database through standardized tools and resources.

## Features

### Tools
The server provides the following tools:

1. **query** - Execute read-only SQL queries
   - Execute SELECT statements on the database
   - Returns results in JSON format

2. **list_tasks** - List all tasks
   - Returns all tasks ordered by ID

3. **get_task** - Get a specific task by ID
   - Parameters: `id` (number)

4. **create_task** - Create a new task
   - Parameters: `title` (string, required), `description` (string, optional), `isCompleted` (boolean, default: false)

5. **update_task** - Update an existing task
   - Parameters: `id` (number, required), `title` (string, optional), `description` (string, optional), `isCompleted` (boolean, optional)

6. **delete_task** - Delete a task by ID
   - Parameters: `id` (number)

7. **search_tasks** - Search tasks by title or description
   - Parameters: `query` (string), `onlyIncomplete` (boolean, default: false)

### Resources
The server exposes the following resources:

1. **sqlite://taskmanager/schema** - Database schema information
2. **sqlite://taskmanager/tasks** - List of all tasks

## Installation

The dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Usage

### Running the Server

```bash
npm start
```

Or directly:

```bash
node index.js
```

### Configuring with Claude Desktop

To use this server with Claude Desktop, add it to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to your config:

```json
{
  "mcpServers": {
    "sqlite-taskmanager": {
      "command": "node",
      "args": ["/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/mcp-sqlite-server/index.js"]
    }
  }
}
```

After updating the config, restart Claude Desktop.

### Using with Other MCP Clients

Since this is a standard MCP server using stdio transport, it can be used with any MCP-compatible client. Configure the client to run:

```bash
node /path/to/mcp-sqlite-server/index.js
```

## Database Location

The server connects to the SQLite database at:
```
../taskmanager.db
```

This is the same database used by the TaskManager.Api application.

## Example Usage in Claude

Once configured, you can ask Claude to interact with your tasks:

- "Show me all my tasks"
- "Create a new task with title 'Buy groceries'"
- "Mark task 5 as completed"
- "Search for tasks containing 'meeting'"
- "Delete task with ID 3"
- "Show me all incomplete tasks"

## Security

- The `query` tool only allows SELECT statements for security
- All database operations are executed with the same permissions as the Node.js process
- The server uses stdio transport (standard input/output) for communication

## Dependencies

- `@modelcontextprotocol/sdk` - Official MCP SDK
- `better-sqlite3` - Fast SQLite3 bindings for Node.js
- `zod` - TypeScript-first schema validation

## Development

For development with auto-reload:

```bash
npm run dev
```

## Troubleshooting

### Database not found
- Make sure the TaskManager.Api application has been run at least once to create the database
- Check that the database path is correct (currently set to `../taskmanager.db`)

### Connection errors
- Ensure the database file is not locked by another process
- Check file permissions on the database file

### MCP client doesn't see the server
- Verify the configuration path in your MCP client
- Restart the MCP client after configuration changes
- Check the server logs for errors

## Architecture

The server implements the MCP specification:
- **Resources**: Provides read-only access to database schema and data
- **Tools**: Provides interactive operations (CRUD) on tasks
- **Transport**: Uses stdio for communication with MCP clients

## License

ISC
