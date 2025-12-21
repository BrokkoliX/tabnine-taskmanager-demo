using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddSingleton<ITaskRepository, InMemoryTaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

app.MapGet("/", () => "Task Manager API for Tabnine demo");

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
