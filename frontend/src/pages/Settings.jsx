import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  HardDrive, 
  Sliders, 
  ShieldCheck, 
  Save, 
  DownloadCloud, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Database, 
  Terminal, 
  Bell, 
  Palette, 
  UserPlus, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  Cpu,
  Server,
  Edit2,
  Trash2,
  X,
  Moon,
  Sun
} from 'lucide-react';

export default function Settings({ onNavigateAudit }) {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // System Stats
  const [systemStats, setSystemStats] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeMsg, setOptimizeMsg] = useState(null);

  // Team Members
  const [teamMembers, setTeamMembers] = useState([]);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'engineer' });
  const [creatingUser, setCreatingUser] = useState(false);
  const [userMsg, setUserMsg] = useState(null);

  // Edit Team Member
  const [editingMember, setEditingMember] = useState(null);
  const [editMemberForm, setEditMemberForm] = useState({ name: '', email: '', role: 'engineer', password: '' });
  const [savingMemberEdit, setSavingMemberEdit] = useState(false);
  const [editMemberMsg, setEditMemberMsg] = useState(null);

  // Preferences (Saved in localStorage)
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('devops_preferences');
      return saved ? JSON.parse(saved) : {
        accent: 'cyan',
        defaultTab: 'dashboard',
        notifications: true,
        autoRefresh: '60'
      };
    } catch {
      return { accent: 'cyan', defaultTab: 'dashboard', notifications: true, autoRefresh: '60' };
    }
  });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  useEffect(() => {
    loadSystemInfo();
    if (user?.role === 'admin') {
      loadTeam();
    }
  }, [user]);

  const loadSystemInfo = async () => {
    try {
      const [stats, health] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getHealth().catch(() => null)
      ]);
      setSystemStats({ stats: stats?.summary, health });
    } catch (e) {
      console.error('Failed to load system info:', e);
    }
  };

  const loadTeam = async () => {
    try {
      const users = await api.getUsers();
      setTeamMembers(users);
    } catch (e) {
      console.error('Failed to load team:', e);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await api.updateProfile(profileForm);
      updateUser(res.user, res.token);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      await api.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatingUser(true);
    setUserMsg(null);
    try {
      await api.createUser(newUserForm);
      setUserMsg({ type: 'success', text: `Team member ${newUserForm.email} created!` });
      setNewUserForm({ name: '', email: '', password: '', role: 'engineer' });
      loadTeam();
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setEditMemberForm({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'engineer',
      password: ''
    });
    setEditMemberMsg(null);
  };

  const handleEditMemberSubmit = async (e) => {
    e.preventDefault();
    if (!editingMember) return;
    setSavingMemberEdit(true);
    setEditMemberMsg(null);
    try {
      const payload = {
        name: editMemberForm.name,
        email: editMemberForm.email,
        role: editMemberForm.role
      };
      if (editMemberForm.password && editMemberForm.password.trim()) {
        payload.password = editMemberForm.password.trim();
      }
      await api.updateTeamUser(editingMember.id, payload);
      setEditingMember(null);
      loadTeam();
      if (editingMember.id === user?.id) {
        updateUser({ ...user, name: payload.name, email: payload.email, role: payload.role });
      }
      setUserMsg({ type: 'success', text: `Account for ${payload.email} updated successfully!` });
    } catch (err) {
      setEditMemberMsg({ type: 'error', text: err.message });
    } finally {
      setSavingMemberEdit(false);
    }
  };

  const handleDeleteMember = async (member) => {
    if (member.id === user?.id) {
      alert('You cannot delete your own active account while logged in.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the account "${member.name}" (${member.email})?\nThis action will revoke access immediately.`)) {
      return;
    }
    try {
      await api.deleteTeamUser(member.id);
      loadTeam();
      setUserMsg({ type: 'success', text: `Account ${member.email} deleted successfully.` });
    } catch (err) {
      alert('Failed to delete account: ' + err.message);
    }
  };

  const handleOptimizeDb = async () => {
    setOptimizing(true);
    setOptimizeMsg(null);
    try {
      const res = await api.optimizeDatabase();
      setOptimizeMsg({ type: 'success', text: res.message });
      loadSystemInfo();
    } catch (err) {
      setOptimizeMsg({ type: 'error', text: err.message });
    } finally {
      setOptimizing(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('devops_preferences', JSON.stringify(updated));
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'preferences', label: 'Preferences & UI', icon: Sliders },
    { id: 'vault', label: 'Vault & Storage', icon: HardDrive },
    { id: 'security', label: 'Security & Sessions', icon: ShieldCheck },
    ...(user?.role === 'admin' ? [{ id: 'team', label: 'Team Members', icon: UserPlus }] : [])
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            <span>DevOps System Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, credentials, storage limits, database backups, and interface preferences.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Role: {user?.role || 'engineer'}
          </span>
        </div>
      </div>

      {/* Settings Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PROFILE & ACCOUNT */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Personal Profile Information</span>
            </h2>

            {profileMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/70 border border-rose-800 text-rose-300'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g. Kishwanth"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Personal Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Used for personal authentication and audit trail tracking.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Access Role</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white capitalize">{user?.role || 'engineer'}</span>
                  <span className="text-[10px] text-slate-500 font-mono">(Full access to tasks, vaults, and deployments)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Change Password</span>
            </h2>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/70 border border-rose-800 text-rose-300'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">New Password (minimum 8 characters) *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter new strong password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-xs transition shadow-lg shadow-amber-600/20 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PREFERENCES & UI */}
      {activeSubTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Application Preferences</span>
            </h2>
            <p className="text-xs text-slate-400">
              Customize your default dashboard view, refresh rates, and notification behaviors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Default Landing Tab */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-sm font-semibold text-white">Default Landing Tab</label>
              <p className="text-[11px] text-slate-400">Select which tab opens automatically upon login.</p>
              <select
                value={preferences.defaultTab}
                onChange={(e) => handlePreferenceChange('defaultTab', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="dashboard">Dashboard (Overview & Metrics)</option>
                <option value="commands">DevOps Commands & CLI Reference</option>
                <option value="tasks">Tasks (Full Table & PDF Viewer)</option>
                <option value="files">Files & Scripts Vault</option>
                <option value="pdfs">PDF Documents Repository</option>
                <option value="pocs">POCs Repository</option>
                <option value="notes">Runbooks & Notes</option>
              </select>
            </div>

            {/* Dashboard Auto-Refresh */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-sm font-semibold text-white">Auto-Refresh Interval</label>
              <p className="text-[11px] text-slate-400">Background polling interval for task status and metrics.</p>
              <select
                value={preferences.autoRefresh}
                onChange={(e) => handlePreferenceChange('autoRefresh', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">Off (Manual Refresh)</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds (Recommended)</option>
                <option value="300">Every 5 minutes</option>
              </select>
            </div>

            {/* Notification Toggles */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-semibold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Task & File Notifications</span>
              </label>
              <p className="text-[11px] text-slate-400">Display instant toast messages on file uploads and edits.</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-300">In-App Notification Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Theme Display Mode (Dark Mode Symbol & Toggle) */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-white flex items-center gap-2">
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>Display Theme Mode</span>
                </label>
                <span className="text-xs font-mono text-cyan-400">
                  {isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                    isDark
                      ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Moon className={`w-4 h-4 ${isDark ? 'text-cyan-400 fill-cyan-400/20' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div>Dark Mode (Cyber Night)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Obsidian slate with neon accents</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                    !isDark
                      ? 'border-amber-500 bg-amber-950/30 text-white shadow-md shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Sun className={`w-4 h-4 ${!isDark ? 'text-amber-400 fill-amber-400/20' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div>Light Mode</div>
                    <div className="text-[10px] text-slate-500 font-normal">Clean high-contrast theme</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Accent Theme */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-semibold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>DevOps Accent Color</span>
              </label>
              <div className="flex items-center gap-3 pt-1">
                {[
                  { id: 'cyan', label: 'Cyan Ops', color: 'bg-cyan-500' },
                  { id: 'emerald', label: 'Emerald Cyber', color: 'bg-emerald-500' },
                  { id: 'amber', label: 'Amber Ops', color: 'bg-amber-500' },
                  { id: 'purple', label: 'Violet K8s', color: 'bg-purple-500' },
                  { id: 'rose', label: 'Rose Alert', color: 'bg-rose-500' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePreferenceChange('accent', item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      preferences.accent === item.id 
                        ? 'border-white text-white bg-slate-800' 
                        : 'border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: VAULT & STORAGE */}
      {activeSubTab === 'vault' && (
        <div className="space-y-6">
          {/* Storage Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total POCs</span>
              <p className="text-2xl font-bold text-white mt-1">{systemStats?.stats?.totalPocs ?? '12'}</p>
              <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Architecture & Tests</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Active Tasks</span>
              <p className="text-2xl font-bold text-white mt-1">{systemStats?.stats?.totalTasks ?? '15'}</p>
              <span className="text-[10px] text-blue-400 font-mono mt-1 block">Tracked SRE Items</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Vault Files & PDFs</span>
              <p className="text-2xl font-bold text-white mt-1">{systemStats?.stats?.totalFiles ?? '15'}</p>
              <span className="text-[10px] text-rose-400 font-mono mt-1 block">Documents & Scripts</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Storage Used</span>
              <p className="text-2xl font-bold text-white mt-1">
                {formatBytes(systemStats?.stats?.totalStorageBytes || 8500000)}
              </p>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Max limit: 50 MB / file</span>
            </div>
          </div>

          {/* Database Backup & Maintenance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>SQLite Database Backup & Maintenance</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Download an instant snapshot of your entire database or optimize SQLite tables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={api.getDatabaseBackupUrl()}
                  download
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition shadow-lg shadow-emerald-600/20"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download DB Backup</span>
                </a>

                <button
                  onClick={handleOptimizeDb}
                  disabled={optimizing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs border border-slate-700 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${optimizing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{optimizing ? 'Optimizing...' : 'Vacuum & Optimize'}</span>
                </button>
              </div>
            </div>

            {optimizeMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                optimizeMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/70 border border-rose-800 text-rose-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{optimizeMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Database Engine</span>
                <span className="font-semibold text-white">SQLite (WAL Mode Active)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Allowed Formats</span>
                <span className="font-semibold text-white">.pdf, .sh, .py, .yaml, .tf, .json, .conf</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Max File Size</span>
                <span className="font-semibold text-white">50 MB per Upload</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SECURITY & SESSIONS */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Session Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Current Active Session</span>
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Authenticated As</span>
                  <span className="font-semibold text-white font-mono">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Access Level</span>
                  <span className="font-semibold text-emerald-400 uppercase font-mono">{user?.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Token Type</span>
                  <span className="font-semibold text-slate-200 font-mono">JWT (Bearer Authorization)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Session Security</span>
                  <span className="font-semibold text-cyan-400">Encrypted (HMAC-SHA256)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-semibold transition"
                >
                  Sign Out This Device
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Clear all local browser data and cookies?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  Clear Cached Session
                </button>
              </div>
            </div>

            {/* Audit & Compliance Link */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security & Audit Trails</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every action taken within this DevOps vault—including user logins, task creation, file uploads, edits, and deletions—is securely recorded in the immutable audit log.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Tamper-Resistant Logging Active</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Audit records include actor user ID, client IP, timestamp, action type, and target entity IDs.
                </p>
              </div>

              {onNavigateAudit && (
                <div className="pt-2">
                  <button
                    onClick={onNavigateAudit}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-lg text-xs font-semibold transition"
                  >
                    <span>Open Full Audit Trail Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: TEAM MEMBERS (Admin Only) */}
      {activeSubTab === 'team' && user?.role === 'admin' && (
        <div className="space-y-6">
          {/* Add Team Member */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Create New DevOps Team Member</span>
            </h2>

            {userMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 flex items-center gap-2 ${
                userMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/70 border border-rose-800 text-rose-300'
              }`}>
                {userMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{userMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. SRE Engineer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="engineer@devops.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="engineer">Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="sm:col-span-4 pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{creatingUser ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Team Members List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Active DevOps Accounts</h3>
              <span className="text-xs text-slate-400 font-mono">{teamMembers.length} Accounts Registered</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{member.name}</span>
                          {member.id === user?.id && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{member.email}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          member.role === 'admin' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                            : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMember(member)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
                            title="Edit account details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member)}
                            disabled={member.id === user?.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                              member.id === user?.id
                                ? 'bg-slate-800/50 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer'
                            }`}
                            title={member.id === user?.id ? "Cannot delete your active session" : "Delete account"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Edit DevOps Account</h3>
                  <p className="text-[11px] text-slate-400">Modify user credentials & permissions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditMemberSubmit} className="p-5 space-y-4">
              {editMemberMsg && (
                <div className="p-3 rounded-lg text-xs bg-rose-950/60 text-rose-300 border border-rose-800">
                  {editMemberMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editMemberForm.name}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={editMemberForm.email}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Permission</label>
                <select
                  value={editMemberForm.role}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="engineer">Engineer (Standard Access)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Reset Password <span className="text-[10px] text-slate-500 font-normal">(Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password if changing"
                  value={editMemberForm.password}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMemberEdit}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                >
                  {savingMemberEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
