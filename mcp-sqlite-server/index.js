#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Database from 'better-sqlite3';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - points to the parent directory where the .NET app creates the database
const DB_PATH = path.join(__dirname, '..', 'taskmanager.db');

// Initialize SQLite database
let db;
try {
  db = new Database(DB_PATH);
  console.error(`Connected to SQLite database at: ${DB_PATH}`);
} catch (error) {
  console.error(`Failed to connect to database: ${error.message}`);
  process.exit(1);
}

// Create MCP server
const server = new Server(
  {
    name: 'sqlite-taskmanager-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Schema definitions
const QuerySchema = z.object({
  sql: z.string().describe('SQL query to execute'),
});

const TaskInsertSchema = z.object({
  title: z.string().describe('Task title'),
  description: z.string().optional().describe('Task description'),
  isCompleted: z.boolean().default(false).describe('Whether the task is completed'),
});

const TaskUpdateSchema = z.object({
  id: z.number().describe('Task ID'),
  title: z.string().optional().describe('Task title'),
  description: z.string().optional().nullable().describe('Task description'),
  isCompleted: z.boolean().optional().describe('Whether the task is completed'),
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'sqlite://taskmanager/schema',
        mimeType: 'application/json',
        name: 'Database Schema',
        description: 'Schema information for the TaskManager database',
      },
      {
        uri: 'sqlite://taskmanager/tasks',
        mimeType: 'application/json',
        name: 'All Tasks',
        description: 'List of all tasks in the database',
      },
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri.toString();

  if (uri === 'sqlite://taskmanager/schema') {
    const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='Tasks'").get();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(schema, null, 2),
        },
      ],
    };
  }

  if (uri === 'sqlite://taskmanager/tasks') {
    const tasks = db.prepare('SELECT * FROM Tasks').all();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query',
        description: 'Execute a read-only SQL query on the TaskManager database',
        inputSchema: {
          type: 'object',
          properties: {
            sql: {
              type: 'string',
              description: 'SQL query to execute (SELECT statements only)',
            },
          },
          required: ['sql'],
        },
      },
      {
        name: 'list_tasks',
        description: 'List all tasks from the database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_task',
        description: 'Get a specific task by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Task ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_task',
        description: 'Create a new task',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
            },
            description: {
              type: 'string',
              description: 'Task description',
            },
            isCompleted: {
              type: 'boolean',
              description: 'Whether the task is completed',
              default: false,
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Task ID',
            },
            title: {
              type: 'string',
              description: 'Task title',
            },
            description: {
              type: 'string',
              description: 'Task description',
            },
            isCompleted: {
              type: 'boolean',
              description: 'Whether the task is completed',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_task',
        description: 'Delete a task by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Task ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'search_tasks',
        description: 'Search tasks by title or description',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            onlyIncomplete: {
              type: 'boolean',
              description: 'Only show incomplete tasks',
              default: false,
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query': {
        const { sql } = QuerySchema.parse(args);
        
        // Security: Only allow SELECT queries
        if (!sql.trim().toUpperCase().startsWith('SELECT')) {
          throw new Error('Only SELECT queries are allowed');
        }

        const results = db.prepare(sql).all();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'list_tasks': {
        const tasks = db.prepare('SELECT * FROM Tasks ORDER BY Id').all();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      }

      case 'get_task': {
        const { id } = z.object({ id: z.number() }).parse(args);
        const task = db.prepare('SELECT * FROM Tasks WHERE Id = ?').get(id);
        
        if (!task) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${id} not found`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(task, null, 2),
            },
          ],
        };
      }

      case 'create_task': {
        const taskData = TaskInsertSchema.parse(args);
        const stmt = db.prepare(
          'INSERT INTO Tasks (Title, Description, IsCompleted) VALUES (?, ?, ?)'
        );
        const result = stmt.run(
          taskData.title,
          taskData.description || null,
          taskData.isCompleted ? 1 : 0
        );

        const newTask = db.prepare('SELECT * FROM Tasks WHERE Id = ?').get(result.lastInsertRowid);
        
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully:\n${JSON.stringify(newTask, null, 2)}`,
            },
          ],
        };
      }

      case 'update_task': {
        const taskData = TaskUpdateSchema.parse(args);
        
        // Check if task exists
        const existing = db.prepare('SELECT * FROM Tasks WHERE Id = ?').get(taskData.id);
        if (!existing) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${taskData.id} not found`,
              },
            ],
            isError: true,
          };
        }

        // Build update query dynamically
        const updates = [];
        const values = [];
        
        if (taskData.title !== undefined) {
          updates.push('Title = ?');
          values.push(taskData.title);
        }
        if (taskData.description !== undefined) {
          updates.push('Description = ?');
          values.push(taskData.description);
        }
        if (taskData.isCompleted !== undefined) {
          updates.push('IsCompleted = ?');
          values.push(taskData.isCompleted ? 1 : 0);
        }

        if (updates.length > 0) {
          values.push(taskData.id);
          const stmt = db.prepare(`UPDATE Tasks SET ${updates.join(', ')} WHERE Id = ?`);
          stmt.run(...values);
        }

        const updatedTask = db.prepare('SELECT * FROM Tasks WHERE Id = ?').get(taskData.id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Task updated successfully:\n${JSON.stringify(updatedTask, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_task': {
        const { id } = z.object({ id: z.number() }).parse(args);
        
        // Check if task exists
        const existing = db.prepare('SELECT * FROM Tasks WHERE Id = ?').get(id);
        if (!existing) {
          return {
            content: [
              {
                type: 'text',
                text: `Task with ID ${id} not found`,
              },
            ],
            isError: true,
          };
        }

        const stmt = db.prepare('DELETE FROM Tasks WHERE Id = ?');
        stmt.run(id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Task with ID ${id} deleted successfully`,
            },
          ],
        };
      }

      case 'search_tasks': {
        const { query, onlyIncomplete } = z.object({
          query: z.string(),
          onlyIncomplete: z.boolean().default(false),
        }).parse(args);

        let sql = 'SELECT * FROM Tasks WHERE (Title LIKE ? OR Description LIKE ?)';
        const params = [`%${query}%`, `%${query}%`];

        if (onlyIncomplete) {
          sql += ' AND IsCompleted = 0';
        }

        sql += ' ORDER BY Id';

        const tasks = db.prepare(sql).all(...params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Cleanup on exit
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  db.close();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP SQLite Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
