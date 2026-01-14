# Snyk MCP Integration Guide

## ✅ Installation Complete!

Your TaskManager.Api project now has Snyk security scanning integrated via Model Context Protocol (MCP).

## What's Been Set Up

1. **Snyk CLI** - Authenticated with API key: `793b8118-...`
2. **Custom Snyk MCP Server** - Created in `mcp-snyk-server/`
3. **MCP Configuration** - Updated `.tabnine/mcp_servers.json`

## Available Security Scanning Tools

You now have access to 4 Snyk security tools via your AI assistant:

### 🔍 1. Dependency Scanning
**Tool**: `snyk_test`  
**What it does**: Scans NuGet packages for known vulnerabilities

**Example usage**: Ask your AI assistant:
- "Scan my project dependencies for vulnerabilities"
- "Are there any critical security issues in my packages?"
- "Check EPPlus and Entity Framework for vulnerabilities"

### 📊 2. Continuous Monitoring
**Tool**: `snyk_monitor`  
**What it does**: Sends a snapshot to Snyk for ongoing monitoring

**Example usage**:
- "Set up continuous monitoring for this project"
- "Monitor my dependencies for new vulnerabilities"

### 🔬 3. Code Analysis (SAST)
**Tool**: `snyk_code_test`  
**What it does**: Static analysis of your C# source code for security issues

**Example usage**:
- "Run security code analysis on my source files"
- "Check for security vulnerabilities in my code"
- "Scan the Services directory for security issues"

### 📋 4. Issue Reporting
**Tool**: `snyk_get_issues`  
**What it does**: Gets comprehensive list of all security issues

**Example usage**:
- "Show me all security issues in the project"
- "Generate a security report in JSON format"

## Quick Test

To verify Snyk is working, you can manually test from command line:

```bash
# Test dependencies
snyk test --file=TaskManager.Api.csproj

# Test source code (requires Snyk Code to be enabled)
snyk code test

# View all issues
snyk test --all-projects
```

## What Snyk Will Scan

### ✅ Will Scan:
- **NuGet Packages**:
  - EPPlus 7.0.0 (Excel library - has commercial licensing)
  - Microsoft.EntityFrameworkCore.Sqlite 9.0.0
  - Microsoft.EntityFrameworkCore.Design 9.0.0
  
- **Source Code**:
  - Program.cs
  - Models/*.cs
  - Services/*.cs
  - All C# files in the project

- **Configuration**:
  - appsettings.json (for secrets/credentials)

### ❌ Won't Scan:
- bin/, obj/ (build artifacts)
- Database files (taskmanager.db)
- Documentation files

## Using with AI Assistant

Simply ask your AI assistant natural language questions like:

```
"Scan this project for security vulnerabilities"
"Are there any high-severity security issues?"
"Check if EPPlus has any known vulnerabilities"
"Run a full security audit"
"What security issues should I fix first?"
```

The AI assistant will automatically use the appropriate Snyk MCP tool to scan your project and provide detailed results.

## Snyk Dashboard

You can also view results in the Snyk web dashboard:
- Visit: https://app.snyk.io
- Your organization and projects will appear after running `snyk monitor`

## Important: EPPlus License Compliance

⚠️ **EPPlus Licensing Note**: EPPlus 7.0.0 requires a commercial license for certain use cases:
- Commercial use
- Government use  
- Closed-source projects

Snyk's license scanning will flag this. Make sure you have:
1. The appropriate EPPlus license for your use case
2. Or consider switching to an open-source alternative if appropriate

## Next Steps

1. **Run your first scan** - Ask the AI assistant to scan the project
2. **Review findings** - Check what vulnerabilities are found
3. **Enable Snyk Code** - For advanced SAST analysis (may require Snyk paid plan)
4. **Set up monitoring** - Enable continuous monitoring via `snyk_monitor`
5. **Configure policies** - Create a `.snyk` policy file to customize scanning

## Troubleshooting

### Snyk CLI not authenticated
```bash
snyk config set api=793b8118-c095-4c8c-9d52-849b22078e10
```

### MCP server not responding
1. Restart Tabnine
2. Check logs in Tabnine settings
3. Verify Node.js is available: `node --version`

### No vulnerabilities found
This could mean:
- Your dependencies are secure (good!)
- Or Snyk needs to download vulnerability database (wait a moment and try again)

## Security Best Practices

🔐 **Protect Your API Key**:
- Don't commit `.tabnine/mcp_servers.json` if it contains your API key
- Add to `.gitignore` if needed
- Rotate API key periodically from https://app.snyk.io/account

## Learn More

- Snyk CLI Documentation: https://docs.snyk.io/snyk-cli
- Snyk Studio MCP: https://docs.snyk.io/integrations/snyk-studio-agentic-integrations
- Model Context Protocol: https://modelcontextprotocol.io

---

**Happy Secure Coding! 🛡️**
