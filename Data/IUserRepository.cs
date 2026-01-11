using TaskManager.Api.Models;

namespace TaskManager.Api.Data;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User> AddAsync(User user);
    Task<User?> UpdateAsync(User user);
    Task<bool> DeleteAsync(int id);
}
