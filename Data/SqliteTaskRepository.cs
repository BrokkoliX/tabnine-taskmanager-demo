using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public class SqliteTaskRepository : ITaskRepository
{
    private readonly TaskDbContext _context;

    public SqliteTaskRepository(TaskDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        return await _context.Tasks
            .Include(t => t.Assignee)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _context.Tasks
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<TaskItem> AddAsync(TaskItem task)
    {
        // Reset the ID to let the database generate it
        task.Id = 0;
        
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        
        // Reload to get the Assignee navigation property
        if (task.AssigneeId.HasValue)
        {
            await _context.Entry(task).Reference(t => t.Assignee).LoadAsync();
        }
        
        return task;
    }

    public async Task<TaskItem?> UpdateAsync(TaskItem task)
    {
        var existing = await _context.Tasks
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == task.Id);
        
        if (existing == null)
        {
            return null;
        }

        existing.Title = task.Title;
        existing.Description = task.Description;
        existing.IsCompleted = task.IsCompleted;
        existing.AssigneeId = task.AssigneeId;
        existing.Priority = task.Priority;
        existing.DueDate = task.DueDate;
        existing.Category = task.Category;
        // Note: CreatedAt should not be updated

        await _context.SaveChangesAsync();
        
        // Reload to get the updated Assignee navigation property
        await _context.Entry(existing).Reference(t => t.Assignee).LoadAsync();
        
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return false;
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
