#!/bin/bash
if [ -z "$1" ]; then echo "Usage: ./restore-db.sh <backup-file>"; exit 1; fi
DB_NAME="${DB_NAME:-mall_system}"
DB_USER="${DB_USERNAME:-mall_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
echo "Restoring database $DB_NAME from $1..."
PGPASSWORD="${DB_PASSWORD}" pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$1"
echo "Restore completed."
