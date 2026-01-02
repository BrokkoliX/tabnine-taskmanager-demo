# Migration from In-Memory to SQLite Database

## Summary
Successfully migrated the TaskManager API from using an in-memory database to SQLite with Entity Framework Core.

## Changes Made

### 1. Updated Dependencies (TaskManager.Api.csproj)
Added the following NuGet packages:
- `Microsoft.EntityFrameworkCore.Sqlite` (9.0.0)
- `Microsoft.EntityFrameworkCore.Design` (9.0.0)

### 2. Created New Files

#### Data/TaskDbContext.cs
- Entity Framework Core DbContext for managing TaskItem entities
- Configures the database schema for the Tasks table
- Defines entity relationships and constraints

#### Data/SqliteTaskRepository.cs
- New implementation of `ITaskRepository` interface
- Uses Entity Framework Core for all database operations
- Replaces the `InMemoryTaskRepository` implementation
- Provides async operations for CRUD functionality

#### appsettings.json
- Configuration file with connection string
- Default connection points to `taskmanager.db` in the application directory

### 3. Modified Files

#### Program.cs
- Added `using Microsoft.EntityFrameworkCore;`
- Registered `TaskDbContext` with SQLite provider
- Changed repository registration from Singleton to Scoped
- Replaced `InMemoryTaskRepository` with `SqliteTaskRepository`
- Added database initialization on startup using `EnsureCreated()`

## Database Details

### Connection String
```
Data Source=taskmanager.db
```

The SQLite database file will be created in the application's root directory.

### Schema
The database has a single `Tasks` table with the following structure:
- `Id` (INTEGER, Primary Key, Auto-increment)
- `Title` (TEXT, Required)
- `Description` (TEXT, Nullable)
- `IsCompleted` (INTEGER/BOOLEAN, Required)

## How to Use

### Running the Application
```bash
dotnet run
```

The database file `taskmanager.db` will be automatically created on first run.

### Deleting the Database
To start fresh, simply delete the `taskmanager.db` file:
```bash
rm taskmanager.db
```

### Using Migrations (Optional)
If you want to use EF Core migrations instead of `EnsureCreated()`:

1. Remove the `EnsureCreated()` code from Program.cs
2. Create initial migration:
   ```bash
   dotnet ef migrations add InitialCreate
   ```
3. Apply migrations:
   ```bash
   dotnet ef database update
   ```

## Benefits of SQLite

1. **Data Persistence**: Data survives application restarts
2. **File-Based**: Easy to backup, copy, or version control
3. **Zero Configuration**: No server setup required
4. **Production Ready**: Suitable for small to medium applications
5. **Easy Testing**: Can use in-memory SQLite for unit tests

## API Behavior

All API endpoints remain the same. The change is transparent to API consumers:
- `GET /tasks` - Get all tasks
- `GET /tasks/search` - Search tasks
- `GET /tasks/{id}` - Get single task
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## MCP Server Integration 🤖

An MCP (Model Context Protocol) server has been added in the `mcp-sqlite-server/` directory. This allows AI assistants like Claude Desktop to directly interact with your SQLite database.

### What is MCP?

MCP is a protocol that allows AI assistants to connect to external tools and data sources. With the MCP server, you can ask Claude to:
- View and search your tasks
- Create new tasks
- Update existing tasks
- Delete tasks
- Run custom SQL queries

### Quick Start

1. **Create the database** (run the .NET app once):
   ```bash
   dotnet run
   ```

2. **Test the MCP server**:
   ```bash
   cd mcp-sqlite-server
   npm test
   ```

3. **Configure Claude Desktop** - See `mcp-sqlite-server/SETUP_GUIDE.md` for detailed instructions

4. **Start using it** - Ask Claude: "Show me all my tasks"

For full setup instructions, see [mcp-sqlite-server/SETUP_GUIDE.md](mcp-sqlite-server/SETUP_GUIDE.md)

## Notes

- The old `InMemoryTaskRepository.cs` is still in the codebase but is no longer used
- You can safely delete it if desired
- The database is created automatically on startup
- All data persists between application restarts
- The MCP server provides AI-assisted task management capabilities
