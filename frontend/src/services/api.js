const API_BASE = '/api';

export function getToken() {
  return sessionStorage.getItem('devops_token') || localStorage.getItem('devops_token');
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: identifier, email: identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data.user;
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data.users;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  async uploadAvatar(formDataOrBase64) {
    const token = getToken();
    let options = {};
    if (formDataOrBase64 instanceof FormData) {
      options = {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formDataOrBase64
      };
    } else {
      options = {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ avatar: formDataOrBase64 })
      };
    }
    const res = await fetch(`${API_BASE}/auth/avatar`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile picture');
    return data;
  },

  async deleteAvatar() {
    const res = await fetch(`${API_BASE}/auth/avatar`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove profile picture');
    return data;
  },

  async changePassword(passwordData) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },

  async updateTeamUser(id, userData) {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  },

  async deleteTeamUser(id) {
    const res = await fetch(`${API_BASE}/auth/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },

  // Dashboard & System
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch dashboard stats');
    return data;
  },

  async optimizeDatabase() {
    const res = await fetch(`${API_BASE}/dashboard/optimize`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to optimize database');
    return data;
  },

  getDatabaseBackupUrl() {
    const token = getToken();
    return `${API_BASE}/dashboard/backup${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  // POCs
  async getPocs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/pocs?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch POCs');
    return data.pocs;
  },

  async getPoc(id) {
    const res = await fetch(`${API_BASE}/pocs/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch POC');
    return data;
  },

  async createPoc(pocData) {
    const res = await fetch(`${API_BASE}/pocs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pocData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create POC');
    return data;
  },

  async updatePoc(id, pocData) {
    const res = await fetch(`${API_BASE}/pocs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pocData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update POC');
    return data;
  },

  async deletePoc(id) {
    const res = await fetch(`${API_BASE}/pocs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete POC');
    return data;
  },

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
    return data.tasks;
  },

  async getTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch task');
    return data;
  },

  async createTask(taskData) {
    const isFormData = typeof FormData !== 'undefined' && taskData instanceof FormData;
    const token = getToken();
    const headers = isFormData
      ? { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      : getAuthHeaders();
    const body = isFormData ? taskData : JSON.stringify(taskData);
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers,
      body
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create task');
    return data;
  },

  async updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task status');
    return data;
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update task');
    return data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete task');
    return data;
  },

  // Files
  async getFiles(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/files?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch files');
    return data.files;
  },

  async uploadFiles(formData) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/files/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload file(s)');
    return data;
  },

  async getFileContent(id) {
    const res = await fetch(`${API_BASE}/files/${id}/content`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to preview file');
    return data;
  },

  async deleteFile(id) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete file');
    return data;
  },

  async updateFile(id, fileData) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(fileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update file');
    return data;
  },

  getFileDownloadUrl(id) {
    const token = getToken();
    return `${API_BASE}/files/${id}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  getFileViewUrl(id) {
    const token = getToken();
    return `${API_BASE}/files/${id}/view${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  // Folders
  async getFolders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/folders?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch folders');
    return data.folders;
  },

  async getFolder(id) {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch folder');
    return data;
  },

  async createFolder(folderData) {
    const res = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(folderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create folder');
    return data;
  },

  async updateFolder(id, folderData) {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(folderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update folder');
    return data;
  },

  async deleteFolder(id) {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete folder');
    return data;
  },

  async assignFilesToFolder(folderId, fileIds) {
    const res = await fetch(`${API_BASE}/folders/${folderId}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fileIds })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to assign files to folder');
    return data;
  },

  async unassignFilesFromFolder(fileIds) {
    const res = await fetch(`${API_BASE}/folders/unassign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fileIds })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to unassign files from folder');
    return data;
  },

  // Notes
  async getNotes(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/notes?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch notes');
    return data.notes;
  },

  async createNote(noteData) {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create note');
    return data;
  },

  async updateNote(id, noteData) {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update note');
    return data;
  },

  async deleteNote(id) {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete note');
    return data;
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/audit?${query}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch audit logs');
    return data.logs;
  },

  // Health
  async getHealth() {
    const res = await fetch(`/health`);
    const data = await res.json();
    if (!res.ok) throw new Error('Healthcheck returned non-200');
    return data;
  }
};
