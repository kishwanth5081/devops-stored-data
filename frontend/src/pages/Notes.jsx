import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookOpen, Plus, Search, Layers, Calendar, Trash2, Edit3, X, FileText } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Runbook',
    poc_id: '',
    tags: ''
  });

  const categories = ['All', 'Runbook', 'Cheat Sheet', 'Documentation', 'Checklist', 'Architecture Guide'];

  const loadData = async () => {
    setLoading(true);
    try {
      const [notesData, pocsData] = await Promise.all([
        api.getNotes({ search, category }),
        api.getPocs().catch(() => [])
      ]);
      setNotes(notesData);
      setPocs(pocsData);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.createNote({
        ...form,
        tags: tagsArray,
        poc_id: form.poc_id || null
      });
      setIsCreateOpen(false);
      setForm({ title: '', content: '', category: 'Runbook', poc_id: '', tags: '' });
      loadData();
    } catch (err) {
      alert('Error creating note: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete note "${title}"?`)) return;
    try {
      await api.deleteNote(id);
      if (selectedNote?.id === id) setSelectedNote(null);
      loadData();
    } catch (err) {
      alert('Failed to delete note: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span>DevOps Runbooks & Documentation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store disaster recovery runbooks, troubleshooting checklists, and architectural notes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Runbook / Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation, runbooks, commands..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>Type: {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Column Layout: Notes List & Note Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notes List Column */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
              No documentation entries found.
            </div>
          ) : (
            notes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected 
                      ? 'bg-slate-900 border-purple-500/60 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {note.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug line-clamp-1">{note.title}</h3>

                  {note.poc_title && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400 truncate">
                      <Layers className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{note.poc_title}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Note Reader Column */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {selectedNote.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Author: {selectedNote.author_name || 'Admin'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedNote.title}</h2>
                </div>

                <button
                  onClick={() => handleDelete(selectedNote.id, selectedNote.title)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Formatted Markdown Content */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[300px]">
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center text-slate-500 text-xs">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">Select a Runbook or Guide</p>
              <p className="mt-1">Choose any item from the left panel to inspect the documentation.</p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE NOTE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Create Runbook / Documentation</span>
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSL Renewal & OCSP Stapling Troubleshooting Playbook"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Link to POC (optional)</label>
                  <select
                    value={form.poc_id}
                    onChange={(e) => setForm({ ...form, poc_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">None (Global SOP)</option>
                    {pocs.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Content (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  placeholder="# Runbook Title&#10;&#10;### Prerequisites&#10;- Sudo access&#10;&#10;### Recovery Steps&#10;1. Check service status: `systemctl status nginx`&#10;2. Reload configuration: `nginx -s reload`"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-600/20 transition"
                >
                  Save Runbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
