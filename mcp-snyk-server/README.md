# Snyk MCP Server

This is a Model Context Protocol (MCP) server that integrates Snyk security scanning into your AI assistant workflows.

## Features

The Snyk MCP server provides the following tools:

### 1. `snyk_test`
Scan project dependencies for vulnerabilities.

**Parameters:**
- `projectFile` (optional): Path to project file (default: "TaskManager.Api.csproj")
- `severity` (optional): Minimum severity threshold ("low", "medium", "high", "critical")

**Example:**
```json
{
  "projectFile": "TaskManager.Api.csproj",
  "severity": "high"
}
```

### 2. `snyk_monitor`
Monitor project and send snapshot to Snyk for continuous monitoring.

**Parameters:**
- `projectFile` (optional): Path to project file (default: "TaskManager.Api.csproj")

### 3. `snyk_code_test`
Run static application security testing (SAST) on source code.

**Parameters:**
- `path` (optional): Path to scan (default: ".")

### 4. `snyk_get_issues`
Get list of all current issues from last scan.

**Parameters:**
- `format` (optional): Output format ("json" or "sarif", default: "json")

## Configuration

The server is configured in `.tabnine/mcp_servers.json`:

```json
{
  "mcpServers": {
    "snyk-security": {
      "command": "node",
      "args": [
        "/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/mcp-snyk-server/index.js"
      ],
      "env": {
        "SNYK_TOKEN": "your-snyk-api-token",
        "PROJECT_PATH": "/path/to/your/project"
      }
    }
  }
}
```

## Environment Variables

- `SNYK_TOKEN`: Your Snyk API token (get from https://app.snyk.io/account)
- `PROJECT_PATH`: Absolute path to your project directory

## Usage with AI Assistants

Once configured, you can ask your AI assistant to:

- "Scan my project for security vulnerabilities"
- "Check if there are any high-severity issues"
- "Run Snyk code analysis on my source files"
- "Show me all security issues in JSON format"

The assistant will use the appropriate Snyk MCP tool to perform the scan and provide results.

## Security Best Practices

⚠️ **Important**: Your Snyk API token should be kept secure. Consider:

1. Using environment variables instead of hardcoding in config files
2. Adding `.tabnine/mcp_servers.json` to `.gitignore` if it contains sensitive data
3. Rotating your API token regularly

## Dependencies

- Node.js v20+
- @modelcontextprotocol/sdk
- Snyk CLI (installed globally)

## License

This MCP server implementation uses MIT-licensed code patterns from the Model Context Protocol community.
