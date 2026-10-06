import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, ArrowUpDown, Download, User, MapPin, Briefcase, CreditCard, Shield } from 'lucide-react';
import { formatCurrency } from '../data/mockData';

export default function Customers({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    let customers = [...data.customers];
    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.fullName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    if (kycFilter !== 'All') customers = customers.filter(c => c.kycStatus === kycFilter);
    if (riskFilter !== 'All') customers = customers.filter(c => c.riskCategory === riskFilter);
    return customers;
  }, [data.customers, search, kycFilter, riskFilter]);

  const customerLoans = useMemo(() => {
    if (!selectedCustomer) return [];
    return data.loans.filter(l => l.customerId === selectedCustomer.id);
  }, [selectedCustomer, data.loans]);

  const handleExportCustomers = () => {
    try {
      const headers = ['Customer ID', 'Name', 'Phone', 'Email', 'City', 'Credit Score', 'KYC', 'Risk'];
      const csvRows = [headers.join(',')];
      
      filtered.forEach(c => {
        const row = [
          c.id,
          `"${c.fullName}"`,
          c.phone,
          c.email,
          `"${c.city}"`,
          c.creditScore,
          c.kycStatus,
          c.riskCategory
        ];
        csvRows.push(row.join(','));
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export customers', err);
      alert('Failed to export customers');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers (CRM)</h1>
          <p className="page-subtitle">Customer 360° view — profile, loans, interactions & credit history</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportCustomers}><Download size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Customer</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-4)' }}>
        <div className="stat-card" style={{ '--stat-color': '#4c6ef5' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{data.customers.length}</div>
          <div className="stat-card-label">Total Customers</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#20c997' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{data.customers.filter(c => c.kycStatus === 'Verified').length}</div>
          <div className="stat-card-label">KYC Verified</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#fab005' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{data.customers.filter(c => c.kycStatus === 'Pending').length}</div>
          <div className="stat-card-label">KYC Pending</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#fa5252' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-2xl)' }}>{data.customers.filter(c => c.riskCategory === 'High').length}</div>
          <div className="stat-card-label">High Risk</div>
        </div>
      </div>

      {selectedCustomer ? (
        /* Customer 360 View */
        <div className="customer-profile-grid">
          <div className="customer-profile-sidebar">
            <div className="card profile-card-avatar">
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCustomer(null)} style={{ alignSelf: 'flex-start', marginBottom: 'var(--space-3)' }}>← Back</button>
              <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))', marginBottom: 'var(--space-3)' }}>
                {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{selectedCustomer.fullName}</h3>
              <span className="text-sm text-muted">{selectedCustomer.id}</span>
              <span className={`badge badge-dot mt-2 ${selectedCustomer.kycStatus === 'Verified' ? 'badge-success' : selectedCustomer.kycStatus === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                KYC: {selectedCustomer.kycStatus}
              </span>
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-3)' }}>Contact Info</div>
              <div className="profile-stat-row"><span className="profile-stat-label">Email</span><span className="profile-stat-value">{selectedCustomer.email}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">Phone</span><span className="profile-stat-value">{selectedCustomer.phone}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">City</span><span className="profile-stat-value">{selectedCustomer.city}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">PAN</span><span className="profile-stat-value">{selectedCustomer.pan}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">Aadhaar</span><span className="profile-stat-value">{selectedCustomer.aadhaar}</span></div>
            </div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-3)' }}>Financial Summary</div>
              <div className="profile-stat-row"><span className="profile-stat-label">Monthly Income</span><span className="profile-stat-value">{formatCurrency(selectedCustomer.monthlyIncome)}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">Employer</span><span className="profile-stat-value">{selectedCustomer.employer}</span></div>
              <div className="profile-stat-row"><span className="profile-stat-label">Credit Score</span>
                <span className="profile-stat-value" style={{ color: selectedCustomer.creditScore >= 750 ? 'var(--color-success-400)' : selectedCustomer.creditScore >= 650 ? 'var(--color-warning-400)' : 'var(--color-danger-400)' }}>
                  {selectedCustomer.creditScore}
                </span>
              </div>
              <div className="profile-stat-row"><span className="profile-stat-label">Risk Category</span>
                <span className={`badge ${selectedCustomer.riskCategory === 'Low' ? 'badge-success' : selectedCustomer.riskCategory === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                  {selectedCustomer.riskCategory}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Loan History ({customerLoans.length} loans)</span>
              </div>
              {customerLoans.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Type</th>
                      <th>Principal</th>
                      <th>EMI</th>
                      <th>Rate</th>
                      <th>Tenure</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoans.map(l => (
                      <tr key={l.id}>
                        <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{l.id}</td>
                        <td>{l.loanType}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(l.principal)}</td>
                        <td>{formatCurrency(l.emi)}</td>
                        <td>{l.interestRate}%</td>
                        <td>{l.tenure} mo</td>
                        <td>
                          <span className={`badge badge-dot ${l.status === 'Active' || l.status === 'Disbursed' ? 'badge-success' : l.status === 'NPA' ? 'badge-danger' : 'badge-neutral'}`}>
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                  <div className="empty-state-icon"><CreditCard size={24} /></div>
                  <div className="empty-state-title">No Loans</div>
                  <div className="empty-state-desc">This customer doesn't have any loan history yet.</div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Documents</span>
                <button className="btn btn-sm btn-secondary" onClick={() => alert('Document upload dialog opened. (Mock functionality)')}><Plus size={14} /> Upload</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                {['Aadhaar Card', 'PAN Card', 'Bank Statement', 'Salary Slip', 'Address Proof'].map(doc => (
                  <div key={doc} style={{
                    padding: 'var(--space-3)',
                    background: 'var(--surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--surface-border-strong)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    <Shield size={20} style={{ margin: '0 auto var(--space-2)', color: 'var(--text-tertiary)' }} />
                    {doc}
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      {selectedCustomer.kycStatus === 'Verified' ? '✓ Verified' : '⏳ Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Customer List */
        <div className="data-table-wrapper">
          <div className="data-table-toolbar">
            <div className="data-table-toolbar-left">
              <div className="table-search">
                <Search size={14} className="table-search-icon" />
                <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: '130px' }} value={kycFilter} onChange={e => setKycFilter(e.target.value)}>
                <option value="All">All KYC</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select className="form-select" style={{ width: '130px' }} value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
                <option value="All">All Risk</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <span className="text-sm text-muted">{filtered.length} customers</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Occupation</th>
                  <th>Income</th>
                  <th>Credit Score</th>
                  <th>KYC</th>
                  <th>Risk</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{c.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar" style={{ background: `hsl(${c.id.charCodeAt(4) * 37 % 360}, 60%, 45%)` }}>
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.fullName}</div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{c.phone}</td>
                    <td>{c.city}</td>
                    <td>{c.occupation}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.monthlyIncome)}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: c.creditScore >= 750 ? 'var(--color-success-400)' : c.creditScore >= 650 ? 'var(--color-warning-400)' : 'var(--color-danger-400)' }}>
                        {c.creditScore}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-dot ${c.kycStatus === 'Verified' ? 'badge-success' : c.kycStatus === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {c.kycStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${c.riskCategory === 'Low' ? 'badge-success' : c.riskCategory === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                        {c.riskCategory}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedCustomer(c)} title="View 360°">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-pagination">
            <span>Showing {Math.min(20, filtered.length)} of {filtered.length} customers</span>
            <div className="table-pagination-btns">
              <button className="table-pagination-btn active">1</button>
              <button className="table-pagination-btn">2</button>
              <button className="table-pagination-btn">3</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', padding: 'var(--space-6)', background: 'var(--surface-card)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xl)' }}>Add New Customer</h3>
            <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" className="form-input" placeholder="e.g. John Doe" style={{ width: '100%', padding: '8px', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-elevated)', color: 'var(--text-primary)' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" className="form-input" placeholder="john@example.com" style={{ width: '100%', padding: '8px', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-elevated)', color: 'var(--text-primary)' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Phone</label>
              <input type="text" className="form-input" placeholder="+91 9876543210" style={{ width: '100%', padding: '8px', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', background: 'var(--surface-elevated)', color: 'var(--text-primary)' }} />
            </div>
            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                alert('Customer added successfully! (Mock functionality)');
                setShowAddModal(false);
              }}>Save Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
