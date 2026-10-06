import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';
import { formatCurrency } from '../data/mockData';

const COLORS = ['#4c6ef5', '#20c997', '#fab005', '#fa5252', '#7950f2', '#ff922b'];

export default function Reports({ data, chartData }) {
  const regulatoryReports = [
    { id: 'REG01', name: 'NPA Provisioning Report', desc: 'Summary of Non-Performing Assets and required provisions as per RBI guidelines.', freq: 'Monthly' },
    { id: 'REG02', name: 'Priority Sector Lending (PSL)', desc: 'Report on loans disbursed to priority sectors.', freq: 'Quarterly' },
    { id: 'REG03', name: 'Credit Information Company (CIC) Data', desc: 'CIBIL / Experian data submission format.', freq: 'Monthly' },
    { id: 'REG04', name: 'ALM Report', desc: 'Asset Liability Management - Structural Liquidity.', freq: 'Monthly' },
  ];

  const operationalReports = [
    { id: 'OP01', name: 'Daily Disbursement Register', desc: 'List of all loans disbursed on a given date.', freq: 'Daily' },
    { id: 'OP02', name: 'Collection Efficiency (Agent-wise)', desc: 'Performance of collection agents.', freq: 'Weekly' },
    { id: 'OP03', name: 'Lead Conversion Funnel', desc: 'Analysis of lead generation and conversion rates.', freq: 'Monthly' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Business intelligence, regulatory reporting, and data exports</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => alert('Date Range picker opened (Mock)')}><Calendar size={16} /> Date Range</button>
          <button className="btn btn-primary" onClick={() => alert('Exporting all reports to CSV/PDF... (Mock)')}><Download size={16} /> Export All</button>
        </div>
      </div>

      <div className="tabs">
        <button className="tab active">Dashboards</button>
        <button className="tab">Regulatory Reports</button>
        <button className="tab">Operational Reports</button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <span className="chart-card-title">Lead Conversion Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.leadConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" name="Total Leads" stroke="#4c6ef5" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="converted" name="Converted" stroke="#20c997" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <span className="chart-card-title">Risk Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData.riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="category" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {chartData.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#20c997' : index === 1 ? '#fab005' : '#fa5252'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="form-row">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Regulatory Reporting Templates</span>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Frequency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {regulatoryReports.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{r.desc}</div>
                    </td>
                    <td><span className="badge badge-neutral">{r.freq}</span></td>
                    <td><button className="btn btn-sm btn-secondary" onClick={() => alert('Generating report... (Mock)')}><Download size={14} /> Generate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Operational Reports</span>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Frequency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {operationalReports.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{r.desc}</div>
                    </td>
                    <td><span className="badge badge-neutral">{r.freq}</span></td>
                    <td><button className="btn btn-sm btn-secondary" onClick={() => alert('Generating report... (Mock)')}><Download size={14} /> Generate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
