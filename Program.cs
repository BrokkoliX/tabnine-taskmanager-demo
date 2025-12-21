using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register DbContext with SQLite
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TaskDatabase")));

// Register services
builder.Services.AddScoped<ITaskRepository, SqliteTaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1");
    });
}

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
