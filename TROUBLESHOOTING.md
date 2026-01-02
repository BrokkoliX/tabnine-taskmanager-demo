# Troubleshooting Guide

## Issues Found and Fixed

### Issue 1: Root Path Returning "Task Manager API for Tabnine demo"

**Problem:**
The application had a `MapGet("/")` endpoint that was returning a plain text message instead of serving the UI.

**Root Cause:**
```csharp
app.MapGet("/", () => "Task Manager API for Tabnine demo");
```
This endpoint was catching all requests to the root path before the static file middleware could serve `index.html`.

**Solution:**
Removed the conflicting endpoint. The `UseDefaultFiles()` middleware automatically serves `index.html` when accessing the root path.

**Fixed Code:**
```csharp
// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// The root path now automatically serves wwwroot/index.html
```

---

### Issue 2: Understanding Swagger 403 Error

**Note about Swagger:**
This project doesn't currently have Swagger/OpenAPI configured. If you were trying to access `/swagger`, that endpoint doesn't exist yet.

**To Add Swagger (Optional):**

1. Add the NuGet package:
   ```bash
   dotnet add package Swashbuckle.AspNetCore
   ```

2. Update `Program.cs`:
   ```csharp
   // Add this after builder creation
   builder.Services.AddEndpointsApiExplorer();
   builder.Services.AddSwaggerGen();

   // Add this after app.Build() and before endpoints
   if (app.Environment.IsDevelopment())
   {
       app.UseSwagger();
       app.UseSwaggerUI();
   }
   ```

---

## Current Working Setup

### URL Access:

- **UI (Web Interface):** `http://localhost:5050/`
  - Serves the complete task management interface
  - All CRUD operations available through the UI

- **API Endpoints:**
  - `GET /tasks` - Get all tasks
  - `GET /tasks/{id}` - Get specific task
  - `GET /tasks/search?query=...&onlyIncomplete=true/false` - Search tasks
  - `POST /tasks` - Create task
  - `PUT /tasks/{id}` - Update task
  - `DELETE /tasks/{id}` - Delete task

### How to Run:

```bash
cd /Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api
dotnet run --urls "http://localhost:5050"
```

Then open your browser to: `http://localhost:5050/`

---

## Testing the Setup

### 1. Test the UI
Open `http://localhost:5050/` in your browser. You should see:
- Purple gradient background
- "📋 Task Manager" header
- Form to add new tasks
- Search and filter controls

### 2. Test the API (using curl)

**Get all tasks:**
```bash
curl http://localhost:5050/tasks
```

**Create a task:**
```bash
curl -X POST http://localhost:5050/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Task description","isCompleted":false}'
```

**Search tasks:**
```bash
curl "http://localhost:5050/tasks/search?query=test&onlyIncomplete=false"
```

---

## Common Issues

### Port Already in Use
If port 5050 is taken, use a different port:
```bash
dotnet run --urls "http://localhost:5051"
```

### Static Files Not Serving
Make sure:
1. Files are in the `wwwroot/` folder
2. `UseDefaultFiles()` comes before `UseStaticFiles()`
3. No `MapGet("/")` endpoint is defined
4. The project has been rebuilt: `dotnet build`

### UI Loads But API Doesn't Work
Check the browser console (F12) for errors. Common issues:
- CORS (shouldn't be an issue since UI and API are same origin)
- Network errors (check the API is running)
- JSON parsing errors (check request format)

---

## Verification Checklist

✅ `wwwroot/index.html` exists  
✅ `wwwroot/styles.css` exists  
✅ `wwwroot/app.js` exists  
✅ `UseDefaultFiles()` is called before `UseStaticFiles()`  
✅ No `MapGet("/")` endpoint defined  
✅ Application builds successfully  
✅ Application runs without errors  
✅ UI loads at root path  
✅ API endpoints respond correctly  

All checks should pass! 🎉
