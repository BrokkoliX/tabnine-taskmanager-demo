# MCP Servers Overview - TaskManager.Api Project

## 🎯 What is MCP?

**Model Context Protocol (MCP)** is a standard protocol that allows AI assistants to interact with external tools and services. Think of it as giving your AI assistant "superpowers" to access databases, security scanners, project management tools, and more!

## 🚀 Your Installed MCP Servers

You currently have **3 MCP servers** configured:

### 1. 🗄️ SQLite TaskManager Server
**Purpose**: Direct database access for your TaskManager application

**What it does**:
- Read/write tasks from the database
- Query task data
- Manage task records
- Database operations

**Example queries**:
- "Show me all incomplete tasks"
- "Create a new task for Excel export"
- "Update task #5 to completed"
- "Search for tasks containing 'authentication'"

**Status**: ✅ Active

---

### 2. 🛡️ Snyk Security Server
**Purpose**: Security vulnerability scanning and code analysis

**What it does**:
- Scan NuGet dependencies for vulnerabilities
- Static code analysis (SAST)
- License compliance checking
- Continuous security monitoring

**Available tools**:
- `snyk_test` - Scan dependencies
- `snyk_monitor` - Continuous monitoring
- `snyk_code_test` - Source code analysis
- `snyk_get_issues` - Generate reports

**Example queries**:
- "Scan my project for security vulnerabilities"
- "Check if EPPlus has any known vulnerabilities"
- "Run security code analysis"
- "Show me all high-severity security issues"

**Security findings**:
- 6 issues found (4 HIGH, 2 MEDIUM)
- Command injection issues in MCP server
- XSS vulnerabilities in frontend

**Status**: ✅ Active

---

### 3. 📋 Azure DevOps Server
**Purpose**: Integration with Azure DevOps for work items, builds, and repositories

**What it does**:
- View and manage work items (tickets, bugs, stories)
- Browse repositories and commits
- Check build and pipeline status
- View releases and deployments
- Manage test plans

**Connected to**:
- **Organization**: robisz
- **Project**: Tabnine
- **URL**: https://dev.azure.com/robisz/Tabnine

**Available domains**:
- ✅ Work Items (Read & Write)
- ✅ Repositories (Read)
- ✅ Builds (Read)
- ✅ Pipelines (Read)
- ✅ Releases (Read)
- ✅ Test Plans (Read)

**Example queries**:
- "Show me all work items in the Tabnine project"
- "Create a bug for the login issue"
- "What's the status of the latest build?"
- "List all open pull requests"
- "Update work item #123 to In Progress"

**Status**: ✅ Configured (Restart Tabnine to activate)

---

## 🔗 Integration Possibilities

### Cross-System Workflows

#### Task Management Integration
Combine local TaskManager with Azure DevOps:
```
"Create Azure DevOps work items for all incomplete tasks in the database"
"Sync task priorities between local system and Azure DevOps"
"Show me tasks that exist in both systems"
```

#### Security-Aware Development
Integrate security scanning with task management:
```
"Scan the project and create tasks for each security issue"
"Show me high-priority security vulnerabilities and create Azure DevOps bugs"
"Generate a security status report"
```

#### Complete Development Workflow
```
1. "Show me my Azure DevOps sprint items"
2. "Create local tasks for each sprint item"
3. "Scan the project for security issues"
4. "Check the latest build status"
5. "Update Azure DevOps items with progress"
```

## 📊 Comparison Table

| Feature | SQLite Server | Snyk Server | Azure DevOps Server |
|---------|--------------|-------------|---------------------|
| **Primary Use** | Local data | Security | Project management |
| **Read Data** | ✅ | ✅ | ✅ |
| **Write Data** | ✅ | ❌ | ✅ |
| **Real-time** | ✅ | ✅ | ✅ |
| **Requires Internet** | ❌ | ✅ | ✅ |
| **Authentication** | None | API Key | PAT Token |
| **Cost** | Free | Free tier available | Free tier available |

## 🎯 Common Use Cases

### Daily Development
```
Morning routine:
1. "Show me my Azure DevOps tasks for today"
2. "Scan project for new security issues"
3. "Show database statistics"

During development:
4. "Create task in database for bug fix"
5. "Check build status"
6. "Update Azure DevOps item to In Progress"

End of day:
7. "Update all completed tasks"
8. "Generate daily progress report"
```

### Sprint Planning
```
1. "Show all Azure DevOps items in current sprint"
2. "Create local tasks for sprint items"
3. "Run security scan to identify risks"
4. "Estimate effort for each task"
```

### Security Audits
```
1. "Run complete security scan"
2. "Create Azure DevOps bugs for each vulnerability"
3. "Create local tasks for security fixes"
4. "Track remediation progress"
```

## 🔒 Security Configuration

### API Keys & Tokens Stored

| Server | Authentication | Stored In |
|--------|---------------|-----------|
| SQLite | None | N/A |
| Snyk | API Token | `mcp_servers.json` env vars |
| Azure DevOps | PAT Token | `mcp_servers.json` env vars |

### 🛡️ Protection Measures

✅ **Environment Variables**: Tokens stored in env vars, not hardcoded  
✅ **Gitignore**: `mcp_servers.json` excluded from version control  
✅ **Scoped Permissions**: Each token has minimal required permissions  
⚠️ **Rotate Regularly**: Update tokens every 90 days

### Token Management

**Snyk Token**:
- Manage at: https://app.snyk.io/account
- Permissions: Read vulnerability data, run scans

**Azure DevOps PAT**:
- Manage at: https://dev.azure.com/robisz/_usersSettings/tokens
- Permissions: Work items (R/W), Code (R), Build (R)

## 📁 Files Overview

```
TaskManager.Api/
├── .tabnine/
│   └── mcp_servers.json              # MCP configuration (gitignored)
├── mcp-sqlite-server/                # SQLite MCP server
│   ├── index.js
│   └── package.json
├── mcp-snyk-server/                  # Snyk MCP server
│   ├── index.js
│   ├── package.json
│   └── README.md
├── SNYK_INSTALLATION_SUMMARY.md      # Snyk setup docs
├── SNYK_INTEGRATION_GUIDE.md         # Snyk usage guide
├── SNYK_QUICK_COMMANDS.md            # Snyk command reference
├── AZURE_DEVOPS_MCP_SETUP.md         # Azure DevOps setup
├── AZURE_DEVOPS_QUICK_START.md       # Azure DevOps quick start
├── AZURE_DEVOPS_INSTALLATION_SUMMARY.md # Azure DevOps summary
└── MCP_SERVERS_OVERVIEW.md           # This file
```

## 🚀 Getting Started

### First Time Setup

1. **Restart Tabnine** to load all MCP servers
2. **Test each server**:
   ```
   SQLite: "Show me all tasks in the database"
   Snyk: "Scan my project for vulnerabilities"
   Azure DevOps: "List all work items in Tabnine project"
   ```
3. **Explore integrations**: Try cross-system queries

### Quick Reference Commands

#### Database Operations
```
"How many tasks are in the database?"
"Show incomplete tasks"
"Create a new task"
"Update task status"
```

#### Security Scanning
```
"Scan for vulnerabilities"
"Show security issues"
"Check dependency versions"
```

#### Azure DevOps
```
"Show my work items"
"Create a bug"
"Check build status"
"List repositories"
```

## 🐛 Troubleshooting

### MCP Server Not Responding
1. Check Tabnine is running
2. Restart Tabnine
3. Check Tabnine logs in settings
4. Verify Node.js: `node --version`

### Authentication Errors
1. Verify tokens haven't expired
2. Check token permissions
3. Regenerate tokens if needed

### Can't See Data
1. Verify data exists in the source system
2. Check server is running
3. Verify permissions

## 📚 Learn More

### Documentation
- SQLite Server: `mcp-sqlite-server/README.md`
- Snyk Server: `SNYK_INTEGRATION_GUIDE.md`
- Azure DevOps: `AZURE_DEVOPS_QUICK_START.md`

### Official Resources
- MCP Protocol: https://modelcontextprotocol.io
- Snyk Docs: https://docs.snyk.io
- Azure DevOps API: https://learn.microsoft.com/en-us/rest/api/azure/devops

## 🎉 What's Possible

With these 3 MCP servers, you can:

✅ **Manage Tasks** - Local database + Azure DevOps  
✅ **Ensure Security** - Continuous vulnerability scanning  
✅ **Track Progress** - Integrated project management  
✅ **Automate Workflows** - Cross-system automation  
✅ **Generate Reports** - Unified status reports  
✅ **Monitor Builds** - CI/CD integration  
✅ **Code Reviews** - Security-aware reviews  

## 🔮 Future Possibilities

Consider adding more MCP servers:

- **GitHub** - Source control integration
- **Git** - Local git operations
- **Slack** - Team notifications
- **Docker** - Container management
- **Kubernetes** - Deployment management

---

## ✨ Summary

You have a powerful development environment with:
- 🗄️ **Local data management** (SQLite)
- 🛡️ **Security scanning** (Snyk)
- 📋 **Project management** (Azure DevOps)

All accessible through natural language via your AI assistant!

**Ready to explore?** Try asking: "Show me a combined status of database tasks, security issues, and Azure DevOps work items" 🚀
