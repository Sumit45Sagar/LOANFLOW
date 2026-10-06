import React, { useState, useMemo } from 'react';
import { Search, Download, Plus, BookOpen, ArrowUpDown, Filter, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../data/mockData';

export default function Accounting({ data }) {
  const [activeTab, setActiveTab] = useState('journal');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredJournals = useMemo(() => {
    let entries = [...data.journalEntries];
    if (search) {
      const q = search.toLowerCase();
      entries = entries.filter(e => e.id.toLowerCase().includes(q) || e.customerName.toLowerCase().includes(q) || e.loanId.toLowerCase().includes(q));
    }
    if (typeFilter !== 'All') entries = entries.filter(e => e.type === typeFilter);
    return entries;
  }, [data.journalEntries, search, typeFilter]);

  const accountSummary = useMemo(() => {
    const assets = data.chartOfAccounts.filter(a => a.type === 'Asset').reduce((s, a) => s + a.balance, 0);
    const liabilities = data.chartOfAccounts.filter(a => a.type === 'Liability').reduce((s, a) => s + a.balance, 0);
    const equity = data.chartOfAccounts.filter(a => a.type === 'Equity').reduce((s, a) => s + a.balance, 0);
    const revenue = data.chartOfAccounts.filter(a => a.type === 'Revenue').reduce((s, a) => s + a.balance, 0);
    const expenses = data.chartOfAccounts.filter(a => a.type === 'Expense').reduce((s, a) => s + a.balance, 0);
    return { assets, liabilities, equity, revenue, expenses, netIncome: revenue - expenses };
  }, [data.chartOfAccounts]);

  const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  const typeColors = { Asset: '#4c6ef5', Liability: '#fa5252', Equity: '#7950f2', Revenue: '#20c997', Expense: '#ff922b' };

  const handleExportAccounting = () => {
    try {
      const headers = ['Entry ID', 'Date', 'Type', 'Amount', 'Customer Name', 'Loan ID', 'Description'];
      const csvRows = [headers.join(',')];
      filteredJournals.forEach(e => {
        csvRows.push([e.id, e.date, e.type, e.amount, `"${e.customerName}"`, e.loanId, `"${e.description}"`].join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `accounting_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (e) {
      alert('Failed to export accounting records');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounting & General Ledger</h1>
          <p className="page-subtitle">Chart of accounts, journal entries, and financial reconciliation</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportAccounting}><Download size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => alert('New Entry dialog opened (Mock functionality)')}><Plus size={16} /> New Entry</button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="stat-card" style={{ '--stat-color': '#4c6ef5' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{formatCurrency(accountSummary.assets)}</div>
          <div className="stat-card-label">Total Assets</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#fa5252' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{formatCurrency(accountSummary.liabilities)}</div>
          <div className="stat-card-label">Total Liabilities</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#7950f2' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{formatCurrency(accountSummary.equity)}</div>
          <div className="stat-card-label">Total Equity</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#20c997' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{formatCurrency(accountSummary.revenue)}</div>
          <div className="stat-card-label">Total Revenue</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#ff922b' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)' }}>{formatCurrency(accountSummary.expenses)}</div>
          <div className="stat-card-label">Total Expenses</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#20c997' }}>
          <div className="stat-card-value" style={{ fontSize: 'var(--font-size-xl)', color: accountSummary.netIncome >= 0 ? 'var(--color-success-400)' : 'var(--color-danger-400)' }}>
            {formatCurrency(accountSummary.netIncome)}
          </div>
          <div className="stat-card-label">Net Income</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
          <FileText size={14} style={{ marginRight: '6px' }} /> Journal Entries
        </button>
        <button className={`tab ${activeTab === 'coa' ? 'active' : ''}`} onClick={() => setActiveTab('coa')}>
          <BookOpen size={14} style={{ marginRight: '6px' }} /> Chart of Accounts
        </button>
        <button className={`tab ${activeTab === 'reconciliation' ? 'active' : ''}`} onClick={() => setActiveTab('reconciliation')}>
          Reconciliation
        </button>
      </div>

      {activeTab === 'journal' && (
        <div className="data-table-wrapper">
          <div className="data-table-toolbar">
            <div className="data-table-toolbar-left">
              <div className="table-search">
                <Search size={14} className="table-search-icon" />
                <input placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: '160px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                {['Disbursement', 'EMI Receipt', 'Interest Income', 'Fee Income', 'Penalty Income', 'Provision', 'Write-Off'].map(t =>
                  <option key={t} value={t}>{t}</option>
                )}
              </select>
            </div>
            <span className="text-sm text-muted">{filteredJournals.length} entries</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Entry ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {filteredJournals.slice(0, 20).map(e => (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{e.id}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{e.date}</td>
                    <td><span className="badge badge-neutral">{e.type}</span></td>
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{e.loanId}</td>
                    <td>{e.customerName}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-danger-400)' }}>{e.debitAccount}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success-400)' }}>{e.creditAccount}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(e.amount)}</td>
                    <td>
                      <span className={`badge badge-dot ${e.status === 'Posted' ? 'badge-success' : e.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{e.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-pagination">
            <span>Showing {Math.min(20, filteredJournals.length)} of {filteredJournals.length} entries</span>
          </div>
        </div>
      )}

      {activeTab === 'coa' && (
        <div className="data-table-wrapper">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.chartOfAccounts.map(acc => (
                  <tr key={acc.code}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-primary-400)' }}>{acc.code}</td>
                    <td style={{ fontWeight: 500 }}>{acc.name}</td>
                    <td><span className="badge" style={{ background: `${typeColors[acc.type]}20`, color: typeColors[acc.type] }}>{acc.type}</span></td>
                    <td style={{ fontSize: 'var(--font-size-sm)' }}>{acc.category}</td>
                    <td style={{ fontWeight: 700, color: acc.type === 'Asset' || acc.type === 'Revenue' ? 'var(--color-success-400)' : acc.type === 'Expense' || acc.type === 'Liability' ? 'var(--color-danger-400)' : 'var(--text-primary)' }}>
                      {formatCurrency(acc.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reconciliation' && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <div className="empty-state">
            <div className="empty-state-icon"><BookOpen size={28} /></div>
            <div className="empty-state-title">Bank Reconciliation</div>
            <div className="empty-state-desc">Upload bank statements to reconcile transactions with system records. Supports CSV and Excel formats.</div>
            <button className="btn btn-primary" onClick={() => alert('Upload Statement dialog opened (Mock functionality)')}><Plus size={16} /> Upload Statement</button>
          </div>
        </div>
      )}
    </div>
  );
}
