#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server can connect to the database
 * Run this before configuring Claude Desktop to ensure everything works
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'taskmanager.db');

console.log('🔍 Testing MCP SQLite Server Setup\n');
console.log(`Database path: ${DB_PATH}`);

// Check if database file exists
if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Database file not found!');
  console.log('💡 Please run the TaskManager.Api application first to create the database.');
  console.log('   Command: dotnet run (from the TaskManager.Api directory)');
  process.exit(1);
}

console.log('✅ Database file exists\n');

try {
  // Try to connect to the database
  const db = new Database(DB_PATH);
  console.log('✅ Successfully connected to database\n');

  // Check if Tasks table exists
  const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Tasks'").get();
  
  if (!tableInfo) {
    console.error('❌ Tasks table not found!');
    console.log('💡 The database exists but the Tasks table is missing.');
    db.close();
    process.exit(1);
  }

  console.log('✅ Tasks table exists\n');

  // Get table schema
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='Tasks'").get();
  console.log('📋 Table Schema:');
  console.log(schema.sql);
  console.log('');

  // Count tasks
  const count = db.prepare('SELECT COUNT(*) as count FROM Tasks').get();
  console.log(`📊 Current task count: ${count.count}\n`);

  // Show sample tasks (if any)
  if (count.count > 0) {
    const sampleTasks = db.prepare('SELECT * FROM Tasks LIMIT 5').all();
    console.log('📝 Sample tasks:');
    console.log(JSON.stringify(sampleTasks, null, 2));
    console.log('');
  }

  db.close();

  console.log('✅ All checks passed!\n');
  console.log('🎉 The MCP server should work correctly.');
  console.log('📌 Next steps:');
  console.log('   1. Update your Claude Desktop config with the server path');
  console.log('   2. Restart Claude Desktop');
  console.log('   3. Start asking Claude to manage your tasks!\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   - Make sure the database is not locked by another process');
  console.log('   - Check file permissions on the database file');
  console.log('   - Ensure the TaskManager.Api app created the database correctly');
  process.exit(1);
}
