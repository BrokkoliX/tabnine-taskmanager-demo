# Users Table Implementation Guide

## Overview
The Task Manager now uses a separate `Users` table with proper relational database design. Tasks are linked to users through a foreign key relationship instead of storing assignee names as strings.

## What Changed

### Database Schema

#### Users Table
```sql
CREATE TABLE Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Department TEXT NULL,
    IsActive INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL
);
```

#### Tasks Table (Updated)
```sql
CREATE TABLE Tasks (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Title TEXT NOT NULL,
    Description TEXT NULL,
    IsCompleted INTEGER NOT NULL,
    AssigneeId INTEGER NULL,  -- Foreign Key to Users table
    Priority INTEGER NOT NULL,
    DueDate TEXT NULL,
    Category TEXT NULL,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (AssigneeId) REFERENCES Users(Id) ON DELETE SET NULL
);
```

### Key Features

✅ **Referential Integrity**: Foreign key constraint ensures assignees are valid users  
✅ **Unique Emails**: Users must have unique email addresses  
✅ **Soft Delete Support**: When a user is deleted, tasks are set to NULL (not deleted)  
✅ **Active/Inactive Users**: Users can be marked as inactive without deletion  
✅ **Department Tracking**: Users can be organized by department  
✅ **Circular Reference Handling**: JSON serialization properly handles User ↔ Task relationships  

## API Endpoints

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/active` | Get only active users |
| GET | `/users/{id}` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

### User API Examples

**Create a User:**
```bash
curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "isActive": true
  }'
```

**Get Active Users:**
```bash
curl http://localhost:5050/users/active
```

**Update User:**
```bash
curl -X PUT http://localhost:5050/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john@example.com",
    "department": "Product",
    "isActive": true
  }'
```

## Task Assignment

### Creating Tasks with Assignees

**Old Way (String):**
```json
{
  "title": "Task title",
  "assignee": "John Doe"
}
```

**New Way (Foreign Key):**
```json
{
  "title": "Task title",
  "assigneeId": 1
}
```

### Example: Create Task with Assignee
```bash
curl -X POST http://localhost:5050/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement feature",
    "description": "Add new functionality",
    "assigneeId": 1,
    "priority": 1,
    "isCompleted": false
  }'
```

### Task Response Format
```json
{
  "id": 1,
  "title": "Implement feature",
  "description": "Add new functionality",
  "isCompleted": false,
  "assigneeId": 1,
  "assignee": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "isActive": true,
    "createdAt": "2026-01-08T08:00:00Z"
  },
  "priority": 1,
  "dueDate": null,
  "category": null,
  "createdAt": "2026-01-08T08:30:00Z"
}
```

## UI Changes

### Assignee Selection
- Changed from text input to dropdown select
- Dropdown populated with active users from the database
- Users are loaded on page load
- "-- No Assignee --" option for unassigned tasks

### Display
- Assignee name is displayed from the `User` object: `task.assignee.name`
- Shows full user information when viewing task details

## Implementation Details

### Models

**User.cs:**
```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? Department { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<TaskItem> AssignedTasks { get; set; }
}
```

**TaskItem.cs (Updated):**
```csharp
public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    
    // Foreign key
    public int? AssigneeId { get; set; }
    
    // Navigation property
    public User? Assignee { get; set; }
    
    // ... other properties
}
```

### Repositories

**IUserRepository.cs** - User data access interface  
**UserRepository.cs** - User data access implementation  
**SqliteTaskRepository.cs** - Updated to include `.Include(t => t.Assignee)` for eager loading

### Services

- JSON serialization configured with `ReferenceHandler.IgnoreCycles`
- Prevents circular reference errors when serializing User ↔ Task relationships

## Migration Process

### Automated Migration

Run the provided migration script:
```bash
bash migrate-to-users-table.sh
```

This will:
1. Backup the existing database
2. Stop the running application
3. Delete the old database
4. Prepare for new schema creation

### Seed Sample Data

After migration, seed users:
```bash
bash seed-users.sh
```

This creates 4 sample users:
- Robbie Szekely (Engineering)
- John Doe (Product)
- Jane Smith (Design)
- Bob Johnson (Marketing)

### Manual Migration

1. Backup database: `cp taskmanager.db taskmanager.db.backup`
2. Stop application
3. Delete database: `rm taskmanager.db*`
4. Start application (new schema auto-created)
5. Add users via API

## Files Added/Modified

### New Files
- `Models/User.cs` - User entity model
- `Data/IUserRepository.cs` - User repository interface
- `Data/UserRepository.cs` - User repository implementation
- `migrate-to-users-table.sh` - Migration script
- `seed-users.sh` - Seed data script
- `USERS_TABLE_IMPLEMENTATION.md` - This documentation

### Modified Files
- `Models/TaskItem.cs` - Added AssigneeId FK and Assignee navigation property
- `Data/TaskDbContext.cs` - Added Users DbSet and relationship configuration
- `Data/SqliteTaskRepository.cs` - Added eager loading for Assignee
- `Services/TaskService.cs` - Updated exports to use `task.Assignee.Name`
- `Program.cs` - Added user endpoints and JSON cycle handling
- `wwwroot/index.html` - Changed assignee inputs to select dropdowns
- `wwwroot/app.js` - Added user loading and dropdown population

## Benefits

### Data Integrity
- ✅ No duplicate user information
- ✅ Consistent user data across all tasks
- ✅ Email uniqueness enforced
- ✅ Foreign key constraints prevent invalid assignments

### Flexibility
- ✅ Easy to update user information (changes reflect in all tasks)
- ✅ Can track user details (department, email, status)
- ✅ Can filter/search by user properties
- ✅ Support for inactive users without data loss

### Reporting
- ✅ Easy to query tasks by user
- ✅ Can analyze workload per user/department
- ✅ Better data for exports and analytics

## Troubleshooting

### Issue: "User not found" when creating task
**Solution**: Ensure the user ID exists in the Users table. Use `/users/active` to get valid user IDs.

### Issue: Circular reference error
**Solution**: Already handled with `ReferenceHandler.IgnoreCycles` in Program.cs

### Issue: Assignee dropdown is empty
**Solution**: 
1. Check browser console for errors
2. Verify `/users/active` endpoint returns users
3. Check that users are marked as `isActive: true`

### Issue: Old tasks showing no assignee
**Solution**: This is expected after migration. Old string-based assignee data cannot be automatically converted. You'll need to:
1. Manually update tasks to assign proper users
2. Or keep old data as reference and create new tasks

## Future Enhancements

Potential improvements:
- [ ] User roles and permissions
- [ ] User avatars/profile pictures
- [ ] User search and filtering in UI
- [ ] Bulk task assignment
- [ ] User workload dashboard
- [ ] Email notifications to assignees
- [ ] Task reassignment history

---

**Migration Date**: January 8, 2026  
**Status**: ✅ Complete and Tested
