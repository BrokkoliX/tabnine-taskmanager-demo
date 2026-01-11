#!/bin/bash
# Migration script to add Users table and update schema

echo "🔄 Migrating database to use Users table..."
echo ""

# Backup existing database
if [ -f "taskmanager.db" ]; then
    echo "📦 Creating backup of existing database..."
    cp taskmanager.db "taskmanager.db.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backup created"
    echo ""
fi

# Stop any running instances
echo "⏸️  Stopping running application..."
pkill -f "dotnet.*TaskManager.Api" 2>/dev/null || true
sleep 1

# Remove old database to force recreation with new schema
echo "🗑️  Removing old database..."
rm -f taskmanager.db taskmanager.db-shm taskmanager.db-wal

echo ""
echo "✅ Migration preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run: dotnet run --urls \"http://localhost:5050\""
echo "2. The new database will be created automatically with:"
echo "   - Users table"
echo "   - Updated Tasks table with AssigneeId foreign key"
echo "3. Add some users via the API or UI"
echo ""
echo "🔗 API Endpoints for Users:"
echo "   GET    /users         - List all users"
echo "   GET    /users/active  - List active users"
echo "   POST   /users         - Create new user"
echo "   PUT    /users/{id}    - Update user"
echo "   DELETE /users/{id}    - Delete user"
echo ""
