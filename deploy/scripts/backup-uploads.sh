#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
UPLOAD_DIR="${UPLOAD_DIR:-uploads}"
mkdir -p "$BACKUP_DIR"
echo "Backing up uploads directory..."
tar -czf "$BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz" "$UPLOAD_DIR"
echo "Backup completed: $BACKUP_DIR/uploads_${TIMESTAMP}.tar.gz"
