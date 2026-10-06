import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Moon, Sun, HelpCircle, ChevronRight, X } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/leads': 'Lead Management',
  '/customers': 'Customers (CRM)',
  '/loans': 'Loan Origination',
  '/loan-management': 'Loan Management',
  '/collections': 'Collections',
  '/accounting': 'Accounting & GL',
  '/reports': 'Reports & Analytics',
  '/user-management': 'User Management',
  '/audit-log': 'Audit Trail',
  '/settings': 'Settings',
};

export default function Header({ notifications = [], onClearNotification }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pageTitle = PAGE_TITLES[location.pathname] || 'LoanFlow ERP';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-breadcrumbs">
          <span>LoanFlow</span>
          <ChevronRight size={14} />
          <span>{pageTitle}</span>
        </div>
      </div>

      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search loans, customers, leads... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Help">
          <HelpCircle size={18} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge" />}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              width: '340px',
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 200,
              animation: 'slideUp 150ms ease',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderBottom: '1px solid var(--surface-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>Notifications</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>{unreadCount} new</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderBottom: '1px solid var(--surface-border)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                    background: n.read ? 'transparent' : 'rgba(76, 110, 245, 0.04)',
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      marginTop: '6px',
                      flexShrink: 0,
                      background: n.type === 'danger' ? 'var(--color-danger-500)' :
                        n.type === 'warning' ? 'var(--color-warning-500)' :
                        n.type === 'success' ? 'var(--color-success-500)' : 'var(--color-primary-500)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{n.message}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-avatar" title="Sumit Sagar (Admin)">SS</div>
      </div>
    </header>
  );
}
