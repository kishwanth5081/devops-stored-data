#!/usr/bin/env bash
# ==============================================================================
# DevOps Stored Data - Let's Encrypt SSL/TLS Certificate Provisioner
# ==============================================================================

set -euo pipefail

DOMAIN="${1:-devops.example.com}"
EMAIL="${2:-admin@example.com}"

echo "=================================================="
echo "🔒 Provisioning Let's Encrypt SSL for ${DOMAIN}"
echo "=================================================="

# Check if Certbot is installed
if ! command -v certbot >/dev/null 2>&1; then
    echo "Installing certbot and python3-certbot-nginx..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Request certificate
echo "Issuing certificate via Nginx plugin..."
sudo certbot --nginx \
    -d "${DOMAIN}" \
    --non-interactive \
    --agree-tos \
    -m "${EMAIL}" \
    --redirect

# Verify renewal timer
echo "Checking renewal systemd timer..."
sudo systemctl status certbot.timer --no-pager || true

echo "Testing dry-run renewal..."
sudo certbot renew --dry-run

echo "=================================================="
echo "✅ SSL/TLS certificate configured for https://${DOMAIN}!"
echo "   Auto-renewal is active."
echo "=================================================="
