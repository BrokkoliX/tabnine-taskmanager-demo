# Snyk Quick Command Reference

## Command Line Usage

### Basic Scans

```bash
# Scan project dependencies for vulnerabilities
snyk test --file=TaskManager.Api.csproj

# Scan with JSON output
snyk test --file=TaskManager.Api.csproj --json

# Scan and show only high/critical severity
snyk test --file=TaskManager.Api.csproj --severity-threshold=high

# Scan source code (SAST)
snyk code test

# Scan all projects in the directory
snyk test --all-projects
```

### Monitoring

```bash
# Monitor project (sends snapshot to Snyk dashboard)
snyk monitor --file=TaskManager.Api.csproj

# Monitor with project name
snyk monitor --file=TaskManager.Api.csproj --project-name="TaskManager API"
```

### Reports

```bash
# Generate HTML report
snyk test --json | snyk-to-html -o report.html

# Generate SARIF report (for CI/CD)
snyk test --sarif

# Get vulnerability count
snyk test --json | grep -o '"severity"' | wc -l
```

### Configuration

```bash
# View current configuration
snyk config

# Set API token
snyk config set api=YOUR_API_TOKEN

# Clear configuration
snyk config clear
```

### Help

```bash
# General help
snyk --help

# Command-specific help
snyk test --help
snyk monitor --help
snyk code test --help
```

## AI Assistant Usage

Simply ask natural language questions - the MCP server will handle the rest!

### Dependency Scanning
- "Scan my project for vulnerabilities"
- "Check if there are any security issues in my NuGet packages"
- "Are there any critical vulnerabilities in EPPlus?"
- "Show me all high-severity dependency issues"

### Code Analysis
- "Run security code analysis on my project"
- "Check my C# code for security vulnerabilities"
- "Scan the Services directory for security issues"

### Monitoring & Reporting
- "Set up continuous monitoring for this project"
- "Generate a security report"
- "Show me all security issues in JSON format"
- "What security vulnerabilities should I fix first?"

### Specific Queries
- "Does Entity Framework Core have any known vulnerabilities?"
- "Check if EPPlus license is compatible with my project"
- "What's the severity of the issues found?"

## MCP Tools Available

Via AI assistant, you have access to:

1. **`snyk_test`** - Dependency vulnerability scanning
2. **`snyk_monitor`** - Continuous monitoring setup  
3. **`snyk_code_test`** - Source code security analysis
4. **`snyk_get_issues`** - Comprehensive issue reporting

## Common Workflows

### Initial Security Audit
```bash
# 1. Scan dependencies
snyk test --file=TaskManager.Api.csproj

# 2. Scan source code
snyk code test

# 3. Set up monitoring
snyk monitor --file=TaskManager.Api.csproj
```

### Before Deployment
```bash
# Quick security check with threshold
snyk test --severity-threshold=high --file=TaskManager.Api.csproj
```

### CI/CD Integration
```bash
# Fail build if vulnerabilities found
snyk test --severity-threshold=medium --fail-on=all
```

## Useful Flags

- `--json` - Output in JSON format
- `--sarif` - Output in SARIF format (for tools)
- `--severity-threshold=<level>` - Only show issues at or above level (low|medium|high|critical)
- `--fail-on=<condition>` - Exit with error code (all|upgradable|patchable)
- `--project-name=<name>` - Set project name in Snyk dashboard
- `--org=<org-id>` - Specify organization
- `--all-projects` - Scan all projects in directory
- `-d` or `--debug` - Debug output

## Environment Variables

```bash
# Set Snyk token (alternative to config)
export SNYK_TOKEN=793b8118-c095-4c8c-9d52-849b22078e10

# Set organization
export SNYK_ORG=your-org-id

# Disable analytics
export SNYK_DISABLE_ANALYTICS=true
```

## Integration with .NET

### Project-Specific Scanning
```bash
# Scan specific project file
snyk test --file=TaskManager.Api.csproj

# Scan with PackageReference
snyk test --file=TaskManager.Api.csproj --package-manager=nuget
```

### Solution-Level Scanning
```bash
# Scan entire solution
snyk test --file=TaskManager.Api.sln --all-projects
```

## Filtering Results

### By Severity
```bash
# Only critical
snyk test --severity-threshold=critical

# High and above
snyk test --severity-threshold=high
```

### By Issue Type
```bash
# Only show issues with fixes available
snyk test --json | jq '.vulnerabilities[] | select(.isUpgradable==true)'
```

## Getting Help

- Documentation: https://docs.snyk.io/snyk-cli
- Support: https://support.snyk.io
- Community: https://community.snyk.io
- Status: https://status.snyk.io

## Quick Tips

💡 **Tip 1**: Use `--json` for programmatic processing  
💡 **Tip 2**: Set `--severity-threshold` to reduce noise  
💡 **Tip 3**: Run `snyk monitor` after major changes to track over time  
💡 **Tip 4**: Use AI assistant for natural language queries instead of remembering commands!

---

**Remember**: The easiest way is to just ask your AI assistant! The MCP integration handles all of this for you. 🤖
