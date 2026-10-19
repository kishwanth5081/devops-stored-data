# DevOps Stored Data - Maintenance & Backup Operations Guide

This guide describes operational maintenance routines, backup automation, disaster recovery procedures, and performance optimization for **DevOps Stored Data**.

---

## 1. Automated Daily Backup Automation

The application includes `scripts/backup.sh` (Linux) and `scripts/backup.ps1` (Windows) to produce atomic snapshots of both the SQLite database and all uploaded files.

### Scheduling via Linux Cron (Nightly at 02:00 AM)
1. Make the backup script executable:
   ```bash
   chmod +x /opt/devops-stored-data/scripts/backup.sh
   ```

2. Edit root crontab:
   ```bash
   sudo crontab -e
   ```

3. Add the following entry:
   ```cron
   # Daily backup at 02:00 AM with log output
   0 2 * * * /opt/devops-stored-data/scripts/backup.sh >> /var/log/devops_backup.log 2>&1
   ```

### Scheduling via Windows Task Scheduler
Open PowerShell as Administrator:
```powershell
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File C:\Users\kishwanth.aderu\Desktop\Tasks\devops-stored-data\scripts\backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
Register-ScheduledTask -TaskName "DevOpsStoredDataBackup" -Action $action -Trigger $trigger -Description "Daily snapshot of DevOps Stored Data"
```

---

## 2. Disaster Recovery & Restoration

If a server failure occurs or data corruption needs to be reverted:

1. Locate your desired backup archive:
   ```bash
   ls -lh /var/backups/devops-stored-data/
   # Example: devops_backup_20261015_020000.tar.gz
   ```

2. Stop the application service:
   ```bash
   # If running Systemd:
   sudo systemctl stop devops-stored-data

   # If running Docker Compose:
   cd /opt/devops-stored-data/docker && docker compose stop app
   ```

3. Execute the restoration script:
   ```bash
   chmod +x /opt/devops-stored-data/scripts/restore.sh
   /opt/devops-stored-data/scripts/restore.sh /var/backups/devops-stored-data/devops_backup_20261015_020000.tar.gz
   ```

4. Restart the service:
   ```bash
   sudo systemctl start devops-stored-data
   # Or: docker compose start app
   ```

---

## 3. SQLite Database Maintenance & Optimization

SQLite in WAL mode requires periodic maintenance to defragment space and ensure optimal query planner statistics.

### Run Database Vacuum & Integrity Check
Execute this command periodically (e.g. monthly):

```bash
# Verify integrity
node -e "const db = require('./backend/src/database/db'); console.log(db.pragma('quick_check'));"

# Optimize and reclaim disk space
node -e "const db = require('./backend/src/database/db'); db.exec('VACUUM; ANALYZE;'); console.log('Database vacuumed and optimized.');"
```

---

## 4. Zero-Downtime Application Updates

When updating the application code or pulling a new release:

```bash
cd /opt/devops-stored-data

# 1. Pull latest code
git pull origin main

# 2. Build updated frontend assets
npm run build

# 3. Graceful restart (in-place restart takes < 1 second)
# For Systemd:
sudo systemctl restart devops-stored-data

# For Docker Compose:
cd docker && docker compose up -d --build app
```

Nginx will continue serving clients, holding incoming requests in queue while Node.js re-attaches within 500ms, resulting in zero dropped connections.
