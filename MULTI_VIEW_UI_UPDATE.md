# Multi-View UI with User Management

## Overview
The Task Manager application has been reorganized into a multi-view architecture with sidebar navigation, enabling better scalability for future features. A complete User Management interface has been added alongside the existing Tasks view.

## What Was Changed

### 1. **HTML Structure** (`wwwroot/index.html`)

#### Added Sidebar Navigation
- Fixed sidebar menu on the left side
- Menu items for "Tasks" and "Users"
- Responsive design that adapts to screen size

#### Reorganized Content
- Wrapped existing task management in a "Tasks View"
- Added new "Users View" with complete user management UI
- Both views exist in the same page and switch dynamically

#### New User Management UI Components
- **Add User Form**: Name, Email, Department fields
- **User Search/Filter**: Search users by name, email, or department
- **User List Display**: Shows all users with details
- **Edit User Modal**: Update user information and active status

### 2. **CSS Styling** (`wwwroot/styles.css`)

#### Sidebar Styles
```css
- Sidebar: 250px fixed width on desktop
- Gradient background matching the app theme
- Active menu item highlighting with left border
- Menu items with icons and hover effects
```

#### Layout Adjustments
```css
- Main content area: Offset by sidebar width
- Views: Hidden by default, shown when active
- Container: Expanded max-width (1200px) for more content
```

#### Responsive Design
```css
- Tablet (≤768px): 200px sidebar
- Mobile (≤480px): 60px icon-only sidebar
  - Menu text hidden
  - Icons centered
  - Vertical title text
```

### 3. **JavaScript Functionality** (`wwwroot/app.js`)

#### View Switching System
```javascript
switchView(viewName)
- Updates active menu item
- Shows/hides views
- Loads data for selected view
```

#### User Management Functions

**CRUD Operations:**
- `loadUsersForDisplay()` - Fetch and display all users
- `handleAddUser()` - Create new user
- `handleEditUser()` - Update existing user
- `deleteUser()` - Remove user with confirmation
- `toggleUserActive()` - Activate/deactivate user

**Search & Filter:**
- `handleUserSearch()` - Search by name, email, department
- `handleClearUserSearch()` - Reset search filters
- Filter active/inactive users

**UI Functions:**
- `displayUsers()` - Render user list with cards
- `openEditUserModal()` - Open edit modal with user data
- `closeEditUserModal()` - Close edit modal
- `showUserLoading()` - Loading state
- `showUserError()` - Error messages

## Features

### Sidebar Navigation
✅ **Scalable menu system** - Easy to add more views
✅ **Visual active state** - Clear indication of current view
✅ **Responsive design** - Adapts to mobile, tablet, desktop
✅ **Smooth transitions** - Professional feel

### User Management View

#### View Users
- Display all users in card format
- Show user details: Name, Email, Department
- Display active/inactive status
- Show created date and assigned task count
- Filter active/inactive users
- Search by name, email, or department

#### Add New User
- Required fields: Name, Email
- Optional field: Department
- Automatically set as active
- Form validation
- Success notification

#### Edit User
- Update name, email, department
- Toggle active/inactive status
- Modal dialog interface
- Save changes with validation

#### Delete User
- Confirmation dialog
- Permanent deletion
- Updates task assignee dropdowns
- Success notification

#### Additional Features
- Real-time search and filtering
- User count display
- Assigned tasks count per user
- Status badges (Active/Inactive)
- Clean, consistent UI with tasks

## User Interface Elements

### Users View Layout
```
┌─────────────────────────────────────┐
│ 👥 Users                            │
│ Manage users and assignees          │
├─────────────────────────────────────┤
│ Add New User                        │
│ [Name] [Email]                      │
│ [Department]                        │
│ [➕ Add User]                       │
├─────────────────────────────────────┤
│ Filter Users                        │
│ [Search...] ☑ Active only           │
│ [🔍 Search] [✖️ Clear]              │
├─────────────────────────────────────┤
│ Users                    (X users)  │
│ ┌─────────────────────────────────┐ │
│ │ John Doe          ✓ Active      │ │
│ │ 📧 john@example.com             │ │
│ │ 🏢 Engineering                  │ │
│ │ 📅 Created: 1/15/2025           │ │
│ │ 🎯 Assigned Tasks: 5            │ │
│ │ [⏸️ Deactivate] [✏️ Edit] [🗑️] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Sidebar Layout
```
┌────────────┐
│ 📋 Task    │
│  Manager   │
├────────────┤
│ ✓ Tasks  ◄─┼─ Active
│            │
│ 👥 Users   │
│            │
└────────────┘
```

## API Integration

### Endpoints Used
```
GET    /users        - Get all users
GET    /users/active - Get only active users
POST   /users        - Create user
PUT    /users/{id}   - Update user
DELETE /users/{id}   - Delete user
```

### Request/Response Examples

**Create User:**
```json
POST /users
{
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering",
  "isActive": true
}
```

**Update User:**
```json
PUT /users/1
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Sales",
  "isActive": false
}
```

## How to Use

### Switching Views
1. Click on "Tasks" or "Users" in the sidebar
2. View automatically switches
3. Data loads for selected view

### Managing Users

#### Add a User
1. Navigate to Users view
2. Fill in Name and Email (required)
3. Optionally add Department
4. Click "➕ Add User"
5. User appears in the list immediately

#### Edit a User
1. Click "✏️ Edit" on any user card
2. Modify fields in the modal
3. Toggle active status if needed
4. Click "💾 Save Changes"

#### Search Users
1. Type in the search box
2. Click "🔍 Search" or press Enter
3. Results filter by name, email, or department
4. Use "Show only active users" checkbox
5. Click "✖️ Clear" to reset

#### Deactivate/Activate User
1. Click "⏸️ Deactivate" or "▶️ Activate"
2. User status updates immediately
3. Inactive users shown with different styling

#### Delete User
1. Click "🗑️ Delete" on user card
2. Confirm deletion in dialog
3. User removed from database

## Technical Details

### State Management
```javascript
- Global users array for dropdowns
- View-specific data loading
- No page reloads (SPA behavior)
```

### Event Handling
```javascript
- Menu click → switchView()
- Form submit → handleAddUser() / handleEditUser()
- Search → handleUserSearch()
- Delete → deleteUser() with confirmation
- Toggle active → toggleUserActive()
```

### Data Flow
```
User Action → Event Handler → API Call → Update UI → Show Notification
```

## Responsive Behavior

### Desktop (>768px)
- Full sidebar (250px) with text
- Wide content area (max 1200px)
- Two-column forms where appropriate

### Tablet (481px - 768px)
- Medium sidebar (200px)
- Adjusted content area
- Single-column forms

### Mobile (≤480px)
- Icon-only sidebar (60px)
- Menu text hidden
- Vertical title
- Maximum content space
- Single-column layouts

## Benefits of Multi-View Architecture

✅ **Scalability** - Easy to add new views (Reports, Settings, etc.)
✅ **Organization** - Logical separation of features
✅ **Navigation** - Clear menu structure
✅ **Performance** - Single page load, dynamic content switching
✅ **User Experience** - Consistent interface across views
✅ **Maintainability** - Modular code structure

## Future Enhancements

With this architecture in place, adding new views is straightforward:

### Potential New Views
1. **Reports View**
   - Task statistics
   - User performance
   - Charts and graphs

2. **Settings View**
   - Application preferences
   - User profile
   - Notifications

3. **Dashboard View**
   - Overview statistics
   - Recent activities
   - Quick actions

### How to Add a New View
```javascript
// 1. Add menu item in HTML
<li class="menu-item" data-view="reports">
    <span class="menu-icon">📊</span>
    <span class="menu-text">Reports</span>
</li>

// 2. Add view container in HTML
<div id="reportsView" class="view">
    <!-- View content -->
</div>

// 3. Add case in switchView() function
if (viewName === 'reports') {
    loadReportsData();
}
```

## Testing Checklist

### View Switching
- [x] Click Tasks menu item → Shows tasks view
- [x] Click Users menu item → Shows users view
- [x] Active menu item highlighted
- [x] Data loads when switching views

### User Management
- [x] Add user with all fields
- [x] Add user with only required fields
- [x] Edit user details
- [x] Toggle user active status
- [x] Delete user with confirmation
- [x] Search users by name
- [x] Search users by email
- [x] Search users by department
- [x] Filter active/inactive users
- [x] Clear search filters

### Responsive Design
- [x] Desktop sidebar (250px)
- [x] Tablet sidebar (200px)
- [x] Mobile sidebar (60px icons only)
- [x] Content adjusts properly

### Integration
- [x] User dropdowns update after user CRUD
- [x] Success notifications show
- [x] Error handling works
- [x] Loading states display

## Files Modified

1. **wwwroot/index.html**
   - Added sidebar navigation
   - Reorganized into multi-view structure
   - Added user management UI
   - Added edit user modal

2. **wwwroot/styles.css**
   - Added sidebar styles
   - Added multi-view layout
   - Updated responsive breakpoints
   - Mobile-friendly sidebar

3. **wwwroot/app.js**
   - Added view switching logic
   - Added user CRUD functions
   - Added user search/filter
   - Added user display functions
   - Added event listeners for user UI

## Running the Application

```bash
# Build and run
dotnet run --urls "http://localhost:5050"

# Open in browser
http://localhost:5050/

# Navigate between views
Click "Tasks" or "Users" in the sidebar
```

## Conclusion

The Task Manager now has a professional, scalable multi-view architecture with complete user management capabilities. The sidebar navigation provides an intuitive way to switch between features, and the consistent design makes it easy to add new functionality in the future.

**Key Improvements:**
- ✅ Organized multi-view structure
- ✅ Complete user CRUD operations
- ✅ Responsive sidebar navigation
- ✅ Consistent UI/UX across views
- ✅ Easy to extend with new features
- ✅ Professional appearance
- ✅ Mobile-friendly design

The application is now ready for production use with both task and user management fully functional!
