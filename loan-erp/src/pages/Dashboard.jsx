import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Users, FileText, TrendingUp, TrendingDown, AlertTriangle,
  ArrowUpRight, ArrowDownRight, DollarSign, Target, Activity, CreditCard,
  IndianRupee, Plus, FileSpreadsheet, ShieldAlert, CheckCircle, Clock,
  PieChart as PieChartIcon, BarChart2, Calendar, Filter, MoreHorizontal,
  ChevronRight, ArrowRight, Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { formatCurrency } from '../data/mockData';

// Advanced currency formatter for Crores and Lakhs
const formatFinancial = (value) => {
  if (!value) return '₹0';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

export default function Dashboard({ data, stats }) {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Month');

  const handleExportReport = () => {
    try {
      const headers = ['Loan ID', 'Customer Name', 'Amount', 'Interest Rate (%)', 'Status', 'Date'];
      const csvRows = [headers.join(',')];
      data.loans.forEach(loan => {
        csvRows.push([loan.id, `"${loan.customerName}"`, loan.amount, loan.interestRate, loan.status, loan.applicationDate].join(','));
      });
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `portfolio_report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (err) {
      alert('Failed to export report');
    }
  };

  const recentLoans = useMemo(() =>
    [...data.loans].sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)).slice(0, 6),
    [data.loans]
  );

  const pendingApprovals = useMemo(() =>
    [...data.loans].filter(l => l.status === 'Under Review' || l.status === 'Applied').slice(0, 5),
    [data.loans]
  );

  const recentActivity = useMemo(() =>
    data.auditLog.slice(0, 6),
    [data.auditLog]
  );

  // Derived Chart Data
  const loanDistribution = useMemo(() => {
    const dist = {};
    data.loans.forEach(l => {
      if (!dist[l.loanType]) dist[l.loanType] = 0;
      dist[l.loanType] += l.principal;
    });
    return Object.entries(dist).map(([name, value]) => ({ name: name.replace(' Loan', ''), value }));
  }, [data.loans]);

  // Mock Trend Data for Charts
  const performanceData = [
    { name: 'Jan', expected: 4000000, collected: 3800000, npa: 120000 },
    { name: 'Feb', expected: 4200000, collected: 4100000, npa: 110000 },
    { name: 'Mar', expected: 4500000, collected: 4350000, npa: 140000 },
    { name: 'Apr', expected: 4700000, collected: 4600000, npa: 130000 },
    { name: 'May', expected: 5100000, collected: 5000000, npa: 150000 },
    { name: 'Jun', expected: 5400000, collected: 5250000, npa: 140000 },
    { name: 'Jul', expected: 5800000, collected: 5650000, npa: 160000 }
  ];

  const collectionTrend = [
    { day: 'Mon', amount: 125000 },
    { day: 'Tue', amount: 245000 },
    { day: 'Wed', amount: 180000 },
    { day: 'Thu', amount: 290000 },
    { day: 'Fri', amount: 340000 },
    { day: 'Sat', amount: 95000 },
    { day: 'Sun', amount: 45000 }
  ];

  const CHART_COLORS = ['#1e3a8a', '#3b82f6', '#0ea5e9', '#64748b', '#cbd5e1'];

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1600px' }}>

      {/* Command Center Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Portfolio Command Center
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time analytics, risk exposure, and operational workflows.
          </p>
        </div>
        <div className="flex gap-3">
          <div style={{ display: 'flex', background: 'var(--surface-elevated)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {['Week', 'Month', 'Quarter', 'YTD'].map(t => (
              <button key={t}
                onClick={() => setTimeRange(t)}
                style={{
                  padding: '6px 12px',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  background: timeRange === t ? 'var(--color-primary-50)' : 'transparent',
                  color: timeRange === t ? 'var(--color-primary-700)' : 'var(--text-tertiary)',
                  border: 'none',
                  cursor: 'pointer',
                  borderRight: '1px solid var(--surface-border)'
                }}>
                {t}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={handleExportReport}><Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => navigate('/loans')}><Plus size={14} /> New Origination</button>
        </div>
      </div>

      {/* KPI Cards - Enterprise Grade */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)'
      }}>
        {/* AUM */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assets Under Management</span>
            <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', padding: '6px', borderRadius: 'var(--radius-sm)' }}><Wallet size={16} /></div>
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {formatFinancial(stats.totalAUM)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success-600)', background: 'var(--color-success-50)', padding: '2px 6px', borderRadius: '4px' }}>
              <ArrowUpRight size={12} style={{ marginRight: '2px' }} /> +12.4%
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>vs last month</span>
          </div>
        </div>

        {/* Collections */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Collections</span>
            <div style={{ background: 'var(--color-success-50)', color: 'var(--color-success-600)', padding: '6px', borderRadius: 'var(--radius-sm)' }}><Activity size={16} /></div>
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {formatFinancial(stats.todayCollections)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              Efficiency: <strong style={{ color: 'var(--color-success-600)' }}>{stats.collectionEfficiency}%</strong>
            </span>
          </div>
        </div>

        {/* Active Loans */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Loan Accounts</span>
            <div style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', padding: '6px', borderRadius: 'var(--radius-sm)' }}><Users size={16} /></div>
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {stats.activeLoansCount.toLocaleString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success-600)' }}>
              <ArrowUpRight size={12} style={{ marginRight: '2px' }} /> +4.2%
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>new originations</span>
          </div>
        </div>

        {/* NPA Exposure */}
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderTop: '3px solid var(--color-danger-500)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-danger-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NPA Exposure</span>
            <div style={{ background: 'var(--color-danger-50)', color: 'var(--color-danger-600)', padding: '6px', borderRadius: 'var(--radius-sm)' }}><AlertTriangle size={16} /></div>
          </div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {formatFinancial(stats.npaAmount)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'var(--space-2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-danger-600)', background: 'var(--color-danger-50)', padding: '2px 6px', borderRadius: '4px' }}>
              <ArrowUpRight size={12} style={{ marginRight: '2px' }} /> {stats.npaPercentage}%
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>of portfolio at risk</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>

        {/* Main Content Area (Left/Center) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
            {/* Portfolio Performance */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Portfolio Performance</h3>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Expected vs Collected vs NPA</p>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm"><MoreHorizontal size={16} /></button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickFormatter={(val) => `₹${val / 100000}L`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="expected" stroke="var(--color-primary-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorExpected)" name="Expected" />
                  <Area type="monotone" dataKey="collected" stroke="var(--color-success-500)" strokeWidth={2} fill="none" name="Collected" />
                  <Area type="monotone" dataKey="npa" stroke="var(--color-danger-500)" strokeWidth={1.5} strokeDasharray="3 3" fill="none" name="NPA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Distribution</h3>
                <button className="btn btn-ghost btn-icon btn-sm"><PieChartIcon size={14} /></button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={loanDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {loanDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatFinancial(val)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Premium Data Table */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)' }}>Recent Originations</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>Latest processed loan applications.</p>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => navigate('/loans')}>View All Registry <ArrowRight size={14} /></button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-bg)', borderBottom: '1px solid var(--surface-border)' }}>
                    <th style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loan ID</th>
                    <th style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant</th>
                    <th style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                    <th style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '12px 20px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan, idx) => (
                    <tr key={loan.id} style={{ borderBottom: idx === recentLoans.length - 1 ? 'none' : '1px solid var(--surface-border)', transition: 'background 0.2s' }} className="hover-highlight">
                      <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 500, color: 'var(--color-primary-700)' }}>{loan.id}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{loan.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Applied: {loan.applicationDate}</div>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>{loan.loanType}</td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
                        {formatCurrency(loan.principal)}
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: loan.status === 'Approved' || loan.status === 'Disbursed' || loan.status === 'Active' ? 'var(--color-success-50)' :
                            loan.status === 'Under Review' || loan.status === 'Applied' ? 'var(--color-warning-50)' : 'var(--color-danger-50)',
                          color: loan.status === 'Approved' || loan.status === 'Disbursed' || loan.status === 'Active' ? 'var(--color-success-700)' :
                            loan.status === 'Under Review' || loan.status === 'Applied' ? 'var(--color-warning-700)' : 'var(--color-danger-700)',
                        }}>
                          {loan.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                        <button className="btn btn-ghost btn-icon btn-sm" title="View Details"><ChevronRight size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Area (Approvals & Activity) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

          {/* Priority Workflow */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--surface-border)', background: 'var(--surface-bg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning-500)' }}></div>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Action Required</h3>
              <span style={{ marginLeft: 'auto', background: 'var(--color-warning-100)', color: 'var(--color-warning-700)', fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                {pendingApprovals.length} Pending
              </span>
            </div>
            <div>
              {pendingApprovals.length > 0 ? pendingApprovals.map((loan, idx) => (
                <div key={loan.id} style={{
                  padding: '16px 20px',
                  borderBottom: idx === pendingApprovals.length - 1 ? 'none' : '1px solid var(--surface-border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }} className="hover-highlight">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{loan.customerName}</div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{formatCurrency(loan.principal)}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>ID: {loan.id} • {loan.loanType}</div>
                    <button style={{
                      background: 'var(--surface-bg)',
                      border: '1px solid var(--surface-border)',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}>Review</button>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                  <CheckCircle size={24} style={{ color: 'var(--color-success-500)', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>All caught up!</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No pending approvals in queue.</div>
                </div>
              )}
            </div>
          </div>

          {/* Mini Collections Trend */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Collections Trend</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Last 7 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={collectionTrend} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} dy={5} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip cursor={{ fill: 'var(--surface-bg)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontSize: '12px' }} formatter={(val) => `₹${val.toLocaleString()}`} />
                <Bar dataKey="amount" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
}
