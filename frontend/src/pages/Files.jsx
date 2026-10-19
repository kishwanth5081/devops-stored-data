import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  FolderGit2, 
  UploadCloud, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  Edit2,
  Save,
  FileCode, 
  FileText, 
  Layers, 
  Check, 
  Copy, 
  X,
  ExternalLink,
  HardDrive
} from 'lucide-react';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // File Preview state
  const [previewData, setPreviewData] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [copied, setCopied] = useState(false);

  // Edit State
  const [editingFile, setEditingFile] = useState(null);
  const [editForm, setEditForm] = useState({
    original_name: '',
    category: '',
    poc_id: '',
    tags: '',
    content: ''
  });
  const [isTextFile, setIsTextFile] = useState(false);
  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Upload Form
  const [selectedPocId, setSelectedPocId] = useState('');
  const [uploadCategory, setUploadCategory] = useState('PDF Document');
  const fileInputRef = useRef(null);

  const categories = [
    'All',
    'PDF Document',
    'Script',
    'Config',
    'Documentation',
    'Diagram',
    'Log',
    'Certificate',
    'Other'
  ];

  const loadFiles = async () => {
    setLoading(true);
    try {
      const [filesData, pocsData] = await Promise.all([
        api.getFiles({ search, category }),
        api.getPocs().catch(() => [])
      ]);
      setFiles(filesData);
      setPocs(pocsData);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFiles();
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const inputFiles = fileInputRef.current?.files;
    if (!inputFiles || inputFiles.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < inputFiles.length; i++) {
      formData.append('files', inputFiles[i]);
    }
    if (selectedPocId) formData.append('poc_id', selectedPocId);
    if (uploadCategory) formData.append('category', uploadCategory);

    setUploading(true);
    try {
      await api.uploadFiles(formData);
      setIsUploadOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadFiles();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileAction = async (file) => {
    const isPdf = (file.file_type || '').toLowerCase() === '.pdf' || file.category === 'PDF Document';
    if (isPdf) {
      setSelectedPdf({
        id: file.id,
        name: file.original_name,
        size: file.file_size,
        category: file.category
      });
      return;
    }

    try {
      const data = await api.getFileContent(file.id);
      if (data.is_pdf) {
        setSelectedPdf({
          id: file.id,
          name: file.original_name,
          size: file.file_size,
          category: file.category
        });
      } else {
        setPreviewData(data);
        setCopied(false);
      }
    } catch (err) {
      alert('Cannot preview this file: ' + err.message);
    }
  };

  const handleCopyCode = () => {
    if (!previewData?.content) return;
    navigator.clipboard.writeText(previewData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Delete file "${fileName}"? This cannot be undone.`)) return;
    try {
      await api.deleteFile(fileId);
      if (selectedPdf?.id === fileId) setSelectedPdf(null);
      if (previewData?.id === fileId) setPreviewData(null);
      if (editingFile?.id === fileId) setEditingFile(null);
      loadFiles();
    } catch (err) {
      alert('Failed to delete file: ' + err.message);
    }
  };

  const handleOpenEdit = async (file) => {
    const isPdf = (file.file_type || '').toLowerCase() === '.pdf' || file.category === 'PDF Document';
    const textExtensions = ['.sh', '.py', '.ps1', '.yaml', '.yml', '.tf', '.json', '.conf', '.md', '.txt', '.env', '.ini', '.sql', '.js', '.ts', '.html', '.css', '.xml'];
    const hasTextExt = textExtensions.some(ext => (file.file_type || '').toLowerCase() === ext || (file.original_name || '').toLowerCase().endsWith(ext));
    const isText = !isPdf && (hasTextExt || file.category === 'Script' || file.category === 'Config' || file.category === 'Documentation');

    setEditingFile(file);
    setIsTextFile(isText);
    setEditForm({
      original_name: file.original_name || '',
      category: file.category || 'Other',
      poc_id: file.poc_id ? String(file.poc_id) : '',
      tags: file.tags || '',
      content: ''
    });

    if (isText) {
      setLoadingFileContent(true);
      try {
        const data = await api.getFileContent(file.id);
        if (data.content !== undefined) {
          setEditForm(prev => ({ ...prev, content: data.content }));
        }
      } catch (err) {
        console.error('Failed to load file content for editing:', err);
      } finally {
        setLoadingFileContent(false);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingFile) return;
    setSavingEdit(true);
    try {
      await api.updateFile(editingFile.id, {
        original_name: editForm.original_name,
        category: editForm.category,
        poc_id: editForm.poc_id ? parseInt(editForm.poc_id, 10) : null,
        tags: editForm.tags,
        ...(isTextFile ? { content: editForm.content } : {})
      });
      setEditingFile(null);
      if (previewData?.id === editingFile.id) {
        setPreviewData(prev => ({ ...prev, original_name: editForm.original_name, category: editForm.category, content: editForm.content }));
      }
      if (selectedPdf?.id === editingFile.id) {
        setSelectedPdf(prev => ({ ...prev, name: editForm.original_name, category: editForm.category }));
      }
      loadFiles();
    } catch (err) {
      alert('Failed to update file: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-emerald-400" />
            <span>DevOps Files & PDF Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store and view PDF documentation, POC reports, automation scripts, and server configuration files.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF / Script / Config</span>
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
            placeholder="Search files by name, type (.pdf, .sh, .yaml), or tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Files Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-300 text-sm font-semibold">No Files Stored Yet</p>
          <p className="text-slate-500 text-xs mt-1">Upload PDF reports, deployment scripts, Nginx configurations, or Ansible playbooks.</p>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Scrollable Table Area */}
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] min-h-[350px]">
            <table className="w-full text-left text-xs text-slate-300 min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 shadow-md">
                <tr>
                  <th className="p-3.5 bg-slate-950">File Name</th>
                  <th className="p-3.5 bg-slate-950">Category</th>
                  <th className="p-3.5 bg-slate-950">Size</th>
                  <th className="p-3.5 text-center bg-slate-950">Actions</th>
                  <th className="p-3.5 bg-slate-950">Linked POC</th>
                  <th className="p-3.5 bg-slate-950">Uploaded By</th>
                  <th className="p-3.5 bg-slate-950 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {files.map((file) => {
                  const isPdf = (file.file_type || '').toLowerCase() === '.pdf' || file.category === 'PDF Document';
                  return (
                    <tr key={file.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono text-white flex items-center gap-2">
                        {isPdf ? (
                          <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-xs">{file.original_name}</span>
                        {isPdf && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-rose-950 text-rose-400 border border-rose-800">
                            PDF
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isPdf ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          file.category === 'Script' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                          file.category === 'Config' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          file.category === 'Documentation' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {file.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">{formatBytes(file.file_size)}</td>
                      
                      {/* Prominent Actions Column (Edit, Delete, View, Download) */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(file)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition shadow-sm"
                            title="Edit file details and content"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(file.id, file.original_name)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 transition shadow-sm"
                            title="Delete file permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete</span>
                          </button>

                          {/* View Button (PDF Viewer or Code Viewer) */}
                          <button
                            onClick={() => handleFileAction(file)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                              isPdf 
                                ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                            }`}
                            title={isPdf ? 'View PDF document' : 'Preview code content'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Download Button */}
                          <a
                            href={api.getFileDownloadUrl(file.id)}
                            download
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition"
                            title="Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-400 truncate max-w-xs">{file.poc_title || '-'}</td>
                      <td className="p-3.5 text-slate-400 whitespace-nowrap">{file.uploaded_by_name || 'System'}</td>
                      <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap pr-4">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with File Count and Scroll Indicator */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Showing {files.length} vault files</span>
            <span className="text-slate-500 hidden sm:inline">↕ Use mouse wheel / scrollbar to view all files</span>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" />
                <span>Upload PDF or DevOps Resource</span>
              </h2>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Select File(s) *</label>
                <input
                  type="file"
                  multiple
                  required
                  ref={fileInputRef}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 bg-slate-950 p-2 rounded-lg border border-slate-700"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports .pdf, .sh, .py, .ps1, .yaml, .tf, .json, .conf, .md, images (Up to 50MB)
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Attach to POC (optional)</label>
                <select
                  value={selectedPocId}
                  onChange={(e) => setSelectedPocId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">None (General DevOps Vault)</option>
                  {pocs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED IN-APP PDF VIEWER MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-[95vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            {/* PDF Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{selectedPdf.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-semibold text-[10px] border border-rose-800">
                      PDF VIEWER
                    </span>
                    {selectedPdf.size && <span>{formatBytes(selectedPdf.size)}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
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
                  onClick={() => {
                    const file = files.find(f => f.id === selectedPdf.id);
                    if (file) handleOpenEdit(file);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-xs text-amber-300 border border-amber-800/80 transition"
                  title="Edit PDF details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(selectedPdf.id, selectedPdf.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-xs text-rose-300 border border-rose-800/80 transition"
                  title="Delete PDF file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>

                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Native Browser PDF Viewer */}
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

      {/* LIVE CODE PREVIEW MODAL (for Text, Scripts, YAML, JSON) */}
      {previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-sm font-bold text-white">{previewData.original_name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {previewData.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const file = files.find(f => f.id === previewData.id);
                    if (file) handleOpenEdit(file);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-xs text-amber-300 border border-amber-800/80 transition"
                  title="Edit file details and content"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(previewData.id, previewData.original_name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-xs text-rose-300 border border-rose-800/80 transition"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setPreviewData(null)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {previewData.content}
            </div>
          </div>
        </div>
      )}

      {/* EDIT FILE MODAL */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Edit File: <span className="font-mono text-amber-300">{editingFile.original_name}</span></span>
              </h2>
              <button 
                onClick={() => setEditingFile(null)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-medium text-slate-300 mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.original_name}
                  onChange={(e) => setEditForm({ ...editForm, original_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Attached POC</label>
                  <select
                    value={editForm.poc_id}
                    onChange={(e) => setEditForm({ ...editForm, poc_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">None (General Vault)</option>
                    {pocs.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="e.g. nginx, production, backup, automation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {isTextFile && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-300">File Content (Live Script / Config Editor)</label>
                    {loadingFileContent && <span className="text-[10px] text-amber-400 animate-pulse">Loading content...</span>}
                  </div>
                  <textarea
                    rows={10}
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    placeholder="Enter or modify file content..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Modifying content will rewrite the file on the server and update its file size.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow-lg shadow-amber-600/20 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
