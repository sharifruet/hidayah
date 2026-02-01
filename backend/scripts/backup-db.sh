#!/bin/bash

# Database backup script
# Usage: ./scripts/backup-db.sh

set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-salat_saom_db}"
CONTAINER_NAME="${MYSQL_CONTAINER:-ramadan_mysql_prod}"

echo "💾 Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Get database password from environment or docker-compose
if [ -f ".env.production" ]; then
    source .env.production
fi

# Create backup
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.sql"
docker exec "$CONTAINER_NAME" mysqldump \
    -u root \
    -p"${DB_ROOT_PASSWORD}" \
    --single-transaction \
    --routines \
    --triggers \
    "${DB_NAME}" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "✅ Backup created: ${BACKUP_FILE}"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "📦 Backup size: ${BACKUP_SIZE}"

# Cleanup old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup completed successfully!"
