// API Base URL
const API_BASE = '/tasks';
const USERS_API_BASE = '/users';

// Global state
let users = [];

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const searchQuery = document.getElementById('searchQuery');
const onlyIncomplete = document.getElementById('onlyIncomplete');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const exportBtn = document.getElementById('exportBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const taskCount = document.getElementById('taskCount');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const editTaskCompleted = document.getElementById('editTaskCompleted');

// New field elements
const taskAssignee = document.getElementById('taskAssignee');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const taskCategory = document.getElementById('taskCategory');
const editTaskAssignee = document.getElementById('editTaskAssignee');
const editTaskPriority = document.getElementById('editTaskPriority');
const editTaskDueDate = document.getElementById('editTaskDueDate');
const editTaskCategory = document.getElementById('editTaskCategory');

// User management elements
const userForm = document.getElementById('userForm');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userDepartment = document.getElementById('userDepartment');
const usersList = document.getElementById('usersList');
const userSearchQuery = document.getElementById('userSearchQuery');
const onlyActiveUsers = document.getElementById('onlyActiveUsers');
const userSearchBtn = document.getElementById('userSearchBtn');
const clearUserSearchBtn = document.getElementById('clearUserSearchBtn');
const userCount = document.getElementById('userCount');
const editUserModal = document.getElementById('editUserModal');
const editUserForm = document.getElementById('editUserForm');
const editUserId = document.getElementById('editUserId');
const editUserName = document.getElementById('editUserName');
const editUserEmail = document.getElementById('editUserEmail');
const editUserDepartment = document.getElementById('editUserDepartment');
const editUserActive = document.getElementById('editUserActive');

// View switching elements
const menuItems = document.querySelectorAll('.menu-item');
const views = document.querySelectorAll('.view');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadTasks();
    attachEventListeners();
});

// Attach event listeners
function attachEventListeners() {
    // View switching
    menuItems.forEach(item => {
        item.addEventListener('click', () => switchView(item.dataset.view));
    });
    
    // Task management
    taskForm.addEventListener('submit', handleAddTask);
    editForm.addEventListener('submit', handleEditTask);
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', handleClearSearch);
    exportBtn.addEventListener('click', handleExport);
    exportCsvBtn.addEventListener('click', handleExportCsv);
    
    // User management
    userForm.addEventListener('submit', handleAddUser);
    editUserForm.addEventListener('submit', handleEditUser);
    userSearchBtn.addEventListener('click', handleUserSearch);
    clearUserSearchBtn.addEventListener('click', handleClearUserSearch);
    
    // Allow Enter key in search
    searchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    userSearchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserSearch();
        }
    });
    
    // Close modals on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    editUserModal.addEventListener('click', (e) => {
        if (e.target === editUserModal) {
            closeEditUserModal();
        }
    });
}

// Load all tasks
async function loadTasks() {
    try {
        showLoading();
        const response = await fetch(API_BASE);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        showError('Failed to load tasks. Please try again.');
        console.error('Error loading tasks:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch(`${USERS_API_BASE}/active`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        users = await response.json();
        populateUserDropdowns();
    } catch (error) {
        console.error('Error loading users:', error);
        // Don't show error to user, just log it
        users = [];
    }
}

// Populate user dropdowns
function populateUserDropdowns() {
    const dropdowns = [taskAssignee, editTaskAssignee];
    
    dropdowns.forEach(dropdown => {
        // Clear existing options except the first one (-- No Assignee --)
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }
        
        // Add user options
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            dropdown.appendChild(option);
        });
    });
}

// Handle search
async function handleSearch() {
    const query = searchQuery.value.trim();
    const incomplete = onlyIncomplete.checked;
    
    try {
        showLoading();
        let url = `${API_BASE}/search?onlyIncomplete=${incomplete}`;
        
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        showError('Failed to search tasks. Please try again.');
        console.error('Error searching tasks:', error);
    }
}

// Handle clear search
function handleClearSearch() {
    searchQuery.value = '';
    onlyIncomplete.checked = false;
    loadTasks();
}

// Handle export to Excel
function handleExport() {
    const query = searchQuery.value.trim();
    const incomplete = onlyIncomplete.checked;
    
    // Build export URL with current filters
    let url = `${API_BASE}/export?onlyIncomplete=${incomplete}`;
    
    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }
    
    // Trigger download
    window.location.href = url;
    
    // Show success message
    showSuccessMessage('Exporting tasks to Excel...');
}

// Handle export to CSV
function handleExportCsv() {
    const query = searchQuery.value.trim();
    const incomplete = onlyIncomplete.checked;
    
    // Build export URL with current filters
    let url = `${API_BASE}/export/csv?onlyIncomplete=${incomplete}`;
    
    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }
    
    // Trigger download
    window.location.href = url;
    
    // Show success message
    showSuccessMessage('Exporting tasks to CSV...');
}

// Handle add task
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const assigneeId = taskAssignee.value ? parseInt(taskAssignee.value) : null;
    const priority = parseInt(taskPriority.value);
    const dueDate = taskDueDate.value;
    const category = taskCategory.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const newTask = {
        title: title,
        description: description || null,
        isCompleted: false,
        assigneeId: assigneeId,
        priority: priority,
        dueDate: dueDate || null,
        category: category || null
    };
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Clear form
        taskForm.reset();
        
        // Reload tasks
        await loadTasks();
        
        // Show success message
        showSuccessMessage('Task added successfully!');
    } catch (error) {
        alert('Failed to add task. Please try again.');
        console.error('Error adding task:', error);
    }
}

// Handle edit task
async function handleEditTask(e) {
    e.preventDefault();
    
    const id = parseInt(editTaskId.value);
    const title = editTaskTitle.value.trim();
    const description = editTaskDescription.value.trim();
    const isCompleted = editTaskCompleted.checked;
    const assigneeId = editTaskAssignee.value ? parseInt(editTaskAssignee.value) : null;
    const priority = parseInt(editTaskPriority.value);
    const dueDate = editTaskDueDate.value;
    const category = editTaskCategory.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    const updatedTask = {
        id: id,
        title: title,
        description: description || null,
        isCompleted: isCompleted,
        assigneeId: assigneeId,
        priority: priority,
        dueDate: dueDate || null,
        category: category || null
    };
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Close modal
        closeEditModal();
        
        // Reload tasks
        await loadTasks();
        
        // Show success message
        showSuccessMessage('Task updated successfully!');
    } catch (error) {
        alert('Failed to update task. Please try again.');
        console.error('Error updating task:', error);
    }
}

// Handle delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Reload tasks
        await loadTasks();
        
        // Show success message
        showSuccessMessage('Task deleted successfully!');
    } catch (error) {
        alert('Failed to delete task. Please try again.');
        console.error('Error deleting task:', error);
    }
}

// Open edit modal
function openEditModal(task) {
    editTaskId.value = task.id;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description || '';
    editTaskCompleted.checked = task.isCompleted;
    editTaskAssignee.value = task.assigneeId || '';
    editTaskPriority.value = task.priority || 1;
    editTaskDueDate.value = task.dueDate ? task.dueDate.split('T')[0] : '';
    editTaskCategory.value = task.category || '';
    editModal.classList.add('show');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('show');
    editForm.reset();
}

// Toggle task completion
async function toggleComplete(task) {
    const updatedTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted,
        assigneeId: task.assigneeId,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category
    };
    
    try {
        const response = await fetch(`${API_BASE}/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Reload tasks
        await loadTasks();
    } catch (error) {
        alert('Failed to update task. Please try again.');
        console.error('Error toggling task completion:', error);
    }
}

// Display tasks
function displayTasks(tasks) {
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks found. Add your first task above!</div>';
        return;
    }
    
    tasksList.innerHTML = tasks.map(task => {
        const metadata = [];
        if (task.assignee?.name) metadata.push(`<span class="task-meta-item">👤 ${escapeHtml(task.assignee.name)}</span>`);
        if (task.category) metadata.push(`<span class="task-meta-item">🏷️ ${escapeHtml(task.category)}</span>`);
        
        const priorityLabels = ['Low', 'Medium', 'High'];
        const priorityClasses = ['priority-low', 'priority-medium', 'priority-high'];
        const priorityLabel = priorityLabels[task.priority] || 'Medium';
        const priorityClass = priorityClasses[task.priority] || 'priority-medium';
        metadata.push(`<span class="task-meta-item ${priorityClass}">⚡ ${priorityLabel}</span>`);
        
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isOverdue = dueDate < today && !task.isCompleted;
            const dueDateStr = dueDate.toLocaleDateString();
            metadata.push(`<span class="task-meta-item ${isOverdue ? 'overdue' : ''}">📅 ${dueDateStr}${isOverdue ? ' (Overdue)' : ''}</span>`);
        }
        
        if (task.createdAt) {
            const createdDate = new Date(task.createdAt).toLocaleDateString();
            metadata.push(`<span class="task-meta-item">🕒 Created: ${createdDate}</span>`);
        }
        
        return `
        <div class="task-item ${task.isCompleted ? 'completed' : ''}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <span class="task-status ${task.isCompleted ? 'completed' : 'pending'}">
                    ${task.isCompleted ? '✓ Completed' : '○ Pending'}
                </span>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            ${metadata.length > 0 ? `<div class="task-metadata">${metadata.join('')}</div>` : ''}
            <div class="task-footer">
                <span class="task-id">ID: ${task.id}</span>
                <div class="task-actions">
                    <button class="btn btn-secondary" onclick='toggleComplete(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
                        ${task.isCompleted ? '↶ Mark Incomplete' : '✓ Mark Complete'}
                    </button>
                    <button class="btn btn-edit" onclick='openEditModal(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Show loading state
function showLoading() {
    tasksList.innerHTML = '<div class="loading">Loading tasks...</div>';
}

// Show error
function showError(message) {
    tasksList.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

// Show success message
function showSuccessMessage(message) {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// VIEW SWITCHING
// ============================================

function switchView(viewName) {
    // Update active menu item
    menuItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update active view
    views.forEach(view => {
        if (view.id === `${viewName}View`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });
    
    // Load data for the view
    if (viewName === 'users') {
        loadUsersForDisplay();
    } else if (viewName === 'tasks') {
        loadTasks();
    }
}

// ============================================
// USER MANAGEMENT FUNCTIONS
// ============================================

// Load users for display in users view
async function loadUsersForDisplay() {
    try {
        showUserLoading();
        const endpoint = onlyActiveUsers.checked ? `${USERS_API_BASE}/active` : USERS_API_BASE;
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allUsers = await response.json();
        displayUsers(allUsers);
    } catch (error) {
        showUserError('Failed to load users. Please try again.');
        console.error('Error loading users:', error);
    }
}

// Handle add user
async function handleAddUser(e) {
    e.preventDefault();
    
    const user = {
        name: userName.value.trim(),
        email: userEmail.value.trim(),
        department: userDepartment.value.trim() || null,
        isActive: true
    };
    
    try {
        const response = await fetch(USERS_API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        userForm.reset();
        await loadUsersForDisplay();
        await loadUsers(); // Refresh dropdown
        showSuccessMessage('✅ User added successfully!');
    } catch (error) {
        showUserError('Failed to add user. Please try again.');
        console.error('Error adding user:', error);
    }
}

// Handle edit user
async function handleEditUser(e) {
    e.preventDefault();
    
    const id = parseInt(editUserId.value);
    const user = {
        id: id,
        name: editUserName.value.trim(),
        email: editUserEmail.value.trim(),
        department: editUserDepartment.value.trim() || null,
        isActive: editUserActive.checked
    };
    
    try {
        const response = await fetch(`${USERS_API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        closeEditUserModal();
        await loadUsersForDisplay();
        await loadUsers(); // Refresh dropdown
        showSuccessMessage('✅ User updated successfully!');
    } catch (error) {
        showUserError('Failed to update user. Please try again.');
        console.error('Error updating user:', error);
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${USERS_API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadUsersForDisplay();
        await loadUsers(); // Refresh dropdown
        showSuccessMessage('✅ User deleted successfully!');
    } catch (error) {
        showUserError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', error);
    }
}

// Toggle user active status
async function toggleUserActive(user) {
    const updatedUser = {
        ...user,
        isActive: !user.isActive
    };
    
    try {
        const response = await fetch(`${USERS_API_BASE}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadUsersForDisplay();
        await loadUsers(); // Refresh dropdown
        showSuccessMessage(`✅ User ${updatedUser.isActive ? 'activated' : 'deactivated'}!`);
    } catch (error) {
        showUserError('Failed to update user status. Please try again.');
        console.error('Error toggling user active:', error);
    }
}

// Handle user search
async function handleUserSearch() {
    const query = userSearchQuery.value.trim();
    
    try {
        showUserLoading();
        let allUsers;
        
        // First get all users or only active
        const endpoint = onlyActiveUsers.checked ? `${USERS_API_BASE}/active` : USERS_API_BASE;
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allUsers = await response.json();
        
        // Filter by search query
        if (query) {
            allUsers = allUsers.filter(user => 
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                (user.department && user.department.toLowerCase().includes(query.toLowerCase()))
            );
        }
        
        displayUsers(allUsers);
    } catch (error) {
        showUserError('Failed to search users. Please try again.');
        console.error('Error searching users:', error);
    }
}

// Handle clear user search
function handleClearUserSearch() {
    userSearchQuery.value = '';
    onlyActiveUsers.checked = true;
    loadUsersForDisplay();
}

// Open edit user modal
function openEditUserModal(user) {
    editUserId.value = user.id;
    editUserName.value = user.name;
    editUserEmail.value = user.email;
    editUserDepartment.value = user.department || '';
    editUserActive.checked = user.isActive;
    editUserModal.classList.add('show');
}

// Close edit user modal
function closeEditUserModal() {
    editUserModal.classList.remove('show');
}

// Display users
function displayUsers(users) {
    userCount.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;
    
    if (users.length === 0) {
        usersList.innerHTML = '<div class="empty-state">No users found. Add your first user above!</div>';
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="task-item ${!user.isActive ? 'completed' : ''}">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${escapeHtml(user.name)}</h3>
                    <span class="task-status ${user.isActive ? 'pending' : 'completed'}">
                        ${user.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                </div>
            </div>
            <div class="task-description">
                📧 ${escapeHtml(user.email)}
            </div>
            ${user.department ? `
            <div class="task-metadata">
                <span class="task-meta-item">🏢 ${escapeHtml(user.department)}</span>
            </div>
            ` : ''}
            <div class="task-metadata">
                <span class="task-meta-item">📅 Created: ${new Date(user.createdAt).toLocaleDateString()}</span>
                <span class="task-meta-item">🎯 Assigned Tasks: ${user.assignedTasks?.length || 0}</span>
            </div>
            <div class="task-footer">
                <span class="task-id">ID: ${user.id}</span>
                <div class="task-actions">
                    <button class="btn btn-secondary" onclick="toggleUserActive(${escapeHtml(JSON.stringify(user))})">
                        ${user.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                    </button>
                    <button class="btn btn-edit" onclick="openEditUserModal(${escapeHtml(JSON.stringify(user))})">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show user loading state
function showUserLoading() {
    usersList.innerHTML = '<div class="loading">Loading users...</div>';
}

// Show user error
function showUserError(message) {
    usersList.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}
