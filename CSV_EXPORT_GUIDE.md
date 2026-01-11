# CSV Export Feature Guide

## Overview
The Task Manager now supports exporting tasks to CSV (Comma-Separated Values) format, in addition to Excel export. This provides a lightweight, universal format that can be opened in any spreadsheet application or text editor.

## Features

### ✅ What's Included in CSV Export
- **All task fields**: ID, Title, Description, Status, Assignee, Priority, Due Date, Category, Created At
- **Proper CSV formatting**: Values containing commas, quotes, or newlines are properly escaped
- **UTF-8 encoding**: Supports international characters
- **Same filtering as Excel**: Supports search query and incomplete-only filtering

## How to Use

### From the Web UI
1. **Open the application**: Navigate to http://localhost:5050
2. **Apply filters (optional)**:
   - Enter search text in the search box
   - Check "Show only incomplete tasks" if desired
3. **Click "📄 Export to CSV"** button
4. The CSV file will download automatically with a timestamped filename

### From the API
**Endpoint**: `GET /tasks/export/csv`

**Query Parameters**:
- `query` (optional): Search term to filter tasks
- `onlyIncomplete` (optional): Set to `true` to export only incomplete tasks

**Examples**:
```bash
# Export all tasks
curl "http://localhost:5050/tasks/export/csv?onlyIncomplete=false" -o tasks.csv

# Export only incomplete tasks
curl "http://localhost:5050/tasks/export/csv?onlyIncomplete=true" -o incomplete_tasks.csv

# Export tasks matching a search query
curl "http://localhost:5050/tasks/export/csv?query=MCP&onlyIncomplete=false" -o mcp_tasks.csv
```

## CSV Format

### Header Row
```
ID,Title,Description,Status,Assignee,Priority,Due Date,Category,Created At
```

### Data Example
```csv
1,Create MCP server,Create a new MCP server for SQLight,Pending,Robbie,Medium,2026-01-05,,2026-01-04 08:56:51
2,Complete documentation,"Documentation for CSV, Excel exports",Completed,John,High,2026-01-10,Documentation,2026-01-05 14:30:00
```

### Priority Values
- `Low` = Priority 0
- `Medium` = Priority 1
- `High` = Priority 2

### Status Values
- `Pending` = Incomplete task
- `Completed` = Completed task

### Date Format
- **Due Date**: `yyyy-MM-dd` (e.g., 2026-01-05)
- **Created At**: `yyyy-MM-dd HH:mm:ss` (e.g., 2026-01-04 08:56:51)

## CSV vs Excel Export

| Feature | CSV | Excel |
|---------|-----|-------|
| **File Size** | Smaller | Larger |
| **Formatting** | Plain text | Rich formatting (colors, bold headers) |
| **Compatibility** | Universal | Excel/LibreOffice/Google Sheets |
| **Auto-fit columns** | No | Yes |
| **Best for** | Data import/export, scripts | Presentations, analysis |

## Use Cases

### ✅ When to Use CSV Export
- Import into databases or other applications
- Process data with scripts (Python, PowerShell, etc.)
- Version control friendly (text-based)
- Sharing with users who don't have Excel
- Lightweight file size requirements

### ✅ When to Use Excel Export
- Creating presentations or reports
- Need formatted, professional-looking spreadsheets
- Sharing with Excel users
- Visual data analysis

## Technical Implementation

### Backend (C#)
- **Service Method**: `TaskService.ExportToCsvAsync()`
- **Endpoint**: `Program.cs` - `app.MapGet("/tasks/export/csv", ...)`
- **Encoding**: UTF-8
- **Escaping**: RFC 4180 compliant (values with commas/quotes are wrapped and escaped)

### Frontend (JavaScript)
- **Handler**: `handleExportCsv()` in `app.js`
- **Button**: "📄 Export to CSV" in the search controls section

## Troubleshooting

### Issue: CSV file contains garbled characters
**Solution**: Make sure you're opening the CSV with UTF-8 encoding
- Excel: Data > From Text/CSV > File Origin: UTF-8
- Google Sheets: File > Import > UTF-8 encoding

### Issue: Commas in descriptions break columns
**Solution**: This is already handled! Values with commas are automatically wrapped in quotes

### Issue: Export button not working
**Solution**: 
1. Check browser console for JavaScript errors
2. Verify the API is running on http://localhost:5050
3. Try refreshing the page

## Files Modified
- `Services/ITaskService.cs` - Added `ExportToCsvAsync` method
- `Services/TaskService.cs` - Implemented CSV export logic
- `Program.cs` - Added `/tasks/export/csv` endpoint
- `wwwroot/index.html` - Added CSV export button
- `wwwroot/app.js` - Added CSV export handler

## Related Documentation
- [Excel Export Guide](EXCEL_EXPORT_GUIDE.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [API Documentation](README.md)
