using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;

    public TaskService(ITaskRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<TaskItem>> GetAllAsync() => _repository.GetAllAsync();

    public async Task<IEnumerable<TaskItem>> SearchAsync(string? query, bool onlyIncomplete)
    {
        var tasks = await _repository.GetAllAsync();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var normalized = query.Trim().ToLowerInvariant();

            tasks = tasks.Where(t =>
                (!string.IsNullOrEmpty(t.Title) && t.Title.ToLowerInvariant().Contains(normalized)) ||
                (!string.IsNullOrEmpty(t.Description) && t.Description!.ToLowerInvariant().Contains(normalized)));
        }

        if (onlyIncomplete)
        {
            tasks = tasks.Where(t => t.Status != "Completed");
        }

        return tasks;
    }

    public Task<TaskItem?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

    public Task<TaskItem> CreateAsync(TaskItem task)
    {
        if (string.IsNullOrWhiteSpace(task.Title))
        {
            throw new ArgumentException("Task title is required.", nameof(task));
        }

        task.Id = 0;
        return _repository.AddAsync(task);
    }

    public async Task<TaskItem?> UpdateAsync(int id, TaskItem task)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return null;
        }

        existing.Title = task.Title;
        existing.Description = task.Description;
        existing.Status = task.Status;
        existing.Priority = task.Priority;
        existing.DueDate = task.DueDate;

        return await _repository.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);
}
