# Testing New Fields - Quick Guide

## 🚀 Start the Application

```bash
dotnet run --urls "http://localhost:5050"
```

Then open your browser to: **http://localhost:5050/**

---

## ✅ Quick Test Steps

### 1. Create a Task with All New Fields

1. Fill in the form:
   - **Title:** "Complete project documentation"
   - **Description:** "Write comprehensive docs for the new features"
   - **Assignee:** "Your Name"
   - **Priority:** High Priority
   - **Due Date:** Pick a date next week
   - **Category:** "Documentation"

2. Click "➕ Add Task"

3. **Expected Result:**
   - Task appears in the list below
   - Shows 👤 with your name
   - Shows 🏷️ Documentation
   - Shows ⚡ High in red badge
   - Shows 📅 with the due date
   - Shows 🕒 Created with today's date

### 2. Create a Task with Only Required Fields

1. Fill in only:
   - **Title:** "Quick task"
   - Leave all other fields empty/default

2. Click "➕ Add Task"

3. **Expected Result:**
   - Task appears with just the title
   - Shows ⚡ Medium (default priority)
   - Shows created date
   - No assignee, category, or due date shown

### 3. Test Overdue Task

1. Create a task:
   - **Title:** "Overdue task test"
   - **Due Date:** Pick yesterday's date
   - Leave uncompleted

2. Click "➕ Add Task"

3. **Expected Result:**
   - Due date shows in RED with "(Overdue)" text
   - Example: "📅 1/9/2025 (Overdue)"

### 4. Test Edit Modal

1. Click "✏️ Edit" on any task

2. **Expected Result:**
   - Modal opens
   - All fields populate correctly
   - Can change assignee, priority, due date, category
   - Changes save properly

### 5. Test Priority Colors

Create three tasks with different priorities:
- Low: Shows green badge
- Medium: Shows orange badge  
- High: Shows red badge

### 6. Test Mobile Responsive

1. Resize browser window to mobile size (< 768px)

2. **Expected Result:**
   - Form fields stack vertically
   - Task cards remain readable
   - All functionality works

---

## 🧪 API Testing (Optional)

Test the API directly using curl:

### Create Task with All Fields

```bash
curl -X POST http://localhost:5050/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Task",
    "description": "Testing via API",
    "isCompleted": false,
    "assignee": "API Tester",
    "priority": 2,
    "dueDate": "2025-01-20T00:00:00Z",
    "category": "Testing"
  }'
```

### Get All Tasks

```bash
curl http://localhost:5050/tasks | jq
```

---

## 🐛 Troubleshooting

### Database Issues

If you see errors about missing columns:
```bash
rm taskmanager.db
dotnet run --urls "http://localhost:5050"
```

### Fields Not Showing

1. Check browser console (F12) for JavaScript errors
2. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+F5)
3. Clear browser cache

### Date Format Issues

- Due dates are stored in ISO 8601 format
- Display uses browser's locale format
- Edit uses YYYY-MM-DD format for input

---

## 📊 What to Look For

### ✅ Success Indicators

- [ ] All 5 new fields accept input
- [ ] Priority dropdown has 3 options (Low, Medium, High)
- [ ] Date picker works correctly
- [ ] Task cards show metadata section
- [ ] Priority badges have correct colors
- [ ] Overdue detection works
- [ ] Created date is auto-populated
- [ ] Edit modal populates all fields
- [ ] All fields save/update correctly
- [ ] Search still works
- [ ] Toggle complete preserves all fields
- [ ] Responsive layout works on mobile

### ❌ Known Limitations (Expected)

- No filtering by new fields yet (assignee, category, priority)
- No sorting by due date or priority yet
- Search doesn't include new fields yet
- No validation on date ranges

---

## 📸 Expected UI Layout

### Add Task Form
```
Title: [________________________]
Description: [____________________
              ____________________]

Assignee: [___________]  Priority: [Medium ▼]
Due Date: [📅 picker]   Category: [___________]

[➕ Add Task]
```

### Task Card
```
┌─────────────────────────────────────────┐
│ Task Title                  ✓ Completed │
│ Description text here...                │
│                                         │
│ 👤 John  🏷️ Work  ⚡ High  📅 1/15/25  │
│ 🕒 Created: 1/10/25                     │
│                                         │
│ ID: 1        [↶] [✏️] [🗑️]            │
└─────────────────────────────────────────┘
```

---

## 💡 Tips

1. **Test incrementally:** Add one task at a time to verify each field
2. **Check the database:** Use `sqlite3 taskmanager.db` to inspect data
3. **Use browser DevTools:** Check Network tab to see API requests
4. **Test edge cases:** Empty fields, past dates, long text, special characters

---

## 🎯 Success Criteria

All tests pass if:
1. ✅ Can create tasks with all new fields
2. ✅ Can create tasks with only required fields
3. ✅ Can edit and update all fields
4. ✅ Priority colors display correctly
5. ✅ Overdue detection works
6. ✅ Created date is automatically set
7. ✅ Responsive design works
8. ✅ No console errors
9. ✅ Data persists after page reload

---

**Ready to test?** Run `dotnet run --urls "http://localhost:5050"` and open http://localhost:5050/ in your browser!
