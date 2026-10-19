import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Terminal, 
  Database,
  Server, 
  Globe, 
  User, 
  Activity,
  Plus,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Shield,
  Clock,
  Calendar,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ activeTab, setActiveTab, onNewPoc, onNewTask, onUploadFile }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Profile Popover Dropdown State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Live Date & Time
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Update live clock every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const day = now.getDate();
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${day} ${month} ${year}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordMsg(null);
      }, 1500);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center space-x-3 cursor-pointer flex-shrink-0" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold ring-1 ring-cyan-400/30">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">DevOps Stored Data</span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              devops.example.com
            </p>
          </div>
        </div>

        {/* Center: Global Application Search Bar */}
        <GlobalSearch 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewPoc={onNewPoc}
          onNewTask={onNewTask}
          onUploadFile={onUploadFile}
        />

        {/* Center-Right: Quick Action Buttons (shown on large screens) */}
        <div className="hidden 2xl:flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onNewPoc}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New POC</span>
          </button>
          <button
            onClick={onNewTask}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>New Task</span>
          </button>
          <button
            onClick={onUploadFile}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Script/File</span>
          </button>
        </div>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Notification Symbol Button & Dropdown */}
          <NotificationDropdown setActiveTab={setActiveTab} />

          <button
            onClick={() => setActiveTab('settings')}
            title="DevOps System Settings"
            className={`p-2 rounded-lg border transition ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Single-Icon Dark & Light Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark and Light Mode"
            className={`p-2 rounded-lg border transition shadow-sm cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700 hover:border-slate-600'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30 hover:border-amber-500/50'
            }`}
          >
            {isDark ? (
              <Moon className="w-4 h-4 fill-cyan-400/20 text-cyan-400 transition-transform duration-300 hover:-rotate-12" />
            ) : (
              <Sun className="w-4 h-4 fill-amber-400/20 text-amber-500 transition-transform duration-300 hover:rotate-90" />
            )}
          </button>

          {/* Full Screen Toggle Button with Visible Text Label */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen (F11)' : 'Enter Full Screen (F11)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isFullscreen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* User Profile Chip with Dropdown Popover */}
          <div className="relative" ref={profileDropdownRef}>
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border cursor-pointer transition shadow-sm select-none ${
                isProfileOpen 
                  ? 'bg-slate-800 border-cyan-500/50 ring-1 ring-cyan-500/30' 
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
              }`}
              title="Click to view profile menu"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-mono">{user?.role}</div>
              </div>
            </div>

            {/* Profile Dropdown Menu matching requested UI */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                
                {/* User Header with Avatar */}
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-cyan-400/30">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate leading-tight">
                      {user?.name || 'kishu'}
                    </h4>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase">{user?.role || 'user'}</span>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Role: <strong className="font-semibold text-cyan-300">{user?.role || 'user'}</strong></span>
                </div>

                {/* Live Time */}
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Time: <strong className="font-semibold text-white">{currentTime}</strong></span>
                </div>

                {/* Live Date */}
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-3">
                  <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Date: <strong className="font-semibold text-white">{currentDate}</strong></span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 my-2.5"></div>

                {/* Menu Items */}
                <div className="space-y-1">
                  {/* My Profile */}
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer group"
                  >
                    <User className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <span>My Profile</span>
                  </button>

                  {/* Change Password */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition text-left cursor-pointer group"
                  >
                    <Key className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <span>Change Password</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 my-2.5"></div>

                {/* Sign Out */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition text-left cursor-pointer group"
                >
                  <LogOut className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Sign Out</span>
                </button>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* QUICK CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <span>Change Password</span>
              </h2>
              <button 
                onClick={() => { setIsPasswordModalOpen(false); setPasswordMsg(null); }} 
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs mt-4 flex items-center gap-2 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-rose-950/70 border border-rose-800 text-rose-300'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Current Password *</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  >
                    {showOldPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">New Password (minimum 8 characters) *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setPasswordMsg(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
