# 🔐 Environment Setup Guide

## Setting Up Your Local Environment

This project uses environment variables to keep sensitive credentials secure and out of version control.

### 1️⃣ Create Your `.env` File

Copy the example and add your tokens:

```bash
cp .env.example .env
```

Then edit `.env` with your actual credentials.

### 2️⃣ Required Environment Variables

Add these to your `.env` file:

```env
# Snyk Token
SNYK_TOKEN=your-snyk-token-here

# Azure DevOps Personal Access Token
AZURE_DEVOPS_PAT=your-azure-devops-pat-here
ADO_MCP_AUTH_TOKEN=your-azure-devops-pat-here

# Project Path
PROJECT_PATH=/absolute/path/to/your/project
```

### 3️⃣ Configure MCP Servers

The actual `mcp_servers.json` file (gitignored) should contain your real paths and tokens.

Use `.tabnine/mcp_servers.json.template` as a reference to create your own `.tabnine/mcp_servers.json`:

```bash
cp .tabnine/mcp_servers.json.template .tabnine/mcp_servers.json
```

Then edit `.tabnine/mcp_servers.json` with your actual values.

### 4️⃣ Get Your Tokens

#### Snyk Token
1. Log in to https://snyk.io
2. Go to Account Settings
3. Generate an API token
4. Copy to `.env` as `SNYK_TOKEN`

#### Azure DevOps PAT
1. Go to https://dev.azure.com/[your-org]/_usersSettings/tokens
2. Create a new Personal Access Token with required scopes:
   - Work Items (Read & Write)
   - Code (Read)
   - Build (Read)
   - Test Management (Read & Write)
3. Copy the token to `.env` as both `AZURE_DEVOPS_PAT` and `ADO_MCP_AUTH_TOKEN`

### ⚠️ Security Best Practices

✅ **DO:**
- Keep `.env` file local (never commit it)
- Use `.env.example` for team sharing (without real values)
- Rotate tokens regularly (every 90 days)
- Use minimum required permissions for tokens

❌ **DON'T:**
- Commit `.env` to git
- Share your `.env` file
- Use the same token across multiple projects
- Store tokens in code or documentation

### 🔍 Verify Your Setup

Check that gitignore is working:

```bash
git status
```

You should NOT see:
- `.env`
- `.tabnine/mcp_servers.json`

### 📝 Files Overview

| File | Purpose | Committed? |
|------|---------|------------|
| `.env` | Your actual secrets | ❌ NO (gitignored) |
| `.env.example` | Template for team | ✅ YES |
| `.tabnine/mcp_servers.json` | Your actual config | ❌ NO (gitignored) |
| `.tabnine/mcp_servers.json.template` | Template for team | ✅ YES |

### 🆘 Troubleshooting

**Q: MCP servers not working after setup?**
- Restart Tabnine
- Check that paths in `mcp_servers.json` are absolute
- Verify tokens are valid

**Q: Git is trying to commit my secrets?**
- Check `.gitignore` includes `.env` and `.tabnine/mcp_servers.json`
- Run `git rm --cached .env` if already tracked

**Q: Need to share setup with team?**
- Share `.env.example` and `.tabnine/mcp_servers.json.template`
- Document where to get tokens in this file
- Never share actual `.env` file

---

**Last Updated**: December 2024
