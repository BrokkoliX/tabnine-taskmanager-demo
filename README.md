# TaskManager API

A minimal REST API for task management built with ASP.NET Core 9.0 and SQLite, featuring an MCP (Model Context Protocol) server for AI-assisted task management.

## Features

### REST API
- ✅ Create, Read, Update, Delete (CRUD) operations for tasks
- ✅ Search and filter tasks
- ✅ Persistent SQLite database storage
- ✅ Minimal API design (no controllers)

### MCP Server Integration 🤖
- ✅ AI assistant integration via Model Context Protocol
- ✅ Natural language task management through Claude Desktop
- ✅ Direct database access for AI assistants
- ✅ 7 tools + 2 resources for comprehensive task management

## Project Structure

```
TaskManager.Api/
├── Data/
│   ├── ITaskRepository.cs          # Repository interface
│   ├── InMemoryTaskRepository.cs   # Legacy in-memory implementation
│   ├── SqliteTaskRepository.cs     # SQLite implementation
│   └── TaskDbContext.cs            # Entity Framework DbContext
├── Models/
│   └── TaskItem.cs                 # Task entity model
├── Services/
│   ├── ITaskService.cs             # Service interface
│   └── TaskService.cs              # Business logic service
├── mcp-sqlite-server/              # MCP Server (Node.js)
│   ├── index.js                    # Main MCP server
│   ├── test-server.js              # Test script
│   ├── package.json                # Node dependencies
│   ├── QUICK_START.md              # Quick setup guide
│   ├── SETUP_GUIDE.md              # Detailed setup
│   └── README.md                   # MCP server docs
├── Program.cs                      # Application entry point
├── appsettings.json                # Configuration
├── taskmanager.db                  # SQLite database (created on first run)
├── MIGRATION_TO_SQLITE.md          # Migration documentation
├── MCP_SERVER_OVERVIEW.md          # MCP architecture guide
└── README.md                       # This file
```

## Quick Start

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- (Optional) [Node.js](https://nodejs.org/) for MCP server

### Running the API

```bash
# Restore dependencies
dotnet restore

# Run the application
dotnet run
```

The API will be available at `http://localhost:5000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/search?query={q}&onlyIncomplete={bool}` | Search tasks |
| GET | `/tasks/{id}` | Get task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

### Example Requests

**Create a task:**
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","isCompleted":false}'
```

**Get all tasks:**
```bash
curl http://localhost:5000/tasks
```

**Search tasks:**
```bash
curl "http://localhost:5000/tasks/search?query=groceries&onlyIncomplete=true"
```

**Update a task:**
```bash
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"title":"Buy groceries","description":"Milk, eggs, bread","isCompleted":true}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:5000/tasks/1
```

## MCP Server for AI Integration 🤖

The MCP server allows AI assistants like Claude Desktop to interact with your task database using natural language!

### Quick MCP Setup

1. **Create the database:**
   ```bash
   dotnet run
   # Press Ctrl+C after it starts
   ```

2. **Test the MCP server:**
   ```bash
   cd mcp-sqlite-server
   npm install  # First time only
   npm test
   ```

3. **Configure Claude Desktop:**
   - See [mcp-sqlite-server/QUICK_START.md](mcp-sqlite-server/QUICK_START.md)

4. **Use with Claude:**
   - "Show me all my tasks"
   - "Create a task called 'Review code'"
   - "Mark task 5 as completed"

### MCP Documentation

- **Quick Start:** [mcp-sqlite-server/QUICK_START.md](mcp-sqlite-server/QUICK_START.md)
- **Full Setup Guide:** [mcp-sqlite-server/SETUP_GUIDE.md](mcp-sqlite-server/SETUP_GUIDE.md)
- **MCP Overview:** [MCP_SERVER_OVERVIEW.md](MCP_SERVER_OVERVIEW.md)
- **MCP Server Docs:** [mcp-sqlite-server/README.md](mcp-sqlite-server/README.md)

## Database

The application uses **SQLite** for data persistence:

- **File:** `taskmanager.db` (created automatically)
- **Location:** Project root directory
- **Schema:** See [MIGRATION_TO_SQLITE.md](MIGRATION_TO_SQLITE.md)

### Database Schema

```sql
CREATE TABLE "Tasks" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Description" TEXT NULL,
    "IsCompleted" INTEGER NOT NULL
)
```

## Technology Stack

### .NET API
- **Framework:** ASP.NET Core 9.0
- **Database:** SQLite
- **ORM:** Entity Framework Core 9.0
- **Architecture:** Repository Pattern + Service Layer

### MCP Server
- **Runtime:** Node.js
- **SDK:** @modelcontextprotocol/sdk
- **Database:** better-sqlite3
- **Validation:** Zod
- **Transport:** stdio (standard input/output)

## Development

### Build
```bash
dotnet build
```

### Run Tests (MCP Server)
```bash
cd mcp-sqlite-server
npm test
```

### Clean Database
```bash
rm taskmanager.db
```

## Migration History

This project was migrated from an in-memory database to SQLite. See [MIGRATION_TO_SQLITE.md](MIGRATION_TO_SQLITE.md) for details.

## Use Cases

### Traditional API Access
- Mobile apps
- Web applications
- Microservices
- Integration testing

### AI-Assisted Management (via MCP)
- Natural language task queries
- Bulk operations
- Complex searches
- Database analysis
- Conversational interface

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  HTTP Clients                        │
│            (curl, Postman, browsers)                 │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              TaskManager.Api                         │
│              (ASP.NET Core)                          │
│                                                      │
│  Program.cs → TaskService → SqliteTaskRepository    │
└──────────────────┬──────────────────────────────────┘
                   │
                   │
┌──────────────────▼──────────────────────────────────┐
│              TaskDbContext                           │
│          (Entity Framework Core)                     │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              taskmanager.db                          │
│                 (SQLite)                             │
└──────────────────▲──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│           MCP SQLite Server                          │
│             (Node.js)                                │
└──────────────────▲──────────────────────────────────┘
                   │ stdio
┌──────────────────┴──────────────────────────────────┐
│             Claude Desktop                           │
│            (AI Assistant)                            │
└──────────────────▲──────────────────────────────────┘
                   │
              Natural Language
                   │
┌──────────────────┴──────────────────────────────────┐
│                   User                               │
└─────────────────────────────────────────────────────┘
```

## Contributing

This is a demo project for Tabnine showcasing SQLite integration and MCP server capabilities.

## License

ISC

## Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [SQLite](https://www.sqlite.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)

---

**Project:** TaskManager API  
**Purpose:** Task management with REST API and AI integration  
**Created:** 2025  
**Features:** SQLite persistence + MCP server for Claude Desktop
