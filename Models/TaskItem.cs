namespace TaskManager.Api.Models;

public class TaskItem
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed

    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical

    public DateTime? DueDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
