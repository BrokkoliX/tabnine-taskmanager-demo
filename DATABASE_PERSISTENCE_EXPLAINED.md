# 🗄️ Database Persistence - How It Works

## ✅ Your Data is PERSISTENT (It Stays!)

**Good news:** Your database is a **real file** that persists across builds and runs!

---

## 📁 How It Works

### The Database File
Your SQLite database is stored as a **physical file**:
```
/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/taskmanager.db
```

This file:
- ✅ **Persists across app restarts**
- ✅ **Persists across rebuilds** (`dotnet build`)
- ✅ **Persists across code changes**
- ✅ **Persists across reboots**
- ❌ **Only deleted if YOU manually delete it**

---

## 🔄 What Happens When You...

### 1. **Rebuild the Project** (`dotnet build`)
```bash
dotnet build
```
**Result:** ✅ **Database stays the same**
- Your data is NOT touched
- The database file remains unchanged
- All your tasks are still there

---

### 2. **Run the App** (`dotnet run`)
```bash
dotnet run
```
**Result:** ✅ **Database stays the same (if it exists)**

The code does this:
```csharp
dbContext.Database.EnsureCreated();
```

**What `EnsureCreated()` does:**
- ✅ If database EXISTS → **Do nothing, use existing database**
- ✅ If database DOESN'T exist → **Create new database**

**Your data persists!** It only creates the database the first time.

---

### 3. **Stop and Restart the App**
```bash
# Stop with Ctrl+C
# Then restart
dotnet run
```
**Result:** ✅ **Database stays the same**
- All your tasks are still there
- No data lost

---

### 4. **Make Code Changes** (e.g., fix a bug in UI)
```bash
# Edit JavaScript, CSS, C# code
dotnet run
```
**Result:** ✅ **Database stays the same**
- Your data persists
- Code changes don't affect the database

---

## ❌ When Database Gets DELETED

The database is **ONLY** deleted when:

### 1. **You manually delete it**
```bash
rm taskmanager.db
# Or
./reset-database.sh
```

### 2. **Schema changes** (like adding new fields)
When the model changes (like we just did):
```bash
# You must delete manually because the old schema is incompatible
rm -f taskmanager.db*
dotnet run  # Creates NEW database with NEW schema
```

**Important:** Old data is lost when schema changes!

---

## 🔍 How to Check Your Database

### See if database exists:
```bash
ls -lh taskmanager.db
```

### Count tasks in database:
```bash
sqlite3 taskmanager.db "SELECT COUNT(*) FROM Tasks;"
```

### See all tasks:
```bash
sqlite3 taskmanager.db "SELECT * FROM Tasks;"
```

### Check database schema:
```bash
sqlite3 taskmanager.db ".schema Tasks"
```

---

## 📊 Current vs Future Runs

### Scenario 1: Fresh Start (First Time)
```bash
# No database exists
dotnet run
```
**Result:**
- `EnsureCreated()` creates taskmanager.db
- Empty database (0 tasks)
- Ready to add tasks

---

### Scenario 2: Subsequent Runs (Normal Usage)
```bash
# Database already exists with 10 tasks
dotnet run
```
**Result:**
- `EnsureCreated()` sees database exists
- Does nothing (keeps existing data)
- You still have all 10 tasks!

---

### Scenario 3: After Adding Data
```bash
# Add 5 tasks via UI
# Stop app (Ctrl+C)
# Restart
dotnet run
```
**Result:**
- Database still has 5 tasks
- Nothing lost!

---

### Scenario 4: Schema Change (Like We Just Did)
```bash
# You modified TaskItem.cs (added new fields)
# Old database is incompatible
rm -f taskmanager.db*  # Manual deletion required
dotnet run
```
**Result:**
- New database created with new schema
- **Old data is LOST** (that's why we create backups!)
- Database has new columns (Assignee, Priority, etc.)

---

## 🎯 Summary Table

| Action | Database Status | Your Data |
|--------|----------------|-----------|
| `dotnet build` | ✅ Unchanged | ✅ Kept |
| `dotnet run` | ✅ Unchanged | ✅ Kept |
| `dotnet clean` | ✅ Unchanged | ✅ Kept |
| Stop/Restart app | ✅ Unchanged | ✅ Kept |
| Code changes | ✅ Unchanged | ✅ Kept |
| Reboot computer | ✅ Unchanged | ✅ Kept |
| `rm taskmanager.db` | ❌ Deleted | ❌ Lost |
| Schema change | ⚠️ Requires deletion | ⚠️ Lost (unless migrated) |

---

## 🛡️ Data Protection Best Practices

### 1. **Backup Before Schema Changes**
```bash
cp taskmanager.db taskmanager.db.backup-$(date +%Y%m%d)
```

### 2. **Use the Reset Script** (it creates backups)
```bash
./reset-database.sh  # Prompts for confirmation, creates backup
```

### 3. **Export Important Data**
```bash
# Export to JSON
curl http://localhost:5050/tasks > tasks-backup.json

# Export to CSV
sqlite3 taskmanager.db -header -csv "SELECT * FROM Tasks;" > tasks.csv
```

---

## 🔮 Future: Using Migrations (Production-Ready)

For production, you should use **EF Core Migrations** instead of `EnsureCreated()`:

### Why Migrations?
- ✅ **Preserves data** during schema changes
- ✅ **Version control** for database schema
- ✅ **Automatic upgrades** when deploying

### How to Switch:

1. **Remove `EnsureCreated()` from Program.cs**
2. **Create migration:**
   ```bash
   dotnet ef migrations add InitialCreate
   ```
3. **Apply migration:**
   ```bash
   dotnet ef database update
   ```
4. **Future changes:**
   ```bash
   dotnet ef migrations add AddNewField
   dotnet ef database update  # Data is preserved!
   ```

---

## 💡 Key Takeaways

1. **Your database is a real file** - It persists!

2. **`EnsureCreated()` is smart** - Only creates if missing

3. **Rebuilding doesn't delete data** - It's safe!

4. **Schema changes need manual deletion** - That's the only exception

5. **Always backup before deleting** - Use `./reset-database.sh`

---

## 🧪 Test It Yourself

```bash
# 1. Start app and add a task
dotnet run --urls "http://localhost:5050"
# Add a task in browser
# Stop app (Ctrl+C)

# 2. Rebuild project
dotnet clean
dotnet build

# 3. Restart app
dotnet run --urls "http://localhost:5050"
# Open browser - YOUR TASK IS STILL THERE! ✅

# 4. Check database file
ls -lh taskmanager.db
# File still exists with same size ✅
```

---

## ❓ Common Questions

### Q: Do I lose data when I stop the app?
**A:** ❌ No! Data is saved to disk immediately.

### Q: Do I lose data when I rebuild?
**A:** ❌ No! The database file is not in `bin/` or `obj/`.

### Q: Where is the database stored?
**A:** ✅ In your project root: `/Users/robbie/Tab/TabnineTaskDemo/TaskManager.Api/taskmanager.db`

### Q: What if I want to start fresh?
**A:** ✅ Use `./reset-database.sh` (creates backup automatically)

### Q: Can I move the database?
**A:** ✅ Yes! It's just a file. Copy it anywhere.

### Q: Can I share the database?
**A:** ✅ Yes! Send the `.db` file to someone else.

---

## 📁 Database Files Location

```
Your Project/
├── taskmanager.db              ← Your persistent data!
├── taskmanager.db.backup       ← Manual backup
├── bin/                        ← Build output (deleted on clean)
│   └── Debug/net9.0/
│       └── TaskManager.Api.dll  ← Your compiled app
├── obj/                        ← Build temp files
└── Models/TaskItem.cs          ← Your code
```

**Key Point:** 
- ✅ `taskmanager.db` is in **project root** (persists)
- ❌ Compiled code is in **bin/** (deleted on clean)
- ✅ Database survives `dotnet clean`

---

## 🎉 Conclusion

**Your data PERSISTS!** 🎊

- ✅ Rebuilding = Safe
- ✅ Restarting = Safe  
- ✅ Code changes = Safe
- ⚠️ Schema changes = Manual deletion needed

**Use `./reset-database.sh` for safe database resets with automatic backups!**

---

**TL;DR:** Your database is a real file. It stays unless YOU delete it. Rebuilds don't touch it! 🚀
