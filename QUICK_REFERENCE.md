# 📋 Quick Reference Card

## 🚀 Common Commands

### Start the App
```bash
./restart.sh
# or
dotnet run --urls "http://localhost:5050"
```
**Result:** ✅ Data persists from last run

---

### Rebuild the Project
```bash
dotnet build
```
**Result:** ✅ Database unchanged, data safe

---

### Clean Build
```bash
dotnet clean
dotnet build
```
**Result:** ✅ Database unchanged, data safe

---

### Reset Database (with backup)
```bash
./reset-database.sh
```
**Result:** ⚠️ Data lost, backup created

---

### Manual Database Delete
```bash
rm -f taskmanager.db*
```
**Result:** ❌ Data lost, no backup

---

## 🗄️ Database Persistence

| You Do This | Database Status | Data Status |
|-------------|----------------|-------------|
| `dotnet run` | ✅ Keeps existing | ✅ Safe |
| `dotnet build` | ✅ Unchanged | ✅ Safe |
| `dotnet clean` | ✅ Unchanged | ✅ Safe |
| Stop app (Ctrl+C) | ✅ Unchanged | ✅ Safe |
| Restart app | ✅ Unchanged | ✅ Safe |
| Edit code | ✅ Unchanged | ✅ Safe |
| Reboot PC | ✅ Unchanged | ✅ Safe |
| Schema change | ⚠️ Needs reset | ⚠️ See below |

---

## ⚠️ Schema Changes (New Fields)

When you modify `TaskItem.cs` (add/remove/change fields):

```bash
# Option 1: Safe reset with backup
./reset-database.sh

# Option 2: Manual with backup
cp taskmanager.db taskmanager.db.backup
rm -f taskmanager.db*
dotnet run

# Option 3: Quick reset (no backup)
rm -f taskmanager.db*
dotnet run
```

**Result:** ⚠️ New database created, old data lost

---

## 🔍 Check Database

### See if exists
```bash
ls -lh taskmanager.db
```

### Count tasks
```bash
sqlite3 taskmanager.db "SELECT COUNT(*) FROM Tasks;"
```

### View all tasks
```bash
sqlite3 taskmanager.db "SELECT Id, Title, Assignee, Priority FROM Tasks;"
```

### See schema
```bash
sqlite3 taskmanager.db ".schema Tasks"
```

---

## 💾 Backup & Restore

### Create Backup
```bash
cp taskmanager.db taskmanager.db.backup-$(date +%Y%m%d)
```

### Restore Backup
```bash
cp taskmanager.db.backup taskmanager.db
```

### Export to JSON
```bash
curl http://localhost:5050/tasks > tasks-backup.json
```

---

## 🆘 Troubleshooting

### Database Locked
```bash
rm -f taskmanager.db-shm taskmanager.db-wal
./restart.sh
```

### Can't Add Tasks
```bash
./reset-database.sh
./restart.sh
```

### Multiple Instances Running
```bash
pkill -f TaskManager.Api
./restart.sh
```

### Port Already in Use
```bash
pkill -f TaskManager.Api
dotnet run --urls "http://localhost:5051"  # Different port
```

---

## 📁 File Locations

```
TaskManager.Api/
├── taskmanager.db              ← YOUR DATA (persists!)
├── taskmanager.db.backup       ← Manual backup
├── restart.sh                  ← Easy restart
├── reset-database.sh           ← Safe reset
├── bin/                        ← Deleted on 'dotnet clean'
├── obj/                        ← Deleted on 'dotnet clean'
└── wwwroot/                    ← Static files
    ├── index.html
    ├── app.js
    └── styles.css
```

---

## 🎯 Key Points

1. **Database = Real File**
   - Not stored in `bin/` or `obj/`
   - Survives rebuilds and restarts
   - Located in project root

2. **`EnsureCreated()` Logic**
   - If DB exists → Use it
   - If DB missing → Create it
   - Never deletes existing data

3. **Data Persists Across:**
   - ✅ App restarts
   - ✅ Rebuilds
   - ✅ Code changes
   - ✅ Computer reboots

4. **Data Lost Only When:**
   - ❌ You manually delete DB
   - ❌ Schema changes (incompatible)

---

## 📚 Documentation Files

| File | When to Read |
|------|--------------|
| `QUICK_REFERENCE.md` | Quick lookup |
| `DATABASE_PERSISTENCE_EXPLAINED.md` | How DB works |
| `QUICK_FIX_SUMMARY.md` | Just fixed error |
| `READY_TO_RUN.md` | First time setup |
| `FIELD_ADDITIONS.md` | New fields guide |
| `VISUAL_GUIDE.md` | UI examples |

---

## 🔗 URLs

- **App:** http://localhost:5050/
- **API:** http://localhost:5050/tasks
- **Search:** http://localhost:5050/tasks/search?query=test

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Stop app | `Ctrl+C` |
| Hard refresh browser | `Cmd+Shift+R` (Mac)<br>`Ctrl+Shift+F5` (Windows) |
| Open DevTools | `F12` |

---

## 💡 Pro Tips

1. **Use `./restart.sh`** - Handles cleanup automatically
2. **Backup before schema changes** - Use `./reset-database.sh`
3. **Check for multiple instances** - `ps aux | grep TaskManager`
4. **SQLite Browser** - Install "DB Browser for SQLite" for GUI

---

## 🎓 Learn More

- **Read:** `DATABASE_PERSISTENCE_EXPLAINED.md`
- **Test:** Create task → rebuild → restart → task still there!
- **Experiment:** Safe to try things - database persists!

---

**Remember:** Your database is persistent! Rebuilding is safe! 🎉
