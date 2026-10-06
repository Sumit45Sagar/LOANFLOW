import React, { useState, useMemo } from 'react';
import { Search, Download, IndianRupee, Calendar, AlertTriangle, ArrowUpDown, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, LOAN_TYPES } from '../data/mockData';

export default function LoanManagement({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('active');

  const activeLoans = useMemo(() => {
    let loans = data.loans.filter(l => ['Active', 'Disbursed'].includes(l.status));
    if (search) {
      const q = search.toLowerCase();
      loans = loans.filter(l => l.id.toLowerCase().includes(q) || l.customerName.toLowerCase().includes(q));
    }
    if (typeFilter !== 'All') loans = loans.filter(l => l.loanType === typeFilter);
    return loans;
  }, [data.loans, search, typeFilter]);

  const overdueLoans = useMemo(() =>
    data.loans.filter(l => l.dpd > 0 && l.status === 'Active'),
    [data.loans]
  );

  const totalEmiDue = useMemo(() =>
    activeLoans.reduce((sum, l) => sum + l.emi, 0),
    [activeLoans]
  );

  const portfolioByType = useMemo(() => {
    const map = {};
    activeLoans.forEach(l => {
      if (!map[l.loanType]) map[l.loanType] = { name: l.loanType.replace(' Loan', ''), value: 0, count: 0 };
      map[l.loanType].value += l.outstandingPrincipal;
      map[l.loanType].count += 1;
    });
    return Object.values(map);
  }, [activeLoans]);

  const COLORS = ['#4c6ef5', '#20c997', '#fab005', '#fa5252', '#7950f2', '#ff922b'];

  const handlePayment = (loanId) => {
    const updated = data.loans.map(l => {
      if (l.id === loanId) {
        const newSchedule = l.repaymentSchedule.map((r, idx) => {
          if (r.status === 'Overdue' || (r.status === 'Upcoming' && idx === l.paidInstallments)) {
            return { ...r, status: 'Paid', paidDate: new Date().toISOString().split('T')[0], penalty: 0 };
          }
          return r;
        });
        return { ...l, paidInstallments: l.paidInstallments + 1, remainingInstallments: l.remainingInstallments - 1, repaymentSchedule: newSchedule, dpd: 0 };
      }
      return l;
    });
    onUpdate({ ...data, loans: updated });
  };

  const handleExportPortfolio = () => {
    try {
      const headers = ['Loan ID', 'Customer Name', 'Type', 'Principal', 'Outstanding', 'EMI', 'Status'];
      const csvRows = [headers.join(',')];
      activeLoans.forEach(l => {
        csvRows.push([l.id, `"${l.customerName}"`, l.loanType, l.principal, l.outstandingPrincipal, l.emi, l.status].join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (e) {
      alert('Failed to export portfolio');
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Loan Management System</h1>
          <p className="page-subtitle">Active portfolio, repayments, penalties & disbursement tracking</p>
        </div>
        <button className="btn btn-secondary" onClick={handleExportPortfolio}><Download size={16} /> Export Portfolio</button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card" style={{ '--stat-color': '#4c6ef5' }}>
          <div className="stat-card-icon"><CreditCard size={20} /></div>
          <div className="stat-card-value">{activeLoans.length}</div>
          <div className="stat-card-label">Active Loans</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#20c997' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(32,201,151,0.1)', color: 'var(--color-accent-400)' }}><IndianRupee size={20} /></div>
          <div className="stat-card-value">{formatCurrency(activeLoans.reduce((s, l) => s + l.outstandingPrincipal, 0))}</div>
          <div className="stat-card-label">Outstanding Principal</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#fab005' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(252,196,25,0.1)', color: 'var(--color-warning-400)' }}><Calendar size={20} /></div>
          <div className="stat-card-value">{formatCurrency(totalEmiDue)}</div>
          <div className="stat-card-label">Monthly EMI Due</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#fa5252' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(250,82,82,0.1)', color: 'var(--color-danger-400)' }}><AlertTriangle size={20} /></div>
          <div className="stat-card-value">{overdueLoans.length}</div>
          <div className="stat-card-label">Overdue Accounts</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Portfolio by Product</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={portfolioByType} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {portfolioByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-title">EMI Collection Performance</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[
              { month: 'Jun', collected: 85, target: 100 },
              { month: 'Jul', collected: 91, target: 100 },
              { month: 'Aug', collected: 78, target: 100 },
              { month: 'Sep', collected: 94, target: 100 },
              { month: 'Oct', collected: 88, target: 100 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} unit="%" />
              <Tooltip />
              <Bar dataKey="collected" fill="#20c997" radius={[4, 4, 0, 0]} name="Collected %" />
              <Bar dataKey="target" fill="#4c6ef5" radius={[4, 4, 0, 0]} opacity={0.3} name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active Loans ({activeLoans.length})</button>
        <button className={`tab ${activeTab === 'overdue' ? 'active' : ''}`} onClick={() => setActiveTab('overdue')}>Overdue ({overdueLoans.length})</button>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="table-search">
              <Search size={14} className="table-search-icon" />
              <input placeholder="Search active loans..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: '150px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="All">All Products</option>
              {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Outstanding</th>
                <th>EMI</th>
                <th>Paid / Total</th>
                <th>Next Due</th>
                <th>DPD</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'active' ? activeLoans : overdueLoans).slice(0, 20).map(loan => (
                <tr key={loan.id}>
                  <td style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{loan.id}</td>
                  <td style={{ fontWeight: 500 }}>{loan.customerName}</td>
                  <td><span className="badge badge-neutral">{loan.loanType}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(loan.outstandingPrincipal)}</td>
                  <td>{formatCurrency(loan.emi)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div className="progress-bar" style={{ width: '60px' }}>
                        <div className="progress-bar-fill" style={{ width: `${(loan.paidInstallments / loan.tenure) * 100}%` }} />
                      </div>
                      <span style={{ fontSize: 'var(--font-size-xs)' }}>{loan.paidInstallments}/{loan.tenure}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{loan.nextDueDate}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: loan.dpd === 0 ? 'var(--color-success-400)' : loan.dpd <= 30 ? 'var(--color-warning-400)' : 'var(--color-danger-400)' }}>
                      {loan.dpd}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-dot ${loan.status === 'Active' ? 'badge-success' : 'badge-info'}`}>{loan.status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-accent" onClick={() => handlePayment(loan.id)}>
                      <IndianRupee size={12} /> Pay EMI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-pagination">
          <span>Showing {Math.min(20, activeTab === 'active' ? activeLoans.length : overdueLoans.length)} loans</span>
        </div>
      </div>
    </div>
  );
}
