using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with SQLite
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=taskmanager.db"));

// Configure JSON serialization to handle circular references
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Register services
builder.Services.AddScoped<ITaskRepository, SqliteTaskRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
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

// Export tasks to CSV
app.MapGet("/tasks/export/csv", async (string? query, bool onlyIncomplete, ITaskService service) =>
{
    var csvData = await service.ExportToCsvAsync(query, onlyIncomplete);
    var fileName = $"tasks_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
    return Results.File(csvData, "text/csv", fileName);
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

// ===== USER MANAGEMENT ENDPOINTS =====

// Get all users
app.MapGet("/users", async (IUserRepository repository) =>
{
    var users = await repository.GetAllAsync();
    return Results.Ok(users);
});

// Get active users only
app.MapGet("/users/active", async (IUserRepository repository) =>
{
    var users = await repository.GetActiveUsersAsync();
    return Results.Ok(users);
});

// Get a single user
app.MapGet("/users/{id:int}", async (int id, IUserRepository repository) =>
{
    var user = await repository.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

// Create a new user
app.MapPost("/users", async (User user, IUserRepository repository) =>
{
    // Check if email already exists
    var existing = await repository.GetByEmailAsync(user.Email);
    if (existing != null)
    {
        return Results.BadRequest(new { error = "A user with this email already exists" });
    }

    var created = await repository.AddAsync(user);
    return Results.Created($"/users/{created.Id}", created);
});

// Update an existing user
app.MapPut("/users/{id:int}", async (int id, User user, IUserRepository repository) =>
{
    user.Id = id;
    var updated = await repository.UpdateAsync(user);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

// Delete a user
app.MapDelete("/users/{id:int}", async (int id, IUserRepository repository) =>
{
    var deleted = await repository.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
