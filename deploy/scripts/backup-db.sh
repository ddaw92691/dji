#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"
DB_NAME="${DB_NAME:-mall_system}"
DB_USER="${DB_USERNAME:-mall_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
echo "Backing up database $DB_NAME..."
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_DIR/mall_${TIMESTAMP}.dump"
echo "Backup completed: $BACKUP_DIR/mall_${TIMESTAMP}.dump"
