import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  FolderGit2, 
  CheckSquare, 
  X,
  Trash2,
  Edit3,
  Download,
  Printer,
  FileCheck,
  Shield,
  Server
} from 'lucide-react';

export default function Pocs({ onNewTask, onUploadFile }) {
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [selectedPoc, setSelectedPoc] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [docTab, setDocTab] = useState('doc'); // 'doc' or 'pdf'

  // Edit POC Form State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'Infrastructure',
    status: 'Validated',
    environment: 'Multi-Cloud',
    tags: '',
    repository_url: ''
  });

  // New POC Form State
  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'Infrastructure',
    status: 'Validated',
    environment: 'Multi-Cloud',
    tags: '',
    repository_url: ''
  });

  const categories = ['All', 'Infrastructure', 'Security', 'Networking', 'Monitoring', 'CI/CD', 'Database'];
  const statuses = ['All', 'Production-Ready', 'Validated', 'Draft'];

  const loadPocs = async () => {
    setLoading(true);
    try {
      const data = await api.getPocs({ search, category, status });
      setPocs(data);
    } catch (err) {
      console.error('Failed to load POCs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPocs();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPocs();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.createPoc({
        ...form,
        tags: tagsArray
      });
      setIsCreateOpen(false);
      setForm({
        title: '',
        summary: '',
        description: '',
        category: 'Infrastructure',
        status: 'Validated',
        environment: 'Multi-Cloud',
        tags: '',
        repository_url: ''
      });
      loadPocs();
    } catch (err) {
      alert('Error creating POC: ' + err.message);
    }
  };

  const openPocDetails = async (pocId) => {
    try {
      const details = await api.getPoc(pocId);
      setSelectedPoc(details);
      setIsDetailOpen(true);
    } catch (err) {
      alert('Failed to load POC details: ' + err.message);
    }
  };

  const handleDeletePoc = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deletePoc(id);
      if (isDetailOpen && selectedPoc?.poc.id === id) {
        setIsDetailOpen(false);
      }
      loadPocs();
    } catch (err) {
      alert('Failed to delete POC: ' + err.message);
    }
  };

  const handleOpenEdit = (poc) => {
    if (!poc) return;
    setEditForm({
      title: poc.title || '',
      summary: poc.summary || '',
      description: poc.description || '',
      category: poc.category || 'Infrastructure',
      status: poc.status || 'Validated',
      environment: poc.environment || 'Multi-Cloud',
      tags: Array.isArray(poc.tags) ? poc.tags.join(', ') : (poc.tags || ''),
      repository_url: poc.repository_url || ''
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPoc?.poc) return;
    setEditSaving(true);
    try {
      const tagsArray = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.updatePoc(selectedPoc.poc.id, {
        ...editForm,
        tags: tagsArray
      });
      const updatedDetails = await api.getPoc(selectedPoc.poc.id);
      setSelectedPoc(updatedDetails);
      setIsEditOpen(false);
      loadPocs();
    } catch (err) {
      alert('Error updating POC: ' + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    const attachedPdfs = (selectedPoc?.files || []).filter(f => (f.file_type || '').toLowerCase() === '.pdf');
    if (attachedPdfs.length > 0) {
      const a = document.createElement('a');
      a.href = api.getFileDownloadUrl(attachedPdfs[0].id);
      a.download = attachedPdfs[0].original_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>DevOps POCs Repository</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, document, and manage all infrastructure, security, and cloud Proofs of Concept.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Proof of Concept</span>
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
            placeholder="Search POC titles, tags, summaries, architectures..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>Status: {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* POCs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pocs.length === 0 ? (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-300 text-sm font-semibold">No POCs Found</p>
          <p className="text-slate-500 text-xs mt-1">Try adjusting your filters or create a new DevOps POC.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pocs.map((poc) => (
            <div
              key={poc.id}
              className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 hover:shadow-xl transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${
                    poc.category === 'Security' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                    poc.category === 'Networking' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                    poc.category === 'Monitoring' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    'bg-blue-950 text-blue-300 border-blue-800'
                  }`}>
                    {poc.category}
                  </span>

                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    poc.status === 'Production-Ready' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    poc.status === 'Validated' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {poc.status}
                  </span>
                </div>

                <h3 
                  onClick={() => openPocDetails(poc.id)}
                  className="text-sm font-bold text-white group-hover:text-cyan-400 cursor-pointer transition line-clamp-2"
                >
                  {poc.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                  {poc.summary || 'No summary provided.'}
                </p>

                {/* Tags */}
                {poc.tags && poc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {poc.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                        #{tag}
                      </span>
                    ))}
                    {poc.tags.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{poc.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="bg-slate-950/60 px-5 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1" title="Attached tasks">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>{poc.task_count || 0}</span>
                  </span>
                  <span className="flex items-center gap-1" title="Attached files & scripts">
                    <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{poc.file_count || 0}</span>
                  </span>
                </div>

                <button
                  onClick={() => openPocDetails(poc.id)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-xs flex items-center gap-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE POC MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Create New Proof of Concept (POC)</span>
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">POC Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POC-14: Zero-Trust Mesh with WireGuard and Consul"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Environment</label>
                  <select
                    value={form.environment}
                    onChange={(e) => setForm({ ...form, environment: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Multi-Cloud">Multi-Cloud</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="Linux">Linux Bare-Metal</option>
                    <option value="Kubernetes">Kubernetes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Executive Summary</label>
                <input
                  type="text"
                  placeholder="Brief 1-sentence technical purpose..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Nginx, Docker, Terraform, SSL, WireGuard"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Repository URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/company/repo"
                  value={form.repository_url}
                  onChange={(e) => setForm({ ...form, repository_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Detailed Technical Documentation (Markdown)</label>
                <textarea
                  rows={6}
                  placeholder="# Technical Spec&#10;&#10;## Architecture&#10;Describe components, prerequisites, and execution commands..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-600/20 transition"
                >
                  Save POC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POC ARCHITECTURE PDF DOCUMENT VIEWER */}
      {isDetailOpen && selectedPoc && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md overflow-hidden">
          {/* Top PDF Document Viewer Toolbar */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                <FileText className="w-5 h-5 text-rose-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold text-[10px] border border-rose-800 tracking-wide uppercase">
                    PDF ARCHITECTURE SPECIFICATION
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    REF: DOC-POC-{selectedPoc.poc.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white truncate max-w-md sm:max-w-xl">
                  {selectedPoc.poc.title}
                </h3>
              </div>
            </div>

            {/* Document / Attached PDF view switcher if attached PDF exists */}
            {selectedPoc.files.some(f => (f.file_type || '').toLowerCase() === '.pdf') && (
              <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setDocTab('doc')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    docTab === 'doc' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📄 Specification Sheet
                </button>
                <button
                  onClick={() => setDocTab('pdf')}
                  className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                    docTab === 'pdf' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📑 Attached PDF Blueprint
                </button>
              </div>
            )}

            {/* Prominent Action Bar: Download, Edit, Delete, Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 text-xs text-emerald-300 border border-emerald-800 transition font-semibold cursor-pointer shadow-sm"
                title="Download PDF or save printable copy"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={() => handleOpenEdit(selectedPoc.poc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 text-xs text-cyan-300 border border-cyan-800 transition font-semibold cursor-pointer shadow-sm"
                title="Edit POC specification and parameters"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDeletePoc(selectedPoc.poc.id, selectedPoc.poc.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/90 hover:bg-rose-900 text-xs text-rose-300 border border-rose-800 transition font-semibold cursor-pointer shadow-sm"
                title="Delete this Proof of Concept"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Body Area */}
          <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-6 lg:p-8">
            {docTab === 'pdf' && selectedPoc.files.some(f => (f.file_type || '').toLowerCase() === '.pdf') ? (
              <div className="w-full h-full max-w-5xl mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
                <iframe
                  src={api.getFileViewUrl(selectedPoc.files.find(f => (f.file_type || '').toLowerCase() === '.pdf').id)}
                  title={selectedPoc.poc.title}
                  className="w-full h-full min-h-[75vh] border-0"
                />
              </div>
            ) : (
              /* High-Fidelity Printable Architectural PDF Document Sheet */
              <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 overflow-hidden font-sans my-2">
                {/* PDF Header Strip */}
                <div className="h-3 bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600" />
                
                <div className="p-8 sm:p-12 space-y-8">
                  {/* Document Meta Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                          DevOps Architecture Specification
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          CLASSIFICATION: INTERNAL
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {selectedPoc.poc.title}
                      </h1>
                    </div>

                    <div className="text-right flex-shrink-0 text-xs font-mono text-slate-600 space-y-1">
                      <div><strong className="text-slate-800">DOCUMENT ID:</strong> DOC-{selectedPoc.poc.id.slice(0, 8).toUpperCase()}</div>
                      <div><strong className="text-slate-800">REVISION:</strong> 1.0 (VERIFIED)</div>
                      <div><strong className="text-slate-800">DATE:</strong> {new Date(selectedPoc.poc.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>

                  {/* Architecture Metadata Spec Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Category</span>
                      <span className="font-semibold text-sky-800 text-sm mt-0.5 block">{selectedPoc.poc.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mt-0.5 ${
                        selectedPoc.poc.status === 'Production-Ready' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        selectedPoc.poc.status === 'Validated' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {selectedPoc.poc.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Environment</span>
                      <span className="font-mono font-medium text-slate-800 mt-0.5 block">{selectedPoc.poc.environment || 'Multi-Cloud'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Author / Lead</span>
                      <span className="font-medium text-slate-800 mt-0.5 block">{selectedPoc.poc.author_name || 'Kishwanth Aderu'}</span>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  {selectedPoc.poc.summary && (
                    <div className="border-l-4 border-sky-600 bg-sky-50/70 p-5 rounded-r-xl">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2">
                        1. Executive Summary & Problem Statement
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedPoc.poc.summary}
                      </p>
                    </div>
                  )}

                  {/* Technical Specifications & Markdown Content */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200 mb-3">
                      2. Technical Specifications & Architecture Blueprint
                    </h4>
                    <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
                      {selectedPoc.poc.description || 'No detailed technical documentation or specifications recorded.'}
                    </div>
                  </div>

                  {/* Implementation Tasks */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200 mb-3 flex items-center justify-between">
                      <span>3. Implementation Tasks & Validation Milestones</span>
                      <span className="text-[11px] font-normal text-slate-500 font-mono">({selectedPoc.tasks.length} tasks registered)</span>
                    </h4>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {selectedPoc.tasks.length > 0 ? (
                        selectedPoc.tasks.map((task) => (
                          <div key={task.id} className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-slate-900">{task.title}</span>
                              <span className="text-slate-500 ml-2 text-[11px]">Assigned to: {task.assigned_name || 'Unassigned'}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              task.status === 'In_Progress' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-xs text-slate-500 italic bg-slate-50 text-center">
                          No tasks currently linked to this Proof of Concept.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attached Blueprints & Files */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-200 mb-3 flex items-center justify-between">
                      <span>4. Attached Blueprints, Runbooks & Documentation</span>
                      <span className="text-[11px] font-normal text-slate-500 font-mono">({selectedPoc.files.length} artifacts)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPoc.files.length > 0 ? (
                        selectedPoc.files.map((file) => {
                          const isPdf = (file.file_type || '').toLowerCase() === '.pdf' || file.category === 'PDF Document';
                          return (
                            <div key={file.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-2 rounded-lg flex-shrink-0 ${
                                  isPdf ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {isPdf ? <FileText className="w-4 h-4" /> : <FolderGit2 className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 truncate">{file.original_name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">{(file.file_size / 1024).toFixed(1)} KB • {file.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isPdf && (
                                  <button
                                    onClick={() => setDocTab('pdf')}
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] shadow-sm transition cursor-pointer"
                                  >
                                    View PDF
                                  </button>
                                )}
                                <a
                                  href={api.getFileDownloadUrl(file.id)}
                                  download
                                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-[11px] transition cursor-pointer"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 p-4 text-xs text-slate-500 italic bg-slate-50 rounded-xl text-center border border-slate-200">
                          No external files or runbooks attached to this POC.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Footer Sign-off */}
                  <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                    <div>
                      <span>DevOps Stored Data Platform • Verified Architectural Proof of Concept</span>
                    </div>
                    <div className="font-mono text-slate-600">
                      STATUS: APPROVED FOR REPOSITORY ARCHIVAL
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT POC MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <span>Edit Proof of Concept (POC)</span>
              </h2>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">POC Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Boomi Multi-node Active-Active API Gateway Architecture"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Target Environment</label>
                  <input
                    type="text"
                    value={editForm.environment}
                    onChange={(e) => setEditForm({ ...editForm, environment: e.target.value })}
                    placeholder="e.g. Azure East-US / AWS EKS"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={editForm.summary}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  placeholder="High-level architecture objectives, validation outcomes, and business impact..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="boomi, high-availability, kubernetes"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={editForm.repository_url}
                    onChange={(e) => setEditForm({ ...editForm, repository_url: e.target.value })}
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Detailed Technical Documentation & Runbook (Markdown)</label>
                <textarea
                  rows={7}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="# Technical Specifications&#10;&#10;## Architecture Components&#10;Describe infra, network, config..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {editSaving ? 'Saving Changes...' : 'Save POC Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED IN-APP PDF VIEWER MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-[95vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{selectedPdf.name}</h3>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    PDF DOCUMENT VIEWER
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={api.getFileViewUrl(selectedPdf.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                  title="Open PDF in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">New Tab</span>
                </a>

                <a
                  href={api.getFileDownloadUrl(selectedPdf.id)}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 transition"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                src={api.getFileViewUrl(selectedPdf.id)}
                title={selectedPdf.name}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
