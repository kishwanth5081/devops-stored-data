import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  Layers, 
  X, 
  Trash2, 
  Edit2, 
  FileText, 
  UploadCloud, 
  ExternalLink, 
  Download, 
  Eye, 
  Paperclip, 
  FolderGit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); // { task, files }
  const [selectedPdf, setSelectedPdf] = useState(null); // { id, name, size }
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // New Task form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Medium',
    category: 'Infrastructure',
    poc_id: '',
    assigned_to: '',
    due_date: '',
    tags: ''
  });
  const [selectedCreatePdfFile, setSelectedCreatePdfFile] = useState(null);

  // Edit Task form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'Medium',
    category: 'Infrastructure',
    poc_id: '',
    assigned_to: '',
    due_date: '',
    tags: ''
  });

  const taskFileInputRef = useRef(null);
  const createPdfInputRef = useRef(null);

  const statusOptions = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-800 text-slate-300 border-slate-700' },
    { id: 'In_Progress', label: 'In Progress', color: 'bg-blue-950 text-blue-300 border-blue-800' },
    { id: 'Review', label: 'Review & Testing', color: 'bg-amber-950 text-amber-300 border-amber-800' },
    { id: 'Completed', label: 'Completed', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    { id: 'Blocked', label: 'Blocked / On Hold', color: 'bg-rose-950 text-rose-300 border-rose-800' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, usersData, pocsData] = await Promise.all([
        api.getTasks({ search, priority: priorityFilter }),
        api.getUsers().catch(() => []),
        api.getPocs().catch(() => [])
      ]);
      setTasks(tasksData);
      setUsers(usersData);
      setPocs(pocsData);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Quick Inline Status Update
  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      if (selectedTaskDetails?.task.id === taskId) {
        setSelectedTaskDetails(prev => ({
          ...prev,
          task: { ...prev.task, status: newStatus }
        }));
      }
      await api.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
      loadData();
    }
  };

  // Create Task
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      if (selectedCreatePdfFile) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description || '');
        formData.append('status', form.status || 'Backlog');
        formData.append('priority', form.priority || 'Medium');
        formData.append('category', form.category || 'Infrastructure');
        if (form.poc_id) formData.append('poc_id', form.poc_id);
        if (form.assigned_to) formData.append('assigned_to', form.assigned_to);
        if (form.due_date) formData.append('due_date', form.due_date);
        formData.append('tags', JSON.stringify(tagsArray));
        formData.append('pdf', selectedCreatePdfFile);
        
        await api.createTask(formData);
      } else {
        await api.createTask({
          ...form,
          tags: tagsArray,
          poc_id: form.poc_id || null,
          assigned_to: form.assigned_to || null
        });
      }

      setIsCreateOpen(false);
      setSelectedCreatePdfFile(null);
      if (createPdfInputRef.current) createPdfInputRef.current.value = '';
      setForm({
        title: '',
        description: '',
        status: 'Backlog',
        priority: 'Medium',
        category: 'Infrastructure',
        poc_id: '',
        assigned_to: '',
        due_date: '',
        tags: ''
      });
      loadData();
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };

  // Open Edit Task Modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'Backlog',
      priority: task.priority || 'Medium',
      category: task.category || 'Infrastructure',
      poc_id: task.poc_id || '',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
      tags: Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags || '')
    });
  };

  // Submit Edit Task
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const tagsArray = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.updateTask(editingTask.id, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        category: editForm.category,
        poc_id: editForm.poc_id || null,
        assigned_to: editForm.assigned_to || null,
        due_date: editForm.due_date || null,
        tags: tagsArray
      });

      setEditingTask(null);
      loadData();
      if (selectedTaskDetails?.task.id === editingTask.id) {
        openTaskDetails(editingTask.id);
      }
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the task "${title}"?\nThis action will also remove any linked task files.`)) return;
    try {
      await api.deleteTask(id);
      if (selectedTaskDetails?.task.id === id) {
        setSelectedTaskDetails(null);
      }
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
      loadData();
    }
  };

  // Open Task Details & Document Vault
  const openTaskDetails = async (taskId) => {
    try {
      const data = await api.getTask(taskId);
      setSelectedTaskDetails(data);
    } catch (err) {
      alert('Failed to fetch task details: ' + err.message);
    }
  };

  // Upload Document for the active task
  const handleTaskDocUpload = async (e) => {
    e.preventDefault();
    const inputFiles = taskFileInputRef.current?.files;
    if (!inputFiles || inputFiles.length === 0) {
      alert('Please select a file or PDF document to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < inputFiles.length; i++) {
      formData.append('files', inputFiles[i]);
    }
    formData.append('task_id', selectedTaskDetails.task.id);
    if (selectedTaskDetails.task.poc_id) {
      formData.append('poc_id', selectedTaskDetails.task.poc_id);
    }

    setUploadingDoc(true);
    try {
      await api.uploadFiles(formData);
      if (taskFileInputRef.current) taskFileInputRef.current.value = '';
      const updated = await api.getTask(selectedTaskDetails.task.id);
      setSelectedTaskDetails(updated);
      loadData();
    } catch (err) {
      alert('Document upload failed: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteTaskDoc = async (fileId, fileName) => {
    if (!window.confirm(`Delete document "${fileName}" from this task?`)) return;
    try {
      await api.deleteFile(fileId);
      const updated = await api.getTask(selectedTaskDetails.task.id);
      setSelectedTaskDetails(updated);
      loadData();
    } catch (err) {
      alert('Failed to delete document: ' + err.message);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Filter tasks locally by status
  const displayedTasks = tasks.filter(task => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CheckSquare className="w-6 h-6 text-blue-400" />
            </div>
            <span>DevOps Tasks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage DevOps tasks, attach technical specifications, view PDF documents, and track execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, description, or tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span className="text-[11px] text-slate-500 font-mono px-2">
            {displayedTasks.length} {displayedTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* TASKS LIST TABLE (NO KANBAN COLUMNS) */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayedTasks.length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center">
          <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-white text-base font-bold">No Tasks Found</h3>
          <p className="text-slate-400 text-xs mt-1">Get started by creating your first DevOps task with runbooks or PDF specifications.</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Task</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] min-h-[350px]">
            <table className="w-full text-left text-xs text-slate-300 min-w-[1100px]">
              <thead className="sticky top-0 z-20 bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 shadow-md">
                <tr>
                  <th className="p-3.5 bg-slate-950">Task Details</th>
                  <th className="p-3.5 bg-slate-950">Status</th>
                  <th className="p-3.5 bg-slate-950">Priority</th>
                  <th className="p-3.5 bg-slate-950">PDF & Documents</th>
                  <th className="p-3.5 bg-slate-950">Linked POC</th>
                  <th className="p-3.5 bg-slate-950">Assigned To</th>
                  <th className="p-3.5 bg-slate-950">Due Date</th>
                  <th className="p-3.5 text-right bg-slate-950 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {displayedTasks.map((task) => {
                  const currentStatus = statusOptions.find(s => s.id === task.status) || {
                    id: task.status,
                    label: task.status?.replace('_', ' ') || 'Backlog',
                    color: 'bg-slate-800 text-slate-300 border-slate-700'
                  };

                  return (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition group">
                      
                      {/* Title & Description & Tags */}
                      <td className="p-3.5 max-w-sm">
                        <div 
                          onClick={() => openTaskDetails(task.id)}
                          className="font-semibold text-white cursor-pointer hover:text-cyan-400 transition leading-snug"
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        )}
                        {Array.isArray(task.tags) && task.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5 whitespace-nowrap">
                        <select
                          value={task.status}
                          onChange={(e) => handleQuickStatusChange(task.id, e.target.value)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer focus:outline-none transition ${currentStatus.color}`}
                        >
                          {statusOptions.map(s => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Priority */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          task.priority === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          task.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          task.priority === 'Medium' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      {/* PDF & Documents Column */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {task.pdf_file_id ? (
                            <button
                              onClick={() => setSelectedPdf({
                                id: task.pdf_file_id,
                                name: task.pdf_file_name || `${task.title}.pdf`,
                                size: task.pdf_file_size
                              })}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-sm transition"
                              title={`View PDF: ${task.pdf_file_name || 'Task Document'}`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View PDF</span>
                            </button>
                          ) : null}

                          <button
                            onClick={() => openTaskDetails(task.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                              task.file_count > 0 
                                ? 'bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-mono' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                            title="Manage task documents and attachments"
                          >
                            <Paperclip className="w-3 h-3" />
                            <span>{task.file_count || 0} Docs</span>
                          </button>
                        </div>
                      </td>

                      {/* Linked POC */}
                      <td className="p-3.5 text-slate-400 truncate max-w-[160px] whitespace-nowrap">
                        {task.poc_title ? (
                          <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono truncate" title={task.poc_title}>
                            <Layers className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{task.poc_title}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Assigned To */}
                      <td className="p-3.5 text-slate-300 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{task.assigned_name || 'Unassigned'}</span>
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                        {task.due_date ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{task.due_date}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      {/* Actions Column (View, Edit, Delete) */}
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        {/* View PDF Quick Action */}
                        {task.pdf_file_id && (
                          <button
                            onClick={() => setSelectedPdf({
                              id: task.pdf_file_id,
                              name: task.pdf_file_name || `${task.title}.pdf`,
                              size: task.pdf_file_size
                            })}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition inline-block"
                            title="Open attached PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => openTaskDetails(task.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition inline-block"
                          title="View task details & documents"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Task */}
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-950 text-blue-400 hover:text-blue-300 transition inline-block"
                          title="Edit this task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Task */}
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition inline-block"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Task Count and Scroll Guidance */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Showing {displayedTasks.length} tasks</span>
            <span className="text-slate-500 hidden sm:inline">↕ Use mouse wheel / scrollbar to view all tasks</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CREATE TASK MODAL                                            */}
      {/* ============================================================ */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <span>Add New DevOps Task</span>
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Configure Let's Encrypt automated hook on Port 443"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Steps, acceptance criteria, or error logs..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Assign To</label>
                  <select
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Link to DevOps POC (optional)</label>
                <select
                  value={form.poc_id}
                  onChange={(e) => setForm({ ...form, poc_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Independent Task)</option>
                  {pocs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Nginx, SSL, Linux, Docker"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Attach PDF Document to Task (PDF Type) */}
              <div className="p-3.5 bg-slate-950/80 border border-rose-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-rose-400 flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span>Attach Task PDF Document (PDF Type)</span>
                  </label>
                  <span className="text-[10px] text-rose-400/80 font-mono">Optional • .pdf format</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Upload an architecture doc, runbook, or POC report in PDF format to view directly within the task list.
                </p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  ref={createPdfInputRef}
                  onChange={(e) => setSelectedCreatePdfFile(e.target.files[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-rose-950/80 file:text-rose-300 hover:file:bg-rose-900 bg-slate-900 p-1.5 rounded-lg border border-slate-700"
                />
                {selectedCreatePdfFile && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1.5 rounded">
                    <span className="truncate">✓ PDF: {selectedCreatePdfFile.name}</span>
                    <span>({formatBytes(selectedCreatePdfFile.size)})</span>
                  </div>
                )}
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT TASK MODAL                                              */}
      {/* ============================================================ */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <span>Edit DevOps Task</span>
              </h2>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Assign To</label>
                  <select
                    value={editForm.assigned_to}
                    onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Link to DevOps POC (optional)</label>
                <select
                  value={editForm.poc_id}
                  onChange={(e) => setEditForm({ ...editForm, poc_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Independent Task)</option>
                  {pocs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Nginx, SSL, Linux, Docker"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TASK DETAILS & DOCUMENT VAULT MODAL                          */}
      {/* ============================================================ */}
      {selectedTaskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    selectedTaskDetails.task.priority === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    selectedTaskDetails.task.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {selectedTaskDetails.task.priority} Priority
                  </span>

                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    Status: {selectedTaskDetails.task.status?.replace('_', ' ')}
                  </span>

                  {selectedTaskDetails.task.due_date && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Due: {selectedTaskDetails.task.due_date}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">
                  {selectedTaskDetails.task.title}
                </h2>

                <div className="text-xs text-slate-400 mt-1 flex items-center gap-4">
                  <span>Assigned to: <strong className="text-slate-200">{selectedTaskDetails.task.assigned_name || 'Unassigned'}</strong></span>
                  {selectedTaskDetails.task.poc_title && (
                    <span className="text-cyan-400 flex items-center gap-1 truncate">
                      <Layers className="w-3 h-3 flex-shrink-0" />
                      {selectedTaskDetails.task.poc_title}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedTaskDetails.task);
                    setSelectedTaskDetails(null);
                  }}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedTaskDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Task Description */}
              {selectedTaskDetails.task.description && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px] tracking-wider">
                    Task Objectives & Acceptance Criteria:
                  </span>
                  {selectedTaskDetails.task.description}
                </div>
              )}

              {/* Upload Document / PDF for this Task */}
              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-rose-400" />
                    <span>Upload Document or PDF for this Task</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">PDF, DOCX, TXT, MD, YAML, SH</span>
                </div>

                <form onSubmit={handleTaskDocUpload} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <input
                    type="file"
                    multiple
                    required
                    ref={taskFileInputRef}
                    className="flex-1 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-rose-400 hover:file:bg-slate-700 bg-slate-900 p-1.5 rounded-lg border border-slate-700"
                  />
                  <button
                    type="submit"
                    disabled={uploadingDoc}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-md shadow-rose-600/20 transition disabled:opacity-50 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingDoc ? 'Uploading...' : 'Attach Document'}</span>
                  </button>
                </form>
              </div>

              {/* Attached Documents List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span>Attached Documents & Specifications ({selectedTaskDetails.files.length})</span>
                  </h3>
                </div>

                {selectedTaskDetails.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTaskDetails.files.map((file) => {
                      const isPdf = (file.file_type || '').toLowerCase() === '.pdf' || file.category === 'PDF Document';
                      return (
                        <div
                          key={file.id}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isPdf ? (
                              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                                <FileText className="w-4 h-4 text-rose-400" />
                              </div>
                            ) : (
                              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                                <FolderGit2 className="w-4 h-4 text-emerald-400" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-white font-medium truncate">{file.original_name}</span>
                                {isPdf && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
                                    PDF
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {formatBytes(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Open & View PDF button */}
                            {isPdf && (
                              <button
                                onClick={() => setSelectedPdf({
                                  id: file.id,
                                  name: file.original_name,
                                  size: file.file_size
                                })}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>
                            )}

                            <a
                              href={api.getFileDownloadUrl(file.id)}
                              download
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Download document"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteTaskDoc(file.id, file.original_name)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 text-slate-500 text-xs">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-300 font-medium">No documents attached to this task yet</p>
                    <p className="mt-1">Attach task specifications, runbooks, or architecture diagrams in PDF format above.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTaskDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DEDICATED IN-APP PDF VIEWER MODAL FOR TASKS                  */}
      {/* ============================================================ */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-[95vw] h-[94vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-sm font-bold text-white truncate">{selectedPdf.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-semibold text-[10px] border border-rose-800">
                      TASK PDF VIEWER
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
                  title="Open PDF in new browser tab"
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

            {/* Embedded Native Browser PDF Viewer */}
            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                src={`${api.getFileViewUrl(selectedPdf.id)}#toolbar=1&navpanes=1`}
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
