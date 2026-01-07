using OfficeOpenXml;
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
            tasks = tasks.Where(t => !t.IsCompleted);
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
        existing.IsCompleted = task.IsCompleted;

        return await _repository.UpdateAsync(existing);
    }

    public Task<bool> DeleteAsync(int id) => _repository.DeleteAsync(id);

    public async Task<byte[]> ExportToExcelAsync(string? query = null, bool onlyIncomplete = false)
    {
        // Set EPPlus license context (required for non-commercial use)
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        var tasks = await SearchAsync(query, onlyIncomplete);

        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Tasks");

        // Add headers
        worksheet.Cells[1, 1].Value = "ID";
        worksheet.Cells[1, 2].Value = "Title";
        worksheet.Cells[1, 3].Value = "Description";
        worksheet.Cells[1, 4].Value = "Status";
        worksheet.Cells[1, 5].Value = "Assignee";
        worksheet.Cells[1, 6].Value = "Priority";
        worksheet.Cells[1, 7].Value = "Due Date";
        worksheet.Cells[1, 8].Value = "Category";
        worksheet.Cells[1, 9].Value = "Created At";

        // Style headers
        using (var range = worksheet.Cells[1, 1, 1, 9])
        {
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
            range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
        }

        // Add data
        int row = 2;
        foreach (var task in tasks)
        {
            worksheet.Cells[row, 1].Value = task.Id;
            worksheet.Cells[row, 2].Value = task.Title;
            worksheet.Cells[row, 3].Value = task.Description ?? string.Empty;
            worksheet.Cells[row, 4].Value = task.IsCompleted ? "Completed" : "Pending";
            worksheet.Cells[row, 5].Value = task.Assignee ?? string.Empty;
            worksheet.Cells[row, 6].Value = task.Priority.ToString();
            worksheet.Cells[row, 7].Value = task.DueDate?.ToString("yyyy-MM-dd") ?? string.Empty;
            worksheet.Cells[row, 8].Value = task.Category ?? string.Empty;
            worksheet.Cells[row, 9].Value = task.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
            row++;
        }

        // Auto-fit columns
        worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

        // Return as byte array
        return package.GetAsByteArray();
    }
}
