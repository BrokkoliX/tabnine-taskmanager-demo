using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem> AddAsync(TaskItem task);
    Task<TaskItem?> UpdateAsync(TaskItem task);
    Task<bool> DeleteAsync(int id);
}
