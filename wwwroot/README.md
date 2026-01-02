# Task Manager UI

A simple, modern web interface for the Task Manager API.

## Features

- ✅ **Add Tasks** - Create new tasks with title and optional description
- 🔍 **Search & Filter** - Search tasks by text and filter incomplete tasks
- ✏️ **Edit Tasks** - Update task details and completion status
- ✓ **Toggle Completion** - Mark tasks as complete or incomplete
- 🗑️ **Delete Tasks** - Remove tasks you no longer need
- 📱 **Responsive Design** - Works on desktop and mobile devices

## How to Use

1. **Start the Application**
   ```bash
   dotnet run
   ```

2. **Open in Browser**
   - Navigate to `http://localhost:5000` or the URL shown in the console
   - The UI will load automatically

3. **Managing Tasks**
   - **Add a Task**: Fill in the "Add New Task" form and click "➕ Add Task"
   - **Search**: Use the search box to filter tasks by title or description
   - **Filter**: Check "Show only incomplete tasks" to hide completed items
   - **Edit**: Click the "✏️ Edit" button on any task
   - **Complete**: Click "✓ Mark Complete" to toggle task status
   - **Delete**: Click "🗑️ Delete" to remove a task

## Technology Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Modern CSS with gradient backgrounds and smooth animations
- **API**: RESTful endpoints using ASP.NET Core Minimal APIs

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling and animations
- `app.js` - JavaScript for API interactions and DOM manipulation

## API Endpoints Used

- `GET /tasks` - Fetch all tasks
- `GET /tasks/search?query={query}&onlyIncomplete={bool}` - Search tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update an existing task
- `DELETE /tasks/{id}` - Delete a task

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
