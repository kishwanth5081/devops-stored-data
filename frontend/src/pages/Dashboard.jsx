import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { 
  Layers, 
  CheckSquare, 
  FolderGit2, 
  ArrowRight, 
  FileCode,
  Terminal,
  Boxes,
  Activity,
  Server,
  Database,
  Cpu,
  Globe,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Download,
  Wrench,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Plus,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onNewPoc, onNewTask, onUploadFile }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, fetchStats]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Connecting to DevOps Platform &amp; Telemetry...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-base">Failed to connect to DevOps Metrics</h3>
        </div>
        <p className="text-xs">{error}</p>
        <button
          onClick={() => fetchStats(true)}
          className="px-4 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-700 text-white text-xs font-semibold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Real-Time Live Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">DevOps Cluster Telemetry Active</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono">
            Synced: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title="Auto-refresh metrics every 30 seconds"
          >
            <Radio className={`w-3 h-3 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh metrics immediately"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DevOps Stored Data Operations
            </h1>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
              ENTERPRISE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Central operational hub for Proofs of Concept, automation scripts, task pipelines, and live infrastructure telemetry.
          </p>
        </div>
        
        {/* Quick Launch Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('commands')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>423 CLI Commands</span>
          </button>
          <button
            onClick={onNewPoc || (() => setActiveTab('pocs'))}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New POC</span>
          </button>
          <button
            onClick={onNewTask || (() => setActiveTab('tasks'))}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
          <button
            onClick={onUploadFile || (() => setActiveTab('files'))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Script</span>
          </button>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* POCs */}
        <div 
          onClick={() => setActiveTab('pocs')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition shadow-md group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total POCs</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.summary?.totalPocs || 0}</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">Validated</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Across {stats.pocsByCategory?.length || 0} categories</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-cyan-400" />
          </div>
        </div>

        {/* Tasks */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition shadow-md group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">DevOps Tasks</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition border border-blue-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.summary?.totalTasks || 0}</span>
            <span className="text-xs text-blue-400 font-medium font-mono">
              {stats.taskStatusMap?.In_Progress || 0} In Progress
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>{stats.taskStatusMap?.Completed || 0} completed / {stats.taskStatusMap?.Blocked || 0} blocked</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-blue-400" />
          </div>
        </div>

        {/* DevOps Technologies Stack */}
        <div 
          onClick={() => setActiveTab('technologies')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition shadow-md group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">DevOps Technologies</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition border border-emerald-500/20">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">19</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">Core Stacks</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>K8s, Docker, Terraform, CI/CD, AWS</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-400" />
          </div>
        </div>

        {/* Documentation / Runbooks */}
        <div 
          onClick={() => setActiveTab('notes')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition shadow-md group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Runbooks &amp; SOPs</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition border border-purple-500/20">
              <FileCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.summary?.totalNotes || 0}</span>
            <span className="text-xs text-purple-400 font-medium font-mono">Markdown Docs</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Disaster Recovery &amp; Architecture</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-purple-400" />
          </div>
        </div>

      </div>

      {/* FEATURE 4: Task Status Kanban Breakdown */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <span>DevOps Task Pipeline Status</span>
            </h2>
            <p className="text-xs text-slate-400">Current workflow distribution across lifecycle stages</p>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Backlog</div>
            <div className="text-2xl font-bold text-slate-300 mt-1">{stats.taskStatusMap?.Backlog || 0}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-slate-500 h-full" style={{ width: `${((stats.taskStatusMap?.Backlog || 0) / (stats.summary?.totalTasks || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-blue-400">In Progress</div>
            <div className="text-2xl font-bold text-blue-300 mt-1">{stats.taskStatusMap?.In_Progress || 0}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${((stats.taskStatusMap?.In_Progress || 0) / (stats.summary?.totalTasks || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-amber-400">Under Review</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{stats.taskStatusMap?.Review || 0}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${((stats.taskStatusMap?.Review || 0) / (stats.summary?.totalTasks || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-emerald-400">Completed</div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.taskStatusMap?.Completed || 0}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${((stats.taskStatusMap?.Completed || 0) / (stats.summary?.totalTasks || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-rose-400">Blocked</div>
            <div className="text-2xl font-bold text-rose-300 mt-1">{stats.taskStatusMap?.Blocked || 0}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: `${((stats.taskStatusMap?.Blocked || 0) / (stats.summary?.totalTasks || 1)) * 100}%` }}></div>
            </div>
          </div>

        </div>
      </div>

      {/* FEATURE 5: POC Architecture & Tech Stack Distribution */}
      {stats.pocsByCategory && stats.pocsByCategory.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Architecture &amp; Tech Stack Distribution</span>
              </h2>
              <p className="text-xs text-slate-400">Proofs of Concept categorized across containerization, CI/CD, and IaC</p>
            </div>
            <button
              onClick={() => setActiveTab('pocs')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All POCs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.pocsByCategory.map((cat, idx) => {
              const colors = [
                'border-cyan-500/40 text-cyan-400',
                'border-blue-500/40 text-blue-400',
                'border-emerald-500/40 text-emerald-400',
                'border-amber-500/40 text-amber-400',
                'border-purple-500/40 text-purple-400',
                'border-rose-500/40 text-rose-400'
              ];
              const colorClass = colors[idx % colors.length];

              return (
                <div
                  key={cat.category}
                  onClick={() => setActiveTab('pocs')}
                  className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
                >
                  <div className="text-[11px] font-mono text-slate-400 truncate group-hover:text-slate-200">
                    {cat.category}
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {cat.count} <span className="text-xs font-normal text-slate-500">POCs</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full bg-cyan-400`} 
                      style={{ width: `${Math.min(100, (cat.count / (stats.summary?.totalPocs || 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEATURE 2 & 3: Two-Column Section (Urgent Priority Tasks + Live DevOps Activity Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Urgent High-Priority Tasks */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Priority Action Items</h3>
                  <p className="text-[11px] text-slate-400">Upcoming critical and high-priority DevOps tasks</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {stats.urgentTasks && stats.urgentTasks.length > 0 ? (
                stats.urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setActiveTab('tasks')}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                          task.priority === 'Critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : task.priority === 'High'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition truncate">
                          {task.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1 font-mono">
                        <span>Assignee: {task.assigned_name || 'Unassigned'}</span>
                        {task.due_date && <span>• Due: {task.due_date}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {task.status}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 opacity-70" />
                  All critical &amp; high priority tasks are completed.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Filter tasks by milestone or assignee in Tasks tab</span>
            <button
              onClick={onNewTask || (() => setActiveTab('tasks'))}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live DevOps Activity Feed */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live DevOps Event Stream</h3>
                  <p className="text-[11px] text-slate-400">Recent audit log operations &amp; updates</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-1 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-200 truncate">
                        {act.action || 'System Action'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                        {act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {act.details || `Performed on ${act.entity_type}`}
                    </p>
                    <div className="text-[10px] text-cyan-400/80 font-mono">
                      By: {act.user_email || 'admin@devops.internal'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  No recent activity logged.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition cursor-pointer"
            >
              Inspect Full Cryptographic Audit Logs →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
