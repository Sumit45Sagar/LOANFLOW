import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, ArrowUpDown, CheckCircle, XCircle, Clock, FileText, Send } from 'lucide-react';
import { formatCurrency, LOAN_TYPES, LOAN_STATUSES } from '../data/mockData';

export default function LoanOrigination({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const [newLoan, setNewLoan] = useState({
    customerId: '', loanType: 'Personal Loan', principal: '', interestRate: 12, tenure: 12,
  });

  const filtered = useMemo(() => {
    let loans = [...data.loans];
    if (search) {
      const q = search.toLowerCase();
      loans = loans.filter(l => l.id.toLowerCase().includes(q) || l.customerName.toLowerCase().includes(q));
    }
    if (typeFilter !== 'All') loans = loans.filter(l => l.loanType === typeFilter);
    if (statusFilter !== 'All') loans = loans.filter(l => l.status === statusFilter);
    return loans.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
  }, [data.loans, search, typeFilter, statusFilter]);

  const handleApprove = (loanId) => {
    const updated = data.loans.map(l => l.id === loanId ? { ...l, status: 'Approved', approvedDate: new Date().toISOString().split('T')[0] } : l);
    onUpdate({ ...data, loans: updated });
    if (selectedLoan?.id === loanId) setSelectedLoan({ ...selectedLoan, status: 'Approved' });
  };

  const handleReject = (loanId) => {
    const updated = data.loans.map(l => l.id === loanId ? { ...l, status: 'Rejected' } : l);
    onUpdate({ ...data, loans: updated });
    if (selectedLoan?.id === loanId) setSelectedLoan({ ...selectedLoan, status: 'Rejected' });
  };

  const handleDisburse = (loanId) => {
    const updated = data.loans.map(l => l.id === loanId ? { ...l, status: 'Disbursed', disbursedDate: new Date().toISOString().split('T')[0] } : l);
    onUpdate({ ...data, loans: updated });
    if (selectedLoan?.id === loanId) setSelectedLoan({ ...selectedLoan, status: 'Disbursed' });
  };

  const approvalStages = ['KYC Check', 'Credit Analysis', 'Underwriting', 'Final Approval', 'Completed'];

  const statusCounts = useMemo(() => {
    const counts = {};
    LOAN_STATUSES.forEach(s => { counts[s] = data.loans.filter(l => l.status === s).length; });
    return counts;
  }, [data.loans]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Loan Origination System</h1>
          <p className="page-subtitle">Application processing, KYC, credit scoring & approval workflows</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewLoan(true)}>
          <Plus size={16} /> New Application
        </button>
      </div>

      {/* Pipeline counts */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {['Applied', 'Under Review', 'Approved', 'Disbursed', 'Rejected'].map(status => (
          <button
            key={status}
            className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {selectedLoan ? (
        /* Loan Detail View */
        <div>
          <button className="btn btn-ghost btn-sm mb-4" onClick={() => setSelectedLoan(null)}>← Back to List</button>

          <div className="loan-detail-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)' }}>{selectedLoan.id}</h2>
                    <span className="text-sm text-muted">{selectedLoan.loanType} • {selectedLoan.customerName}</span>
                  </div>
                  <span className={`badge badge-dot ${
                    selectedLoan.status === 'Active' || selectedLoan.status === 'Disbursed' || selectedLoan.status === 'Approved' ? 'badge-success' :
                    selectedLoan.status === 'Under Review' || selectedLoan.status === 'Applied' ? 'badge-warning' :
                    selectedLoan.status === 'Rejected' || selectedLoan.status === 'NPA' ? 'badge-danger' : 'badge-neutral'
                  }`}>
                    {selectedLoan.status}
                  </span>
                </div>

                {/* Approval Pipeline */}
                <div className="approval-steps">
                  {approvalStages.map((stage, idx) => {
                    const currentIdx = approvalStages.indexOf(selectedLoan.approvalStage);
                    const isCompleted = idx < currentIdx || selectedLoan.status === 'Approved' || selectedLoan.status === 'Disbursed';
                    const isCurrent = idx === currentIdx && selectedLoan.status !== 'Rejected';
                    return (
                      <React.Fragment key={stage}>
                        <div className="approval-step">
                          <div>
                            <div className={`approval-step-circle ${isCompleted ? 'completed' : isCurrent ? 'current' : ''}`}>
                              {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                            </div>
                            <div className="approval-step-label">{stage}</div>
                          </div>
                        </div>
                        {idx < approvalStages.length - 1 && (
                          <div className={`approval-step-line ${isCompleted ? 'completed' : ''}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="card">
                <div className="tabs">
                  {['details', 'schedule', 'documents'].map(tab => (
                    <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === 'details' && (
                  <div className="loan-detail-info">
                    <div className="info-item"><div className="info-item-label">Principal</div><div className="info-item-value">{formatCurrency(selectedLoan.principal)}</div></div>
                    <div className="info-item"><div className="info-item-label">Interest Rate</div><div className="info-item-value">{selectedLoan.interestRate}% p.a.</div></div>
                    <div className="info-item"><div className="info-item-label">Tenure</div><div className="info-item-value">{selectedLoan.tenure} months</div></div>
                    <div className="info-item"><div className="info-item-label">EMI</div><div className="info-item-value">{formatCurrency(selectedLoan.emi)}</div></div>
                    <div className="info-item"><div className="info-item-label">Total Payable</div><div className="info-item-value">{formatCurrency(selectedLoan.totalPayable)}</div></div>
                    <div className="info-item"><div className="info-item-label">Processing Fee</div><div className="info-item-value">{formatCurrency(selectedLoan.processingFee)}</div></div>
                    <div className="info-item"><div className="info-item-label">Collateral</div><div className="info-item-value">{selectedLoan.collateralType}</div></div>
                    <div className="info-item"><div className="info-item-label">Collateral Value</div><div className="info-item-value">{formatCurrency(selectedLoan.collateralValue)}</div></div>
                    <div className="info-item"><div className="info-item-label">Application Date</div><div className="info-item-value">{selectedLoan.applicationDate}</div></div>
                    <div className="info-item"><div className="info-item-label">Loan Officer</div><div className="info-item-value">{selectedLoan.loanOfficer}</div></div>
                    <div className="info-item"><div className="info-item-label">Underwriter</div><div className="info-item-value">{selectedLoan.assignedUnderwriter}</div></div>
                    <div className="info-item"><div className="info-item-label">DPD</div><div className="info-item-value" style={{ color: selectedLoan.dpd > 0 ? 'var(--color-danger-400)' : 'var(--color-success-400)' }}>{selectedLoan.dpd} days</div></div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Due Date</th>
                          <th>EMI</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>Balance</th>
                          <th>Status</th>
                          <th>Penalty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLoan.repaymentSchedule.map(row => (
                          <tr key={row.installment}>
                            <td>{row.installment}</td>
                            <td>{row.dueDate}</td>
                            <td style={{ fontWeight: 600 }}>{formatCurrency(row.emi)}</td>
                            <td>{formatCurrency(row.principal)}</td>
                            <td>{formatCurrency(row.interest)}</td>
                            <td>{formatCurrency(row.balance)}</td>
                            <td>
                              <span className={`badge badge-dot ${row.status === 'Paid' ? 'badge-success' : row.status === 'Overdue' ? 'badge-danger' : 'badge-warning'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td style={{ color: row.penalty > 0 ? 'var(--color-danger-400)' : 'var(--text-tertiary)' }}>
                              {row.penalty > 0 ? formatCurrency(row.penalty) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    {selectedLoan.documents.map(doc => (
                      <div key={doc} style={{
                        padding: 'var(--space-4)',
                        background: 'var(--surface-elevated)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                      }}>
                        <FileText size={24} style={{ color: 'var(--color-primary-400)', margin: '0 auto var(--space-2)' }} />
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{doc}</div>
                        <span className="badge badge-success mt-2" style={{ fontSize: '10px' }}>✓ Uploaded</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar – Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="card">
                <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</div>
                {(selectedLoan.status === 'Applied' || selectedLoan.status === 'Under Review') && (
                  <>
                    <button className="btn btn-primary w-full mb-4" onClick={() => handleApprove(selectedLoan.id)}>
                      <CheckCircle size={16} /> Approve Loan
                    </button>
                    <button className="btn btn-danger w-full mb-4" onClick={() => handleReject(selectedLoan.id)}>
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {selectedLoan.status === 'Approved' && (
                  <button className="btn btn-accent w-full mb-4" onClick={() => handleDisburse(selectedLoan.id)}>
                    <Send size={16} /> Disburse Funds
                  </button>
                )}
                <button className="btn btn-secondary w-full">
                  <FileText size={16} /> Generate Agreement
                </button>
              </div>

              <div className="card">
                <div className="card-title" style={{ marginBottom: 'var(--space-3)' }}>Risk Assessment</div>
                <div className="profile-stat-row"><span className="profile-stat-label">DTI Ratio</span><span className="profile-stat-value">{Math.round((selectedLoan.emi / 50000) * 100)}%</span></div>
                <div className="profile-stat-row"><span className="profile-stat-label">LTV Ratio</span><span className="profile-stat-value">{selectedLoan.collateralValue > 0 ? Math.round((selectedLoan.principal / selectedLoan.collateralValue) * 100) + '%' : 'N/A'}</span></div>
                <div className="profile-stat-row"><span className="profile-stat-label">Loan Officer</span><span className="profile-stat-value">{selectedLoan.loanOfficer}</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Loan List */
        <div className="data-table-wrapper">
          <div className="data-table-toolbar">
            <div className="data-table-toolbar-left">
              <div className="table-search">
                <Search size={14} className="table-search-icon" />
                <input placeholder="Search loans..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: '150px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Products</option>
                {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <span className="text-sm text-muted">{filtered.length} loans</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Principal</th>
                  <th>Rate</th>
                  <th>Tenure</th>
                  <th>EMI</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map(loan => (
                  <tr key={loan.id}>
                    <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{loan.id}</td>
                    <td style={{ fontWeight: 500 }}>{loan.customerName}</td>
                    <td><span className="badge badge-neutral">{loan.loanType}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(loan.principal)}</td>
                    <td>{loan.interestRate}%</td>
                    <td>{loan.tenure}mo</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(loan.emi)}</td>
                    <td><span className="text-xs text-muted">{loan.approvalStage}</span></td>
                    <td>
                      <span className={`badge badge-dot ${
                        loan.status === 'Active' || loan.status === 'Disbursed' || loan.status === 'Approved' ? 'badge-success' :
                        loan.status === 'Under Review' || loan.status === 'Applied' ? 'badge-warning' :
                        loan.status === 'Rejected' || loan.status === 'NPA' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)' }}>{loan.applicationDate}</td>
                    <td>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedLoan(loan)}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-pagination">
            <span>Showing {Math.min(20, filtered.length)} of {filtered.length} loans</span>
            <div className="table-pagination-btns">
              <button className="table-pagination-btn active">1</button>
              <button className="table-pagination-btn">2</button>
              <button className="table-pagination-btn">3</button>
              <button className="table-pagination-btn">4</button>
            </div>
          </div>
        </div>
      )}

      {/* New Loan Modal */}
      {showNewLoan && (
        <div className="modal-overlay" onClick={() => setShowNewLoan(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Loan Application</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowNewLoan(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Customer</label>
                <select className="form-select" value={newLoan.customerId} onChange={e => setNewLoan({ ...newLoan, customerId: e.target.value })}>
                  <option value="">-- Select Customer --</option>
                  {data.customers.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.id})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Loan Product</label>
                  <select className="form-select" value={newLoan.loanType} onChange={e => setNewLoan({ ...newLoan, loanType: e.target.value })}>
                    {LOAN_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Principal Amount</label>
                  <input className="form-input" type="number" placeholder="₹0" value={newLoan.principal} onChange={e => setNewLoan({ ...newLoan, principal: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Interest Rate (% p.a.)</label>
                  <input className="form-input" type="number" step="0.5" value={newLoan.interestRate} onChange={e => setNewLoan({ ...newLoan, interestRate: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenure (months)</label>
                  <select className="form-select" value={newLoan.tenure} onChange={e => setNewLoan({ ...newLoan, tenure: Number(e.target.value) })}>
                    {[6, 12, 18, 24, 36, 48, 60].map(t => <option key={t} value={t}>{t} months</option>)}
                  </select>
                </div>
              </div>
              {newLoan.principal && newLoan.interestRate && newLoan.tenure && (
                <div style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>EMI Calculation</div>
                  <div className="profile-stat-row">
                    <span className="profile-stat-label">Estimated EMI</span>
                    <span className="profile-stat-value" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary-400)' }}>
                      {formatCurrency(Math.round(
                        (Number(newLoan.principal) * (newLoan.interestRate / 12 / 100) * Math.pow(1 + newLoan.interestRate / 12 / 100, newLoan.tenure)) /
                        (Math.pow(1 + newLoan.interestRate / 12 / 100, newLoan.tenure) - 1)
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowNewLoan(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!newLoan.customerId || !newLoan.principal}>Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
