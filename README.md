# Task Manager API

A simple Task Management API built with .NET 9 Minimal APIs and SQLite for data persistence.

## 🎯 Features

- ✅ RESTful API with CRUD operations for tasks
- ✅ SQLite database for data persistence
- ✅ Entity Framework Core for data access
- ✅ Swagger/OpenAPI documentation
- ✅ Search and filter capabilities
- ✅ Clean architecture with repository pattern

## 🏗️ Architecture

```
TaskManager.Api/
├── Data/
│   ├── TaskDbContext.cs          # EF Core DbContext
│   ├── ITaskRepository.cs        # Repository interface
│   └── SqliteTaskRepository.cs   # SQLite implementation
├── Models/
│   └── TaskItem.cs               # Task entity model
├── Services/
│   ├── ITaskService.cs           # Service interface
│   └── TaskService.cs            # Business logic
├── Program.cs                     # Application entry point
└── appsettings.json              # Configuration
```

## 📋 Database Schema

The SQLite database contains a `tasks` table with the following structure:

| Column       | Type     | Description                    |
|-------------|----------|--------------------------------|
| id          | INTEGER  | Primary key (auto-increment)   |
| title       | TEXT     | Task title (required)          |
| description | TEXT     | Task description (optional)    |
| status      | TEXT     | Pending, InProgress, Completed |
| priority    | TEXT     | Low, Medium, High, Critical    |
| due_date    | TEXT     | ISO8601 date string            |
| created_by  | TEXT     | Creator username               |
| created_at  | TEXT     | Creation timestamp             |
| updated_at  | TEXT     | Last update timestamp          |

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQLite 3

### Setup

1. **Clone the repository**
   ```bash
   cd TaskManager.Api
   ```

2. **Initialize the database** (if not already done)
   ```bash
   python3 tools/init_sqlite_db.py
   ```

3. **Restore dependencies**
   ```bash
   dotnet restore
   ```

4. **Build the project**
   ```bash
   dotnet build
   ```

5. **Run the application**
   ```bash
   dotnet run
   ```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger` (in Development mode)

## 📚 API Endpoints

### Get All Tasks
```http
GET /tasks
```

### Search Tasks
```http
GET /tasks/search?query=demo&onlyIncomplete=true
```

**Parameters:**
- `query` (optional): Search term for title/description
- `onlyIncomplete` (optional): Filter out completed tasks

### Get Single Task
```http
GET /tasks/{id}
```

### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "Pending",
  "priority": "Medium",
  "dueDate": "2025-12-31T23:59:59Z",
  "createdBy": "username"
}
```

### Update Task
```http
PUT /tasks/{id}
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "InProgress",
  "priority": "High",
  "dueDate": "2025-12-31T23:59:59Z"
}
```

### Delete Task
```http
DELETE /tasks/{id}
```

## 🧪 Testing with cURL

```bash
# Get all tasks
curl http://localhost:5000/tasks

# Get a specific task
curl http://localhost:5000/tasks/1

# Create a new task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing the API",
    "status": "Pending",
    "priority": "Medium"
  }'

# Update a task
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "status": "Completed",
    "priority": "High"
  }'

# Delete a task
curl -X DELETE http://localhost:5000/tasks/1

# Search tasks
curl "http://localhost:5000/tasks/search?query=demo&onlyIncomplete=true"
```

## 🗄️ Database Management

### View Database Contents
```bash
sqlite3 Data/taskdemo.db "SELECT * FROM tasks;"
```

### Reset Database
```bash
python3 tools/init_sqlite_db.py
```

### Direct Database Access
```bash
sqlite3 Data/taskdemo.db
```

## 📦 NuGet Packages

- **Microsoft.EntityFrameworkCore.Sqlite** (9.0.0) - SQLite database provider
- **Microsoft.EntityFrameworkCore.Design** (9.0.0) - EF Core design-time tools
- **Swashbuckle.AspNetCore** (10.1.0) - Swagger/OpenAPI support

## 🔧 Configuration

Configuration is stored in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "TaskDatabase": "Data Source=Data/taskdemo.db"
  }
}
```

## 📝 Recent Changes

### Migration to SQLite (December 2025)

- ✅ Removed in-memory repository (`InMemoryTaskRepository.cs`)
- ✅ Added Entity Framework Core with SQLite provider
- ✅ Created `TaskDbContext` for database operations
- ✅ Implemented `SqliteTaskRepository` for data persistence
- ✅ Updated `TaskItem` model to match database schema:
  - Changed from `IsCompleted` (bool) to `Status` (string)
  - Added `Priority`, `DueDate`, `CreatedBy`, `CreatedAt`, `UpdatedAt` fields
- ✅ Updated service layer to work with new model structure
- ✅ Added comprehensive `.gitignore` for .NET projects
- ✅ Created configuration files (`appsettings.json`)

## 🎓 Learning Resources

This project demonstrates:
- ✅ .NET 9 Minimal APIs
- ✅ Entity Framework Core with SQLite
- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ Clean Architecture principles
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation

## 📄 License

This is a demo project created for Tabnine demonstration purposes.

## 🤝 Contributing

This is a demo project, but feel free to use it as a learning resource or template for your own projects!
