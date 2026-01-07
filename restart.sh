#!/bin/bash
# Restart script for Task Manager API

echo "🔄 Restarting Task Manager API..."
echo ""

# Kill any running instances
echo "Stopping any running instances..."
pkill -f "dotnet.*TaskManager.Api" 2>/dev/null || true
sleep 1

# Clean up any stale database lock files
echo "Cleaning up database lock files..."
rm -f taskmanager.db-shm taskmanager.db-wal 2>/dev/null || true

echo ""
echo "✅ Ready to start!"
echo ""
echo "Starting application on http://localhost:5050"
echo "Press Ctrl+C to stop"
echo ""

# Start the application
dotnet run --urls "http://localhost:5050"
