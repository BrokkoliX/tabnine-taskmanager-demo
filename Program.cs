using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with SQLite
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=taskmanager.db"));

// Register services
builder.Services.AddScoped<ITaskRepository, SqliteTaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TaskDbContext>();
    dbContext.Database.EnsureCreated();
}

// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Get all tasks
app.MapGet("/tasks", async (ITaskService service) =>
{
    var tasks = await service.GetAllAsync();
    return Results.Ok(tasks);
});

// Search tasks (Scenario 2A uses this)
app.MapGet("/tasks/search", async (string? query, bool onlyIncomplete, ITaskService service) =>
{
    var tasks = await service.SearchAsync(query, onlyIncomplete);
    return Results.Ok(tasks);
});

// Export tasks to Excel
app.MapGet("/tasks/export", async (string? query, bool onlyIncomplete, ITaskService service) =>
{
    var excelData = await service.ExportToExcelAsync(query, onlyIncomplete);
    var fileName = $"tasks_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx";
    return Results.File(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
});

// Get a single task
app.MapGet("/tasks/{id:int}", async (int id, ITaskService service) =>
{
    var task = await service.GetByIdAsync(id);
    return task is null ? Results.NotFound() : Results.Ok(task);
});

// Create a new task
app.MapPost("/tasks", async (TaskItem task, ITaskService service) =>
{
    var created = await service.CreateAsync(task);
    return Results.Created($"/tasks/{created.Id}", created);
});

// Update an existing task
app.MapPut("/tasks/{id:int}", async (int id, TaskItem task, ITaskService service) =>
{
    var updated = await service.UpdateAsync(id, task);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

// Delete a task
app.MapDelete("/tasks/{id:int}", async (int id, ITaskService service) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
