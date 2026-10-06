import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Phone, Mail, MessageSquare, ArrowUpDown, MoreHorizontal, Star, Calendar } from 'lucide-react';
import { formatCurrency, LEAD_SOURCES, LEAD_STATUSES, LOAN_TYPES } from '../data/mockData';

const STATUS_COLORS = {
  'New': 'badge-info',
  'Contacted': 'badge-warning',
  'Qualified': 'badge-accent',
  'Proposal Sent': 'badge-info',
  'Won': 'badge-success',
  'Lost': 'badge-danger',
};

export default function LeadManagement({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [newLead, setNewLead] = useState({
    name: '', email: '', phone: '', source: 'Website', loanType: 'Personal Loan',
    requestedAmount: '', notes: '', city: '',
  });

  const filteredLeads = useMemo(() => {
    let leads = [...data.leads];
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.phone.includes(q)
      );
    }
    if (statusFilter !== 'All') leads = leads.filter(l => l.status === statusFilter);
    if (sourceFilter !== 'All') leads = leads.filter(l => l.source === sourceFilter);
    leads.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return leads;
  }, [data.leads, search, statusFilter, sourceFilter, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleAddLead = () => {
    const lead = {
      id: `LEAD${String(data.leads.length + 1).padStart(5, '0')}`,
      ...newLead,
      requestedAmount: Number(newLead.requestedAmount),
      status: 'New',
      score: Math.floor(Math.random() * 10) + 1,
      assignedTo: 'Priya Sharma',
      lastContactDate: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };
    onUpdate({
      ...data,
      leads: [lead, ...data.leads],
    });
    setShowModal(false);
    setNewLead({ name: '', email: '', phone: '', source: 'Website', loanType: 'Personal Loan', requestedAmount: '', notes: '', city: '' });
  };

  const handleStatusChange = (leadId, newStatus) => {
    const updated = data.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    onUpdate({ ...data, leads: updated });
  };

  const statusCounts = useMemo(() => {
    const counts = { All: data.leads.length };
    LEAD_STATUSES.forEach(s => { counts[s] = data.leads.filter(l => l.status === s).length; });
    return counts;
  }, [data.leads]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Management</h1>
          <p className="page-subtitle">Track and convert leads into loan applications</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Pipeline Summary */}
      <div className="stat-grid" style={{ marginBottom: 'var(--space-4)' }}>
        {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'].map(status => (
          <div
            key={status}
            className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
            style={{ padding: '8px 16px', fontSize: 'var(--font-size-sm)', justifyContent: 'space-between', flex: '1' }}
          >
            <span>{status}</span>
            <span style={{ fontWeight: 700 }}>{statusCounts[status] || 0}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="table-search">
              <Search size={14} className="table-search-icon" />
              <input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="form-select" style={{ width: '140px' }} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="All">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="data-table-toolbar-right">
            <span className="text-sm text-muted">{filteredLeads.length} leads</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>Lead ID <ArrowUpDown size={12} /></th>
                <th onClick={() => handleSort('name')}>Name <ArrowUpDown size={12} /></th>
                <th>Contact</th>
                <th onClick={() => handleSort('source')}>Source</th>
                <th onClick={() => handleSort('loanType')}>Product</th>
                <th onClick={() => handleSort('requestedAmount')}>Amount</th>
                <th onClick={() => handleSort('score')}>Score</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Follow-up</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{lead.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{lead.city}</div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-icon btn-sm" title="Call"><Phone size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Email"><Mail size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="WhatsApp"><MessageSquare size={14} /></button>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{lead.source}</span></td>
                  <td>{lead.loanType}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(lead.requestedAmount)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} style={{ color: lead.score >= 7 ? '#fab005' : lead.score >= 4 ? '#868e96' : '#495057' }} />
                      <span style={{ fontWeight: 600, color: lead.score >= 7 ? '#fab005' : 'var(--text-secondary)' }}>{lead.score}/10</span>
                    </div>
                  </td>
                  <td>
                    <select
                      className={`badge ${STATUS_COLORS[lead.status] || 'badge-neutral'}`}
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{ border: 'none', cursor: 'pointer', background: 'transparent', color: 'inherit', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}
                    >
                      {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
                      <span style={{ fontSize: 'var(--font-size-xs)' }}>{lead.nextFollowUp}</span>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedLead(lead)}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <span>Showing {filteredLeads.length} of {data.leads.length} leads</span>
          <div className="table-pagination-btns">
            <button className="table-pagination-btn active">1</button>
            <button className="table-pagination-btn">2</button>
            <button className="table-pagination-btn">3</button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Lead</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Enter full name" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="City" value={newLead.city} onChange={e => setNewLead({ ...newLead, city: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="email@example.com" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="+91 XXXXX XXXXX" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Lead Source</label>
                  <select className="form-select" value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                    {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Loan Product</label>
                  <select className="form-select" value={newLead.loanType} onChange={e => setNewLead({ ...newLead, loanType: e.target.value })}>
                    {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Requested Amount</label>
                <input className="form-input" type="number" placeholder="₹0" value={newLead.requestedAmount} onChange={e => setNewLead({ ...newLead, requestedAmount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Additional notes..." value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddLead} disabled={!newLead.name || !newLead.phone}>Create Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
