import React, { useState, useMemo, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Layers, 
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { DEVOPS_CATEGORIES, ALL_BUILTIN_COMMANDS } from '../data/devopsCommands';
import { useAuth } from '../context/AuthContext';

export default function Commands({ setActiveTab }) {
  const { user } = useAuth();
  const storageKey = `devops_custom_commands_${user?.id || 'guest'}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState(null);

  // Custom user commands stored in localStorage
  const [customCommands, setCustomCommands] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse custom commands:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCustomCommands(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error('Failed to parse custom commands:', e);
      setCustomCommands([]);
    }
  }, [storageKey]);

  // Modal form state
  const [customForm, setCustomForm] = useState({
    title: '',
    category: 'docker',
    command: '',
    description: '',
    privilege: 'user',
    tags: '',
    explanation: '',
    expectedOutput: ''
  });

  const saveCustomCommandsToStorage = (updated) => {
    setCustomCommands(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom commands:', e);
    }
  };

  // Combine built-in and custom commands
  const allCommands = useMemo(() => {
    const customFormatted = customCommands.map((c) => ({
      ...c,
      isCustom: true,
      categoryLabel: DEVOPS_CATEGORIES.find((cat) => cat.id === c.category)?.label || 'Custom Command'
    }));
    return [...ALL_BUILTIN_COMMANDS, ...customFormatted];
  }, [customCommands]);

  // Compute category command counts
  const categoryCounts = useMemo(() => {
    const map = {};
    DEVOPS_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') {
        map[cat.id] = allCommands.length;
      } else if (cat.id === 'custom') {
        map[cat.id] = customCommands.length;
      } else {
        map[cat.id] = allCommands.filter((c) => c.category === cat.id).length;
      }
    });
    return map;
  }, [allCommands, customCommands]);

  // Filtered categories for the left sidebar
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return DEVOPS_CATEGORIES;
    const q = categorySearch.toLowerCase();
    return DEVOPS_CATEGORIES.filter(c => 
      c.label.toLowerCase().includes(q) || 
      c.group?.toLowerCase().includes(q)
    );
  }, [categorySearch]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    return allCommands.filter((cmd) => {
      // Category filter
      if (selectedCategory === 'custom') {
        if (!cmd.isCustom) return false;
      } else if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = cmd.title?.toLowerCase().includes(q);
      const matchCommand = cmd.command?.toLowerCase().includes(q);
      const matchDesc = cmd.description?.toLowerCase().includes(q);
      const matchTags = cmd.tags?.some((t) => t.toLowerCase().includes(q));
      const matchCategory = cmd.categoryLabel?.toLowerCase().includes(q);

      return matchTitle || matchCommand || matchDesc || matchTags || matchCategory;
    });
  }, [allCommands, selectedCategory, searchQuery]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleOpenAddModal = (existing = null) => {
    if (existing) {
      setEditingCustomId(existing.id);
      setCustomForm({
        title: existing.title || '',
        category: existing.category || 'docker',
        command: existing.command || '',
        description: existing.description || '',
        privilege: existing.privilege || 'user',
        tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : '',
        explanation: existing.explanation || '',
        expectedOutput: existing.expectedOutput || ''
      });
    } else {
      setEditingCustomId(null);
      setCustomForm({
        title: '',
        category: selectedCategory !== 'all' && selectedCategory !== 'custom' ? selectedCategory : 'docker',
        command: '',
        description: '',
        privilege: 'user',
        tags: '',
        explanation: '',
        expectedOutput: ''
      });
    }
    setShowAddModal(true);
  };

  const handleSaveCustomCommand = (e) => {
    e.preventDefault();
    if (!customForm.title.trim() || !customForm.command.trim()) return;

    const tagsArray = customForm.tags
      ? customForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['custom'];

    const targetCat = DEVOPS_CATEGORIES.find((c) => c.id === customForm.category);

    if (editingCustomId) {
      const updated = customCommands.map((c) => {
        if (c.id === editingCustomId) {
          return {
            ...c,
            title: customForm.title.trim(),
            category: customForm.category,
            categoryLabel: targetCat ? targetCat.label : 'Custom Command',
            command: customForm.command.trim(),
            description: customForm.description.trim(),
            privilege: customForm.privilege,
            tags: tagsArray,
            explanation: customForm.explanation.trim(),
            expectedOutput: customForm.expectedOutput.trim()
          };
        }
        return c;
      });
      saveCustomCommandsToStorage(updated);
    } else {
      const newCmd = {
        id: `custom-${Date.now()}`,
        title: customForm.title.trim(),
        category: customForm.category,
        categoryLabel: targetCat ? targetCat.label : 'Custom Command',
        command: customForm.command.trim(),
        description: customForm.description.trim(),
        privilege: customForm.privilege,
        tags: tagsArray,
        explanation: customForm.explanation.trim(),
        expectedOutput: customForm.expectedOutput.trim(),
        isCustom: true
      };
      saveCustomCommandsToStorage([newCmd, ...customCommands]);
    }

    setShowAddModal(false);
  };

  const handleDeleteCustomCommand = (id) => {
    if (window.confirm('Are you sure you want to delete this custom command?')) {
      const updated = customCommands.filter((c) => c.id !== id);
      saveCustomCommandsToStorage(updated);
    }
  };

  const exportCheatSheetScript = () => {
    let script = `#!/bin/bash
# ==============================================================================
# DEVOPS STORED DATA - COMPREHENSIVE CLI COMMANDS CHEAT-SHEET
# Generated: ${new Date().toISOString()}
# Portal URL: http://localhost:5000 / http://localhost:3000
# Total Commands: ${allCommands.length}
# ==============================================================================

set -e

`;

    DEVOPS_CATEGORIES.filter((c) => c.id !== 'all').forEach((cat) => {
      const cmdsInCat = allCommands.filter((c) => (cat.id === 'custom' ? c.isCustom : c.category === cat.id));
      if (cmdsInCat.length === 0) return;

      script += `\n# ------------------------------------------------------------------------------\n`;
      script += `# CATEGORY: ${cat.label.toUpperCase()}\n`;
      script += `# ------------------------------------------------------------------------------\n\n`;

      cmdsInCat.forEach((cmd) => {
        script += `# ${cmd.title} [Privilege: ${cmd.privilege.toUpperCase()}]\n`;
        script += `# ${cmd.description}\n`;
        if (cmd.explanation) script += `# Note: ${cmd.explanation}\n`;
        script += `${cmd.command}\n\n`;
      });
    });

    const blob = new Blob([script], { type: 'text/x-shellscript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devops-commands-cheatsheet-${new Date().toISOString().slice(0, 10)}.sh`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentCategoryObj = DEVOPS_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 -mb-20 w-60 h-60 rounded-full bg-blue-600/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 tracking-wider uppercase font-mono">
                Command Hub
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {allCommands.length} Commands Across 40 Categories
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              <span>Command Hub & Terminal CLI Cheatsheet</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Complete production command-line reference covering Docker, Kubernetes, Helm, Terraform, Cloud Providers (AWS/Azure), 
              CI/CD Pipelines, and full Linux Systems Administration.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Command</span>
            </button>
            <button
              onClick={exportCheatSheetScript}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              title="Download entire command suite as executable .sh cheat-sheet script"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Cheat-sheet (.sh)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Categories Sidebar | Commands Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: Category Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#090d16] border border-slate-800/80 rounded-2xl p-3 flex flex-col shadow-xl">
          
          <div className="px-2 py-1.5 mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Categories</span>
            </span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded font-mono border border-cyan-800/50">
              40 Topics
            </span>
          </div>

          {/* Category Filter Search */}
          <div className="relative mb-2.5 px-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Scrollable Categories List */}
          <div className="overflow-y-auto max-h-[calc(100vh-260px)] min-h-[500px] pr-1.5 space-y-1 scrollbar-thin">
            {filteredCategories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition text-left group ${
                    isSelected
                      ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className={`text-xs transition font-mono ${isSelected ? 'text-cyan-400' : 'text-slate-600 group-hover:text-cyan-400'}`}>
                      {cat.id === 'all' ? '★' : cat.id === 'custom' ? '✦' : '>_'}
                    </span>
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex-shrink-0 transition ${
                    isSelected 
                      ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-700/60' 
                      : 'bg-slate-900 text-slate-500 group-hover:text-slate-300 border border-slate-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Commands Cards Stream (Expanded) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-3">
          
          {/* Search bar inside command view */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search commands by title, syntax, tags (e.g. 'docker', 'nginx', 'ss', 'tar', 'useradd')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Header Badge */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="text-cyan-400">{'>_'}</span>
              <span>{currentCategoryObj?.label || 'Commands'}</span>
              <span className="text-slate-500 font-normal">({filteredCommands.length} matches)</span>
            </span>
          </div>

          {/* Scrollable Command Cards Container */}
          <div className="overflow-y-auto max-h-[calc(100vh-260px)] min-h-[500px] pr-2 space-y-3 rounded-xl scrollbar-thin">
            {filteredCommands.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 space-y-3">
                <Terminal className="w-10 h-10 mx-auto text-slate-600" />
                <p className="font-semibold text-white text-sm">No commands found</p>
                <p className="text-xs max-w-sm mx-auto">
                  No commands matched "{searchQuery}". Try another keyword or switch categories.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredCommands.map((cmd) => {
                const isCopied = copiedId === cmd.id;

                return (
                  <div
                    key={cmd.id}
                    className="group relative rounded-xl border p-4 transition bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition">
                            {cmd.title}
                          </span>

                          {cmd.privilege === 'sudo' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/60 font-mono">
                              sudo
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                              user
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-900/40">
                            {cmd.categoryLabel}
                          </span>

                          {cmd.isCustom && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 font-mono">
                              CUSTOM
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">{cmd.description}</p>
                      </div>

                      {/* Action buttons on card */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {cmd.isCustom && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenAddModal(cmd)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                              title="Edit Custom Command"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomCommand(cmd.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="Delete Custom Command"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => copyToClipboard(cmd.command, cmd.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                            isCopied
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-800 text-slate-300 border border-slate-700'
                          }`}
                          title="Copy command to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Code snippet display */}
                    <div className="mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto flex items-center justify-between">
                      <span className="select-all break-all whitespace-pre-wrap">{cmd.command}</span>
                    </div>

                    {/* Technical breakdown / explanation if present */}
                    {cmd.explanation && (
                      <div className="mt-2 text-[11px] text-slate-300 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/50 font-sans leading-relaxed">
                        <span className="text-cyan-400 font-mono font-bold mr-1.5">Note:</span>
                        {cmd.explanation}
                      </div>
                    )}

                    {/* Tags */}
                    {cmd.tags && cmd.tags.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        {cmd.tags.map((t, i) => (
                          <span key={i} className="text-[10px] text-slate-500 font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Add / Edit Custom Command Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {editingCustomId ? 'Edit Custom Command' : 'Add New Custom Command'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Save custom DevOps scripts to your local vault</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomCommand} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Command Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Restart Production Nginx & Purge Cache"
                  value={customForm.title}
                  onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={customForm.category}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {DEVOPS_CATEGORIES.filter((c) => c.id !== 'all' && c.id !== 'custom').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Privilege Level</label>
                  <select
                    value={customForm.privilege}
                    onChange={(e) => setCustomForm({ ...customForm, privilege: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="user">User / Standard</option>
                    <option value="sudo">Sudo / Root Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Command Line Script *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. sudo systemctl restart nginx && sudo rm -rf /var/cache/nginx/*"
                  value={customForm.command}
                  onChange={(e) => setCustomForm({ ...customForm, command: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Brief summary of what this command accomplishes"
                  value={customForm.description}
                  onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. nginx, cache, restart, production"
                  value={customForm.tags}
                  onChange={(e) => setCustomForm({ ...customForm, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technical Explanation (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Detailed notes, safety considerations, or recovery procedures"
                  value={customForm.explanation}
                  onChange={(e) => setCustomForm({ ...customForm, explanation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-cyan-600/20"
                >
                  {editingCustomId ? 'Save Changes' : 'Add Command'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
