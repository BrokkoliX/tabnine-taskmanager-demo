# Azure DevOps MCP - Quick Start Guide

## ✅ Configuration Complete!

Your Azure DevOps MCP integration is now set up and ready to use!

### 🔧 Configuration Details

- **Organization**: `robisz`
- **Project**: `Tabnine`
- **URL**: https://dev.azure.com/robisz/Tabnine
- **Authentication**: Personal Access Token (PAT)
- **Domains Enabled**: All (work items, repositories, builds, pipelines, releases, test)
- **Status**: ✅ Configured and ready

## 🚀 How to Use

### Restart Required
**Important**: You need to restart Tabnine for the new MCP server to become active.

After restart, you can interact with Azure DevOps using natural language!

## 💬 Example Queries - Work Items (Tickets)

### Viewing Work Items
```
"Show me all work items in the Tabnine project"
"List all open bugs"
"What are my assigned tasks?"
"Show high priority work items"
"Find all user stories in the current sprint"
```

### Creating Work Items
```
"Create a new bug for the login issue"
"Create a user story for Excel export feature"
"Create a task to update documentation"
"Add a bug titled 'Fix database connection timeout'"
```

### Updating Work Items
```
"Update work item #123 to In Progress"
"Change the status of task #456 to Done"
"Assign work item #789 to me"
"Add comment to bug #234: 'Fixed in latest commit'"
```

### Querying Work Items
```
"Show all bugs assigned to me"
"Find work items updated in the last week"
"List all critical priority items"
"Show completed work items from this sprint"
```

## 📁 Repository Operations

```
"Show me all repositories in the Tabnine project"
"List branches in the TaskManager repository"
"Show recent commits"
"What are the open pull requests?"
"Show me the latest commit on main branch"
```

## 🔨 Build & Pipeline Operations

```
"What's the status of the latest build?"
"Show recent build results"
"List all pipelines in the project"
"Check if the CI pipeline is running"
"Show build logs for the last failed build"
```

## 🔗 Integration with Your TaskManager App

You can now connect your local TaskManager tasks with Azure DevOps work items!

### Example Workflows

**Sync Local Task to Azure DevOps**
```
"Create an Azure DevOps work item for task #5 from the database"
"Link local task 'Implement Excel Export' to Azure DevOps"
```

**Track Development Progress**
```
"Show me Azure DevOps work items related to authentication"
"What's the status of work items for the Excel export feature?"
```

**Combined Queries**
```
"Show me all high-priority bugs in Azure DevOps and create corresponding tasks in the local database"
"Which Azure DevOps work items are completed but not marked done in the local system?"
```

## 🎯 Available Domains & Features

| Domain | What You Can Do |
|--------|----------------|
| **Work Items** | Create, read, update, query tickets, bugs, stories, tasks |
| **Repositories** | Browse code, view commits, branches, pull requests |
| **Builds** | Check build status, view history, trigger builds |
| **Pipelines** | List pipelines, run pipelines, view results |
| **Releases** | View releases, check deployment status |
| **Test** | View test plans, test runs, test results |

## 🔍 Work Item Types in Azure DevOps

Common work item types you can interact with:
- **Epic** - Large feature or initiative
- **Feature** - Functionality to deliver
- **User Story** - User requirement or scenario
- **Task** - Work to be done
- **Bug** - Issue to fix
- **Issue** - General work item

## 📊 Sample Workflow

### 1. Check What Needs to Be Done
```
Ask AI: "Show me all active work items in Tabnine project"
```

### 2. Create a New Work Item
```
Ask AI: "Create a bug: 'Fix Excel export date formatting issue'"
```

### 3. Update Progress
```
Ask AI: "Update work item #123 status to 'In Progress'"
```

### 4. Check Build Status
```
Ask AI: "What's the status of the latest build?"
```

### 5. Complete and Close
```
Ask AI: "Mark work item #123 as Done and add comment 'Fixed and tested'"
```

## 🛠️ Advanced Features

### Custom Queries
You can ask complex queries:
```
"Show me all bugs created in the last 7 days assigned to me with high priority"
"Find user stories in the current iteration that are not started"
"List all work items updated today"
```

### Linking Work Items
```
"Link work item #123 to work item #456"
"Add a related link between bug #789 and task #101"
```

### Bulk Operations
```
"Show me all open tasks and mark them as in progress"
"Create tasks for each item in this list: [...]"
```

## 🔒 Security Notes

### Your PAT Token
- ✅ Configured securely in environment variables
- ✅ Not exposed in code or commits
- ⚠️ **Important**: Keep `.tabnine/mcp_servers.json` out of version control

### Recommended .gitignore Entry
Add this to your `.gitignore`:
```
# MCP configuration with secrets
.tabnine/mcp_servers.json
```

### Token Permissions
Your PAT has access to:
- Work Items (Read & Write)
- Code (Read)
- Build (Read)
- Pipelines
- Test Plans
- And more based on your token scopes

### Rotate Regularly
- Update your PAT every 90 days
- Update in: https://dev.azure.com/robisz/_usersSettings/tokens

## 🐛 Troubleshooting

### "No work items found"
1. Verify you have work items in Azure DevOps
2. Check project name is correct: "Tabnine"
3. Ensure PAT has work item read permissions

### "Authentication failed"
1. Verify PAT hasn't expired
2. Check PAT has necessary scopes
3. Try regenerating the PAT token

### MCP server not responding
1. Restart Tabnine
2. Check logs in Tabnine settings
3. Verify: `npm list -g @azure-devops/mcp`

### Can't create work items
1. Ensure PAT has write permissions
2. Check you have contributor access to the project
3. Verify work item type exists in your project

## 📚 Resources

- **Your Azure DevOps**: https://dev.azure.com/robisz/Tabnine
- **Work Items**: https://dev.azure.com/robisz/Tabnine/_workitems
- **Boards**: https://dev.azure.com/robisz/Tabnine/_boards
- **Repositories**: https://dev.azure.com/robisz/Tabnine/_git
- **Pipelines**: https://dev.azure.com/robisz/Tabnine/_build
- **PAT Management**: https://dev.azure.com/robisz/_usersSettings/tokens

## 🎉 Next Steps

1. **Restart Tabnine** to activate the Azure DevOps MCP server
2. **Test the connection**: Ask "Show me all projects in Azure DevOps"
3. **Explore work items**: Ask "List all work items in the Tabnine project"
4. **Create your first item**: Ask "Create a test work item"
5. **Integrate with your app**: Start linking Azure DevOps items with your TaskManager tasks!

---

**You're all set!** 🚀

Try asking me: "Show me all work items in the Tabnine project" after restarting Tabnine!
