import React, { useState } from 'react';
import { Search, Plus, UserPlus, Shield, MoreHorizontal, Edit, Trash2, X } from 'lucide-react';
import { ROLES } from '../data/mockData';

export default function UserManagement({ data, onUpdate }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = data.users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser({
        id: `U00${data.users.length + 1}`,
        name: '',
        email: '',
        role: 'Loan Officer',
        status: 'Active',
        lastLogin: 'Never',
        avatar: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) return;

    let updatedUsers;
    const existingIndex = data.users.findIndex(u => u.id === editingUser.id);
    
    // Auto-generate initials for avatar if empty
    const updatedUser = { ...editingUser };
    if (!updatedUser.avatar) {
      const names = updatedUser.name.split(' ');
      updatedUser.avatar = names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase() 
        : updatedUser.name.substring(0, 2).toUpperCase();
    }

    if (existingIndex >= 0) {
      updatedUsers = [...data.users];
      updatedUsers[existingIndex] = updatedUser;
    } else {
      updatedUsers = [...data.users, updatedUser];
    }

    onUpdate({ ...data, users: updatedUsers });
    handleCloseModal();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = data.users.filter(u => u.id !== id);
      onUpdate({ ...data, users: updatedUsers });
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management (RBAC)</h1>
          <p className="page-subtitle">Manage system users, roles, and access permissions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}><UserPlus size={16} /> Add User</button>
      </div>

      <div className="data-table-wrapper">
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            <div className="table-search">
              <Search size={14} className="table-search-icon" />
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: '150px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <span className="text-sm text-muted">{filteredUsers.length} users</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', flexShrink: 0 }}>{user.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ display: 'inline-flex', gap: '4px' }}>
                      <Shield size={12} /> {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-dot ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-sm)' }}>{user.lastLogin}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleOpenModal(user)}><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger-400)' }} onClick={() => handleDeleteUser(user.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && editingUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveUser}>
              <div className="modal-header">
                <div className="modal-title">{data.users.some(u => u.id === editingUser.id) ? 'Edit User' : 'Add New User'}</div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={handleCloseModal}>
                  <X size={18} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Full Name</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}
                      value={editingUser.name} 
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Email Address</label>
                    <input 
                      type="email" 
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}
                      value={editingUser.email} 
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Role</label>
                      <select 
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}
                        value={editingUser.role} 
                        onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>Status</label>
                      <select 
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}
                        value={editingUser.status} 
                        onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
