import { useState } from 'react';

export default function SettingsPage() {
  const [address, setAddress] = useState('29 B, South End Park, Kolkata, West Bengal 700029');
  const [email, setEmail] = useState('hello@chhumchhum.com');
  const [phone, setPhone] = useState('+91 99034 84121');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Settings</h1>
      <div className="form-grid" style={{ maxWidth: '600px' }}>
        <div className="form-section">
          <h3 className="form-section-title">Store Information</h3>
          <label className="admin-label">Store Address</label>
          <textarea className="admin-textarea" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
          <label className="admin-label">Contact Email</label>
          <input className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="admin-label">Phone / WhatsApp</label>
          <input className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="admin-btn primary" style={{ marginTop: '1rem' }} onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
