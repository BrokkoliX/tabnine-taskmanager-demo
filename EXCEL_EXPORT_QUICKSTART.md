# Excel Export - Quick Start Guide

## 🚀 Quick Start

### Using the Web Interface
1. **Start the application**: `dotnet run`
2. **Open browser**: Navigate to `http://localhost:5000`
3. **Optional**: Apply filters (search or "incomplete only")
4. **Click**: "📊 Export to Excel" button
5. **Done**: Excel file downloads automatically!

### Using the API Directly

```bash
# Export all tasks
curl -o my_tasks.xlsx http://localhost:5000/tasks/export

# Export filtered tasks
curl -o incomplete.xlsx "http://localhost:5000/tasks/export?onlyIncomplete=true"
```

## 📊 What You Get

Your Excel file will include:
- **All task details**: ID, Title, Description, Status, Assignee, Priority, Due Date, Category, Created At
- **Professional formatting**: Bold headers, auto-sized columns, color-coded
- **Timestamp filename**: `tasks_export_20250107_143022.xlsx`

## 🎯 Common Use Cases

### Export All Tasks
Just click the "Export to Excel" button without any filters.

### Export Incomplete Tasks Only
1. Check "Show only incomplete tasks"
2. Click "📊 Export to Excel"

### Export Specific Tasks
1. Enter search term (e.g., "urgent", "bug", "meeting")
2. Click "📊 Export to Excel"

### Export Filtered Results
1. Enter search term AND check "incomplete only"
2. Click "📊 Export to Excel"

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks/export` | GET | Export all tasks |
| `/tasks/export?onlyIncomplete=true` | GET | Export incomplete tasks |
| `/tasks/export?query=text` | GET | Export tasks matching search |
| `/tasks/export?query=text&onlyIncomplete=true` | GET | Export filtered tasks |

## 💡 Tips

- The export respects your current filters
- No need to manually save - file downloads automatically
- Works on all devices and browsers
- File can be opened in Excel, Google Sheets, or any spreadsheet app
- Each export gets a unique timestamped filename

## ⚠️ Important Notes

- **License**: Currently configured for non-commercial use
- **Performance**: Optimized for typical task lists (hundreds of tasks)
- **Format**: Excel 2007+ (.xlsx format)

## 🐛 Troubleshooting

**File doesn't download?**
- Check your browser's download settings
- Ensure pop-ups aren't blocked

**Empty file?**
- Verify you have tasks in your database
- Check if your filters are too restrictive

**Can't open file?**
- Ensure you have Excel, LibreOffice, or Google Sheets
- File must have .xlsx extension

## 📚 More Information

- Full documentation: See `EXCEL_EXPORT_GUIDE.md`
- Implementation details: See `EXCEL_EXPORT_SUMMARY.md`
- General help: See main `README.md`

---

**That's it! Happy exporting! 🎉**
