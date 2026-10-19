#!/usr/bin/env bash
# ==============================================================================
# DevOps Stored Data - Production Deployment Script
# Supports both Bare-Metal (systemd + Nginx) and Docker Compose deployment
# ==============================================================================

set -euo pipefail

DOMAIN="${1:-devops.example.com}"
DEPLOY_MODE="${2:-docker}" # 'docker' or 'systemd'

echo "=================================================="
echo "🚀 Deploying DevOps Stored Data for: https://${DOMAIN}"
echo "=================================================="

# Check prerequisites
if [ "${DEPLOY_MODE}" = "docker" ]; then
    if ! command -v docker >/dev/null 2>&1; then
        echo "❌ Error: Docker is not installed. Please install docker and docker compose."
        exit 1
    fi

    echo "🐳 Deploying via Docker Compose..."
    cd "$(dirname "$0")/../docker"

    # Replace domain placeholder in nginx.conf if different
    sed -i "s/devops.example.com/${DOMAIN}/g" nginx.conf

    docker compose down || true
    docker compose build --no-cache
    docker compose up -d

    echo "⏳ Waiting for healthcheck..."
    sleep 5
    docker compose ps

    echo "✅ Application deployed successfully via Docker!"
    echo "🔗 URL: https://${DOMAIN}"

else
    echo "🖥️  Deploying on Bare-Metal (Linux Systemd)..."
    cd "$(dirname "$0")/.."

    # 1. Install dependencies & build frontend
    npm install --production=false
    cd frontend && npm install && npm run build && cd ..

    # 2. Setup Systemd Unit
    cat <<EOF | sudo tee /etc/systemd/system/devops-stored-data.service
[Unit]
Description=DevOps Stored Data Application Server
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(which node) backend/src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=5000
Environment=CORS_ORIGIN=https://${DOMAIN}

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable devops-stored-data
    sudo systemctl restart devops-stored-data

    echo "✅ Systemd service started! Now configure Nginx reverse proxy using docker/nginx.conf."
fi
