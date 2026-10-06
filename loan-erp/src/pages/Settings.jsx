import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings({ data, onUpdate }) {
  const [settings, setSettings] = useState(data.settings);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({ ...data, settings });
    alert('Settings saved successfully!');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure global ERP parameters and business rules.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save Changes</button>
      </div>

      <div className="form-row">
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header">
            <span className="card-title">General Preferences</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" value={settings.companyName} onChange={e => handleChange('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Base Currency</label>
              <select className="form-select" value={settings.currency} onChange={e => handleChange('currency', e.target.value)}>
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Format</label>
              <select className="form-select" value={settings.dateFormat} onChange={e => handleChange('dateFormat', e.target.value)}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-header">
            <span className="card-title">Business Rules (Loan Defaults)</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Default Interest Rate (% p.a.)</label>
              <input className="form-input" type="number" value={settings.defaultInterestRate} onChange={e => handleChange('defaultInterestRate', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Late Payment Penalty (%)</label>
              <input className="form-input" type="number" value={settings.lateFeePercent} onChange={e => handleChange('lateFeePercent', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Grace Period (Days)</label>
              <input className="form-input" type="number" value={settings.gracePeriodDays} onChange={e => handleChange('gracePeriodDays', Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
