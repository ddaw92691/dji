#!/bin/bash
echo "Building and deploying Mall System..."
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
echo "Deployment complete. Checking services..."
sleep 10
docker compose -f docker-compose.prod.yml ps
