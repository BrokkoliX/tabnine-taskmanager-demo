#!/bin/bash
# Database Reset Script for Task Manager API

echo "🗄️  Database Reset Utility"
echo "=========================="
echo ""

# Check if database exists
if [ -f taskmanager.db ] || [ -f taskmanager.db-shm ] || [ -f taskmanager.db-wal ]; then
    echo "📋 Current database files found:"
    ls -lh taskmanager.db* 2>/dev/null | grep -v backup || true
    echo ""
    
    read -p "⚠️  Do you want to DELETE the database and start fresh? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "💾 Creating backup..."
        BACKUP_NAME="taskmanager.db.backup-$(date +%Y%m%d-%H%M%S)"
        
        if [ -f taskmanager.db ]; then
            cp taskmanager.db "$BACKUP_NAME" 2>/dev/null && echo "✅ Backup created: $BACKUP_NAME"
        fi
        
        echo ""
        echo "🗑️  Deleting database files..."
        rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal
        
        if [ $? -eq 0 ]; then
            echo "✅ Database files deleted successfully!"
            echo ""
            echo "🔄 Database will be recreated when you run the app"
            echo ""
            echo "To start the app, run:"
            echo "   ./restart.sh"
            echo "   or"
            echo "   dotnet run --urls \"http://localhost:5050\""
        else
            echo "❌ Error deleting database files"
            exit 1
        fi
    else
        echo ""
        echo "ℹ️  Database reset cancelled."
    fi
else
    echo "ℹ️  No database files found. Database will be created on next run."
    echo ""
    echo "To start the app, run:"
    echo "   ./restart.sh"
    echo "   or"
    echo "   dotnet run --urls \"http://localhost:5050\""
fi

echo ""
echo "📚 Backups available:"
ls -lh taskmanager.db.backup* 2>/dev/null || echo "   (none)"
