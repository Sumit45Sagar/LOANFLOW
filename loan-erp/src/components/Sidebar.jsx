import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Wallet, AlertTriangle,
  BookOpen, BarChart3, Settings, Shield, ChevronLeft, ChevronRight,
  Target, UserCheck, CreditCard, HelpCircle, Bell
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/leads', label: 'Lead Management', icon: Target, badge: null },
      { path: '/customers', label: 'Customers (CRM)', icon: Users },
      { path: '/loans', label: 'Loan Origination', icon: FileText },
      { path: '/loan-management', label: 'Loan Management', icon: CreditCard },
      { path: '/collections', label: 'Collections', icon: AlertTriangle },
    ],
  },
  {
    title: 'Finance',
    items: [
      { path: '/accounting', label: 'Accounting & GL', icon: BookOpen },
      { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Administration',
    items: [
      { path: '/user-management', label: 'User Management', icon: UserCheck },
      { path: '/audit-log', label: 'Audit Trail', icon: Shield },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">LF</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">LoanFlow</span>
          <span className="sidebar-brand-sub">ERP System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive && (item.path === '/' ? location.pathname === '/' : true) ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                <span className="nav-item-icon">
                  <item.icon size={18} />
                </span>
                <span className="sidebar-nav-label">{item.label}</span>
                {item.badge && <span className="nav-item-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer with toggle */}
      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
