# Excel Export Feature Guide

## Overview
The Task Manager API now supports exporting tasks to Excel format (.xlsx). This feature allows you to download all tasks or a filtered subset of tasks as a formatted Excel spreadsheet.

## API Endpoint

### Export Tasks to Excel
**Endpoint:** `GET /tasks/export`

**Query Parameters:**
- `query` (optional): Search string to filter tasks by title or description
- `onlyIncomplete` (optional): Boolean flag to export only incomplete tasks (default: false)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File Name: `tasks_export_YYYYMMDD_HHMMSS.xlsx`

## Usage Examples

### 1. Export All Tasks
```
GET http://localhost:5000/tasks/export
```

### 2. Export Only Incomplete Tasks
```
GET http://localhost:5000/tasks/export?onlyIncomplete=true
```

### 3. Export Tasks Matching a Search Query
```
GET http://localhost:5000/tasks/export?query=urgent
```

### 4. Export Incomplete Tasks Matching a Search Query
```
GET http://localhost:5000/tasks/export?query=bug&onlyIncomplete=true
```

## Excel File Format

The exported Excel file includes the following columns:

| Column | Description |
|--------|-------------|
| ID | Task identifier |
| Title | Task title |
| Description | Task description |
| Status | Completed or Pending |
| Assignee | Person assigned to the task |
| Priority | Low, Medium, or High |
| Due Date | Task due date (YYYY-MM-DD format) |
| Category | Task category |
| Created At | Task creation timestamp (YYYY-MM-DD HH:MM:SS format) |

### Features
- **Formatted Headers**: Bold text with gray background
- **Auto-sized Columns**: Columns automatically adjust to content width
- **Proper Date Formatting**: Dates are formatted consistently
- **Status Display**: Shows "Completed" or "Pending" instead of true/false

## Integration with UI

To add an export button to your web interface, you can use the following HTML:

```html
<button onclick="exportTasks()">Export to Excel</button>

<script>
function exportTasks() {
    // Export all tasks
    window.location.href = '/tasks/export';
    
    // Or with filters:
    // window.location.href = '/tasks/export?onlyIncomplete=true';
    // window.location.href = '/tasks/export?query=urgent&onlyIncomplete=true';
}
</script>
```

## Technical Details

### Dependencies
- **EPPlus 7.0.0**: Used for Excel file generation
- License Context: NonCommercial (can be changed in `TaskService.cs` if needed)

### Implementation
The export functionality is implemented in:
- `Services/ITaskService.cs` - Interface definition
- `Services/TaskService.cs` - Implementation with EPPlus
- `Program.cs` - API endpoint registration

### Code Example
```csharp
// In TaskService.cs
public async Task<byte[]> ExportToExcelAsync(string? query = null, bool onlyIncomplete = false)
{
    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
    var tasks = await SearchAsync(query, onlyIncomplete);
    
    using var package = new ExcelPackage();
    var worksheet = package.Workbook.Worksheets.Add("Tasks");
    
    // Headers, data population, and formatting...
    
    return package.GetAsByteArray();
}
```

## Testing

You can test the export feature using:

1. **Browser**: Simply navigate to `http://localhost:5000/tasks/export`
2. **cURL**:
   ```bash
   curl -o tasks.xlsx http://localhost:5000/tasks/export
   ```
3. **Postman/Insomnia**: Create a GET request to the endpoint

## Troubleshooting

### Issue: File downloads as binary data instead of Excel file
**Solution**: Ensure your browser or HTTP client properly handles the `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` content type.

### Issue: Empty Excel file
**Solution**: Check that you have tasks in your database. The export will create a file with headers even if no tasks exist.

### Issue: License error
**Solution**: The code is configured for NonCommercial use. If you need commercial licensing, update the `LicenseContext` in `TaskService.cs` and ensure you have a valid EPPlus license.

## Future Enhancements

Potential improvements to consider:
- Additional filtering options (by category, assignee, due date range)
- Custom column selection
- Multiple worksheet support (e.g., separate sheets for completed/incomplete)
- Chart generation
- Template-based exports
- Scheduled exports
