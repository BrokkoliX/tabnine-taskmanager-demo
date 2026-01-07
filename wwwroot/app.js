// API Base URL
const API_BASE = '/tasks';

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

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    attachEventListeners();
});

// Attach event listeners
function attachEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    editForm.addEventListener('submit', handleEditTask);
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', handleClearSearch);
    exportBtn.addEventListener('click', handleExport);
    
    // Allow Enter key in search
    searchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
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

// Handle add task
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const assignee = taskAssignee.value.trim();
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
        assignee: assignee || null,
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
    const assignee = editTaskAssignee.value.trim();
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
        assignee: assignee || null,
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
    editTaskAssignee.value = task.assignee || '';
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
        assignee: task.assignee,
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
        if (task.assignee) metadata.push(`<span class="task-meta-item">👤 ${escapeHtml(task.assignee)}</span>`);
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
