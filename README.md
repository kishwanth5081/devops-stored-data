# DevOps Stored Data 🚀

> **Centralized Hub to Store, Track, and Manage DevOps Proofs of Concept (POCs), Tasks, Automation Scripts, Configuration Files, and Project Documentation.**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20(WAL%20Mode)-blue.svg)](https://www.sqlite.org/)
[![Security](https://img.shields.io/badge/Security-Bcrypt%20%7C%20JWT%20%7C%20RateLimited-emerald.svg)]()
[![SSL/TLS](https://img.shields.io/badge/SSL%2FTLS-Let's%20Encrypt%20A+-cyan.svg)]()

---

## 🌟 Key Features

- 🔐 **Enterprise Authentication & RBAC**: Secure multi-user login with bcrypt password hashing, JWT stateless tokens, and role-based access (`admin`, `engineer`, `viewer`).
- 📊 **Executive DevOps Dashboard**: High-level metrics for total POCs, task pipeline throughput, storage volume, priority alerts, and real-time audit logs.
- 🧪 **POC Repository**: Complete registry for DevOps Proofs of Concept across Cloud (AWS, Azure, GCP), Infrastructure, Networking, and Security with detailed Markdown specifications.
- 📋 **Project & Task Pipeline (Kanban & List)**: Interactive Kanban board tracking stages (`Backlog`, `In Progress`, `Review`, `Completed`, `Blocked`) with priority flags and assignee controls.
- 🗄️ **Files & Scripts Vault**: Central storage for automation scripts (`.sh`, `.py`, `.ps1`), infrastructure configs (`.yaml`, `.tf`, `.json`, `.conf`), logs, and diagrams with **live in-browser code syntax preview** and instant downloads.
- 📖 **Runbooks & Documentation**: Markdown-based knowledge base for incident response playbooks, troubleshooting guides, and architecture blueprints.
- 🛡️ **Full Audit Trail**: Immutable logging of every login, task transition, file upload, and deletion.
- 🌐 **Custom Domain & Zero Port Exposure**: Production Nginx reverse proxy configuration routing `https://devops.example.com` without exposing IP addresses or internal port numbers.
- 📦 **Automated Backups**: Hot SQLite snapshot and file archival scripts with 7-day retention rotation.
- 🩺 **Health & Prometheus Monitoring**: Native `/health` JSON probe and `/metrics` Prometheus exposition format.

---

## 🏗️ Project Structure

```
devops-stored-data/
├── backend/
│   ├── src/
│   │   ├── config/env.js            # Environment configurations
│   │   ├── database/
│   │   │   ├── db.js                # SQLite WAL connection & schema
│   │   │   └── seed.js              # Baseline DevOps POCs & tasks seeder
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT & RBAC guards
│   │   │   ├── upload.js            # Multer file sanitizer & size limiter
│   │   │   └── rateLimiter.js       # DDoS & brute-force throttler
│   │   ├── routes/                  # Modular REST API endpoints
│   │   ├── services/auditService.js # Security event logger
│   │   └── server.js                # Express app entrypoint & static host
│   ├── data/                        # Persistent SQLite database storage
│   └── uploads/                     # Stored scripts & config files
├── frontend/                        # React 19 + Tailwind CSS + Lucide
│   ├── src/
│   │   ├── components/              # Navbar, Sidebar
│   │   ├── context/AuthContext.jsx  # Authentication state
│   │   ├── pages/                   # Dashboard, POCs, Tasks, Files, Notes, Audit
│   │   └── services/api.js          # Unified API client
│   └── vite.config.js
├── docker/
│   ├── Dockerfile                   # Multi-stage production container build
│   ├── docker-compose.yml           # App + Nginx + Certbot orchestration
│   └── nginx.conf                   # Production TLS/SSL reverse proxy
├── scripts/
│   ├── backup.sh / backup.ps1       # Automated backup scripts (Linux/Windows)
│   ├── restore.sh                   # Disaster recovery restore tool
│   ├── deploy.sh                    # One-click deployment script
│   └── certbot-ssl-setup.sh         # Let's Encrypt SSL provisioner
├── docs/
│   ├── DEPLOYMENT_AND_DOMAIN_SETUP_GUIDE.md
│   ├── ARCHITECTURE_AND_SECURITY.md
│   └── MAINTENANCE_AND_BACKUP_GUIDE.md
└── package.json
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js (v20+ LTS)
- npm (v10+)

### 1. Install & Build
```bash
cd devops-stored-data

# Install backend dependencies
npm install

# Build production frontend assets
npm run build
```

### 2. Start Application
```bash
npm start
```
The server will start on `http://localhost:5000`. Navigate to this URL in your web browser.

### 🔑 Default Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Lead Administrator** | `admin@devops.local` | `DevOps@2026!Secure` |
| **Senior SRE Engineer** | `engineer@devops.local` | `DevOps@2026!Engineer` |

*(Quick-fill demo buttons are also provided directly on the login screen for 1-click access)*

---

## 🚀 Production Deployment with Custom Domain

To deploy on a server with your custom domain (`https://devops.example.com`) without exposing ports:

1. **Point DNS**: Add an `A Record` pointing `devops.example.com` to your server's IP address.
2. **Deploy via Docker Compose**:
   ```bash
   cd devops-stored-data/docker
   docker compose up -d --build
   ```
3. **Provision SSL**:
   ```bash
   sudo ./scripts/certbot-ssl-setup.sh devops.example.com admin@example.com
   ```

Refer to [docs/DEPLOYMENT_AND_DOMAIN_SETUP_GUIDE.md](file:///c:/Users/kishwanth.aderu/Desktop/Tasks/devops-stored-data/docs/DEPLOYMENT_AND_DOMAIN_SETUP_GUIDE.md) for full instructions.

---

## 💾 Backup & Maintenance

Run an immediate manual backup:
```bash
# On Linux
./scripts/backup.sh

# On Windows
npm run backup
```

Backups are saved to `/var/backups/devops-stored-data` (or `./backups` on Windows) and automatically retain the last 7 days of snapshots.
