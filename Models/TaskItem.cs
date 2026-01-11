namespace TaskManager.Api.Models;

public enum Priority
{
    Low = 0,
    Medium = 1,
    High = 2
}

public class TaskItem
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    // Foreign key to User
    public int? AssigneeId { get; set; }

    // Navigation property
    public User? Assignee { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;

    public DateTime? DueDate { get; set; }

    public string? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
