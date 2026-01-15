# Azure DevOps MCP Integration Guide

## 📋 Overview

This guide will help you integrate Azure DevOps with your TaskManager project via MCP, allowing you to interact with work items, builds, repositories, and more through your AI assistant.

## ✅ Installation Complete

Azure DevOps MCP server has been installed:
- **Package**: `@azure-devops/mcp` (v2.4.0)
- **Maintained by**: Microsoft
- **License**: MIT

## 🔧 Configuration Required

### Step 1: Get Your Azure DevOps Information

You need the following:

#### 1. **Organization Name**
Your Azure DevOps organization name from your URL:
```
https://dev.azure.com/{YOUR-ORGANIZATION}
```
Example: If your URL is `https://dev.azure.com/mycompany`, your org is `mycompany`

#### 2. **Personal Access Token (PAT)**
You mentioned you already have this! Make sure it has permissions for:
- ✅ Work Items (Read & Write)
- ✅ Code (Read)
- ✅ Build (Read)
- ✅ Release (Read)
- ✅ Project and Team (Read)

**To create/manage PAT:**
1. Go to: `https://dev.azure.com/{YOUR-ORG}/_usersSettings/tokens`
2. Click "New Token"
3. Set name (e.g., "MCP Server")
4. Select scopes listed above
5. Click "Create"

#### 3. **Project Name** (Optional)
If you want to filter to a specific project

### Step 2: Authentication Options

The Azure DevOps MCP supports multiple authentication methods:

#### Option A: Environment Variable (Recommended for MCP)
Set your PAT as an environment variable:
```bash
export AZURE_DEVOPS_PAT="your-personal-access-token"
```

#### Option B: Interactive Login
Browser-based authentication (good for testing)

#### Option C: Azure CLI
If you have Azure CLI installed and logged in

### Step 3: Update MCP Configuration

Add to `.tabnine/mcp_servers.json`:

```json
{
  "mcpServers": {
    "sqlite-taskmanager": { ... },
    "snyk-security": { ... },
    "azure-devops": {
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "YOUR-ORGANIZATION-NAME",
        "--authentication",
        "env"
      ],
      "env": {
        "AZURE_DEVOPS_PAT": "your-personal-access-token-here"
      }
    }
  }
}
```

**Replace**:
- `YOUR-ORGANIZATION-NAME` - Your Azure DevOps organization
- `your-personal-access-token-here` - Your PAT token

### Step 4: Optional - Filter Domains

By default, all domains are enabled. To enable only specific features:

```json
{
  "azure-devops": {
    "command": "npx",
    "args": [
      "-y",
      "@azure-devops/mcp",
      "YOUR-ORGANIZATION",
      "--authentication",
      "env",
      "--domains",
      "work",
      "builds",
      "repositories"
    ],
    "env": {
      "AZURE_DEVOPS_PAT": "your-pat-token"
    }
  }
}
```

**Available Domains**:
- `work` - Work items (tickets, bugs, user stories)
- `builds` - Build pipelines
- `repositories` - Git repositories
- `pipelines` - Azure Pipelines
- `releases` - Release management
- `test` - Test plans and results
- `all` - Everything (default)

## 🎯 What You Can Do with Azure DevOps MCP

### Work Items (Tickets)
- ✅ **View work items** - "Show me all open work items"
- ✅ **Create work items** - "Create a bug for the login issue"
- ✅ **Update work items** - "Update task #123 status to In Progress"
- ✅ **Query work items** - "Find all high priority bugs assigned to me"
- ✅ **Link work items** - "Link this task to bug #456"

### Repositories
- ✅ **Browse repositories** - "Show me all repositories in the project"
- ✅ **View commits** - "Show recent commits"
- ✅ **Check branches** - "List all branches"
- ✅ **View pull requests** - "Show open pull requests"

### Builds & Pipelines
- ✅ **Check build status** - "What's the status of the latest build?"
- ✅ **View build history** - "Show recent build results"
- ✅ **Trigger builds** - "Run the CI pipeline"
- ✅ **View build logs** - "Show build logs for pipeline X"

### Releases
- ✅ **View releases** - "Show latest releases"
- ✅ **Check deployment status** - "Is version 2.0 deployed to production?"

## 🚀 Example Usage with AI Assistant

Once configured, you can ask:

### Work Items
```
"Show me all open bugs in the TaskManager project"
"Create a new user story for Excel export feature"
"What are my assigned tasks?"
"Update work item #234 to Done"
"Find all critical priority items"
```

### Integration with TaskManager
```
"Create an Azure DevOps work item for this task"
"Link task ID 5 from our database to Azure DevOps bug #789"
"Show me Azure DevOps items related to authentication"
```

### Build Status
```
"What's the status of the main branch build?"
"Show me failed builds from today"
"When was the last successful deployment?"
```

## 🔒 Security Best Practices

### Protect Your PAT Token
1. **Never commit** your PAT to version control
2. **Use environment variables** instead of hardcoding
3. **Set appropriate scopes** - only grant necessary permissions
4. **Rotate regularly** - update your PAT every 90 days
5. **Use .gitignore** - ensure `.tabnine/mcp_servers.json` is not committed if it contains secrets

### Recommended .gitignore Entry
```
# MCP servers with secrets
.tabnine/mcp_servers.json
```

### Alternative: Use .env File
Create `.env` file:
```bash
AZURE_DEVOPS_ORG=your-org
AZURE_DEVOPS_PAT=your-token
```

Then reference in config:
```json
{
  "azure-devops": {
    "command": "npx",
    "args": ["-y", "@azure-devops/mcp", "${AZURE_DEVOPS_ORG}", "--authentication", "env"],
    "env": {
      "AZURE_DEVOPS_PAT": "${AZURE_DEVOPS_PAT}"
    }
  }
}
```

## 📊 Available Tools

The Azure DevOps MCP server provides tools for:

| Category | Tools Available |
|----------|----------------|
| **Work Items** | Query, Create, Update, Delete, Link |
| **Repositories** | List, Get commits, Branches, PRs |
| **Builds** | List, Get status, View logs, Queue |
| **Releases** | List, Get status, Deployments |
| **Pipelines** | List, Run, Get results |
| **Test** | Test plans, Test runs, Results |

## 🧪 Testing the Connection

After configuration:

1. **Restart Tabnine** to load new MCP server
2. **Ask AI assistant**: "List my Azure DevOps projects"
3. **Verify connection**: Should see your projects listed

## 🐛 Troubleshooting

### "Authentication failed"
- Verify PAT token is correct
- Check PAT hasn't expired
- Ensure PAT has necessary scopes

### "Organization not found"
- Double-check organization name spelling
- Verify you have access to the organization

### "MCP server not responding"
- Check Node.js is available: `node --version`
- Verify package is installed: `npm list -g @azure-devops/mcp`
- Check Tabnine logs for errors

### "No work items found"
- Verify you have access to the project
- Check if work items exist in Azure DevOps
- Try specifying project name explicitly

## 📚 Resources

- **Official Repo**: https://github.com/microsoft/azure-devops-mcp
- **Azure DevOps API**: https://learn.microsoft.com/en-us/rest/api/azure/devops
- **PAT Management**: https://dev.azure.com/{YOUR-ORG}/_usersSettings/tokens
- **MCP Protocol**: https://modelcontextprotocol.io

## 🎯 Next Steps

1. **Provide your Azure DevOps details** (organization name, PAT)
2. **I'll update the configuration** for you
3. **Test the connection** with a simple query
4. **Start managing work items** through AI!

---

**Ready to configure?** Please provide:
1. Your Azure DevOps organization name
2. Your Personal Access Token (PAT)
3. (Optional) Specific project name you want to focus on

I'll update the configuration file for you! 🚀
