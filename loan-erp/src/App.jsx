import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import Customers from './pages/Customers';
import LoanOrigination from './pages/LoanOrigination';
import LoanManagement from './pages/LoanManagement';
import Collections from './pages/Collections';
import Accounting from './pages/Accounting';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import { initializeData, saveData, getDashboardStats, getChartData } from './data/mockData';

function App() {
  const [data, setData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const initial = initializeData();
    setData(initial);
  }, []);

  const handleUpdateData = (newData) => {
    setData(newData);
    saveData(newData);
  };

  const handleClearNotification = (id) => {
    if (!data) return;
    const updated = {
      ...data,
      notifications: data.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    };
    handleUpdateData(updated);
  };

  if (!data) return <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>Loading ERP System...</div>;

  const stats = getDashboardStats(data);
  const chartData = getChartData();

  return (
    <Router>
      <div className="app-layout">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Header notifications={data.notifications} onClearNotification={handleClearNotification} />
          <Routes>
            <Route path="/" element={<Dashboard data={data} stats={stats} chartData={chartData} />} />
            <Route path="/leads" element={<LeadManagement data={data} onUpdate={handleUpdateData} />} />
            <Route path="/customers" element={<Customers data={data} onUpdate={handleUpdateData} />} />
            <Route path="/loans" element={<LoanOrigination data={data} onUpdate={handleUpdateData} />} />
            <Route path="/loan-management" element={<LoanManagement data={data} onUpdate={handleUpdateData} />} />
            <Route path="/collections" element={<Collections data={data} onUpdate={handleUpdateData} />} />
            <Route path="/accounting" element={<Accounting data={data} onUpdate={handleUpdateData} />} />
            <Route path="/reports" element={<Reports data={data} chartData={chartData} />} />
            <Route path="/user-management" element={<UserManagement data={data} onUpdate={handleUpdateData} />} />
            <Route path="/audit-log" element={<AuditLog data={data} />} />
            <Route path="/settings" element={<Settings data={data} onUpdate={handleUpdateData} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
