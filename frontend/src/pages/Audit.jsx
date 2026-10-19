import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileCheck2, Search, Filter, Shield, Clock } from 'lucide-react';

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs({ action: actionFilter });
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-cyan-400" />
            <span>DevOps Security & Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all user logins, POC additions, file uploads, task state mutations, and deletions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
            <option value="LOGIN_FAILED">LOGIN_FAILED</option>
            <option value="POC_CREATED">POC_CREATED</option>
            <option value="TASK_CREATED">TASK_CREATED</option>
            <option value="TASK_STATUS_CHANGED">TASK_STATUS_CHANGED</option>
            <option value="FILE_UPLOADED">FILE_UPLOADED</option>
            <option value="FILE_DOWNLOADED">FILE_DOWNLOADED</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] min-h-[350px]">
            <table className="w-full text-left text-xs text-slate-300 min-w-[900px]">
              <thead className="sticky top-0 z-20 bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 shadow-md">
                <tr>
                  <th className="p-3.5 bg-slate-950">Timestamp</th>
                  <th className="p-3.5 bg-slate-950">Action</th>
                  <th className="p-3.5 bg-slate-950">User</th>
                  <th className="p-3.5 bg-slate-950">Entity</th>
                  <th className="p-3.5 bg-slate-950">Details</th>
                  <th className="p-3.5 bg-slate-950">Client IP</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('FAILED') ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      log.action.includes('CREATED') ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                      log.action.includes('DOWNLOAD') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans">{log.user_email}</td>
                  <td className="p-3.5 text-slate-400">{log.entity_type}</td>
                  <td className="p-3.5 text-slate-300 max-w-sm truncate font-sans">{log.details}</td>
                  <td className="p-3.5 text-slate-500">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Showing {logs.length} audit trail records</span>
            <span className="text-slate-500 hidden sm:inline">↕ Use mouse wheel / scrollbar to view all records</span>
          </div>
        </div>
      )}

    </div>
  );
}
