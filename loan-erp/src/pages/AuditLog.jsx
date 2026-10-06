import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

export default function AuditLog({ data }) {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const modules = [...new Set(data.auditLog.map(l => l.module))];

  const filteredLogs = data.auditLog.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'All' || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleExportLogs = () => {
    try {
      const headers = ['Timestamp', 'User', 'Module', 'Action', 'Detail'];
      const csvRows = [headers.join(',')];
      filteredLogs.forEach(l => {
        csvRows.push([l.timestamp, `"${l.user}"`, l.module, `"${l.action}"`, `"${l.detail}"`].join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (e) {
      alert('Failed to export logs');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Audit Trail</h1>
          <p className="page-subtitle">Track all user actions for compliance and security monitoring.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleExportLogs}><Download size={16} /> Export Logs</button>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="table-search">
              <Search size={14} className="table-search-icon" />
              <input placeholder="Search logs (user, action, detail)..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '300px' }} />
            </div>
            <select className="form-select" style={{ width: '150px' }} value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
              <option value="All">All Modules</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Module</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.slice(0, 50).map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>{new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td style={{ fontWeight: 600 }}>{log.user}</td>
                  <td><span className="badge badge-neutral">{log.module}</span></td>
                  <td style={{ fontWeight: 500 }}>{log.action}</td>
                  <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{log.detail}</td>
                  <td style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'monospace' }}>{log.ipAddress}</td>
                  <td>
                    <span className={`badge badge-dot ${log.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
