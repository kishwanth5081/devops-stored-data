import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink, 
  UploadCloud, 
  Layers, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  LayoutList, 
  LayoutGrid, 
  Folder,
  FolderPlus,
  FolderOpen,
  FolderCheck,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Plus,
  Filter,
  MoveRight,
  SlidersHorizontal,
  ArrowRightLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';

const FOLDER_COLORS = [
  { id: 'rose', label: 'Rose Cyber', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-950 text-rose-300 border-rose-800' },
  { id: 'cyan', label: 'Cyan Tech', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', badge: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
  { id: 'emerald', label: 'Emerald SRE', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
  { id: 'amber', label: 'Amber Ops', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-950 text-amber-300 border-amber-800' },
  { id: 'purple', label: 'Violet K8s', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-950 text-purple-300 border-purple-800' },
  { id: 'blue', label: 'Blue Cloud', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-950 text-blue-300 border-blue-800' }
];

export default function PdfViewer() {
  const [pdfs, setPdfs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activePdf, setActivePdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default is 'grid' (Gallery)
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('all'); // 'all', 'uncategorized', or folder.id
  const [viewingPdf, setViewingPdf] = useState(null);
  const [isModalFullscreen, setIsModalFullscreen] = useState(false);
  const modalContainerRef = useRef(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderForm, setFolderForm] = useState({ name: '', description: '', color: 'rose' });
  const [folderSaving, setFolderSaving] = useState(false);

  // Folder detail view in Folders tab
  const [selectedFolderInTab, setSelectedFolderInTab] = useState(null);

  // Edit PDF Document State
  const [isEditPdfOpen, setIsEditPdfOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const [pdfEditForm, setPdfEditForm] = useState({
    original_name: '',
    folder_id: '',
    poc_id: '',
    tags: ''
  });
  const [editPdfSaving, setEditPdfSaving] = useState(false);

  const [pocs, setPocs] = useState([]);
  const [selectedPocId, setSelectedPocId] = useState('');
  const fileInputRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [filesData, foldersData, pocsData] = await Promise.all([
        api.getFiles({ category: 'All' }),
        api.getFolders({ category: 'pdf' }).catch(() => []),
        api.getPocs().catch(() => [])
      ]);
      const pdfFiles = filesData.filter(f => (f.file_type || '').toLowerCase() === '.pdf');
      setPdfs(pdfFiles);
      setFolders(foldersData);
      setPocs(pocsData);

      if (pdfFiles.length > 0 && !activePdf) {
        setActivePdf(pdfFiles[0]);
      }
    } catch (err) {
      console.error('Failed to load PDF documents & folders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsModalFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isModalFullscreen) {
      setIsModalFullscreen(true);
      if (modalContainerRef.current?.requestFullscreen && !document.fullscreenElement) {
        modalContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsModalFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleCloseViewer = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setIsModalFullscreen(false);
    setViewingPdf(null);
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getColorConfig = (colorId) => {
    return FOLDER_COLORS.find(c => c.id === colorId) || FOLDER_COLORS[0];
  };

  // Filtered PDFs based on search
  const filteredPdfs = pdfs.filter(pdf => {
    if (!search.trim()) return true;
    return (
      pdf.original_name.toLowerCase().includes(search.toLowerCase()) ||
      (pdf.poc_title && pdf.poc_title.toLowerCase().includes(search.toLowerCase())) ||
      (pdf.folder_name && pdf.folder_name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Folder creation / update handler
  const handleSaveFolder = async (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) {
      alert('Please enter a folder name.');
      return;
    }

    setFolderSaving(true);
    try {
      if (editingFolder) {
        await api.updateFolder(editingFolder.id, {
          name: folderForm.name.trim(),
          description: folderForm.description.trim(),
          color: folderForm.color
        });
      } else {
        await api.createFolder({
          name: folderForm.name.trim(),
          description: folderForm.description.trim(),
          color: folderForm.color,
          category: 'pdf'
        });
      }
      setIsFolderModalOpen(false);
      setEditingFolder(null);
      setFolderForm({ name: '', description: '', color: 'rose' });
      await loadData();
    } catch (err) {
      alert('Folder operation failed: ' + err.message);
    } finally {
      setFolderSaving(false);
    }
  };

  const handleOpenCreateFolder = () => {
    setEditingFolder(null);
    setFolderForm({ name: '', description: '', color: 'rose' });
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolder = (folder, e) => {
    if (e) e.stopPropagation();
    setEditingFolder(folder);
    setFolderForm({
      name: folder.name,
      description: folder.description || '',
      color: folder.color || 'rose'
    });
    setIsFolderModalOpen(true);
  };

  const handleDeleteFolder = async (folder, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete folder "${folder.name}"?\nPDF documents in this folder will NOT be deleted, but will be moved to unassigned.`)) {
      return;
    }
    try {
      await api.deleteFolder(folder.id);
      if (selectedFolderFilter === folder.id) setSelectedFolderFilter('all');
      if (selectedFolderInTab?.id === folder.id) setSelectedFolderInTab(null);
      await loadData();
    } catch (err) {
      alert('Failed to delete folder: ' + err.message);
    }
  };

  // Move PDF into or out of a folder
  const handleMovePdf = async (pdfId, folderId) => {
    try {
      let targetFolderName = null;
      if (folderId) {
        const target = folders.find(f => f.id === folderId);
        if (target) targetFolderName = target.name;
      }
      await api.updateFile(pdfId, {
        folder_id: folderId || null,
        folder_name: targetFolderName
      });
      await loadData();
    } catch (err) {
      alert('Failed to move document: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const inputFiles = fileInputRef.current?.files;
    if (!inputFiles || inputFiles.length === 0) {
      alert('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < inputFiles.length; i++) {
      formData.append('files', inputFiles[i]);
    }
    formData.append('category', 'PDF Document');
    if (selectedPocId) formData.append('poc_id', selectedPocId);
    if (uploadFolderId) {
      formData.append('folder_id', uploadFolderId);
      const target = folders.find(f => f.id === uploadFolderId);
      if (target) formData.append('folder_name', target.name);
    }

    setUploading(true);
    try {
      const res = await api.uploadFiles(formData);
      setIsUploadOpen(false);
      setUploadFolderId('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadData();
      if (res.files && res.files[0]) {
        const newlyUploaded = pdfs.find(p => p.id === res.files[0].id);
        if (newlyUploaded) setActivePdf(newlyUploaded);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePdf = async (pdfId, pdfName) => {
    if (!window.confirm(`Are you sure you want to delete "${pdfName}"?\nThis document will be permanently removed.`)) {
      return;
    }
    try {
      await api.deleteFile(pdfId);
      const updatedPdfs = pdfs.filter(p => p.id !== pdfId);
      setPdfs(updatedPdfs);
      if (activePdf?.id === pdfId) {
        setActivePdf(updatedPdfs.length > 0 ? updatedPdfs[0] : null);
      }
      await loadData();
    } catch (err) {
      alert('Failed to delete PDF document: ' + err.message);
    }
  };

  const handleOpenEditPdf = (pdf) => {
    if (!pdf) return;
    setEditingPdf(pdf);
    setPdfEditForm({
      original_name: pdf.original_name || '',
      folder_id: pdf.folder_id || '',
      poc_id: pdf.poc_id || '',
      tags: Array.isArray(pdf.tags) ? pdf.tags.join(', ') : (pdf.tags || '')
    });
    setIsEditPdfOpen(true);
  };

  const handleSaveEditPdf = async (e) => {
    e.preventDefault();
    if (!editingPdf) return;
    if (!pdfEditForm.original_name.trim()) {
      alert('Document name cannot be empty.');
      return;
    }

    setEditPdfSaving(true);
    try {
      let targetFolderName = null;
      if (pdfEditForm.folder_id) {
        const target = folders.find(f => f.id === pdfEditForm.folder_id);
        if (target) targetFolderName = target.name;
      }

      const tagsArray = pdfEditForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await api.updateFile(editingPdf.id, {
        original_name: pdfEditForm.original_name.trim(),
        folder_id: pdfEditForm.folder_id || null,
        folder_name: targetFolderName,
        poc_id: pdfEditForm.poc_id || null,
        tags: tagsArray
      });

      await loadData();
      if (activePdf?.id === editingPdf.id) {
        setActivePdf(prev => ({
          ...prev,
          original_name: pdfEditForm.original_name.trim(),
          folder_id: pdfEditForm.folder_id || null,
          folder_name: targetFolderName,
          poc_id: pdfEditForm.poc_id || null,
          tags: tagsArray
        }));
      }

      setIsEditPdfOpen(false);
      setEditingPdf(null);
    } catch (err) {
      alert('Failed to update PDF document: ' + err.message);
    } finally {
      setEditPdfSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <FileText className="w-6 h-6 text-rose-400" />
            </div>
            <span>DevOps PDF Documents & Architecture Viewer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, view, and read all DevOps Proof of Concept (POC) documentation, runbooks, and diagrams in native PDF format.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {/* Quick Search */}
          <div className="relative w-56 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PDF documents..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white text-base font-bold">No PDF Documents Found</h3>
          <p className="text-slate-400 text-xs mt-1">Upload architecture specs, POC reports, or compliance documentation.</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg shadow"
            >
              Upload First PDF
            </button>
          </div>
        </div>
      ) : (

        /* ============================================================ */
        /* GALLERY / GRID CARD VIEW ONLY                                */
        /* ============================================================ */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => setViewingPdf(pdf)}
                className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-rose-500/60 p-5 flex flex-col justify-between shadow-lg hover:shadow-rose-950/30 transition group cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-110 transition">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {pdf.folder_name && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono truncate max-w-[120px]">
                          📁 {pdf.folder_name}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditPdf(pdf); }}
                        className="p-1 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                        title={`Edit ${pdf.original_name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePdf(pdf.id, pdf.original_name); }}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                        title={`Delete ${pdf.original_name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-rose-400 transition">
                    {pdf.original_name.replace('.pdf', '')}
                  </h3>

                  {pdf.poc_title && (
                    <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5 truncate">
                      <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{pdf.poc_title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-500 font-mono text-[11px]">
                    <span>{formatBytes(pdf.file_size)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewingPdf(pdf); }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-md shadow-rose-600/20"
                    >
                      View PDF
                    </button>
                    <a
                      href={api.getFileDownloadUrl(pdf.id)}
                      download
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT FOLDER MODAL */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-cyan-400" />
                <span>{editingFolder ? 'Edit Folder' : 'Create New Document Folder'}</span>
              </h2>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Folder Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={folderForm.name}
                  onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                  placeholder="e.g. High Availability Architecture, Runbooks"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Description (optional)</label>
                <textarea
                  rows="2"
                  value={folderForm.description}
                  onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                  placeholder="e.g. Cluster specifications and failover documentation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-2">Folder Accent Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {FOLDER_COLORS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFolderForm({ ...folderForm, color: c.id })}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left cursor-pointer transition ${
                        folderForm.color === c.id
                          ? 'border-white bg-slate-800 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Folder className={`w-4 h-4 ${c.text}`} />
                      <span className="text-[11px] truncate">{c.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={folderSaving}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {folderSaving ? 'Saving...' : editingFolder ? 'Save Changes' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD PDF MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>Upload PDF Document</span>
              </h2>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Select PDF File *</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  ref={fileInputRef}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-rose-400 hover:file:bg-slate-700 bg-slate-950 p-2 rounded-lg border border-slate-700"
                />
              </div>


              <div>
                <label className="block font-medium text-slate-300 mb-1">Attach to DevOps POC (optional)</label>
                <select
                  value={selectedPocId}
                  onChange={(e) => setSelectedPocId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="">None (General PDF Document)</option>
                  {pocs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shadow-lg shadow-rose-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PDF MODAL */}
      {isEditPdfOpen && editingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-cyan-400" />
                <span>Edit Document / POC Details</span>
              </h2>
              <button 
                onClick={() => { setIsEditPdfOpen(false); setEditingPdf(null); }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPdf} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Document Title / File Name *</label>
                <input
                  type="text"
                  required
                  value={pdfEditForm.original_name}
                  onChange={(e) => setPdfEditForm({ ...pdfEditForm, original_name: e.target.value })}
                  placeholder="e.g. POC-1 Boomi Multi-node Architecture.pdf"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Folder / Architecture Category</label>
                <select
                  value={pdfEditForm.folder_id}
                  onChange={(e) => setPdfEditForm({ ...pdfEditForm, folder_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="">📂 No Folder (Root / Unassigned)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>📁 {f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Associated DevOps POC</label>
                <select
                  value={pdfEditForm.poc_id}
                  onChange={(e) => setPdfEditForm({ ...pdfEditForm, poc_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="">None (Standalone PDF Document)</option>
                  {pocs.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={pdfEditForm.tags}
                  onChange={(e) => setPdfEditForm({ ...pdfEditForm, tags: e.target.value })}
                  placeholder="e.g. boomi, gateway, ha, runbook"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsEditPdfOpen(false); setEditingPdf(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editPdfSaving}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {editPdfSaving ? 'Saving...' : 'Save Document Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* IN-APP FULL-SCREEN PDF VIEWER MODAL */}
      {viewingPdf && (
        <div 
          ref={modalContainerRef}
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
            isModalFullscreen 
              ? 'p-0 bg-slate-950 w-screen h-screen' 
              : 'p-2 sm:p-4 bg-black/85 backdrop-blur-md'
          }`}
        >
          <div className={`bg-slate-900 border flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
            isModalFullscreen 
              ? 'w-screen h-screen rounded-none border-0' 
              : 'w-full max-w-[96vw] h-[95vh] rounded-2xl border-slate-700'
          }`}>
            
            {/* Top Toolbar */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold text-[10px] border border-rose-800 flex-shrink-0">
                      PDF DOCUMENT
                    </span>
                    {viewingPdf.folder_name && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono truncate max-w-[150px]">
                        📁 {viewingPdf.folder_name}
                      </span>
                    )}
                  </div>
                  <h3 className="font-mono text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-2xl mt-0.5">
                    {viewingPdf.original_name}
                  </h3>
                </div>
              </div>

              {/* Action Buttons: Full Screen, Download, Edit, Delete, Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-xs text-indigo-300 border border-indigo-800 transition font-semibold cursor-pointer shadow-sm"
                  title={isModalFullscreen ? "Exit Full Screen" : "Full Screen Mode"}
                >
                  {isModalFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Exit Full Screen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Screen</span>
                    </>
                  )}
                </button>

                <a
                  href={api.getFileDownloadUrl(viewingPdf.id)}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-xs text-emerald-300 border border-emerald-800 transition font-semibold cursor-pointer shadow-sm"
                  title="Download PDF document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => handleOpenEditPdf(viewingPdf)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-xs text-cyan-300 border border-cyan-800 transition font-semibold cursor-pointer shadow-sm"
                  title="Edit document name, folder, or linked POC"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    handleDeletePdf(viewingPdf.id, viewingPdf.original_name);
                    handleCloseViewer();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-xs text-rose-300 border border-rose-800 transition font-semibold cursor-pointer shadow-sm"
                  title="Delete this PDF document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={handleCloseViewer}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1 cursor-pointer"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Iframe Viewport */}
            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                key={viewingPdf.id}
                src={`${api.getFileViewUrl(viewingPdf.id)}#toolbar=1&navpanes=1`}
                title={viewingPdf.original_name}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
