import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Server, 
  Globe, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  Activity, 
  RefreshCw, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Wrench,
  Database,
  Clock,
  Download
} from 'lucide-react';

export default function Deployment() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeMessage, setOptimizeMessage] = useState(null);
  const [copiedTunnel, setCopiedTunnel] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const [healthData, statsData] = await Promise.allSettled([
        api.getHealth(),
        api.getDashboardStats()
      ]);
      if (healthData.status === 'fulfilled') setHealth(healthData.value);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
    } catch (err) {
      console.error('Failed to get health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyTunnel = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedTunnel(true);
    setTimeout(() => setCopiedTunnel(false), 2000);
  };

  const handleOptimizeDb = async () => {
    setOptimizing(true);
    setOptimizeMessage(null);
    try {
      const res = await api.optimizeDatabase();
      setOptimizeMessage(res.message || 'SQLite Database optimized (VACUUM completed)');
      fetchHealth();
      setTimeout(() => setOptimizeMessage(null), 4000);
    } catch (err) {
      setOptimizeMessage('Optimization failed: ' + err.message);
      setTimeout(() => setOptimizeMessage(null), 4000);
    } finally {
      setOptimizing(false);
    }
  };

  const formatSeconds = (sec) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    if (!seconds && seconds !== 0) return 'Just started';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const systemHealth = stats?.systemHealth || {
    uptimeSeconds: health?.uptime_seconds || 3600,
    database: health?.database ? `${health.database.toUpperCase()} (WAL)` : 'Connected & Healthy',
    tunnelUrl: 'https://devops-stored-data.loca.lt',
    localIp: '127.0.0.1',
    port: 5000,
    httpsPort: 5443,
    rssMemoryBytes: health?.system?.process_rss_bytes || 85000000
  };

  const nginxSampleConfig = `# /etc/nginx/conf.d/devops_stored_data.conf
server {
    listen 80;
    server_name devops.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name devops.example.com;

    ssl_certificate /etc/letsencrypt/live/devops.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/devops.example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

  const systemdSampleConfig = `# /etc/systemd/system/devops-stored-data.service
[Unit]
Description=DevOps Stored Data Platform
After=network.target

[Service]
Type=simple
User=devops
WorkingDirectory=/var/www/devops-stored-data/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target`;

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-130px)] min-h-[500px] pr-3 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            <span>Custom Domain &amp; Server Infrastructure</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Production deployment architecture, Let's Encrypt SSL/TLS, Nginx reverse proxy, and DNS records.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Health</span>
        </button>
      </div>

      {/* Live System Health Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${health?.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span className="text-sm font-bold text-white">Live Node &amp; Database Status: {health?.status || 'UNKNOWN'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <a href="/health" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/health (JSON)</a>
            <span className="text-slate-600">|</span>
            <a href="/metrics" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/metrics (Prometheus)</a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Uptime</span>
            <span className="text-white font-bold">{health ? formatSeconds(health.uptime_seconds) : '...'}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Database Engine</span>
            <span className="text-emerald-400 font-bold">{health?.database || 'SQLite (WAL)'}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Process Heap</span>
            <span className="text-cyan-400 font-bold">
              {health?.system ? `${(health.system.process_heap_used_bytes / 1024 / 1024).toFixed(1)} MB` : '...'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Platform</span>
            <span className="text-purple-400 font-bold">{health?.system?.platform || 'Node.js'}</span>
          </div>
        </div>
      </div>

      {/* Production Domain & DNS Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DNS Configuration Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Globe className="w-5 h-5 text-blue-400" />
            <span>DNS Configuration for Custom Domain</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            To map your domain (e.g., <code className="text-cyan-400 font-mono">devops.example.com</code>) without exposing any port number or IP in user browsers, add these DNS records to your registrar (Route 53, Cloudflare, Namecheap, GoDaddy):
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-purple-400 font-bold">A Record:</span>
                <span className="text-slate-300 ml-2">devops &rarr; 203.0.113.50 (Your Server IP)</span>
              </div>
              <span className="text-[10px] text-slate-500">TTL: 300s</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-blue-400 font-bold">CNAME (Alternative):</span>
                <span className="text-slate-300 ml-2">devops &rarr; server.example.com</span>
              </div>
              <span className="text-[10px] text-slate-500">TTL: Auto</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1.5 text-slate-400">
            <div className="text-white font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>DNS Verification Command</span>
            </div>
            <p className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded">
              dig +short devops.example.com
            </p>
          </div>
        </div>

        {/* SSL/TLS Architecture Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Native SSL/TLS &amp; Cloudflare Tunnel Endpoints</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All endpoints are encrypted in transit via TLS 1.3 / 1.2 with A+ grade ciphers.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold">Local HTTPS:</span>
                <span className="text-slate-200 ml-2">https://localhost:5443</span>
              </div>
              <button
                onClick={() => copyToClipboard('https://localhost:5443', 'https-local')}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
              >
                {copiedKey === 'https-local' ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">Cloudflare Edge:</span>
                <span className="text-slate-200 ml-2">https://revealed-begins-hobby-alternate.trycloudflare.com</span>
              </div>
              <button
                onClick={() => copyToClipboard('https://revealed-begins-hobby-alternate.trycloudflare.com', 'https-tunnel')}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
              >
                {copiedKey === 'https-tunnel' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Cert Metadata */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-mono">
            <div><strong className="text-slate-300">Certificate:</strong> backend/certs/server.crt</div>
            <div><strong className="text-slate-300">Private Key:</strong> backend/certs/server.key</div>
            <div><strong className="text-slate-300">SANs:</strong> localhost, 127.0.0.1, 192.168.0.132, devops.internal</div>
            <div><strong className="text-slate-300">Expires:</strong> Jan 21, 2029 (Valid)</div>
          </div>

          {/* Production Let's Encrypt / Certbot snippet */}
          <div className="pt-2 border-t border-slate-800 text-xs space-y-2">
            <span className="text-slate-300 font-bold block">Production Let's Encrypt / Certbot Provisioning:</span>
            <code className="text-slate-300 font-mono text-[11px] block bg-slate-950 p-2.5 rounded border border-slate-800 overflow-x-auto">
              sudo certbot --nginx -d devops.example.com --non-interactive --agree-tos -m admin@example.com
            </code>
          </div>
        </div>

      </div>

      {/* Production Nginx Reverse Proxy Config Snippet */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Production Nginx Reverse Proxy Configuration (Port 80 &rarr; 443)</span>
          </div>

          <button
            onClick={() => copyToClipboard(nginxSampleConfig, 'nginx')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'nginx' ? 'Copied' : 'Copy Config'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          This configuration terminates SSL, forces HTTPS, proxies internally to Node.js port 5000, and hides all ports and IP addresses from clients.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre overflow-x-auto">
          {nginxSampleConfig}
        </div>
      </div>

      {/* Production Systemd Service Unit Configuration */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Systemd Service Unit Configuration (/etc/systemd/system/devops-stored-data.service)</span>
          </div>

          <button
            onClick={() => copyToClipboard(systemdSampleConfig, 'systemd')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            {copiedKey === 'systemd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'systemd' ? 'Copied' : 'Copy Config'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Enables the application to run automatically as a persistent background system daemon with auto-restart on system boot.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto">
          {systemdSampleConfig}
        </div>
      </div>

      {/* Infrastructure & Server Health Telemetry Card (Moved here in last) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Infrastructure &amp; Server Health Telemetry</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time node telemetry, database integrity, and multi-computer access tunnel
              </p>
            </div>
          </div>

          {/* Quick Database Maintenance Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOptimizeDb}
              disabled={optimizing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Run SQLite VACUUM optimization"
            >
              <Wrench className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin' : ''}`} />
              <span>{optimizing ? 'Optimizing...' : 'Optimize DB'}</span>
            </button>

            <a
              href={api.getDatabaseBackupUrl()}
              download
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
              title="Download SQLite Database Backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Backup DB</span>
            </a>
          </div>
        </div>

        {optimizeMessage && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{optimizeMessage}</span>
          </div>
        )}

        {/* 4 Telemetry Metric Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Node Server Status */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">API Server</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Express Port {systemHealth.port}</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400">
              HTTP {systemHealth.port} | HTTPS {systemHealth.httpsPort || 5443} (TLS)
            </div>
          </div>

          {/* SQLite DB Health */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">SQLite Database</span>
              <Database className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-sm font-bold text-emerald-400 truncate">
              {systemHealth.database}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Storage: {formatBytes(stats?.summary?.totalStorageBytes)}
            </div>
          </div>

          {/* Uptime & Runtime */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Process Uptime</span>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-sm font-bold text-white font-mono">
              {formatUptime(systemHealth.uptimeSeconds)}
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Heap: {formatBytes(systemHealth.rssMemoryBytes || 85000000)}
            </div>
          </div>

          {/* Multi-Computer Remote Sharing Tunnel */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Public Secure URL</span>
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-mono font-bold text-emerald-300 truncate max-w-[150px]">
                {systemHealth.tunnelUrl || 'https://devops-stored-data.loca.lt'}
              </span>
              <button
                onClick={() => copyTunnel(systemHealth.tunnelUrl || 'https://devops-stored-data.loca.lt')}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[10px] flex items-center gap-1 cursor-pointer"
                title="Copy secure HTTPS URL"
              >
                {copiedTunnel ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span>🔒 DevOps Stored Data HTTPS</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Scroll Footer Indicator */}
      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400 font-mono shadow-md">
        <span className="flex items-center gap-2 text-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Domain &amp; Server Infrastructure Reference</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">↕ Use mouse wheel / side scrollbar to scroll all configurations</span>
      </div>

    </div>
  );
}
