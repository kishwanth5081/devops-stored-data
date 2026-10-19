const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('./db');

function seedDatabase() {
  console.log('[Seed] Checking if database needs initial seeding...');

  // Check if admin already exists
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existingUser) {
    console.log('[Seed] Database already seeded. Skipping initial seeding.');
    return;
  }

  console.log('[Seed] Seeding initial DevOps data...');

  const now = new Date().toISOString();
  const adminId = crypto.randomUUID();
  const engineerId = crypto.randomUUID();

  // Hash passwords
  const adminPasswordHash = bcrypt.hashSync('DevOps@2026!Secure', 10);
  const engineerPasswordHash = bcrypt.hashSync('DevOps@2026!Engineer', 10);

  // Insert Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(adminId, 'admin@devops.local', adminPasswordHash, 'DevOps Lead Administrator', 'admin', now, now);
  insertUser.run(engineerId, 'engineer@devops.local', engineerPasswordHash, 'Senior SRE Engineer', 'engineer', now, now);

  // Insert POCs
  const pocs = [
    {
      id: crypto.randomUUID(),
      title: 'POC-07: Nginx Web Server Deployment & Reverse Proxy Hardening',
      slug: 'poc-07-nginx-web-server-deployment',
      summary: 'Production-ready Nginx reverse proxy with SSL termination, HTTP/2, HSTS, gzip, and zero-downtime reloads.',
      category: 'Networking',
      status: 'Production-Ready',
      environment: 'Multi-Cloud',
      tags: JSON.stringify(['Nginx', 'SSL', 'Reverse Proxy', 'HSTS', 'Performance']),
      repository_url: 'https://github.com/company/devops-nginx-setup',
      description: `# POC-07: Nginx Web Server Deployment & SSL Hardening

## Overview
This POC demonstrates standardizing our reverse proxy infrastructure to handle high-traffic web applications with automated TLS termination and A+ Qualys SSL ratings.

## Architecture Highlights
- HTTP to HTTPS redirection (Port 80 -> 443)
- TLSv1.2 & TLSv1.3 only (weak ciphers disabled)
- Gzip compression for static assets (.js, .css, .json, .svg)
- Rate limiting on API endpoints to prevent DDoS
- Zero-downtime reconfiguration via \`nginx -s reload\`
      `
    },
    {
      id: crypto.randomUUID(),
      title: 'POC-08: Multi-Region High Availability Architecture & Failover',
      slug: 'poc-08-multi-region-ha-architecture',
      summary: 'Active-Active multi-region infrastructure using Route 53 / Cloudflare GeoDNS and cross-region replication.',
      category: 'Infrastructure',
      status: 'Validated',
      environment: 'AWS',
      tags: JSON.stringify(['AWS', 'Route53', 'Terraform', 'Failover', 'High Availability']),
      repository_url: 'https://github.com/company/multi-region-ha',
      description: `# POC-08: Multi-Region High Availability Architecture

## Overview
Evaluated active-passive vs. active-active deployment topologies across \`us-east-1\` and \`eu-west-1\` to ensure 99.99% availability under severe regional cloud outages.

## Key Outcomes
- RPO (Recovery Point Objective): < 15 seconds
- RTO (Recovery Time Objective): < 60 seconds
- Automated health-check based DNS routing
      `
    },
    {
      id: crypto.randomUUID(),
      title: 'POC-10: Linux Server Security Hardening & CIS Compliance',
      slug: 'poc-10-linux-server-security-hardening',
      summary: 'Automated hardening script adhering to CIS Benchmark Level 2, UFW firewall rules, Fail2ban, and SSH keys.',
      category: 'Security',
      status: 'Production-Ready',
      environment: 'Linux',
      tags: JSON.stringify(['Linux', 'Ubuntu', 'CIS Benchmark', 'Fail2ban', 'UFW', 'SSH']),
      repository_url: 'https://github.com/company/linux-security-hardening',
      description: `# POC-10: Linux Server Security Hardening

## Overview
Baseline security blueprint applied across all Ubuntu 22.04 and 24.04 LTS compute nodes.

## Implementation Details
1. Disabled SSH root login & password authentication
2. Configured Fail2ban with aggressive jail for SSH brute force
3. Setup UFW allow-list for ports 22, 80, 443 only
4. Kernel hardening via \`/etc/sysctl.d/99-security.conf\` (SYN flood protection, ICMP redirects disabled)
      `
    },
    {
      id: crypto.randomUUID(),
      title: 'POC-11: Domain SSL/TLS Certificate Expiry & Renewal Monitor',
      slug: 'poc-11-domain-ssl-dns-monitor',
      summary: 'Automated daemon monitoring SSL cert expiration, OCSP status, and DNS propagation with Slack alerts.',
      category: 'Monitoring',
      status: 'Production-Ready',
      environment: 'Multi-Cloud',
      tags: JSON.stringify(['SSL', 'DNS', 'Let\'s Encrypt', 'Alerting', 'Bash', 'Cron']),
      repository_url: 'https://github.com/company/domain-ssl-dns-monitor',
      description: `# POC-11: Automated SSL & DNS Monitoring

## Overview
Never let a production SSL certificate expire unexpectedly. This monitor runs daily checks and notifies the team at 30, 14, 7, and 1-day thresholds.
      `
    },
    {
      id: crypto.randomUUID(),
      title: 'POC-12: Centralized Logging with FluentBit & OpenSearch',
      slug: 'poc-12-centralized-logging',
      summary: 'Lightweight log shipping agent across Kubernetes and Docker clusters routing structured JSON logs.',
      category: 'Monitoring',
      status: 'Validated',
      environment: 'Kubernetes',
      tags: JSON.stringify(['Logging', 'FluentBit', 'OpenSearch', 'K8s', 'Observability']),
      repository_url: 'https://github.com/company/centralized-logging',
      description: `# POC-12: Centralized Logging Architecture

High-throughput, low-memory footprint log shipper routing container stdout to OpenSearch with index lifecycle policies.
      `
    }
  ];

  const insertPoc = db.prepare(`
    INSERT INTO pocs (id, title, slug, summary, description, category, status, environment, tags, repository_url, author_id, author_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  pocs.forEach(p => {
    insertPoc.run(
      p.id, p.title, p.slug, p.summary, p.description, p.category, p.status, p.environment,
      p.tags, p.repository_url, adminId, 'DevOps Lead Administrator', now, now
    );
  });

  // Insert Tasks
  const tasks = [
    {
      id: crypto.randomUUID(),
      poc_id: pocs[0].id,
      title: 'Automate Nginx SSL Certificate Renewal via Certbot Hook',
      description: 'Implement a post-renewal deploy hook script that validates certificate syntax and reloads Nginx cleanly without dropping existing connections.',
      status: 'Completed',
      priority: 'High',
      assigned_to: engineerId,
      assigned_name: 'Senior SRE Engineer',
      category: 'Infrastructure',
      tags: JSON.stringify(['Nginx', 'SSL', 'Certbot']),
      due_date: '2026-11-01'
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[2].id,
      title: 'Rollout CIS Level 2 Hardening Script to Staging Bastion Host',
      description: 'Execute the hardening playbook on staging bastion and verify that SSH keys, fail2ban filters, and UFW rules work as expected.',
      status: 'In_Progress',
      priority: 'Critical',
      assigned_to: adminId,
      assigned_name: 'DevOps Lead Administrator',
      category: 'Security',
      tags: JSON.stringify(['CIS', 'Security', 'Bastion']),
      due_date: '2026-10-25'
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[1].id,
      title: 'Simulate Primary Region DNS Failover in Sandbox',
      description: 'Trigger synthetic outage on us-east-1 ALB and measure latency for Route 53 health-check failover to eu-west-1.',
      status: 'Review',
      priority: 'High',
      assigned_to: engineerId,
      assigned_name: 'Senior SRE Engineer',
      category: 'Infrastructure',
      tags: JSON.stringify(['Route53', 'Failover', 'AWS']),
      due_date: '2026-10-30'
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[4].id,
      title: 'Configure Log Retention Policy & S3 Cold Archival',
      description: 'Set OpenSearch index retention to 30 days hot storage, transitioning to AWS S3 Glacier after 90 days.',
      status: 'Backlog',
      priority: 'Medium',
      assigned_to: engineerId,
      assigned_name: 'Senior SRE Engineer',
      category: 'Monitoring',
      tags: JSON.stringify(['OpenSearch', 'S3', 'Logs']),
      due_date: '2026-11-15'
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[3].id,
      title: 'Integrate Slack Webhook for Expiring SSL Certificates',
      description: 'Connect bash monitoring script to #devops-alerts channel with formatted payload including days remaining and issuer info.',
      status: 'Completed',
      priority: 'Medium',
      assigned_to: adminId,
      assigned_name: 'DevOps Lead Administrator',
      category: 'Monitoring',
      tags: JSON.stringify(['Slack', 'Webhook', 'Alerts']),
      due_date: '2026-10-18'
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[0].id,
      title: 'Evaluate Nginx Brotli Compression vs Gzip',
      description: 'Benchmark HTTP response payload sizes and CPU overhead with Google Brotli vs traditional Gzip compression on production APIs.',
      status: 'Backlog',
      priority: 'Low',
      assigned_to: engineerId,
      assigned_name: 'Senior SRE Engineer',
      category: 'Performance',
      tags: JSON.stringify(['Brotli', 'Optimization', 'Nginx']),
      due_date: '2026-11-20'
    }
  ];

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, poc_id, title, description, status, priority, assigned_to, assigned_name, category, tags, due_date, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  tasks.forEach(t => {
    insertTask.run(
      t.id, t.poc_id, t.title, t.description, t.status, t.priority,
      t.assigned_to, t.assigned_name, t.category, t.tags, t.due_date,
      adminId, now, now
    );
  });

  // Insert Notes / Documentation
  const notes = [
    {
      id: crypto.randomUUID(),
      poc_id: pocs[0].id,
      title: 'Production SSL & Nginx Configuration Reference',
      category: 'Cheat Sheet',
      tags: JSON.stringify(['Nginx', 'SSL', 'Security']),
      content: `# Production Nginx SSL Configuration Guide

### 1. Modern Cipher Suites
\`\`\`nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
\`\`\`

### 2. HTTP Security Headers
\`\`\`nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
\`\`\`
      `
    },
    {
      id: crypto.randomUUID(),
      poc_id: pocs[2].id,
      title: 'Server Hardening & Bastion Access Runbook',
      category: 'Runbook',
      tags: JSON.stringify(['Security', 'Linux', 'Runbook']),
      content: `# Linux Security Hardening Checklist

- [x] Configure non-root sudoer user
- [x] Disable SSH root login (\`PermitRootLogin no\`)
- [x] Disable password authentication (\`PasswordAuthentication no\`)
- [x] Install & enable UFW with minimal open ports
- [x] Configure Fail2ban jail for SSH
- [x] Set automatic security updates via \`unattended-upgrades\`
      `
    }
  ];

  const insertNote = db.prepare(`
    INSERT INTO notes (id, poc_id, title, content, category, tags, author_id, author_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  notes.forEach(n => {
    insertNote.run(n.id, n.poc_id, n.title, n.content, n.category, n.tags, adminId, 'DevOps Lead Administrator', now, now);
  });

  // Insert initial audit logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, details, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run(
    crypto.randomUUID(), adminId, 'admin@devops.local',
    'SYSTEM_INIT', 'SYSTEM', 'SYSTEM',
    'DevOps Stored Data initialized with baseline POCs, tasks, and documentation', '127.0.0.1', now
  );

  console.log('[Seed] Database successfully seeded with baseline DevOps data!');
}

module.exports = seedDatabase;
