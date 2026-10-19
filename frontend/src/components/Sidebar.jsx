import React, { useRef, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  FolderGit2, 
  BookOpen, 
  FileCheck2, 
  Server,
  ShieldAlert,
  FileText,
  Settings,
  Terminal,
  LogOut,
  Boxes,
  UserCircle,
  Camera,
  Loader2,
  Eye,
  Pencil,
  Trash2,
  X,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Close avatar menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAvatarMenu(false);
      }
    };
    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvatarMenu]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAvatarMenu(false);
        setShowImageViewer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAvatarIconClick = (e) => {
    e.stopPropagation();
    setShowAvatarMenu((prev) => !prev);
  };

  const handleViewImage = (e) => {
    e.stopPropagation();
    setShowAvatarMenu(false);
    if (user?.avatar) {
      setShowImageViewer(true);
    } else {
      alert('No profile picture uploaded yet. Click "Edit / Change" to upload one.');
    }
  };

  const handleEditImage = (e) => {
    e.stopPropagation();
    setShowAvatarMenu(false);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();
    setShowAvatarMenu(false);
    if (!user?.avatar) return;
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    
    setRemovingAvatar(true);
    try {
      const res = await api.deleteAvatar();
      updateUser(res.user);
      setShowImageViewer(false);
    } catch (err) {
      console.error('Failed to remove profile picture:', err);
      alert('Failed to remove profile picture: ' + err.message);
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleDownloadImage = (e) => {
    e.stopPropagation();
    if (!user?.avatar) return;
    const a = document.createElement('a');
    a.href = user.avatar;
    a.download = `${user?.name || 'profile'}-photo.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF)');
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (user) {
        updateUser({ ...user, avatar: event.target.result });
      }
    };
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.uploadAvatar(formData);
      updateUser(res.user, res.token);
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      alert('Failed to upload profile picture: ' + err.message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pocs', label: 'POCs Repository', icon: Layers },
    { id: 'pdfs', label: 'PDF Documents', icon: FileText, badge: 'PDF' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'commands', label: 'Commands', icon: Terminal, badge: 'CLI' },
    { id: 'technologies', label: 'Technologies', icon: Boxes, badge: 'STACK' },
    { id: 'notes', label: 'Runbooks & Notes', icon: BookOpen },
    { id: 'audit', label: 'Audit Trail', icon: FileCheck2 },
    { id: 'deployment', label: 'Domain & Server Setup', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 p-4 flex flex-col justify-between overflow-y-auto">
      
      {/* Top Section: Navigation Links */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 mb-2 font-mono">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            DevOps Hub
          </p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: User Profile with Gmail & Sign Out Button */}
      <div className="mt-8 pt-4 border-t border-slate-800 space-y-3 relative">
        
        {/* User Card with Gmail */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="bg-slate-950/80 hover:bg-slate-950 p-3 rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 shadow-xl space-y-2.5 cursor-pointer transition relative"
          title="Open My Profile"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Hidden File Input for Avatar Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Clickable Profile Avatar Icon */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <div
                onClick={handleAvatarIconClick}
                className="relative group/avatar cursor-pointer"
                title="Profile photo options (View, Edit, Remove)"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/30 overflow-hidden group-hover/avatar:ring-2 group-hover/avatar:ring-cyan-300 transition">
                  {uploadingAvatar || removingAvatar ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'Profile'}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'K'}</span>
                  )}
                </div>

                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-white drop-shadow" />
                </div>
              </div>

              {/* Action Popover Menu (View, Edit, Remove) */}
              {showAvatarMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 bottom-12 z-50 w-52 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2.5 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Profile Photo</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{user?.avatar ? 'Uploaded' : 'Default'}</span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {/* 1. View Image */}
                    <button
                      type="button"
                      onClick={handleViewImage}
                      disabled={!user?.avatar}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition ${
                        user?.avatar 
                          ? 'text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer' 
                          : 'text-slate-500 cursor-not-allowed opacity-40'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="flex-1">View Image</span>
                    </button>

                    {/* 2. Edit Image */}
                    <button
                      type="button"
                      onClick={handleEditImage}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer text-left transition"
                    >
                      <Pencil className="w-4 h-4 text-emerald-400" />
                      <span className="flex-1">{user?.avatar ? 'Edit / Change' : 'Upload Image'}</span>
                    </button>

                    {/* 3. Remove Image */}
                    {user?.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={removingAvatar}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer text-left transition"
                      >
                        {removingAvatar ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="flex-1">Remove Image</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span className="truncate">{user?.name || 'Kishwanth'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono uppercase">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div 
                className="text-[11px] text-cyan-400 font-mono truncate mt-0.5" 
                title={user?.email || 'aderukishu@gmail.com'}
              >
                {user?.email || 'aderukishu@gmail.com'}
              </div>
            </div>
          </div>

          {/* Sign Out Button in Side Tab */}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 hover:border-rose-500/40 text-xs font-semibold transition cursor-pointer shadow-sm group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Server & Domain status */}
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 text-[10px] text-slate-500 font-mono flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Server Online
          </span>
          <span>Port 5000</span>
        </div>

      </div>

      {/* High-Resolution Profile Image Viewer Modal */}
      {showImageViewer && user?.avatar && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowImageViewer(false)}
        >
          <div 
            className="relative max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{user?.name || 'Profile'} Photo</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageViewer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image Display */}
            <div className="p-6 flex items-center justify-center bg-slate-950/80 min-h-[280px]">
              <div className="relative group max-h-[55vh] rounded-2xl overflow-hidden ring-2 ring-cyan-500/30 shadow-2xl">
                <img 
                  src={user.avatar} 
                  alt={user?.name || 'Profile'} 
                  className="w-full h-auto max-h-[50vh] object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Modal Action Footer: Edit, Remove, Download */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Edit / Change Image */}
                <button
                  type="button"
                  onClick={handleEditImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
                  title="Upload a new profile picture from File Explorer"
                >
                  <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit / Change</span>
                </button>

                {/* Remove Image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={removingAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
                  title="Remove this profile picture"
                >
                  {removingAvatar ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Remove</span>
                </button>
              </div>

              {/* Download Image */}
              <button
                type="button"
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition cursor-pointer"
                title="Download profile picture"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
