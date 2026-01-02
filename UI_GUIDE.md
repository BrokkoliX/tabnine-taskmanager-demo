# Task Manager UI Guide

## 🎉 Quick Start

Your Task Manager now has a beautiful web interface! Here's how to use it:

### 1. Run the Application

```bash
dotnet run
```

### 2. Access the UI

Open your browser and navigate to one of these URLs (check the console output for the exact URL):
- `http://localhost:5000`
- `https://localhost:5001`

The UI will automatically load at the root path!

---

## 📋 UI Features

### Add New Tasks
1. Enter a task title in the "Add New Task" section (required)
2. Optionally add a description
3. Click "➕ Add Task"
4. Your task appears instantly in the list below

### Search & Filter Tasks
- **Search**: Type in the search box to find tasks by title or description
- **Filter**: Check "Show only incomplete tasks" to hide completed items
- **Clear**: Click "✖️ Clear" to reset search and show all tasks

### Manage Tasks
Each task card includes:
- **Task Title & Status**: See if it's completed or pending
- **Description**: Optional details about the task
- **Task ID**: Unique identifier for each task

### Task Actions
- **✓ Mark Complete / ↶ Mark Incomplete**: Toggle task completion status
- **✏️ Edit**: Opens a modal to update title, description, and status
- **🗑️ Delete**: Remove the task (with confirmation prompt)

---

## 🎨 UI Design

The interface features:
- **Modern gradient background** (purple/blue)
- **Clean card-based layout** for tasks
- **Color-coded status badges**:
  - 🟠 Orange "○ Pending" for incomplete tasks
  - 🟢 Green "✓ Completed" for finished tasks
- **Smooth animations** on hover and interactions
- **Responsive design** that works on mobile and desktop

---

## 🛠️ Technical Details

### File Structure
```
wwwroot/
├── index.html      # Main UI structure
├── styles.css      # Styling and animations
├── app.js          # JavaScript functionality
└── README.md       # UI documentation
```

### How It Works
1. **Static Files**: ASP.NET Core serves files from `wwwroot/`
2. **API Calls**: JavaScript makes fetch requests to `/tasks` endpoints
3. **Dynamic Updates**: DOM is updated in real-time as you interact

### API Integration
The UI uses these endpoints:
- `GET /tasks` - Load all tasks
- `GET /tasks/search?query=...&onlyIncomplete=...` - Search
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

---

## 💡 Tips

1. **Fast Task Creation**: Press Tab to move between title and description fields
2. **Quick Search**: Press Enter in the search box to search immediately
3. **Bulk Actions**: Complete tasks quickly by clicking the completion toggle
4. **Visual Feedback**: Success notifications appear when tasks are added/updated/deleted

---

## 🐛 Troubleshooting

### UI Not Loading?
- Make sure `UseDefaultFiles()` and `UseStaticFiles()` are in `Program.cs`
- Check that files are in the `wwwroot/` folder
- Verify the build succeeded: `dotnet build`

### API Not Working?
- Check browser console (F12) for errors
- Verify the API is running on the same port as the UI
- CORS issues? Make sure you're accessing from the same origin

### Styles Not Applying?
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that `styles.css` is in `wwwroot/`

---

## 🚀 Next Steps

You can enhance the UI by:
- Adding task categories or tags
- Implementing due dates
- Adding priority levels
- Creating drag-and-drop reordering
- Adding dark mode toggle
- Implementing user authentication

Enjoy your new Task Manager UI! 🎊
