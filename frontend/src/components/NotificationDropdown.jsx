import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Terminal, 
  FileText, 
  Layers, 
  ArrowRight,
  Trash2,
  AlertTriangle,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

// Icon resolver that returns valid React component safely
const resolveIconComponent = (item) => {
  // If item.icon is an actual function or forwardRef component
  if (typeof item?.icon === 'function' || (typeof item?.icon === 'object' && item?.icon?.$$typeof)) {
    return item.icon;
  }
  
  const key = (item?.category || item?.iconName || '').toLowerCase();
  switch (key) {
    case 'network':
    case 'globe':
      return Globe;
    case 'commands':
    case 'terminal':
      return Terminal;
    case 'security':
      return ShieldCheck;
    case 'documents':
    case 'pdfs':
    case 'file':
      return FileText;
    case 'pocs':
      return Layers;
    case 'alert':
    case 'warning':
      return AlertTriangle;
    case 'system':
    case 'activity':
    default:
      return Activity;
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Multi-Computer Tunnel Active',
    message: 'Public secure tunnel online at https://two-memes-deny.loca.lt',
    timestamp: 'Just now',
    category: 'network',
    severity: 'info',
    tab: 'deployment',
    read: false
  },
  {
    id: 'notif-2',
    title: 'DevOps Commands Hub Loaded',
    message: '423 production commands available across 40 DevOps & Linux categories',
    timestamp: '5m ago',
    category: 'commands',
    severity: 'success',
    tab: 'commands',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Secure Authentication Gate Active',
    message: 'System requires valid credentials for all incoming sessions and remote nodes',
    timestamp: '20m ago',
    category: 'security',
    severity: 'security',
    tab: 'audit',
    read: false
  },
  {
    id: 'notif-4',
    title: 'SQLite Database Optimized',
    message: 'Storage verified and healthy at backend/data/devops_stored.sqlite',
    timestamp: '1h ago',
    category: 'system',
    severity: 'info',
    tab: 'dashboard',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Document & Folder Vault Ready',
    message: 'PDF document viewer and custom folder categorization enabled',
    timestamp: '2h ago',
    category: 'documents',
    severity: 'info',
    tab: 'pdfs',
    read: true
  }
];

export default function NotificationDropdown({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, security, system
  
  // Safely initialize from localStorage, purging any broken icon objects
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('devops_notifications_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(({ icon, ...rest }) => rest);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const dropdownRef = useRef(null);

  // Sync serializable data to localStorage
  useEffect(() => {
    try {
      const serializable = notifications.map(({ icon, ...rest }) => rest);
      localStorage.setItem('devops_notifications_v2', JSON.stringify(serializable));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  // Click outside listener (handles both mousedown & touchstart)
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Fetch recent audit logs to dynamically enrich notifications
  useEffect(() => {
    api.getAuditLogs({ limit: 3 })
      .then((logs) => {
        if (Array.isArray(logs) && logs.length > 0) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            const newEntries = logs
              .filter((log) => !existingIds.has(`audit-${log.id}`))
              .map((log) => ({
                id: `audit-${log.id}`,
                title: log.action || 'Audit Log Event',
                message: log.details || `Performed by ${log.username || 'System'}`,
                timestamp: 'Recent',
                category: 'security',
                severity: 'security',
                tab: 'audit',
                read: false
              }));
            return [...newEntries, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id, tab) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (tab && setActiveTab) {
      setActiveTab(tab);
      setIsOpen(false);
    }
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Quick Action to simulate a live alert for testing
  const addTestNotification = () => {
    const alerts = [
      {
        title: 'Kubernetes Pod Deployment Succeeded',
        message: 'devops-api-v2 deployment completed across 3 cluster replicas.',
        category: 'commands',
        severity: 'success',
        tab: 'commands'
      },
      {
        title: 'Security Scan Completed',
        message: '0 high-vulnerability CVEs found in container images and node dependencies.',
        category: 'security',
        severity: 'security',
        tab: 'audit'
      },
      {
        title: 'New Script Added to Vault',
        message: 'Database backup and disaster recovery automation script verified.',
        category: 'documents',
        severity: 'info',
        tab: 'files'
      }
    ];

    const pick = alerts[Math.floor(Math.random() * alerts.length)];
    const newNotif = {
      id: `test-${Date.now()}`,
      title: pick.title,
      message: pick.message,
      timestamp: 'Just now',
      category: pick.category,
      severity: pick.severity,
      tab: pick.tab,
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'security') return n.category === 'security';
    if (filter === 'system') return n.category === 'system' || n.category === 'network' || n.category === 'commands';
    return true;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Bell Notification Symbol Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title={unreadCount > 0 ? `Notifications (${unreadCount} unread alerts)` : 'Notifications'}
        aria-label="System Notifications & Alerts"
        aria-expanded={isOpen}
        className={`relative p-2 rounded-lg border transition shadow-sm cursor-pointer flex items-center justify-center select-none ${
          isOpen
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-950/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
        }`}
      >
        <Bell className={`w-4 h-4 transition-transform duration-300 ${
          unreadCount > 0 ? 'text-cyan-400 rotate-12' : 'text-slate-400'
        }`} />

        {/* Unread Alert Ping & Numeric Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center font-mono shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Flyout Dropdown Notification Center */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-slate-400">DevOps system events &amp; infrastructure alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={addTestNotification}
                title="Simulate a new DevOps notification"
                className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Test Alert</span>
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Mark all notifications as read"
                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  title="Clear all notifications"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'security', label: 'Security' },
              { id: 'system', label: 'System & CLI' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] whitespace-nowrap transition border ${
                  filter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                <p className="font-semibold text-white text-xs">All Caught Up!</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  No notifications matching your filter. Click <strong>Test Alert</strong> above to simulate a live event.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const IconComponent = resolveIconComponent(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => markItemAsRead(item.id, item.tab)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 group ${
                      !item.read
                        ? 'bg-slate-800/90 border-cyan-500/40 shadow-sm shadow-cyan-950/20'
                        : 'bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    {/* Severity / Category Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                      item.severity === 'security'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : item.severity === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    {/* Unread indicator dot & dismiss button */}
                    <div className="flex items-center space-x-1 flex-shrink-0 pt-0.5">
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20"></span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => deleteNotification(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition"
                        title="Dismiss notification"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with link to Audit Logs */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => {
                setActiveTab('audit');
                setIsOpen(false);
              }}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition font-mono"
            >
              <span>View Audit Trail</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-slate-500 font-mono">
              Live Monitoring
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
