import React, { useState, useMemo } from 'react';
import { Search, Phone, MapPin, Calendar, AlertTriangle, ArrowUpDown, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, COLLECTION_BUCKETS } from '../data/mockData';

const PRIORITY_COLORS = { Critical: 'badge-danger', High: 'badge-warning', Medium: 'badge-info', Low: 'badge-neutral' };
const STATUS_COLORS = { Open: 'badge-warning', 'In Progress': 'badge-info', PTP: 'badge-accent', Resolved: 'badge-success', Escalated: 'badge-danger', Legal: 'badge-danger' };

export default function Collections({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [bucketFilter, setBucketFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showPTPModal, setShowPTPModal] = useState(false);

  const filtered = useMemo(() => {
    let cases = [...data.collections];
    if (search) {
      const q = search.toLowerCase();
      cases = cases.filter(c => c.id.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q) || c.loanId.toLowerCase().includes(q));
    }
    if (bucketFilter !== 'All') cases = cases.filter(c => c.bucket === bucketFilter);
    if (priorityFilter !== 'All') cases = cases.filter(c => c.priority === priorityFilter);
    return cases.sort((a, b) => b.dpd - a.dpd);
  }, [data.collections, search, bucketFilter, priorityFilter]);

  const bucketStats = useMemo(() => {
    return COLLECTION_BUCKETS.map(bucket => ({
      bucket,
      count: data.collections.filter(c => c.bucket === bucket).length,
      amount: data.collections.filter(c => c.bucket === bucket).reduce((s, c) => s + c.outstandingAmount, 0),
    }));
  }, [data.collections]);

  const handleLogAction = (caseId, action) => {
    const updated = data.collections.map(c =>
      c.id === caseId ? { ...c, lastAction: action, lastActionDate: new Date().toISOString().split('T')[0], totalCalls: c.totalCalls + (action === 'Call Made' ? 1 : 0), totalVisits: c.totalVisits + (action === 'Visit Done' ? 1 : 0) } : c
    );
    onUpdate({ ...data, collections: updated });
  };

  const handleResolve = (caseId) => {
    const updated = data.collections.map(c => c.id === caseId ? { ...c, status: 'Resolved' } : c);
    onUpdate({ ...data, collections: updated });
  };

  const BUCKET_COLORS = ['#20c997', '#fab005', '#ff922b', '#fa5252', '#e03131', '#c92a2a'];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Collections Module</h1>
          <p className="page-subtitle">Delinquency tracking, task assignment & PTP management</p>
        </div>
      </div>

      {/* Bucket Distribution */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {bucketStats.map((b, idx) => (
          <div
            key={b.bucket}
            className={`stat-card ${bucketFilter === b.bucket ? '' : ''}`}
            style={{ '--stat-color': BUCKET_COLORS[idx], cursor: 'pointer' }}
            onClick={() => setBucketFilter(bucketFilter === b.bucket ? 'All' : b.bucket)}
          >
            <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{b.count}</div>
            <div className="stat-card-label" style={{ fontSize: 'var(--font-size-xs)' }}>{b.bucket}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: BUCKET_COLORS[idx], fontWeight: 600, marginTop: '4px' }}>
              {formatCurrency(b.amount)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="charts-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chart-card">
          <div className="chart-card-title">Delinquency by Bucket (Amount)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bucketStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="bucket" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(val) => formatCurrency(val)} />
              <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                {bucketStats.map((_, i) => <Cell key={i} fill={BUCKET_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="table-search">
              <Search size={14} className="table-search-icon" />
              <input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: '130px' }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <span className="text-sm text-muted">{filtered.length} cases</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Customer</th>
                <th>Loan ID</th>
                <th>Product</th>
                <th>Outstanding</th>
                <th>DPD</th>
                <th>Bucket</th>
                <th>Priority</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Last Action</th>
                <th>PTP Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(c => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.customerName}</td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{c.loanId}</td>
                  <td><span className="badge badge-neutral">{c.loanType}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(c.outstandingAmount)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: c.dpd <= 30 ? 'var(--color-warning-400)' : c.dpd <= 60 ? '#ff922b' : 'var(--color-danger-400)' }}>
                      {c.dpd}
                    </span>
                  </td>
                  <td><span className={`badge ${c.bucket.includes('90') ? 'badge-danger' : c.bucket.includes('60') ? 'badge-warning' : 'badge-info'}`}>{c.bucket}</span></td>
                  <td><span className={`badge ${PRIORITY_COLORS[c.priority]}`}>{c.priority}</span></td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{c.assignedAgent}</td>
                  <td><span className={`badge badge-dot ${STATUS_COLORS[c.status]}`}>{c.status}</span></td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>{c.lastAction}<br/><span className="text-muted">{c.lastActionDate}</span></td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{c.ptpDate || '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-icon btn-sm" title="Log Call" onClick={() => handleLogAction(c.id, 'Call Made')}><Phone size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="SMS" onClick={() => handleLogAction(c.id, 'SMS Sent')}><MessageSquare size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Resolve" onClick={() => handleResolve(c.id)}><CheckCircle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pagination">
          <span>Showing {Math.min(20, filtered.length)} of {filtered.length} cases</span>
        </div>
      </div>
    </div>
  );
}
