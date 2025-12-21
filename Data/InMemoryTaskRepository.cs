using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class InMemoryTaskRepository : ITaskRepository
{
    private readonly List<TaskItem> _tasks = new();
    private int _nextId = 1;
    private readonly object _lock = new();

    public InMemoryTaskRepository()
    {
        // Seed with a few example tasks
        _tasks.Add(new TaskItem
        {
            Id = _nextId++,
            Title = "Prepare Tabnine demo",
            Description = "Create small C# API to showcase Tabnine capabilities.",
            IsCompleted = false
        });

        _tasks.Add(new TaskItem
        {
            Id = _nextId++,
            Title = "Review pull requests",
            Description = "Look at today's PRs in the main repo.",
            IsCompleted = false
        });

        _tasks.Add(new TaskItem
        {
            Id = _nextId++,
            Title = "Refactor old code",
            Description = "Cleanup obsolete services.",
            IsCompleted = true
        });
    }

    public Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        IEnumerable<TaskItem> result;
        lock (_lock)
        {
            // Clone to avoid external modification
            result = _tasks.Select(t => Clone(t)).ToList();
        }
        return Task.FromResult(result);
    }

    public Task<TaskItem?> GetByIdAsync(int id)
    {
        TaskItem? result;
        lock (_lock)
        {
            result = _tasks.FirstOrDefault(t => t.Id == id);
            result = result is null ? null : Clone(result);
        }
        return Task.FromResult(result);
    }

    public Task<TaskItem> AddAsync(TaskItem task)
    {
        TaskItem newTask;
        lock (_lock)
        {
            newTask = Clone(task);
            newTask.Id = _nextId++;
            _tasks.Add(newTask);
            newTask = Clone(newTask);
        }
        return Task.FromResult(newTask);
    }

    public Task<TaskItem?> UpdateAsync(TaskItem task)
    {
        TaskItem? updated = null;
        lock (_lock)
        {
            var existing = _tasks.FirstOrDefault(t => t.Id == task.Id);
            if (existing is null)
            {
                return Task.FromResult<TaskItem?>(null);
            }

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.IsCompleted = task.IsCompleted;

            updated = Clone(existing);
        }

        return Task.FromResult<TaskItem?>(updated);
    }

    public Task<bool> DeleteAsync(int id)
    {
        bool removed;
        lock (_lock)
        {
            removed = _tasks.RemoveAll(t => t.Id == id) > 0;
        }

        return Task.FromResult(removed);
    }

    private static TaskItem Clone(TaskItem task)
        => new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted
        };
}
