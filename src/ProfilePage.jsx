import { useState, useEffect } from 'react';
import './index.css';

export default function ProfilePage({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', city: '', workType: '', vehicle: 'bike', upi: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('smartShieldUserData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setFormData({ ...formData, ...parsed });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('smartShieldUserData', JSON.stringify(formData));
      setIsSaving(false);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
    }, 800);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="header animate-slide-up" style={{ marginBottom: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>Profile</h1>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: '600' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Close
        </button>
      </div>

      {showSavedMsg && (
        <div className="animate-slide-up" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', padding: '16px', borderRadius: '16px', color: '#6ee7b7', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Profile Settings Saved Successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="animate-slide-up delay-100" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px' }}>
        
        <div className="info-card" style={{ padding: '24px', margin: 0 }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>Personal Identity</h3>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="label" htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="label" htmlFor="city">Operating City (Must match GPS)</label>
            <input type="text" id="city" name="city" className="input-field" value={formData.city} onChange={handleChange} required />
          </div>
        </div>

        <div className="info-card animate-slide-up delay-200" style={{ padding: '24px', margin: 0 }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>Delivery Work Details</h3>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="label" htmlFor="workType">Primary Platform</label>
            <select id="workType" name="workType" className="input-field" value={formData.workType} onChange={handleChange} required style={{ color: 'white' }}>
              <option value="food">Food Delivery (Zomato/Swiggy)</option>
              <option value="grocery">Grocery (Zepto/Blinkit)</option>
              <option value="ecommerce">E-commerce (Amazon)</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="label" htmlFor="vehicle">Delivery Vehicle Type</label>
            <select id="vehicle" name="vehicle" className="input-field" value={formData.vehicle} onChange={handleChange} required style={{ color: 'white' }}>
              <option value="bike">Motorcycle / Scooter</option>
              <option value="cycle">Bicycle</option>
              <option value="ev">Electric Vehicle (EV)</option>
            </select>
          </div>
        </div>

        <div className="info-card animate-slide-up delay-300" style={{ padding: '24px', margin: 0, borderColor: 'rgba(59, 130, 246, 0.4)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0,0,0,0))' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '8px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Payout Destination
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: '500' }}>This is where your instant parametric disruption claims will be credited.</p>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="label" htmlFor="upi">Banking UPI ID</label>
            <input type="text" id="upi" name="upi" className="input-field" placeholder="e.g. yourname@ybl" value={formData.upi} onChange={handleChange} required />
          </div>
        </div>

        <div className="bottom-action animate-slide-up delay-400" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '432px' }}>
            <button type="submit" className="button-primary" disabled={isSaving} style={{ padding: '20px', fontSize: '1.15rem' }}>
              {isSaving ? 'Processing...' : 'Save Profile Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
