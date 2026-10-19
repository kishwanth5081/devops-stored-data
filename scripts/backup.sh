#!/usr/bin/env bash
# ==============================================================================
# DevOps Stored Data - Automated Backup Script
# Performs hot database snapshot and file vault archival with retention policy
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/devops-stored-data}"
DATA_DIR="${DATA_DIR:-$(pwd)/backend/data}"
UPLOADS_DIR="${UPLOADS_DIR:-$(pwd)/backend/uploads}"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEST_ARCHIVE="${BACKUP_DIR}/devops_backup_${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_DIR}"

echo "=================================================="
echo "📦 Starting DevOps Stored Data Backup: ${TIMESTAMP}"
echo "=================================================="

# Create temporary staging directory
STAGE_DIR=$(mktemp -d)
trap 'rm -rf "${STAGE_DIR}"' EXIT

# 1. Hot Backup of SQLite Database using sqlite3 .backup or atomic file copy
DB_FILE="${DATA_DIR}/devops_stored.sqlite"
if [ -f "${DB_FILE}" ]; then
    echo "💾 Backing up SQLite database..."
    if command -v sqlite3 >/dev/null 2>&1; then
        sqlite3 "${DB_FILE}" ".backup '${STAGE_DIR}/devops_stored.sqlite'"
    else
        cp "${DB_FILE}" "${STAGE_DIR}/devops_stored.sqlite"
        if [ -f "${DB_FILE}-wal" ]; then cp "${DB_FILE}-wal" "${STAGE_DIR}/"; fi
    fi
fi

# 2. Copy Uploaded Files Vault
if [ -d "${UPLOADS_DIR}" ]; then
    echo "📁 Archiving uploaded files vault..."
    mkdir -p "${STAGE_DIR}/uploads"
    cp -r "${UPLOADS_DIR}/"* "${STAGE_DIR}/uploads/" 2>/dev/null || true
fi

# 3. Create compressed tarball
echo "🗜️  Compressing archive to ${DEST_ARCHIVE}..."
tar -czf "${DEST_ARCHIVE}" -C "${STAGE_DIR}" .

BACKUP_SIZE=$(du -h "${DEST_ARCHIVE}" | cut -f1)
echo "✅ Backup successfully created: ${DEST_ARCHIVE} (${BACKUP_SIZE})"

# 4. Enforce Retention Policy: Remove backups older than RETENTION_DAYS
echo "🧹 Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "devops_backup_*.tar.gz" -type f -mtime +"${RETENTION_DAYS}" -delete

echo "✨ Backup job completed successfully!"
