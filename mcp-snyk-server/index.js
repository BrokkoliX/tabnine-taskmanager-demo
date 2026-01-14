#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Snyk API configuration
const SNYK_TOKEN = process.env.SNYK_TOKEN || "793b8118-c095-4c8c-9d52-849b22078e10";
const PROJECT_PATH = process.env.PROJECT_PATH || "/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api";

class SnykMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "snyk-security-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "snyk_test",
          description: "Scan project dependencies for vulnerabilities using Snyk",
          inputSchema: {
            type: "object",
            properties: {
              projectFile: {
                type: "string",
                description: "Path to project file (e.g., TaskManager.Api.csproj)",
                default: "TaskManager.Api.csproj"
              },
              severity: {
                type: "string",
                description: "Minimum severity threshold (low, medium, high, critical)",
                enum: ["low", "medium", "high", "critical"]
              }
            },
          },
        },
        {
          name: "snyk_monitor",
          description: "Monitor project and send snapshot to Snyk for continuous monitoring",
          inputSchema: {
            type: "object",
            properties: {
              projectFile: {
                type: "string",
                description: "Path to project file",
                default: "TaskManager.Api.csproj"
              }
            },
          },
        },
        {
          name: "snyk_code_test",
          description: "Run static code analysis (SAST) on source code",
          inputSchema: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "Path to scan (default: current directory)",
                default: "."
              }
            },
          },
        },
        {
          name: "snyk_get_issues",
          description: "Get list of current issues from last scan",
          inputSchema: {
            type: "object",
            properties: {
              format: {
                type: "string",
                description: "Output format",
                enum: ["json", "sarif"],
                default: "json"
              }
            },
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "snyk_test":
            return await this.snykTest(args);
          case "snyk_monitor":
            return await this.snykMonitor(args);
          case "snyk_code_test":
            return await this.snykCodeTest(args);
          case "snyk_get_issues":
            return await this.snykGetIssues(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async snykTest(args) {
    const projectFile = args?.projectFile || "TaskManager.Api.csproj";
    const severity = args?.severity ? `--severity-threshold=${args.severity}` : "";
    
    const cmd = `cd ${PROJECT_PATH} && snyk test --file=${projectFile} ${severity} --json`;
    const { stdout, stderr } = await execAsync(cmd);
    
    let result;
    try {
      result = JSON.parse(stdout);
    } catch {
      result = stdout || stderr;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async snykMonitor(args) {
    const projectFile = args?.projectFile || "TaskManager.Api.csproj";
    
    const cmd = `cd ${PROJECT_PATH} && snyk monitor --file=${projectFile} --json`;
    const { stdout, stderr } = await execAsync(cmd);
    
    let result;
    try {
      result = JSON.parse(stdout);
    } catch {
      result = stdout || stderr;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async snykCodeTest(args) {
    const path = args?.path || ".";
    
    const cmd = `cd ${PROJECT_PATH} && snyk code test ${path} --json`;
    const { stdout, stderr } = await execAsync(cmd);
    
    let result;
    try {
      result = JSON.parse(stdout);
    } catch {
      result = stdout || stderr;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async snykGetIssues(args) {
    const format = args?.format || "json";
    
    const cmd = `cd ${PROJECT_PATH} && snyk test --all-projects --${format}`;
    const { stdout, stderr } = await execAsync(cmd);
    
    let result;
    try {
      result = JSON.parse(stdout);
    } catch {
      result = stdout || stderr;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Snyk MCP server running on stdio");
  }
}

const server = new SnykMCPServer();
server.run().catch(console.error);
