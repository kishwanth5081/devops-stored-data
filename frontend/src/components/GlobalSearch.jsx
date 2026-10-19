import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Terminal, 
  FileText, 
  CheckCircle2, 
  ListTodo, 
  Layers, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  FileCode,
  Folder,
  LayoutDashboard,
  Server,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { ALL_BUILTIN_COMMANDS, DEVOPS_CATEGORIES } from '../data/devopsCommands';

export default function GlobalSearch({ activeTab, setActiveTab, onNewPoc, onNewTask, onUploadFile }) {
  const { isDark, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, commands, pages, pocs, tasks, files, actions
  const [copiedId, setCopiedId] = useState(null);
  const [pocs, setPocs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === '/' && !isOpen) {
        // Pressing / when not typing in an input
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened and fetch background items if needed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      // Fetch latest POCs, tasks, and files for search index
      api.getPocs().then((data) => setPocs(data || [])).catch(() => {});
      api.getTasks().then((data) => setTasks(data || [])).catch(() => {});
      api.getFiles().then((data) => setFiles(data || [])).catch(() => {});
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Predefined Application Navigation Pages
  const PAGES = [
    { id: 'page-dashboard', type: 'page', title: 'Dashboard & Overview', category: 'Pages', tab: 'dashboard', icon: LayoutDashboard, desc: 'System health, recent activities, resource gauges & quick stats' },
    { id: 'page-pocs', type: 'page', title: 'Active DevOps POCs', category: 'Pages', tab: 'pocs', icon: Layers, desc: 'Proof of concept architecture records, objectives & deliverables' },
    { id: 'page-commands', type: 'page', title: 'DevOps Commands Hub (423 Commands)', category: 'Pages', tab: 'commands', icon: Terminal, desc: 'Terminal cheatsheets for Docker, Kubernetes, Linux, Terraform, AWS, etc.' },
    { id: 'page-technologies', type: 'page', title: 'DevOps Technologies Stack', category: 'Pages', tab: 'technologies', icon: Layers, desc: 'Directory of core container runtimes, cloud platforms, IaC engines & tools' },
    { id: 'page-pdfs', type: 'page', title: 'PDF Document & Architecture Viewer', category: 'Pages', tab: 'pdfs', icon: FileText, desc: 'Interactive PDF reader, folder organizer & document vault' },
    { id: 'page-tasks', type: 'page', title: 'Engineering Tasks & Milestones', category: 'Pages', tab: 'tasks', icon: ListTodo, desc: 'Kanban tasks, priority queues & operational checklist' },
    { id: 'page-files', type: 'page', title: 'File & Script Storage Vault', category: 'Pages', tab: 'files', icon: FileCode, desc: 'Bash scripts, YAML configs, compose manifests & backup archives' },
    { id: 'page-notes', type: 'page', title: 'Technical Notes & Runbooks', category: 'Pages', tab: 'notes', icon: FileText, desc: 'Markdown knowledge base, architecture documentation & SOPs' },
    { id: 'page-deployment', type: 'page', title: 'Production Deployment & Tunnel', category: 'Pages', tab: 'deployment', icon: Globe, desc: 'Server endpoints, localtunnel URLs, LAN addresses & port bindings' },
    { id: 'page-audit', type: 'page', title: 'Security Audit Logs', category: 'Pages', tab: 'audit', icon: ShieldCheck, desc: 'Authentication attempts, CRUD operations & administrative audit trail' },
    { id: 'page-settings', type: 'page', title: 'Application Settings & Users', category: 'Pages', tab: 'settings', icon: SettingsIcon, desc: 'Manage user accounts, password updates & portal preferences' }
  ];

  // Quick Application Actions
  const ACTIONS = [
    { id: 'action-new-poc', type: 'action', title: 'Create New DevOps POC', category: 'Quick Actions', icon: Plus, action: () => { onNewPoc?.(); setIsOpen(false); } },
    { id: 'action-new-task', type: 'action', title: 'Create New Task', category: 'Quick Actions', icon: Plus, action: () => { onNewTask?.(); setIsOpen(false); } },
    { id: 'action-upload-file', type: 'action', title: 'Upload Script or Config File', category: 'Quick Actions', icon: Plus, action: () => { onUploadFile?.(); setIsOpen(false); } },
    { id: 'action-dark-mode', type: 'action', title: 'Switch to Dark Mode', category: 'Quick Actions', icon: Moon, action: () => { setTheme('dark'); setIsOpen(false); } },
    { id: 'action-light-mode', type: 'action', title: 'Switch to Light Mode', category: 'Quick Actions', icon: Sun, action: () => { setTheme('light'); setIsOpen(false); } },
    { id: 'action-fullscreen', type: 'action', title: 'Toggle Fullscreen Mode', category: 'Quick Actions', icon: Maximize2, action: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
      setIsOpen(false);
    }}
  ];

  // Filtered Results Calculation
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // If query is empty, return suggested/popular items
    if (!q) {
      if (activeFilter === 'commands') {
        return ALL_BUILTIN_COMMANDS.slice(0, 8).map(c => ({ ...c, type: 'command' }));
      }
      if (activeFilter === 'pages') return PAGES;
      if (activeFilter === 'actions') return ACTIONS;
      
      return [
        ...PAGES.slice(0, 4),
        ...ALL_BUILTIN_COMMANDS.slice(0, 4).map(c => ({ ...c, type: 'command' })),
        ...ACTIONS.slice(0, 3)
      ];
    }

    let results = [];

    // 1. Search Pages
    if (activeFilter === 'all' || activeFilter === 'pages') {
      const matchedPages = PAGES.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.desc.toLowerCase().includes(q) || 
        p.tab.toLowerCase().includes(q)
      );
      results = [...results, ...matchedPages];
    }

    // 2. Search DevOps Commands (423 commands)
    if (activeFilter === 'all' || activeFilter === 'commands') {
      const matchedCommands = ALL_BUILTIN_COMMANDS.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.command.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoryLabel?.toLowerCase().includes(q) ||
        c.tags?.some(t => t.toLowerCase().includes(q))
      ).slice(0, 15).map(c => ({ ...c, type: 'command' }));
      results = [...results, ...matchedCommands];
    }

    // 3. Search POCs
    if (activeFilter === 'all' || activeFilter === 'pocs') {
      const matchedPocs = pocs.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
      ).slice(0, 6).map(p => ({
        id: `poc-${p.id}`,
        type: 'poc',
        title: p.title,
        desc: p.description || `Status: ${p.status} | Tech: ${p.category || 'DevOps'}`,
        category: 'POCs',
        item: p
      }));
      results = [...results, ...matchedPocs];
    }

    // 4. Search Tasks
    if (activeFilter === 'all' || activeFilter === 'tasks') {
      const matchedTasks = tasks.filter(t => 
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.priority?.toLowerCase().includes(q)
      ).slice(0, 6).map(t => ({
        id: `task-${t.id}`,
        type: 'task',
        title: t.title,
        desc: `Status: ${t.status} | Priority: ${t.priority?.toUpperCase()}`,
        category: 'Tasks',
        item: t
      }));
      results = [...results, ...matchedTasks];
    }

    // 5. Search Files & Scripts
    if (activeFilter === 'all' || activeFilter === 'files') {
      const matchedFiles = files.filter(f => 
        f.original_name?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
      ).slice(0, 6).map(f => ({
        id: `file-${f.id}`,
        type: 'file',
        title: f.original_name,
        desc: `Size: ${(f.file_size / 1024).toFixed(1)} KB | Category: ${f.category || 'general'}`,
        category: 'Files',
        item: f
      }));
      results = [...results, ...matchedFiles];
    }

    // 6. Search Quick Actions
    if (activeFilter === 'all' || activeFilter === 'actions') {
      const matchedActions = ACTIONS.filter(a => 
        a.title.toLowerCase().includes(q)
      );
      results = [...results, ...matchedActions];
    }

    return results;
  }, [query, activeFilter, pocs, tasks, files]);

  // Copy helper
  const copyCommandText = (text, id, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Selection handler
  const handleSelectResult = (item) => {
    if (item.type === 'page') {
      setActiveTab(item.tab);
    } else if (item.type === 'command') {
      setActiveTab('commands');
    } else if (item.type === 'poc') {
      setActiveTab('pocs');
    } else if (item.type === 'task') {
      setActiveTab('tasks');
    } else if (item.type === 'file') {
      setActiveTab('files');
    } else if (item.type === 'action') {
      item.action();
    }
    setIsOpen(false);
  };

  // Keyboard navigation inside search results list
  const handleKeyDownList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex]);
      }
    }
  };

  const FILTERS = [
    { id: 'all', label: 'All Results' },
    { id: 'commands', label: 'Commands' },
    { id: 'pages', label: 'Pages' },
    { id: 'pocs', label: 'POCs' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'files', label: 'Files' },
    { id: 'actions', label: 'Actions' }
  ];

  return (
    <>
      {/* Search Input Bar in Navbar */}
      <div 
        onClick={() => setIsOpen(true)}
        className="relative flex-1 max-w-md mx-2 sm:mx-4 cursor-pointer group"
      >
        <div className="flex items-center w-full bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl px-3.5 py-2 text-xs text-slate-400 group-hover:text-slate-200 transition shadow-inner">
          <Search className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 mr-2.5 transition flex-shrink-0" />
          <span className="truncate flex-1 select-none font-sans">
            Search commands, POCs, tasks, files...
          </span>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700/80 rounded shadow-sm">
              Ctrl+K
            </kbd>
            <kbd className="inline-flex sm:hidden items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Global Command Palette / Spotlight Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type to search anything (e.g. 'docker ps', 'nginx', 'pocs', 'token', 'light')..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                className="w-full bg-transparent text-white text-sm sm:text-base placeholder-slate-500 focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Badges */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
              {FILTERS.map((f) => {
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setSelectedIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Results List */}
            <div 
              ref={resultsContainerRef}
              className="overflow-y-auto flex-1 p-3 space-y-1.5 scrollbar-thin"
            >
              {searchResults.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="font-semibold text-white text-sm">No matching results found</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No commands, pages, or records matched "{query}". Try searching for another keyword.
                  </p>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isHighlighted = idx === selectedIndex;

                  if (item.type === 'command') {
                    const isCopied = copiedId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group p-3 rounded-xl border transition cursor-pointer flex flex-col space-y-1.5 ${
                          isHighlighted
                            ? 'bg-slate-800/90 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                            : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-cyan-400 font-mono text-xs">{'>_'}</span>
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                              {item.categoryLabel}
                            </span>
                            {item.privilege === 'sudo' && (
                              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                                sudo
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => copyCommandText(item.command, item.id, e)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition ${
                                isCopied 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                  : 'bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700'
                              }`}
                              title="Copy command to clipboard"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Command line preview */}
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap break-all">
                          <span className="text-slate-500 mr-1.5">$</span>
                          <span>{item.command}</span>
                        </div>
                      </div>
                    );
                  }

                  // Default result item (Page, POC, Task, File, Action)
                  const Icon = item.icon || (
                    item.type === 'page' ? LayoutDashboard :
                    item.type === 'poc' ? Layers :
                    item.type === 'task' ? ListTodo :
                    item.type === 'file' ? FileCode : Sparkles
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isHighlighted
                          ? 'bg-slate-800/90 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                          : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === 'page' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          item.type === 'action' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          item.type === 'poc' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          item.type === 'task' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span className="truncate">{item.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
                              {item.category}
                            </span>
                          </div>
                          {item.desc && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <span className="text-cyan-400/80">
                {searchResults.length} matches found
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
