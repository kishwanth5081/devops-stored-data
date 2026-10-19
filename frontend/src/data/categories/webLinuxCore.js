// Image 2: Web, Monitoring & Linux Essentials (13 Categories, 118 Commands)
export const WEB_LINUX_CORE_COMMANDS = [
  {
    "id": "nginx-test-config",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Test Nginx Configuration Syntax",
    "command": "sudo nginx -t",
    "description": "Validates configuration syntax and checks if referenced SSL certificates and files exist.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "test",
      "syntax",
      "config"
    ],
    "explanation": "Always run this before reloading Nginx to avoid taking down production websites.",
    "expectedOutput": "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful",
    "prerequisites": "Nginx installed."
  },
  {
    "id": "nginx-reload-graceful",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Reload Configuration Without Dropping Connections",
    "command": "sudo systemctl reload nginx",
    "description": "Signals the Nginx master process to start new workers with updated config and phase out old workers.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "reload",
      "graceful",
      "zero-downtime"
    ],
    "explanation": "Sends SIGHUP to master process; active HTTP requests complete without interruption.",
    "expectedOutput": "",
    "prerequisites": "Nginx running."
  },
  {
    "id": "nginx-dump-config",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Dump Full Resolved Configuration to Terminal",
    "command": "sudo nginx -T",
    "description": "Prints the entire consolidated configuration including all included files in sites-enabled.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "dump",
      "inspect",
      "config"
    ],
    "explanation": "Useful for tracking down conflicting server_name or duplicate directive warnings.",
    "expectedOutput": "# configuration file /etc/nginx/nginx.conf:\nuser www-data;\nworker_processes auto;\npid /run/nginx.pid;\n# configuration file /etc/nginx/sites-enabled/devops.conf:\nserver {\n    listen 80;\n    server_name devops.local;\n}",
    "prerequisites": "Nginx."
  },
  {
    "id": "nginx-tail-access",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Monitor HTTP 5xx Server Errors in Access Log",
    "command": "sudo tail -f /var/log/nginx/access.log | grep --line-buffered \" 50[0-5] \"",
    "description": "Streams incoming HTTP requests that resulted in 500, 502, 503, or 504 errors in real time.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "access-log",
      "errors",
      "5xx",
      "stream"
    ],
    "explanation": "Filters log lines using regex to catch backend proxy and gateway crashes immediately.",
    "expectedOutput": "192.168.0.50 - - [16/Oct/2026:12:35:10 +0000] \"POST /api/upload HTTP/1.1\" 502 157 \"-\" \"Mozilla/5.0\"\n192.168.0.82 - - [16/Oct/2026:12:35:14 +0000] \"GET /api/pocs HTTP/1.1\" 504 182 \"-\" \"axios/1.6.0\"",
    "prerequisites": "Nginx logs."
  },
  {
    "id": "nginx-tail-error",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Follow Live Nginx Error Log",
    "command": "sudo tail -f -n 50 /var/log/nginx/error.log",
    "description": "Displays upstream timeouts, SSL certificate handshake errors, and permission failures.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "error-log",
      "upstream",
      "debug"
    ],
    "explanation": "Direct log of web server internal errors and upstream proxy connection refusals.",
    "expectedOutput": "2026/10/16 12:35:10 [error] 1421#1421: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 192.168.0.50, server: devops.local, request: \"POST /api/upload HTTP/1.1\", upstream: \"http://127.0.0.1:5000/api/upload\"",
    "prerequisites": "Nginx."
  },
  {
    "id": "nginx-restart-service",
    "category": "nginx",
    "categoryLabel": "Nginx",
    "title": "Full Systemd Service Restart",
    "command": "sudo systemctl restart nginx && sudo systemctl status nginx --no-pager",
    "description": "Stops all Nginx processes, rebinds ports 80/443, and displays immediate status.",
    "privilege": "sudo",
    "tags": [
      "nginx",
      "restart",
      "systemd",
      "service"
    ],
    "explanation": "Use when master process gets unresponsive or when changing socket permissions.",
    "expectedOutput": "● nginx.service - A high performance web server and a reverse proxy server\n     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)\n     Active: active (running) since Thu 2026-10-16 12:36:00 UTC; 2s ago\n   Main PID: 3412 (nginx)",
    "prerequisites": "Root/sudo privileges."
  },
  {
    "id": "dns-dig-trace",
    "category": "networking-dns",
    "categoryLabel": "Networking & DNS",
    "title": "Query Hierarchical DNS Propagation with Dig Trace",
    "command": "dig +trace +noall +answer example.com ANY",
    "description": "Follows recursive DNS query path from root servers down to authoritative nameservers.",
    "privilege": "user",
    "tags": [
      "dns",
      "dig",
      "trace",
      "nameserver",
      "propagation"
    ],
    "explanation": "Detects DNS delegation problems, glue record issues, and cache poisoning.",
    "expectedOutput": "example.com.            86400   IN      A       93.184.216.34\nexample.com.            86400   IN      AAAA    2606:2800:220:1:248:1893:25c8:1946\nexample.com.            86400   IN      NS      a.iana-servers.net.\nexample.com.            86400   IN      NS      b.iana-servers.net.",
    "prerequisites": "dnsutils / bind-utils package."
  },
  {
    "id": "ssl-check-expiry",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Inspect Remote SSL/TLS Expiry Date & Issuer",
    "command": "openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer -subject",
    "description": "Queries remote HTTPS endpoint and extracts start date, expiration date, CA issuer, and CN.",
    "privilege": "user",
    "tags": [
      "ssl",
      "tls",
      "certificate",
      "expiration",
      "openssl"
    ],
    "explanation": "Verifies certificate validity before an unexpected HTTPS outage occurs.",
    "expectedOutput": "notBefore=Sep 12 00:00:00 2026 GMT\nnotAfter=Dec 11 23:59:59 2026 GMT\nissuer=C=US, O=Let's Encrypt, CN=R3\nsubject=CN=example.com",
    "prerequisites": "OpenSSL CLI."
  },
  {
    "id": "ssl-gen-key-csr",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Generate 2048-bit RSA Key & Certificate Signing Request (CSR)",
    "command": "openssl req -new -newkey rsa:2048 -nodes -keyout app.key -out app.csr -subj \"/C=US/ST=CA/L=SF/O=DevOps/CN=portal.example.com\"",
    "description": "Creates a private RSA key and signing request for submission to an SSL Certificate Authority.",
    "privilege": "user",
    "tags": [
      "ssl",
      "rsa",
      "csr",
      "private-key",
      "pki"
    ],
    "explanation": "Generates private key without password (-nodes) for automated web server daemon use.",
    "expectedOutput": "Generating a RSA private key\n................................+++++\nwriting new private key to 'app.key'",
    "prerequisites": "OpenSSL."
  },
  {
    "id": "ssl-read-local-cert",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Read Local PEM Certificate Details",
    "command": "openssl x509 -in /etc/ssl/certs/app.crt -text -noout",
    "description": "Prints subject alternative names (SANs), serial number, public key algorithm, and extensions.",
    "privilege": "user",
    "tags": [
      "ssl",
      "x509",
      "pem",
      "inspect"
    ],
    "explanation": "Inspects certificate on disk to verify SAN coverage for multiple domains.",
    "expectedOutput": "Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number: 4b:82:19:...\n        Signature Algorithm: sha256WithRSAEncryption\n        Issuer: C = US, O = Let's Encrypt, CN = R3\n        Subject: CN = portal.example.com\n        X509v3 Subject Alternative Name: \n            DNS:portal.example.com, DNS:devops.example.com",
    "prerequisites": "Certificate file."
  },
  {
    "id": "ssl-verify-key-match",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Verify that Certificate and Private Key Match",
    "command": "test \"$(openssl x509 -noout -modulus -in cert.pem | md5sum)\" = \"$(openssl rsa -noout -modulus -in key.pem | md5sum)\" && echo \"MATCH: Valid Keypair\" || echo \"MISMATCH: Invalid Pair\"",
    "description": "Compares MD5 hash of public modulus between certificate and private key.",
    "privilege": "user",
    "tags": [
      "ssl",
      "modulus",
      "verification",
      "debug"
    ],
    "explanation": "Nginx will fail to start if the private key does not match the public cert.",
    "expectedOutput": "MATCH: Valid Keypair",
    "prerequisites": "Certificate and key files."
  },
  {
    "id": "ssl-certbot-renew-dry",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Test Automatic Let's Encrypt Certificate Renewal",
    "command": "sudo certbot renew --dry-run",
    "description": "Simulates ACME HTTP-01 or DNS-01 certificate renewal challenges without altering active certs.",
    "privilege": "sudo",
    "tags": [
      "certbot",
      "letsencrypt",
      "renewal",
      "dry-run"
    ],
    "explanation": "Verifies cron or systemd timer renewal configuration before cert expiration.",
    "expectedOutput": "Simulating renewal of an existing certificate for devops.local\nThe following certificates would be renewed:\n  /etc/letsencrypt/live/devops.local/fullchain.pem (success)\n\nCongratulations, all simulated renewals succeeded:",
    "prerequisites": "Certbot installed."
  },
  {
    "id": "ssl-certbot-standalone",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Issue Standalone Let's Encrypt Certificate",
    "command": "sudo certbot certonly --standalone -d portal.example.com --non-interactive --agree-tos -m admin@example.com",
    "description": "Spins up temporary internal webserver on port 80 to complete domain validation and issue cert.",
    "privilege": "sudo",
    "tags": [
      "certbot",
      "acme",
      "standalone",
      "issue"
    ],
    "explanation": "Useful for servers where no web server is running or during initial provisioning.",
    "expectedOutput": "Successfully received certificate.\nCertificate is saved at: /etc/letsencrypt/live/portal.example.com/fullchain.pem\nKey is saved at:         /etc/letsencrypt/live/portal.example.com/privkey.pem",
    "prerequisites": "Port 80 reachable from public internet."
  },
  {
    "id": "ssl-test-tls13",
    "category": "ssl-tls",
    "categoryLabel": "SSL/TLS & Cloud...",
    "title": "Verify TLS 1.3 Protocol & Cipher Negotiation",
    "command": "openssl s_client -connect localhost:443 -tls1_3 -ciphersuites TLS_AES_256_GCM_SHA384 </dev/null",
    "description": "Forces TLS 1.3 handshake to test modern cryptographic compliance and cipher strength.",
    "privilege": "user",
    "tags": [
      "ssl",
      "tls13",
      "security",
      "ciphers"
    ],
    "explanation": "Confirms outdated protocols like TLS 1.0/1.1 and insecure ciphers are disabled.",
    "expectedOutput": "CONNECTED(00000003)\nNew, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\nServer public key is 2048 bit\nVerification: OK",
    "prerequisites": "HTTPS server."
  },
  {
    "id": "prom-reload-config",
    "category": "prometheus-grafana",
    "categoryLabel": "Prometheus & Gr...",
    "title": "Reload Prometheus Configuration Without Restart",
    "command": "curl -X POST http://localhost:9090/-/reload",
    "description": "Hot-reloads scrape configs, alerting rules, and targets via HTTP endpoint.",
    "privilege": "user",
    "tags": [
      "prometheus",
      "reload",
      "metrics",
      "config"
    ],
    "explanation": "Requires --web.enable-lifecycle flag passed to Prometheus daemon on launch.",
    "expectedOutput": "200 OK",
    "prerequisites": "Prometheus running on port 9090."
  },
  {
    "id": "prom-health-check",
    "category": "prometheus-grafana",
    "categoryLabel": "Prometheus & Gr...",
    "title": "Check Prometheus Health & Storage Readiness",
    "command": "curl -s http://localhost:9090/-/ready && echo \"\" && curl -s http://localhost:9090/-/healthy",
    "description": "Verifies WAL replay is finished and TSDB storage is ready to ingest metrics.",
    "privilege": "user",
    "tags": [
      "prometheus",
      "health",
      "ready",
      "wal"
    ],
    "explanation": "Returns 200 Prometheus Server is Ready.",
    "expectedOutput": "Prometheus Server is Ready.\nPrometheus Server is Healthy.",
    "prerequisites": "Prometheus."
  },
  {
    "id": "prom-query-instant",
    "category": "prometheus-grafana",
    "categoryLabel": "Prometheus & Gr...",
    "title": "Query Instant PromQL Metric via REST API",
    "command": "curl -s \"http://localhost:9090/api/v1/query?query=up{job='node'}\" | jq .data.result",
    "description": "Queries PromQL instant vector to check if node exporter scrape target is up.",
    "privilege": "user",
    "tags": [
      "prometheus",
      "promql",
      "api",
      "metrics"
    ],
    "explanation": "Parses Prometheus JSON API response.",
    "expectedOutput": "[\n  {\n    \"metric\": {\n      \"__name__\": \"up\",\n      \"instance\": \"localhost:9100\",\n      \"job\": \"node\"\n    },\n    \"value\": [\n      1729082100,\n      \"1\"\n    ]\n  }\n]",
    "prerequisites": "Prometheus running with node_exporter."
  },
  {
    "id": "grafana-restart",
    "category": "prometheus-grafana",
    "categoryLabel": "Prometheus & Gr...",
    "title": "Restart Grafana Server Service & Check Status",
    "command": "sudo systemctl restart grafana-server && sudo systemctl status grafana-server --no-pager",
    "description": "Restarts Grafana dashboard server to reload datasource plugins or provisioning files.",
    "privilege": "sudo",
    "tags": [
      "grafana",
      "systemd",
      "restart",
      "dashboards"
    ],
    "explanation": "Restarts grafana-server daemon on port 3000.",
    "expectedOutput": "● grafana-server.service - Grafana instance\n     Loaded: loaded (/usr/lib/systemd/system/grafana-server.service; enabled; preset: enabled)\n     Active: active (running) since Thu 2026-10-16 12:40:00 UTC; 1s ago\n   Main PID: 4512 (grafana)",
    "prerequisites": "Grafana installed."
  },
  {
    "id": "sec-ss-listening",
    "category": "security-troubleshooting",
    "categoryLabel": "Security & Troubl...",
    "title": "Audit Open Ports & Listening Daemons",
    "command": "sudo ss -tulpn | grep LISTEN",
    "description": "Displays all listening TCP/UDP sockets along with process names and PIDs.",
    "privilege": "sudo",
    "tags": [
      "security",
      "ports",
      "ss",
      "sockets",
      "audit"
    ],
    "explanation": "Faster modern replacement for netstat reading directly from kernel sock_diag.",
    "expectedOutput": "tcp   LISTEN 0      4096       0.0.0.0:5000       0.0.0.0:*    users:((\"node\",pid=1740,fd=19))\ntcp   LISTEN 0      511        0.0.0.0:80         0.0.0.0:*    users:((\"nginx\",pid=1420,fd=6))\ntcp   LISTEN 0      128        0.0.0.0:22         0.0.0.0:*    users:((\"sshd\",pid=842,fd=3))",
    "prerequisites": "iproute2 package."
  },
  {
    "id": "sec-nmap-scan",
    "category": "security-troubleshooting",
    "categoryLabel": "Security & Troubl...",
    "title": "Scan Host for Open TCP Ports & Service Banners",
    "command": "nmap -sV -p 22,80,443,3000,5000 127.0.0.1",
    "description": "Probes common application ports to discover exposed services and software versions.",
    "privilege": "user",
    "tags": [
      "security",
      "nmap",
      "portscan",
      "banners"
    ],
    "explanation": "Useful for validating firewall rules and ensuring administrative ports are blocked.",
    "expectedOutput": "PORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.4\n80/tcp   open  http    nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n5000/tcp open  http    Node.js Express framework",
    "prerequisites": "nmap installed."
  },
  {
    "id": "sec-active-sessions",
    "category": "security-troubleshooting",
    "categoryLabel": "Security & Troubl...",
    "title": "Audit Active Login Sessions & Recent Logins",
    "command": "who -u && echo \"--- RECENT LOGINS ---\" && last -n 5",
    "description": "Shows who is logged in right now, their remote IP, and the last 5 successful sessions.",
    "privilege": "user",
    "tags": [
      "security",
      "sessions",
      "who",
      "last",
      "audit"
    ],
    "explanation": "Reads /var/run/utmp and /var/log/wtmp.",
    "expectedOutput": "kishwanth pts/0        2026-10-16 10:15 .              1842 (192.168.0.132)\n--- RECENT LOGINS ---\nkishwanth pts/0        192.168.0.132    Thu Oct 16 10:15   still logged in\nadmin     pts/1        10.0.0.45        Wed Oct 15 18:02 - 19:40  (01:37)",
    "prerequisites": "Linux system."
  },
  {
    "id": "sec-failed-logins",
    "category": "security-troubleshooting",
    "categoryLabel": "Security & Troubl...",
    "title": "Inspect Failed SSH Password Brute-Force Attempts",
    "command": "sudo journalctl -u ssh -u sshd --lines=100 | grep \"Failed password\" | tail -n 15",
    "description": "Extracts remote IPs attempting brute-force dictionary attacks against SSH port 22.",
    "privilege": "sudo",
    "tags": [
      "security",
      "ssh",
      "bruteforce",
      "audit",
      "journalctl"
    ],
    "explanation": "Helps identify aggressive IP addresses to block with Fail2ban or UFW.",
    "expectedOutput": "Oct 16 11:42:01 srv sshd[9120]: Failed password for invalid user root from 198.51.100.23 port 41200 ssh2\nOct 16 11:42:04 srv sshd[9124]: Failed password for invalid user admin from 198.51.100.23 port 41204 ssh2",
    "prerequisites": "systemd journal."
  },
  {
    "id": "sec-apparmor-status",
    "category": "security-troubleshooting",
    "categoryLabel": "Security & Troubl...",
    "title": "Check AppArmor / SELinux Security Profiles Status",
    "command": "sudo aa-status 2>/dev/null || getenforce 2>/dev/null || echo \"LSM Disabled\"",
    "description": "Verifies Linux Security Module (LSM) mandatory access control enforcement.",
    "privilege": "sudo",
    "tags": [
      "security",
      "apparmor",
      "selinux",
      "hardening"
    ],
    "explanation": "Shows whether kernel profiles for system daemons are in enforce or complain mode.",
    "expectedOutput": "apparmor module is loaded.\n32 profiles are loaded.\n32 profiles are in enforce mode.\n   /usr/bin/man\n   /usr/sbin/mysqld\n   /usr/sbin/named",
    "prerequisites": "Linux kernel with AppArmor or SELinux."
  },
  {
    "id": "pg-psql-connect",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Connect to PostgreSQL Database Shell",
    "command": "psql -h localhost -U postgres -d devops_db -p 5432",
    "description": "Launches interactive SQL terminal connected to the target database server.",
    "privilege": "user",
    "tags": [
      "postgres",
      "psql",
      "database",
      "sql"
    ],
    "explanation": "Standard interactive REPL for PostgreSQL administration.",
    "expectedOutput": "psql (16.2)\nType \"help\" for help.\n\ndevops_db=# ",
    "prerequisites": "PostgreSQL client."
  },
  {
    "id": "pg-dump-backup",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Dump Full Database with Gzip Compression",
    "command": "pg_dump -h localhost -U postgres devops_db | gzip > /backup/devops_db_$(date +%F_%H%M).sql.gz",
    "description": "Creates a consistent transactional snapshot backup without locking tables.",
    "privilege": "user",
    "tags": [
      "postgres",
      "pg_dump",
      "backup",
      "compression"
    ],
    "explanation": "Streams SQL statements through gzip for minimal disk consumption.",
    "expectedOutput": "[Backup] devops_db_2026-10-16_1245.sql.gz created (14.2 MB)",
    "prerequisites": "pg_dump."
  },
  {
    "id": "pg-restore-backup",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Restore Database from Compressed Backup",
    "command": "gunzip -c /backup/devops_db_backup.sql.gz | psql -h localhost -U postgres -d devops_db",
    "description": "Decompresses stream and feeds DDL and INSERT statements back into PostgreSQL.",
    "privilege": "user",
    "tags": [
      "postgres",
      "restore",
      "recovery",
      "sql"
    ],
    "explanation": "Executes within database transaction.",
    "expectedOutput": "SET\nSET\nCREATE TABLE\nALTER TABLE\nCOPY 1420\nCOMMIT",
    "prerequisites": "Target database created."
  },
  {
    "id": "pg-active-queries",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Show Long-Running Active Queries & Durations",
    "command": "psql -U postgres -d devops_db -c \"SELECT pid, now() - query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' AND query NOT LIKE '%pg_stat_activity%' ORDER BY duration DESC LIMIT 5;\"",
    "description": "Diagnoses deadlocks, slow queries, and database thread bottlenecks.",
    "privilege": "user",
    "tags": [
      "postgres",
      "queries",
      "performance",
      "slow-query"
    ],
    "explanation": "Inspects pg_stat_activity internal catalog.",
    "expectedOutput": "  pid  |    duration     |                        query                         | state  \n-------+-----------------+------------------------------------------------------+--------\n 18412 | 00:00:12.491024 | SELECT * FROM audit_logs WHERE payload LIKE '%auth%' | active ",
    "prerequisites": "PostgreSQL."
  },
  {
    "id": "pg-terminate-backend",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Terminate Stuck Query / Connection by PID",
    "command": "psql -U postgres -d devops_db -c \"SELECT pg_terminate_backend(18412);\"",
    "description": "Sends termination signal to backend PostgreSQL worker thread freeing lock.",
    "privilege": "user",
    "tags": [
      "postgres",
      "kill",
      "terminate",
      "lock"
    ],
    "explanation": "Safely aborts stuck transaction and releases shared row locks.",
    "expectedOutput": " pg_terminate_backend \n----------------------\n t\n(1 row)",
    "prerequisites": "Postgres superuser."
  },
  {
    "id": "pg-vacuum-analyze",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Vacuum & Analyze Database to Reclaim Space",
    "command": "vacuumdb -U postgres -d devops_db -z -v",
    "description": "Reclaims storage from deleted dead tuples and updates table statistics for query planner.",
    "privilege": "user",
    "tags": [
      "postgres",
      "vacuum",
      "analyze",
      "maintenance"
    ],
    "explanation": "Prevents index bloat and accelerates SQL query planner accuracy.",
    "expectedOutput": "vacuumdb: vacuuming database \"devops_db\"\nINFO:  vacuuming \"public.audit_logs\"\nINFO:  \"audit_logs\": removed 420 dead row versions in 12 pages\nINFO:  analyzing \"public.audit_logs\"",
    "prerequisites": "vacuumdb."
  },
  {
    "id": "pg-database-size",
    "category": "postgresql-databases",
    "categoryLabel": "PostgreSQL & Da...",
    "title": "Display Human-Readable Database Disk Usage",
    "command": "psql -U postgres -d devops_db -c \"SELECT pg_size_pretty(pg_database_size('devops_db')) AS total_size;\"",
    "description": "Calculates physical on-disk storage occupied by tables, indexes, and TOAST data.",
    "privilege": "user",
    "tags": [
      "postgres",
      "size",
      "disk",
      "storage"
    ],
    "explanation": "Reads relation sizes from disk cluster directory.",
    "expectedOutput": " total_size \n------------\n 184 MB\n(1 row)",
    "prerequisites": "psql."
  },
  {
    "id": "script-bash-strict",
    "category": "scripting-automation",
    "categoryLabel": "Scripting & Auto...",
    "title": "Execute Bash Script with Strict Error Tracing",
    "command": "bash -eux script.sh",
    "description": "Executes script exiting on any error (-e), treating unset variables as error (-u), and printing each command (-x).",
    "privilege": "user",
    "tags": [
      "bash",
      "debugging",
      "strict",
      "tracing"
    ],
    "explanation": "The industry-standard debugging mode for production DevOps automation scripts.",
    "expectedOutput": "+ export ENVIRONMENT=production\n+ ENVIRONMENT=production\n+ mkdir -p /opt/app/data\n+ node src/server.js",
    "prerequisites": "Bash script."
  },
  {
    "id": "script-jq-filter",
    "category": "scripting-automation",
    "categoryLabel": "Scripting & Auto...",
    "title": "Filter & Transform JSON API Payloads with jq",
    "command": "curl -s http://localhost:5000/api/pocs | jq '.data[] | {id: .id, title: .title, status: .status}'",
    "description": "Extracts specific key-value pairs from complex nested JSON payloads.",
    "privilege": "user",
    "tags": [
      "jq",
      "json",
      "filter",
      "parsing"
    ],
    "explanation": "Lightweight command-line JSON processor.",
    "expectedOutput": "{\n  \"id\": 1,\n  \"title\": \"AWS EKS Cluster Terraform Module\",\n  \"status\": \"active\"\n}\n{\n  \"id\": 2,\n  \"title\": \"Kubernetes Ingress & Cert-Manager\",\n  \"status\": \"completed\"\n}",
    "prerequisites": "jq CLI."
  },
  {
    "id": "script-sed-replace-all",
    "category": "scripting-automation",
    "categoryLabel": "Scripting & Auto...",
    "title": "Recursive String Find & Replace Across Config Files",
    "command": "find ./config -type f -name \"*.env\" -exec sed -i 's/http:\\/\\/localhost:5000/https:\\/\\/devops.example.com/g' {} +",
    "description": "Replaces URLs or variables in-place across matching files throughout directory tree.",
    "privilege": "user",
    "tags": [
      "sed",
      "find",
      "replace",
      "batch"
    ],
    "explanation": "Combines find with stream editor sed for batch refactoring.",
    "expectedOutput": "",
    "prerequisites": "Config directory."
  },
  {
    "id": "script-gen-token",
    "category": "scripting-automation",
    "categoryLabel": "Scripting & Auto...",
    "title": "Generate Cryptographically Secure Random Hex Secret",
    "command": "openssl rand -hex 32",
    "description": "Produces a 256-bit entropy random hexadecimal string suitable for JWT secrets or API keys.",
    "privilege": "user",
    "tags": [
      "openssl",
      "security",
      "token",
      "entropy"
    ],
    "explanation": "Sources high-entropy random data directly from kernel CSPRNG /dev/urandom.",
    "expectedOutput": "a7f9c2d4e8b0123456789abcdef0123456789abcdef0123456789abcdef01234",
    "prerequisites": "OpenSSL."
  },
  {
    "id": "script-benchmark-time",
    "category": "scripting-automation",
    "categoryLabel": "Scripting & Auto...",
    "title": "Benchmark Execution Time & Peak RAM Consumption",
    "command": "/usr/bin/time -v node -e \"console.log('Benchmarking...')\"",
    "description": "Detailed measurement of user/kernel CPU time, page faults, and maximum resident set size (RAM).",
    "privilege": "user",
    "tags": [
      "benchmark",
      "performance",
      "memory",
      "cpu"
    ],
    "explanation": "Uses GNU time binary rather than shell built-in to capture system resource stats.",
    "expectedOutput": "Benchmarking...\n\tCommand being timed: \"node -e console.log('Benchmarking...')\"\n\tUser time (seconds): 0.04\n\tSystem time (seconds): 0.01\n\tPercent of CPU this job got: 95%\n\tElapsed (wall clock) time: 0:00.06\n\tMaximum resident set size (kbytes): 32840",
    "prerequisites": "/usr/bin/time package."
  },
  {
    "id": "basic-pwd",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Print Current Working Directory",
    "command": "pwd",
    "description": "Outputs the absolute filesystem path of the current directory.",
    "privilege": "user",
    "tags": [
      "basic",
      "pwd",
      "directory",
      "path"
    ],
    "explanation": "Resolves environment PWD variable or calls getcwd() syscall.",
    "expectedOutput": "/home/kishwanth/devops-stored-data",
    "prerequisites": "Any shell."
  },
  {
    "id": "basic-whoami",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Print Current Effective Username",
    "command": "whoami",
    "description": "Displays the username associated with the current effective user ID.",
    "privilege": "user",
    "tags": [
      "basic",
      "whoami",
      "user",
      "identity"
    ],
    "explanation": "Equivalent to id -un.",
    "expectedOutput": "kishwanth",
    "prerequisites": "Coreutils."
  },
  {
    "id": "basic-clear",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Clear Terminal Screen & Scrollback",
    "command": "clear",
    "description": "Sends ANSI escape code to clear terminal window and reset cursor position.",
    "privilege": "user",
    "tags": [
      "basic",
      "clear",
      "terminal",
      "screen"
    ],
    "explanation": "Outputs terminfo clear string to stdout.",
    "expectedOutput": "",
    "prerequisites": "Interactive terminal."
  },
  {
    "id": "basic-echo-env",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Echo Text or Expand Shell Variables",
    "command": "echo \"Active Host: $HOSTNAME | Shell: $SHELL\"",
    "description": "Prints strings and expands environment variables to stdout.",
    "privilege": "user",
    "tags": [
      "basic",
      "echo",
      "variables",
      "stdout"
    ],
    "explanation": "Built-in shell command for outputting formatted text.",
    "expectedOutput": "Active Host: devops-srv | Shell: /bin/bash",
    "prerequisites": "Shell."
  },
  {
    "id": "basic-history-tail",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Display Recent Command Execution History",
    "command": "history 15",
    "description": "Lists the last 15 commands typed in the current shell session with line numbers.",
    "privilege": "user",
    "tags": [
      "basic",
      "history",
      "shell",
      "audit"
    ],
    "explanation": "Reads ~/.bash_history in memory.",
    "expectedOutput": " 1001  git status\n 1002  npm run build\n 1003  node src/server.js\n 1004  curl localhost:5000/health",
    "prerequisites": "Bash/Zsh."
  },
  {
    "id": "basic-which-command",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Locate Executable Binary Path in $PATH",
    "command": "which node && which docker && command -v npm",
    "description": "Prints full filesystem path of executable binaries resolved in environment search PATH.",
    "privilege": "user",
    "tags": [
      "basic",
      "which",
      "binary",
      "path"
    ],
    "explanation": "Scans directories in $PATH to find first matching executable file.",
    "expectedOutput": "/usr/bin/node\n/usr/bin/docker\n/usr/local/bin/npm",
    "prerequisites": "Standard shell."
  },
  {
    "id": "basic-man-page",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Display Official Manual Page for Command",
    "command": "man ps",
    "description": "Opens reference documentation with all command flags, examples, and exit codes.",
    "privilege": "user",
    "tags": [
      "basic",
      "man",
      "manual",
      "docs"
    ],
    "explanation": "Renders troff formatted documentation via less pager.",
    "expectedOutput": "PS(1)                            User Commands                           PS(1)\n\nNAME\n       ps - report a snapshot of the current processes.",
    "prerequisites": "man-db installed."
  },
  {
    "id": "basic-whatis",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Display One-Line Summary Description of Command",
    "command": "whatis systemctl curl nginx",
    "description": "Queries manual page database index and prints a single-line summary of what command does.",
    "privilege": "user",
    "tags": [
      "basic",
      "whatis",
      "summary",
      "reference"
    ],
    "explanation": "Searches mandb precompiled index.",
    "expectedOutput": "systemctl (1)        - Control the systemd system and service manager\ncurl (1)             - transfer a URL\nnginx (8)            - HTTP and reverse proxy server, mail proxy server",
    "prerequisites": "mandb."
  },
  {
    "id": "basic-alias-create",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Create Handy Shell Command Alias",
    "command": "alias ll=\"ls -lah --color=auto\"",
    "description": "Defines a shorthand alias for complex command with flags for the current session.",
    "privilege": "user",
    "tags": [
      "basic",
      "alias",
      "shortcut",
      "shell"
    ],
    "explanation": "Store in ~/.bashrc or ~/.zshrc for permanent effect.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "basic-unalias",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Remove Command Alias",
    "command": "unalias ll",
    "description": "Removes previously declared command alias from memory.",
    "privilege": "user",
    "tags": [
      "basic",
      "unalias",
      "cleanup"
    ],
    "explanation": "Reverts command name back to original binary.",
    "expectedOutput": "",
    "prerequisites": "Existing alias."
  },
  {
    "id": "basic-reboot-now",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Reboot Operating System Immediately",
    "command": "sudo reboot",
    "description": "Flushes disk writes, stops all running services cleanly, and restarts the system.",
    "privilege": "sudo",
    "tags": [
      "basic",
      "reboot",
      "restart",
      "system"
    ],
    "explanation": "Calls systemctl reboot.",
    "expectedOutput": "Rebooting.",
    "prerequisites": "Root privileges."
  },
  {
    "id": "basic-shutdown-now",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Gracefully Power Off System Immediately",
    "command": "sudo shutdown -h now",
    "description": "Shuts down and powers down the machine hardware safely.",
    "privilege": "sudo",
    "tags": [
      "basic",
      "shutdown",
      "poweroff",
      "system"
    ],
    "explanation": "Signals all processes, syncs filesystems, and cuts ACPI power.",
    "expectedOutput": "Shutdown scheduled for now, use 'shutdown -c' to cancel.",
    "prerequisites": "Root privileges."
  },
  {
    "id": "basic-shutdown-schedule",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Schedule Timed Shutdown & Broadcast Message",
    "command": "sudo shutdown -h +15 \"Maintenance reboot in 15 minutes\" && sudo shutdown -c",
    "description": "Schedules a shutdown in 15 minutes sending wall broadcast; second command cancels it.",
    "privilege": "sudo",
    "tags": [
      "basic",
      "shutdown",
      "schedule",
      "cancel"
    ],
    "explanation": "Alerts all logged-in users via terminal wall messages.",
    "expectedOutput": "Broadcast message from root@devops-srv on pts/0:\nMaintenance reboot in 15 minutes\nShutdown cancelled.",
    "prerequisites": "Root."
  },
  {
    "id": "basic-cal",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Display ASCII Calendar for Current Month",
    "command": "cal",
    "description": "Prints formatted calendar with current day highlighted.",
    "privilege": "user",
    "tags": [
      "basic",
      "cal",
      "calendar",
      "date"
    ],
    "explanation": "Useful for quick reference during scheduling.",
    "expectedOutput": "    October 2026      \nSu Mo Tu We Th Fr Sa  \n             1  2  3  \n 4  5  6  7  8  9 10  \n11 12 13 14 15 16 17  \n18 19 20 21 22 23 24  \n25 26 27 28 29 30 31  ",
    "prerequisites": "bsdmainutils / util-linux."
  },
  {
    "id": "basic-date-utc",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Display System Date in ISO-8601 UTC Format",
    "command": "date -u +\"%Y-%m-%dT%H:%M:%SZ\"",
    "description": "Outputs standardized UTC timestamp commonly used in CI/CD pipeline tags and logs.",
    "privilege": "user",
    "tags": [
      "basic",
      "date",
      "utc",
      "iso8601",
      "timestamp"
    ],
    "explanation": "Standardizes log auditing regardless of server local timezone.",
    "expectedOutput": "2026-10-16T12:45:00Z",
    "prerequisites": "Coreutils."
  },
  {
    "id": "basic-sleep",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Pause Execution for Specified Duration",
    "command": "sleep 5s",
    "description": "Suspends calling process for specified interval (s=seconds, m=minutes, h=hours).",
    "privilege": "user",
    "tags": [
      "basic",
      "sleep",
      "delay",
      "pause"
    ],
    "explanation": "Commonly used in polling loops or retry backoffs.",
    "expectedOutput": "",
    "prerequisites": "Coreutils."
  },
  {
    "id": "basic-exit-shell",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Exit Current Shell Session or SSH Connection",
    "command": "exit",
    "description": "Terminates active shell process and disconnects SSH or switches back to parent user.",
    "privilege": "user",
    "tags": [
      "basic",
      "exit",
      "logout",
      "shell"
    ],
    "explanation": "Returns exit status code to parent process.",
    "expectedOutput": "logout\nConnection to 192.168.0.132 closed.",
    "prerequisites": "Interactive session."
  },
  {
    "id": "basic-history-grep",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Search Command History with Grep",
    "command": "history | grep \"docker run\"",
    "description": "Finds complex container launch commands previously executed in terminal.",
    "privilege": "user",
    "tags": [
      "basic",
      "history",
      "grep",
      "search"
    ],
    "explanation": "Scans history buffer for matching patterns.",
    "expectedOutput": "  841  docker run -d --name devops-web -p 8080:80 devops-portal:v2.4.0\n  892  docker run -d -p 5000:5000 --env-file .env app:latest",
    "prerequisites": "Bash/Zsh."
  },
  {
    "id": "basic-time-cmd",
    "category": "basic-commands",
    "categoryLabel": "Basic Commands",
    "title": "Measure Total Execution Time of Command",
    "command": "time ls -la /var/log",
    "description": "Calculates real clock time, user CPU time, and system CPU time taken by command.",
    "privilege": "user",
    "tags": [
      "basic",
      "time",
      "benchmark",
      "profiling"
    ],
    "explanation": "Built-in shell keyword for measuring command duration.",
    "expectedOutput": "real    0m0.012s\nuser    0m0.002s\nsys     0m0.008s",
    "prerequisites": "Shell."
  },
  {
    "id": "files-ls-lah",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "List Files with Permissions, Owner & Human Sizes",
    "command": "ls -lah",
    "description": "Displays all files including hidden dotfiles with file permissions, links, owner, group, and sizes.",
    "privilege": "user",
    "tags": [
      "files",
      "ls",
      "permissions",
      "human"
    ],
    "explanation": "-l = long listing, -a = all including hidden, -h = human readable sizes (KB/MB/GB).",
    "expectedOutput": "drwxr-xr-x  6 kishwanth devops 4.0K Oct 16 12:00 .\ndrwxr-xr-x 12 kishwanth devops 4.0K Oct 15 18:30 ..\n-rw-r--r--  1 kishwanth devops  450 Oct 16 11:20 package.json\n-rw-r--r--  1 kishwanth devops 1.2K Oct 16 12:15 .env",
    "prerequisites": "Coreutils."
  },
  {
    "id": "files-ls-time-sort",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "List Files Sorted by Modification Time (Newest First)",
    "command": "ls -lt --time-style=iso",
    "description": "Sorts directory contents showing most recently modified files at top of list.",
    "privilege": "user",
    "tags": [
      "files",
      "ls",
      "sort",
      "time",
      "recent"
    ],
    "explanation": "Essential for finding which log files or output artifacts were just generated.",
    "expectedOutput": "-rw-r--r-- 1 kishwanth devops 24102 2026-10-16 12:45 server.log\n-rw-r--r-- 1 kishwanth devops   892 2026-10-16 12:30 vite.config.js",
    "prerequisites": "Linux."
  },
  {
    "id": "files-ls-size-sort",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "List Files Sorted by File Size (Largest First)",
    "command": "ls -lhS",
    "description": "Sorts files from largest to smallest to pinpoint disk-hogging files.",
    "privilege": "user",
    "tags": [
      "files",
      "ls",
      "size",
      "disk"
    ],
    "explanation": "-S sorts by file size descending.",
    "expectedOutput": "-rw-r--r-- 1 kishwanth devops 142M Oct 16 04:00 database_backup.sql\n-rw-r--r-- 1 kishwanth devops  18M Oct 16 12:40 app_bundle.js\n-rw-r--r-- 1 kishwanth devops 1.4K Oct 16 10:00 README.md",
    "prerequisites": "Coreutils."
  },
  {
    "id": "files-cd-dir",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Change Directory to Specific Absolute Path",
    "command": "cd /var/log/nginx",
    "description": "Updates current working directory context of the shell session.",
    "privilege": "user",
    "tags": [
      "files",
      "cd",
      "navigation",
      "directory"
    ],
    "explanation": "Built-in shell command for navigating filesystem hierarchy.",
    "expectedOutput": "",
    "prerequisites": "Target directory exists."
  },
  {
    "id": "files-cd-home",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Change to User Home Directory",
    "command": "cd ~",
    "description": "Switches directly to $HOME path (/home/<username> or /root).",
    "privilege": "user",
    "tags": [
      "files",
      "cd",
      "home",
      "tilde"
    ],
    "explanation": "Tilde expands to current user home directory.",
    "expectedOutput": "",
    "prerequisites": "Shell."
  },
  {
    "id": "files-cd-previous",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Toggle Back to Previous Working Directory",
    "command": "cd -",
    "description": "Switches back to OLDPWD directory context.",
    "privilege": "user",
    "tags": [
      "files",
      "cd",
      "toggle",
      "oldpwd"
    ],
    "explanation": "Handy when alternating between two distant project folders.",
    "expectedOutput": "/home/kishwanth/devops-stored-data/frontend",
    "prerequisites": "At least one directory change."
  },
  {
    "id": "files-mkdir-p",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Create Directory and All Intermediate Parents",
    "command": "mkdir -p /opt/devops/backups/daily",
    "description": "Creates nested folder hierarchy without throwing error if folders already exist.",
    "privilege": "user",
    "tags": [
      "files",
      "mkdir",
      "nested",
      "parents"
    ],
    "explanation": "-p flag ensures idempotency in automated bash scripts.",
    "expectedOutput": "",
    "prerequisites": "Write permissions."
  },
  {
    "id": "files-rmdir",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Safely Remove Empty Directory",
    "command": "rmdir /tmp/empty_test_folder",
    "description": "Deletes folder only if it contains zero files or subfolders.",
    "privilege": "user",
    "tags": [
      "files",
      "rmdir",
      "safe",
      "delete"
    ],
    "explanation": "Fails with Directory not empty if files are present, preventing accidental loss.",
    "expectedOutput": "",
    "prerequisites": "Empty directory."
  },
  {
    "id": "files-rm-rf",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Recursively Force Remove Directory & Contents",
    "command": "rm -rf /tmp/build_cache",
    "description": "Deletes folder and all contained subdirectories and files without interactive prompts.",
    "privilege": "user",
    "tags": [
      "files",
      "rm",
      "recursive",
      "force",
      "danger"
    ],
    "explanation": "-r = recursive, -f = force ignore nonexistent files without prompting.",
    "expectedOutput": "",
    "prerequisites": "Caution: irreversible deletion."
  },
  {
    "id": "files-cp-archive",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Copy File Preserving Permissions, Timestamps & Symlinks",
    "command": "cp -a /opt/app/config.json /opt/app/config.json.bak",
    "description": "Creates identical duplicate preserving exact file mode, ownership, and timestamps.",
    "privilege": "user",
    "tags": [
      "files",
      "cp",
      "archive",
      "backup",
      "preserve"
    ],
    "explanation": "-a flag is equivalent to -dR --preserve=all.",
    "expectedOutput": "",
    "prerequisites": "Read permission on source."
  },
  {
    "id": "files-cp-r",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Copy Directory Tree Recursively",
    "command": "cp -r ./src ./src_backup_$(date +%F)",
    "description": "Recursively copies entire directory structure to destination.",
    "privilege": "user",
    "tags": [
      "files",
      "cp",
      "recursive",
      "directory"
    ],
    "explanation": "Duplicates directory trees with subdirectories.",
    "expectedOutput": "",
    "prerequisites": "Source directory."
  },
  {
    "id": "files-mv",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Move or Rename File or Directory",
    "command": "mv old_release.tar.gz /archive/releases/",
    "description": "Moves file to destination or renames within same filesystem without copying data.",
    "privilege": "user",
    "tags": [
      "files",
      "mv",
      "rename",
      "move"
    ],
    "explanation": "Atomic inode rename when on the same filesystem.",
    "expectedOutput": "",
    "prerequisites": "Source and target path."
  },
  {
    "id": "files-touch",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Create Empty File or Update Modification Timestamp",
    "command": "touch /var/run/devops_maintenance.lock",
    "description": "Creates empty 0-byte file or refreshes last accessed/modified timestamp of existing file.",
    "privilege": "user",
    "tags": [
      "files",
      "touch",
      "create",
      "lock",
      "timestamp"
    ],
    "explanation": "Frequently used for creating lock files in deployment scripts.",
    "expectedOutput": "",
    "prerequisites": "Write permission."
  },
  {
    "id": "files-ln-s",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Create Symbolic Link (Symlink)",
    "command": "sudo ln -s /etc/nginx/sites-available/devops.conf /etc/nginx/sites-enabled/devops.conf",
    "description": "Creates a pointer linking source file path to destination path.",
    "privilege": "sudo",
    "tags": [
      "files",
      "symlink",
      "ln",
      "pointer"
    ],
    "explanation": "Enables Nginx virtual hosts or toggles active application versions without moving files.",
    "expectedOutput": "",
    "prerequisites": "Source file exists."
  },
  {
    "id": "files-tree-depth",
    "category": "files-directories",
    "categoryLabel": "Files and Direct...",
    "title": "Display Directory Hierarchy Tree with Depth Limit",
    "command": "tree -L 2 -h --dirsfirst src/",
    "description": "Outputs visual ASCII tree diagram of directories and files restricted to 2 levels deep.",
    "privilege": "user",
    "tags": [
      "files",
      "tree",
      "hierarchy",
      "visualize"
    ],
    "explanation": "Renders structural layout of codebase or data stores.",
    "expectedOutput": "src/\n├── components/\n│   ├── Navbar.jsx [3.2K]\n│   └── Sidebar.jsx [2.8K]\n├── pages/\n│   ├── Commands.jsx [48K]\n│   └── Dashboard.jsx [12K]\n└── server.js [6.4K]",
    "prerequisites": "tree package."
  },
  {
    "id": "read-cat-all",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Concatenate & Display Entire File to Terminal",
    "command": "cat /etc/os-release",
    "description": "Reads sequential file contents and streams directly to stdout.",
    "privilege": "user",
    "tags": [
      "read",
      "cat",
      "display",
      "file"
    ],
    "explanation": "Best for small configuration files and environment definitions.",
    "expectedOutput": "PRETTY_NAME=\"Ubuntu 24.04 LTS\"\nNAME=\"Ubuntu\"\nVERSION_ID=\"24.04\"",
    "prerequisites": "Readable file."
  },
  {
    "id": "read-cat-number",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Display File Contents with Line Numbers",
    "command": "cat -n /etc/hosts",
    "description": "Prefixes every line of output with its line number starting from 1.",
    "privilege": "user",
    "tags": [
      "read",
      "cat",
      "lines",
      "numbers"
    ],
    "explanation": "Useful for matching compiler and linter line errors.",
    "expectedOutput": "     1\t127.0.0.1\tlocalhost\n     2\t127.0.1.1\tdevops-srv\n     3\t192.168.0.132\tdevops.local",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-less-paginate",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Interactive Pager with Search & Line Numbers",
    "command": "less -N /var/log/syslog",
    "description": "Allows scrolling forward and backward through large files without loading entire file into memory.",
    "privilege": "user",
    "tags": [
      "read",
      "less",
      "pager",
      "scroll",
      "search"
    ],
    "explanation": "Press / to search, n for next occurrence, q to quit.",
    "expectedOutput": "      1 Oct 16 00:00:01 devops-srv CRON[1841]: (root) CMD (system-clean.sh)\n      2 Oct 16 01:00:00 devops-srv systemd[1]: Starting Logrotate...",
    "prerequisites": "less."
  },
  {
    "id": "read-head-n",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Output First N Lines of File",
    "command": "head -n 20 /var/log/nginx/access.log",
    "description": "Prints the leading 20 lines of a file.",
    "privilege": "user",
    "tags": [
      "read",
      "head",
      "lines",
      "header"
    ],
    "explanation": "Fast inspection of CSV headers or leading file metadata.",
    "expectedOutput": "192.168.0.1 - - [16/Oct/2026:00:00:01] \"GET /health HTTP/1.1\" 200 120\n192.168.0.1 - - [16/Oct/2026:00:00:15] \"GET /health HTTP/1.1\" 200 120",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-tail-n",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Output Last N Lines of File",
    "command": "tail -n 30 /var/log/syslog",
    "description": "Displays the bottom 30 lines of a log file.",
    "privilege": "user",
    "tags": [
      "read",
      "tail",
      "bottom",
      "logs"
    ],
    "explanation": "Checks recent system events without scrolling through megabytes of old logs.",
    "expectedOutput": "Oct 16 12:45:01 devops-srv kernel: [ 4210.19] TCP: connection established\nOct 16 12:45:02 devops-srv systemd[1]: Finished Daily Backup Timer.",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-tail-follow",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Follow File Growth in Real Time (tail -f)",
    "command": "tail -f /var/log/nginx/error.log",
    "description": "Keeps file open and prints newly appended lines to console as they are written.",
    "privilege": "user",
    "tags": [
      "read",
      "tail",
      "follow",
      "stream",
      "live"
    ],
    "explanation": "Press Ctrl+C to terminate the stream.",
    "expectedOutput": "2026/10/16 12:46:00 [info] 1420#1420: *45 client 192.168.0.132 closed connection",
    "prerequisites": "Log file."
  },
  {
    "id": "read-tail-follow-multi",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Follow Multiple Log Files Simultaneously",
    "command": "sudo tail -f /var/log/nginx/*.log",
    "description": "Streams entries from both access.log and error.log with filename headers on updates.",
    "privilege": "sudo",
    "tags": [
      "read",
      "tail",
      "multi",
      "logs"
    ],
    "explanation": "Monitors multiple files in single terminal pane.",
    "expectedOutput": "==> /var/log/nginx/access.log <==\n192.168.0.1 - - \"GET / HTTP/1.1\" 200\n==> /var/log/nginx/error.log <==\n2026/10/16 [warn] buffer size",
    "prerequisites": "Sudo."
  },
  {
    "id": "read-wc-count",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Count Lines, Words & Bytes in File",
    "command": "wc -l < /etc/passwd",
    "description": "Calculates total line count in text stream or file.",
    "privilege": "user",
    "tags": [
      "read",
      "wc",
      "count",
      "lines"
    ],
    "explanation": "Ideal for counting records in datasets or users in passwd file.",
    "expectedOutput": "42",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-tac-reverse",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Display Lines in Reverse Order (Bottom to Top)",
    "command": "tac /var/log/auth.log | head -n 10",
    "description": "Reads file and prints lines in inverse chronological order.",
    "privilege": "user",
    "tags": [
      "read",
      "tac",
      "reverse",
      "chronological"
    ],
    "explanation": "Opposite of cat; allows reading from most recent entry upwards.",
    "expectedOutput": "Oct 16 12:46:12 srv sshd: session closed for user kishwanth\nOct 16 12:45:00 srv sudo: kishwanth : TTY=pts/0",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-vim-edit",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Open File in Vim Modal Text Editor",
    "command": "vim /etc/nginx/nginx.conf",
    "description": "Launches Vim modal editor for editing server configs with syntax highlighting.",
    "privilege": "user",
    "tags": [
      "edit",
      "vim",
      "editor",
      "modal"
    ],
    "explanation": "Press i to enter insert mode, Esc then :wq to save and exit, :q! to discard changes.",
    "expectedOutput": "[Vim interactive session opened]",
    "prerequisites": "vim installed."
  },
  {
    "id": "read-nano-edit",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Open File in Nano Simple Text Editor",
    "command": "nano .env",
    "description": "Beginner-friendly command line text editor with on-screen keyboard shortcuts.",
    "privilege": "user",
    "tags": [
      "edit",
      "nano",
      "editor",
      "simple"
    ],
    "explanation": "Press Ctrl+O to save file, Ctrl+X to exit.",
    "expectedOutput": "[Nano interactive session opened]",
    "prerequisites": "nano."
  },
  {
    "id": "read-hexdump",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "View Canonical Hexadecimal & ASCII Dump of File",
    "command": "hexdump -C /bin/ls | head -n 10",
    "description": "Inspects raw byte values and magic bytes of binary files or corrupted databases.",
    "privilege": "user",
    "tags": [
      "read",
      "hexdump",
      "binary",
      "hex"
    ],
    "explanation": "Displays offset, 16 hex bytes, and printable ASCII representation.",
    "expectedOutput": "00000000  7f 45 4c 46 02 01 01 00  00 00 00 00 00 00 00 00  |.ELF............|\n00000010  03 00 3e 00 01 00 00 00  b0 6d 00 00 00 00 00 00  |..>......m......|",
    "prerequisites": "util-linux."
  },
  {
    "id": "read-cut-delimiters",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Extract Columns Using Custom Delimiter",
    "command": "cut -d: -f1,7 /etc/passwd",
    "description": "Extracts username (column 1) and login shell (column 7) from colon-separated file.",
    "privilege": "user",
    "tags": [
      "read",
      "cut",
      "columns",
      "csv",
      "delimiter"
    ],
    "explanation": "-d defines delimiter character, -f specifies fields to extract.",
    "expectedOutput": "root:/bin/bash\nkishwanth:/bin/bash\nsystemd-resolve:/usr/sbin/nologin\nnode:/bin/sh",
    "prerequisites": "Coreutils."
  },
  {
    "id": "read-paste-merge",
    "category": "read-edit-files",
    "categoryLabel": "Read and Edit Fi...",
    "title": "Merge Lines of Multiple Files Side-by-Side",
    "command": "paste names.txt ips.txt",
    "description": "Combines corresponding lines from two files separated by a tab.",
    "privilege": "user",
    "tags": [
      "read",
      "paste",
      "merge",
      "columns"
    ],
    "explanation": "Constructs two-column tabular reports from parallel arrays.",
    "expectedOutput": "srv-web-01\t192.168.0.10\nsrv-web-02\t192.168.0.11\nsrv-db-01\t192.168.0.20",
    "prerequisites": "Coreutils."
  },
  {
    "id": "search-grep-pattern",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Search for Case-Insensitive Pattern in File",
    "command": "grep -i \"database_url\" .env",
    "description": "Finds all lines matching regular expression ignoring upper/lower case.",
    "privilege": "user",
    "tags": [
      "search",
      "grep",
      "regex",
      "text"
    ],
    "explanation": "Basic pattern search tool standard on all Unix systems.",
    "expectedOutput": "DATABASE_URL=sqlite:///backend/data/devops_stored.sqlite\nTEST_DATABASE_URL=sqlite:///:memory:",
    "prerequisites": "Grep."
  },
  {
    "id": "search-grep-recursive",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Recursive Search Across All Code Files with Line Numbers",
    "command": "grep -rn \"jwt_secret\" ./src",
    "description": "Searches all files under ./src returning filename, line number, and matching code.",
    "privilege": "user",
    "tags": [
      "search",
      "grep",
      "recursive",
      "code"
    ],
    "explanation": "-r = recursive directory search, -n = print line number.",
    "expectedOutput": "src/controllers/authController.js:14:const JWT_SECRET = process.env.JWT_SECRET || 'fallback';\nsrc/middleware/auth.js:8:  jwt.verify(token, JWT_SECRET, (err, user) => {",
    "prerequisites": "Grep."
  },
  {
    "id": "search-grep-invert",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Invert Match: Strip Comments and Blank Lines",
    "command": "grep -v \"^#\" /etc/nginx/nginx.conf | grep -v \"^$\"",
    "description": "Filters out lines starting with # (comments) and empty lines to view active configuration only.",
    "privilege": "user",
    "tags": [
      "search",
      "grep",
      "invert",
      "strip-comments"
    ],
    "explanation": "-v flag inverts matching logic.",
    "expectedOutput": "user www-data;\nworker_processes auto;\nevents {\n    worker_connections 768;\n}\nhttp {\n    sendfile on;\n}",
    "prerequisites": "Coreutils."
  },
  {
    "id": "search-ripgrep",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Blazing Fast Recursive Search with Ripgrep (rg)",
    "command": "rg -i \"authenticate\" --type js",
    "description": "Multithreaded search respecting .gitignore automatically with regex support.",
    "privilege": "user",
    "tags": [
      "search",
      "rg",
      "ripgrep",
      "fast"
    ],
    "explanation": "Significantly faster than grep for large codebases.",
    "expectedOutput": "src/services/api.js:42:export const authenticateUser = async (credentials) => {\nsrc/pages/Login.jsx:88:  await authenticateUser(form);",
    "prerequisites": "ripgrep package."
  },
  {
    "id": "search-find-name",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Find Files by Wildcard Pattern Case-Insensitively",
    "command": "find /var/log -type f -iname \"*.log\"",
    "description": "Traverses filesystem finding regular files ending in .log regardless of case.",
    "privilege": "user",
    "tags": [
      "search",
      "find",
      "files",
      "wildcard"
    ],
    "explanation": "-type f filters for regular files, -iname ignores case.",
    "expectedOutput": "/var/log/syslog\n/var/log/nginx/access.log\n/var/log/nginx/error.log",
    "prerequisites": "Find."
  },
  {
    "id": "search-find-mtime",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Find Files Modified in the Last 24 Hours",
    "command": "find /opt/app -type f -mtime -1",
    "description": "Locates files whose data was modified within the preceding 24 hours.",
    "privilege": "user",
    "tags": [
      "search",
      "find",
      "mtime",
      "recent"
    ],
    "explanation": "-mtime -1 matches files modified < 24h ago.",
    "expectedOutput": "/opt/app/data/devops_stored.sqlite\n/opt/app/logs/audit.log",
    "prerequisites": "Find."
  },
  {
    "id": "search-find-large-files",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Find Files Larger than 100MB Across Filesystem",
    "command": "sudo find / -type f -size +100M -exec ls -lh {} + 2>/dev/null",
    "description": "Scans disks for files exceeding 100MB and prints human-readable sizes.",
    "privilege": "sudo",
    "tags": [
      "search",
      "find",
      "size",
      "disk-usage"
    ],
    "explanation": "Pinpoints large unrotated logs or forgotten database dumps.",
    "expectedOutput": "-rw-r--r-- 1 root root 1.4G Oct 15 03:00 /var/log/journal/system.journal\n-rw-r--r-- 1 root root 512M Oct 12 10:00 /var/lib/docker/overlay2/.../merged/app.bin",
    "prerequisites": "Root."
  },
  {
    "id": "search-find-delete-tmp",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Find & Delete Temporary Files Automatically",
    "command": "find /tmp -type f -name \"*.tmp\" -mtime +7 -delete",
    "description": "Deletes temporary files matching *.tmp older than 7 days directly.",
    "privilege": "user",
    "tags": [
      "search",
      "find",
      "delete",
      "cleanup"
    ],
    "explanation": "-delete action executes unlink() without needing xargs.",
    "expectedOutput": "",
    "prerequisites": "Write permissions."
  },
  {
    "id": "search-sed-in-place",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Find & Replace Text In-Place with Sed",
    "command": "sed -i 's/PORT=3000/PORT=5000/g' .env",
    "description": "Edits file directly without creating a separate temporary file.",
    "privilege": "user",
    "tags": [
      "search",
      "sed",
      "replace",
      "regex"
    ],
    "explanation": "-i edits file in place, s/pattern/replacement/g replaces all instances globally.",
    "expectedOutput": "",
    "prerequisites": "File."
  },
  {
    "id": "search-awk-columns",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Extract Columns & Filter Rows with AWK",
    "command": "awk '$9 == 500 {print $1, $4, $7, $9}' /var/log/nginx/access.log | head -n 10",
    "description": "Parses whitespace-separated log files, printing IP, timestamp, path, and 500 error code.",
    "privilege": "user",
    "tags": [
      "search",
      "awk",
      "columns",
      "filter"
    ],
    "explanation": "AWK treats lines as fields $1, $2, etc.",
    "expectedOutput": "192.168.0.45 [16/Oct/2026:12:10:00 /api/login 500",
    "prerequisites": "AWK."
  },
  {
    "id": "search-sort-numerically",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Sort Numbers or File Lists in Reverse Order",
    "command": "sort -n -r numbers.txt",
    "description": "Performs arithmetic comparison (-n) and reverses order (-r) highest to lowest.",
    "privilege": "user",
    "tags": [
      "search",
      "sort",
      "numeric",
      "reverse"
    ],
    "explanation": "Prevents string sorting where 100 comes before 2.",
    "expectedOutput": "100\n54\n22\n7\n1",
    "prerequisites": "Coreutils."
  },
  {
    "id": "search-uniq-count",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Count Unique Occurrences and Rank Frequency",
    "command": "cut -d' ' -f1 /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10",
    "description": "Finds the top 10 IP addresses making requests by counting distinct values.",
    "privilege": "user",
    "tags": [
      "search",
      "uniq",
      "frequency",
      "top-ips"
    ],
    "explanation": "uniq requires sorted input to group identical rows.",
    "expectedOutput": "   1420 192.168.0.132\n    812 10.0.0.45\n    120 198.51.100.23",
    "prerequisites": "Coreutils."
  },
  {
    "id": "search-tr-uppercase",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Translate Characters: Convert to Uppercase",
    "command": "cat text.txt | tr 'a-z' 'A-Z'",
    "description": "Translates or deletes characters from standard input stream.",
    "privilege": "user",
    "tags": [
      "search",
      "tr",
      "translate",
      "uppercase"
    ],
    "explanation": "Fast character mapping filter.",
    "expectedOutput": "HELLO WORLD - DEVOPS PORTAL",
    "prerequisites": "Coreutils."
  },
  {
    "id": "search-locate-indexed",
    "category": "search-text",
    "categoryLabel": "Search and Text...",
    "title": "Instantly Locate Files Using Pre-Built mlocate Database",
    "command": "locate nginx.conf",
    "description": "Searches precompiled filesystem database index for instantaneous results.",
    "privilege": "user",
    "tags": [
      "search",
      "locate",
      "index",
      "fast"
    ],
    "explanation": "Requires database updated via sudo updatedb.",
    "expectedOutput": "/etc/nginx/nginx.conf\n/usr/share/doc/nginx/examples/nginx.conf",
    "prerequisites": "plocate or mlocate package."
  },
  {
    "id": "perm-chmod-644",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Set Standard File Permissions (Read/Write Owner, Read Others)",
    "command": "chmod 644 /etc/nginx/nginx.conf",
    "description": "Grants owner read/write (6), group read (4), others read (4).",
    "privilege": "user",
    "tags": [
      "permissions",
      "chmod",
      "octal",
      "security"
    ],
    "explanation": "Standard secure permission for non-executable configuration files.",
    "expectedOutput": "",
    "prerequisites": "Owner or root."
  },
  {
    "id": "perm-chmod-755",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Set Directory Permissions (Owner Full, Group/Others Read & Execute)",
    "command": "chmod 755 /var/www/html",
    "description": "Allows owner rwx (7), and others r-x (5) to enter directory and read contents.",
    "privilege": "user",
    "tags": [
      "permissions",
      "chmod",
      "directories",
      "traverse"
    ],
    "explanation": "Required on directories for web server worker processes (www-data) to traverse paths.",
    "expectedOutput": "",
    "prerequisites": "File owner."
  },
  {
    "id": "perm-chmod-exec",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Make Shell Script Executable",
    "command": "chmod +x deploy.sh",
    "description": "Adds execute permission (+x) to file allowing direct execution via ./deploy.sh.",
    "privilege": "user",
    "tags": [
      "permissions",
      "chmod",
      "executable",
      "script"
    ],
    "explanation": "Modifies permission bits in file inode.",
    "expectedOutput": "",
    "prerequisites": "File owner."
  },
  {
    "id": "perm-chmod-recursive",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Recursively Restrict Permissions on Sensitive Folder",
    "command": "chmod -R 700 ~/.ssh",
    "description": "Restricts directory and all enclosed files so only owner has read, write, and execute access.",
    "privilege": "user",
    "tags": [
      "permissions",
      "chmod",
      "ssh",
      "privacy"
    ],
    "explanation": "SSH client refuses to use private keys if directory permissions are looser than 700.",
    "expectedOutput": "",
    "prerequisites": "File owner."
  },
  {
    "id": "perm-chown-user-group",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Change File Owner and Group",
    "command": "sudo chown www-data:www-data /var/www/html/index.html",
    "description": "Assigns user www-data and group www-data as owners of the target file.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "chown",
      "owner",
      "group"
    ],
    "explanation": "Ensures web server service can write or read required files.",
    "expectedOutput": "",
    "prerequisites": "Root/sudo."
  },
  {
    "id": "perm-chown-recursive",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Recursively Change Directory Ownership",
    "command": "sudo chown -R devops:devops /opt/devops-stored-data",
    "description": "Applies ownership changes to directory and all files and subdirectories beneath it.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "chown",
      "recursive",
      "fleet"
    ],
    "explanation": "Standard step after cloning a repo or unpacking tarballs.",
    "expectedOutput": "",
    "prerequisites": "Root/sudo."
  },
  {
    "id": "perm-chgrp",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Change Group Ownership Only",
    "command": "sudo chgrp docker /var/run/docker.sock",
    "description": "Updates group owner of Unix domain socket without modifying user owner.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "chgrp",
      "docker",
      "socket"
    ],
    "explanation": "Allows non-root users belonging to docker group to communicate with Docker daemon.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "perm-ls-shadow",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Inspect Shadow Password File Permissions",
    "command": "ls -la /etc/shadow",
    "description": "Verifies /etc/shadow is strictly restricted to root:shadow mode 640 or 000.",
    "privilege": "user",
    "tags": [
      "permissions",
      "security",
      "audit",
      "shadow"
    ],
    "explanation": "World-readable shadow files represent a critical privilege escalation vulnerability.",
    "expectedOutput": "-rw-r----- 1 root shadow 1842 Oct 16 10:00 /etc/shadow",
    "prerequisites": "System."
  },
  {
    "id": "perm-umask-symbolic",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "View Default File Creation Permission Mask",
    "command": "umask -S",
    "description": "Prints symbolic representation of permissions applied to newly created files.",
    "privilege": "user",
    "tags": [
      "permissions",
      "umask",
      "defaults"
    ],
    "explanation": "A umask of 0022 creates files with 644 and directories with 755.",
    "expectedOutput": "u=rwx,g=rx,o=rx",
    "prerequisites": "Shell."
  },
  {
    "id": "perm-suid-bit",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Set SUID (Set User ID) Bit on Executable Binary",
    "command": "sudo chmod u+s /usr/local/bin/ping_helper",
    "description": "Enables binary to execute with permissions of the file owner (e.g. root) rather than caller.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "suid",
      "privilege",
      "security"
    ],
    "explanation": "Used by tools like passwd and sudo to perform privileged system tasks safely.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "perm-sgid-bit",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Set SGID Bit on Shared Collaboration Directory",
    "command": "sudo chmod g+s /opt/devops-shared",
    "description": "Causes any newly created file inside directory to automatically inherit group of parent folder.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "sgid",
      "shared",
      "collaboration"
    ],
    "explanation": "Eliminates group permission mismatches among team members editing shared files.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "perm-sticky-bit",
    "category": "permissions-ownership",
    "categoryLabel": "Permissions an...",
    "title": "Set Sticky Bit on Public Writable Directory",
    "command": "sudo chmod +t /tmp/shared_vault",
    "description": "Allows anyone to write files, but only the file creator or root can rename or delete them.",
    "privilege": "sudo",
    "tags": [
      "permissions",
      "sticky-bit",
      "tmp",
      "safety"
    ],
    "explanation": "Standard protection used on /tmp directory (drwxrwxrwt).",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "user-useradd-m",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Create System User with Home Directory & Bash Shell",
    "command": "sudo useradd -m -s /bin/bash -c \"DevOps Deployer\" deployer",
    "description": "Creates new user account, provisions /home/deployer, and sets default login shell.",
    "privilege": "sudo",
    "tags": [
      "users",
      "useradd",
      "account",
      "provision"
    ],
    "explanation": "-m creates home directory copying files from /etc/skel.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "user-passwd-set",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Set or Change User Password",
    "command": "sudo passwd deployer",
    "description": "Prompts for and hashes new password into /etc/shadow using SHA-512 or yescrypt.",
    "privilege": "sudo",
    "tags": [
      "users",
      "passwd",
      "password",
      "security"
    ],
    "explanation": "Root can set passwords without knowing the old password.",
    "expectedOutput": "New password: \nRetype new password: \npasswd: password updated successfully",
    "prerequisites": "Root."
  },
  {
    "id": "user-userdel-r",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Delete User Account & Purge Home Directory",
    "command": "sudo userdel -r olduser",
    "description": "Removes user entry from /etc/passwd and deletes user home directory and mail spool.",
    "privilege": "sudo",
    "tags": [
      "users",
      "userdel",
      "cleanup",
      "delete"
    ],
    "explanation": "-r ensures no orphaned home files remain on disk.",
    "expectedOutput": "userdel: olduser mail spool (/var/mail/olduser) not found",
    "prerequisites": "Root."
  },
  {
    "id": "user-usermod-groups",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Add User to Docker and Sudo Supplemental Groups",
    "command": "sudo usermod -aG docker,sudo kishwanth",
    "description": "Appends user to specified secondary groups without removing existing group memberships.",
    "privilege": "sudo",
    "tags": [
      "users",
      "usermod",
      "groups",
      "docker",
      "sudo"
    ],
    "explanation": "Always use -a (append) with -G; omitting -a removes user from all other groups!",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "user-chsh-shell",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Change Default Login Shell for User",
    "command": "sudo chsh -s /usr/bin/zsh kishwanth",
    "description": "Updates login shell entry in /etc/passwd to point to Zsh or Bash.",
    "privilege": "sudo",
    "tags": [
      "users",
      "chsh",
      "shell",
      "zsh"
    ],
    "explanation": "Shell must be listed in /etc/shells.",
    "expectedOutput": "",
    "prerequisites": "Target shell installed."
  },
  {
    "id": "user-groupadd",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Create New System Security Group",
    "command": "sudo groupadd devops-admins",
    "description": "Allocates new GID entry in /etc/group.",
    "privilege": "sudo",
    "tags": [
      "groups",
      "groupadd",
      "rbac"
    ],
    "explanation": "Enables group-based permissions for teams.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "user-groupdel",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Delete Existing Group",
    "command": "sudo groupdel old-team",
    "description": "Removes group from /etc/group.",
    "privilege": "sudo",
    "tags": [
      "groups",
      "groupdel",
      "cleanup"
    ],
    "explanation": "Cannot delete primary group of an existing user.",
    "expectedOutput": "",
    "prerequisites": "Root."
  },
  {
    "id": "user-groups-list",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "List All Groups Active User Belongs To",
    "command": "groups $USER",
    "description": "Displays current primary and secondary group memberships for authenticated session.",
    "privilege": "user",
    "tags": [
      "users",
      "groups",
      "membership"
    ],
    "explanation": "Requires new login session to reflect newly added groups.",
    "expectedOutput": "kishwanth : kishwanth adm cdrom sudo dip plugdev docker devops",
    "prerequisites": "Any user."
  },
  {
    "id": "user-id-details",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Inspect UID, Primary GID & Group IDs",
    "command": "id deployer",
    "description": "Outputs numeric UID, primary GID, and list of all secondary GIDs.",
    "privilege": "user",
    "tags": [
      "users",
      "id",
      "uid",
      "gid"
    ],
    "explanation": "UID 0 is root; standard users begin at UID 1000 on Linux.",
    "expectedOutput": "uid=1001(deployer) gid=1001(deployer) groups=1001(deployer),27(sudo),998(docker)",
    "prerequisites": "System."
  },
  {
    "id": "user-su-switch",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Switch User Session with Full Login Environment",
    "command": "su - deployer",
    "description": "Opens a new shell session inheriting target user home directory, PATH, and environment.",
    "privilege": "user",
    "tags": [
      "users",
      "su",
      "switch",
      "login-shell"
    ],
    "explanation": "The dash (-) specifies a complete login shell simulation.",
    "expectedOutput": "Password: \ndeployer@devops-srv:~$ ",
    "prerequisites": "Target user password or root."
  },
  {
    "id": "user-sudo-u-exec",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Execute Single Command as Another User",
    "command": "sudo -u www-data php -v",
    "description": "Executes specified binary under permissions of user www-data without interactive login.",
    "privilege": "sudo",
    "tags": [
      "users",
      "sudo",
      "exec",
      "service-account"
    ],
    "explanation": "Verifies file permissions and script execution as service accounts.",
    "expectedOutput": "PHP 8.3.6 (cli) (built: Apr 15 2026 14:00:12) (NTS)",
    "prerequisites": "Sudo."
  },
  {
    "id": "user-cut-passwd",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "List All Registered Users in System",
    "command": "cut -d: -f1 /etc/passwd | sort",
    "description": "Extracts list of all human and daemon user accounts defined on system.",
    "privilege": "user",
    "tags": [
      "users",
      "passwd",
      "list",
      "audit"
    ],
    "explanation": "Reads the first column of /etc/passwd.",
    "expectedOutput": "admin\nbin\ndaemon\ndeployer\ndocker\nkishwanth\nnginx\nnode\nroot\nwww-data",
    "prerequisites": "Readable /etc/passwd."
  },
  {
    "id": "user-visudo-check",
    "category": "users-groups",
    "categoryLabel": "Users and Groups",
    "title": "Verify Sudoers Configuration Syntax",
    "command": "sudo visudo -c",
    "description": "Checks /etc/sudoers and /etc/sudoers.d/* files for syntax errors without editing.",
    "privilege": "sudo",
    "tags": [
      "users",
      "sudoers",
      "visudo",
      "syntax"
    ],
    "explanation": "A syntax error in sudoers can lock administrators out of root access permanently.",
    "expectedOutput": "/etc/sudoers: parsed OK\n/etc/sudoers.d/README: parsed OK\n/etc/sudoers.d/90-cloud-init-users: parsed OK",
    "prerequisites": "Root/sudo."
  }
];
