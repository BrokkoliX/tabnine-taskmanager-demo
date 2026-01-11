# Testing Guide - Multi-View UI with User Management

## Quick Start

The application is now running at: **http://localhost:5050/**

Open your browser and navigate to this URL to test the new features.

## What to Test

### 1. Sidebar Navigation

**Test the sidebar menu:**
- ✅ Click on "Tasks" menu item
  - Should highlight with white left border
  - Should show the tasks view
  
- ✅ Click on "Users" menu item
  - Should highlight with white left border
  - Should show the users view
  - Should load users automatically

- ✅ Try switching back and forth
  - Views should switch smoothly
  - Data should reload when switching

### 2. User Management - Add User

**Add a new user with all fields:**
1. Navigate to "Users" view
2. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Department: "Engineering"
3. Click "➕ Add User"
4. Expected results:
   - Success notification appears
   - User appears in the list below
   - Form resets
   - User count updates

**Add a user with only required fields:**
1. Fill in only:
   - Name: "Jane Smith"
   - Email: "jane@example.com"
2. Leave Department empty
3. Click "➕ Add User"
4. Expected: User is created without department

### 3. User Management - View Users

**Check the user list display:**
- ✅ Users shown in card format
- ✅ Each card shows:
  - Name and active status badge
  - Email with 📧 icon
  - Department (if set) with 🏢 icon
  - Created date with 📅 icon
  - Assigned tasks count with 🎯 icon
  - User ID
  - Action buttons

### 4. User Management - Edit User

**Edit an existing user:**
1. Click "✏️ Edit" on any user card
2. Modal should open with current values
3. Change the name or email
4. Change department
5. Toggle "Active User" checkbox
6. Click "💾 Save Changes"
7. Expected results:
   - Modal closes
   - User list updates with new values
   - Success notification appears

### 5. User Management - Toggle Active Status

**Deactivate a user:**
1. Click "⏸️ Deactivate" on an active user
2. Expected results:
   - Status changes to "✗ Inactive"
   - Card styling changes (grayed out)
   - Button changes to "▶️ Activate"
   - Success notification appears

**Reactivate a user:**
1. Click "▶️ Activate" on an inactive user
2. Expected: User becomes active again

### 6. User Management - Search & Filter

**Search by name:**
1. Type a user's name in the search box
2. Click "🔍 Search" or press Enter
3. Expected: Only matching users shown

**Search by email:**
1. Type part of an email
2. Click "🔍 Search"
3. Expected: Filtered results

**Filter active users:**
1. Uncheck "Show only active users"
2. Expected: Shows all users (active and inactive)
3. Check it again
4. Expected: Shows only active users

**Clear search:**
1. After searching, click "✖️ Clear"
2. Expected: 
   - Search box clears
   - "Active only" checkbox checked
   - All active users shown

### 7. User Management - Delete User

**Delete a user:**
1. Click "🗑️ Delete" on a user card
2. Confirmation dialog appears
3. Click "OK" to confirm
4. Expected results:
   - User removed from list
   - User count updates
   - Success notification appears

**Cancel deletion:**
1. Click "🗑️ Delete"
2. Click "Cancel" in confirmation
3. Expected: User remains in list

### 8. Integration - Task Assignee Dropdown

**Verify users appear in task assignee dropdown:**
1. Switch to "Tasks" view
2. Scroll to "Add New Task" form
3. Click on "Assignee" dropdown
4. Expected: All active users appear in the list
5. Add a task with an assignee
6. Switch back to "Users" view
7. Check the user's "Assigned Tasks" count
8. Expected: Count should increase

### 9. Responsive Design

**Desktop view (> 768px):**
- Full sidebar (250px) with text labels
- Wide content area
- Two-column forms

**Tablet view (481px - 768px):**
- Medium sidebar (200px)
- Resize browser window to test
- Expected: Sidebar adjusts, content remains usable

**Mobile view (≤ 480px):**
- Icon-only sidebar (60px)
- Menu text hidden
- Vertical title text
- Expected: Maximum space for content

### 10. Error Handling

**Test form validation:**
1. Try to submit user form without name
2. Expected: Browser validation prevents submission

**Test email validation:**
1. Enter invalid email (e.g., "notanemail")
2. Try to submit
3. Expected: Browser email validation

## Expected User Flow Examples

### Scenario 1: Onboarding New Team Members

1. Click "Users" in sidebar
2. Add user "Alice Johnson", "alice@company.com", "Marketing"
3. Add user "Bob Wilson", "bob@company.com", "Sales"
4. Verify both appear in the list
5. Switch to "Tasks" view
6. Create a task assigned to Alice
7. Create a task assigned to Bob
8. Switch back to "Users"
9. Verify assigned task counts updated

### Scenario 2: Managing User Status

1. View all users
2. Find a user who left the company
3. Click "⏸️ Deactivate"
4. Uncheck "Show only active users"
5. Verify inactive user still visible but grayed out
6. Switch to Tasks view
7. Verify inactive user doesn't appear in assignee dropdown

### Scenario 3: Finding Specific Users

1. Navigate to Users
2. Type "eng" in search box
3. Click Search
4. Expected: All users in Engineering department shown
5. Clear search
6. Type an email
7. Expected: Specific user shown

## Visual Checks

### Sidebar
- ✅ Gradient background (purple/blue)
- ✅ Active menu item has white left border
- ✅ Hover effect on menu items
- ✅ Icons display correctly

### User Cards
- ✅ Clean card layout
- ✅ Active users: Normal styling
- ✅ Inactive users: Grayed out
- ✅ Status badges: Green for active, gray for inactive
- ✅ Icons for email, department, dates
- ✅ Action buttons aligned right

### Modals
- ✅ Centered on screen
- ✅ Dark overlay background
- ✅ Close button (×) works
- ✅ Clicking outside modal closes it
- ✅ Form fields pre-filled when editing

### Notifications
- ✅ Success messages appear top-right
- ✅ Green background
- ✅ Auto-disappear after 2 seconds
- ✅ Smooth animation

## Browser Compatibility

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

## Performance Checks

- ✅ View switching is instant
- ✅ No page reloads
- ✅ Data loads quickly
- ✅ Smooth animations
- ✅ Responsive to user input

## Known Working Features

Based on the implementation, these should all work:

### Sidebar Navigation ✅
- Click menu items to switch views
- Visual feedback on active view
- Responsive sizing

### User Management ✅
- Add users with validation
- Edit users in modal
- Delete with confirmation
- Toggle active status
- Search by name/email/department
- Filter active/inactive

### Integration ✅
- Users populate task assignee dropdowns
- Assigned task counts update
- Active/inactive users filtered correctly

### UI/UX ✅
- Success notifications
- Loading states
- Error messages
- Empty states
- Confirmation dialogs

## Troubleshooting

### Users not loading?
- Open browser DevTools (F12)
- Check Console for errors
- Verify API endpoint: `http://localhost:5050/users`

### Search not working?
- Make sure you have users in the database
- Check browser console for errors
- Try clicking Search button vs pressing Enter

### Sidebar not showing?
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for CSS errors
- Verify styles.css is loaded

### Modal not opening?
- Check browser console for JavaScript errors
- Ensure user data is valid JSON
- Try refreshing the page

## API Endpoints You Can Test Manually

Using curl or Postman:

```bash
# Get all users
curl http://localhost:5050/users

# Get active users only
curl http://localhost:5050/users/active

# Create a user
curl -X POST http://localhost:5050/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","department":"IT"}'

# Update a user (replace {id} with actual ID)
curl -X PUT http://localhost:5050/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Updated Name","email":"test@example.com","department":"Sales","isActive":false}'

# Delete a user
curl -X DELETE http://localhost:5050/users/1
```

## Success Criteria

✅ All tests pass without errors
✅ UI is responsive and looks good
✅ Navigation works smoothly
✅ CRUD operations work correctly
✅ Search and filter function properly
✅ Integration with tasks works
✅ No console errors
✅ Performance is good

## Next Steps After Testing

Once testing is complete, you can:
1. Add more users to test with realistic data
2. Create tasks assigned to different users
3. Test edge cases (very long names, special characters, etc.)
4. Consider adding additional features
5. Deploy to production

Enjoy testing the new multi-view UI! 🎉
