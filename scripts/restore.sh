#!/usr/bin/env bash
# ==============================================================================
# DevOps Stored Data - Disaster Recovery & Restore Script
# ==============================================================================

set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <path-to-devops_backup_YYYYMMDD_HHMMSS.tar.gz>"
    exit 1
fi

BACKUP_ARCHIVE="$1"
DATA_DIR="${DATA_DIR:-$(pwd)/backend/data}"
UPLOADS_DIR="${UPLOADS_DIR:-$(pwd)/backend/uploads}"

if [ ! -f "${BACKUP_ARCHIVE}" ]; then
    echo "❌ Error: Backup archive file not found: ${BACKUP_ARCHIVE}"
    exit 1
fi

echo "⚠️  WARNING: Restoring will overwrite existing database and uploaded files!"
read -p "Are you sure you want to proceed? (yes/no): " CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

STAGE_DIR=$(mktemp -d)
trap 'rm -rf "${STAGE_DIR}"' EXIT

echo "📦 Extracting archive..."
tar -xzf "${BACKUP_ARCHIVE}" -C "${STAGE_DIR}"

mkdir -p "${DATA_DIR}" "${UPLOADS_DIR}"

if [ -f "${STAGE_DIR}/devops_stored.sqlite" ]; then
    echo "💾 Restoring SQLite database..."
    cp "${STAGE_DIR}/devops_stored.sqlite" "${DATA_DIR}/devops_stored.sqlite"
fi

if [ -d "${STAGE_DIR}/uploads" ]; then
    echo "📁 Restoring uploaded files vault..."
    cp -r "${STAGE_DIR}/uploads/"* "${UPLOADS_DIR}/" 2>/dev/null || true
fi

echo "✅ Restoration completed successfully! Please restart the DevOps Stored Data service."
