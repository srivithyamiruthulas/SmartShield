import { useState, useEffect } from 'react';
import './index.css';

export default function OnboardingPage({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', city: '', workType: '', vehicle: '', gearReflector: false, gearRaincoat: false, gearMask: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Dynamic AI Safety Suggestion Logic
  useEffect(() => {
    if (formData.city.length > 2) {
      if (formData.city.toLowerCase().includes('mumbai') || formData.city.toLowerCase().includes('kerala')) {
        setRiskAnalysis({ type: 'rain', msg: 'High monsoon rain risks detected in your zone. We strongly advise carrying heavy-duty rain gear and anti-slip tires to prevent road harm.' });
      } else if (formData.city.toLowerCase().includes('delhi') || formData.city.toLowerCase().includes('noida')) {
        setRiskAnalysis({ type: 'pollution', msg: 'Severe AQI (Pollution) spikes are highly probable in your zone. Wearing an N95 Mask is critical for your lung safety.' });
      } else {
        setRiskAnalysis({ type: 'general', msg: 'Standard route risks detected. Ensure you wear a high-visibility reflector jacket during night shifts.' });
      }
    } else {
      setRiskAnalysis(null);
    }
  }, [formData.city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('smartShieldUserData', JSON.stringify(formData));
      onNavigate('planSelection');
    }, 1200);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '140px' }}>
      <div className="header animate-slide-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ background: 'var(--accent-gradient)', display: 'inline-flex', padding: '16px', borderRadius: '24px', marginBottom: '20px', boxShadow: '0 10px 40px var(--accent-glow)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h1 style={{ fontSize: '2.2rem' }}><span className="text-gradient">Safety Profiler</span></h1>
        <p style={{ marginTop: '8px', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Step 1: AI Risk Assessment</p>
      </div>

      <div className="info-card animate-slide-up delay-100" style={{ background: 'var(--surface-glass)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '14px', flexShrink: 0 }}>
          <svg fill="none" stroke="var(--success-color)" viewBox="0 0 24 24" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.5 }}>
          Our priority is your physical safety. Tell us about your delivery setup so our AI can suggest the best ways to prevent harm on the road.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="animate-slide-up delay-200" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '20px' }}>
        
        {/* Core Identity */}
        <div className="info-card" style={{ padding: '20px', margin: 0 }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Driver Details
            </h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <input type="text" id="name" name="name" className="input-field" placeholder="Full Legal Name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <select id="workType" name="workType" className="input-field" value={formData.workType} onChange={handleChange} required style={{ color: formData.workType ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <option value="" disabled>Primary Delivery Platform</option>
                <option value="food">Food Delivery (Zomato/Swiggy/UberEats)</option>
                <option value="grocery">Grocery (Zepto/Blinkit/Instacart)</option>
                <option value="ecommerce">E-commerce Parcels (Amazon/Flipkart)</option>
              </select>
            </div>
        </div>

        {/* Risk & Safety Mapping */}
        <div className="info-card" style={{ padding: '20px', margin: 0 }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon></svg>
                Route Safety Profiler
            </h3>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <input type="text" id="city" name="city" className="input-field" placeholder="Operating City (e.g. Delhi, Mumbai)" value={formData.city} onChange={handleChange} required />
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <select id="vehicle" name="vehicle" className="input-field" value={formData.vehicle} onChange={handleChange} required style={{ color: formData.vehicle ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                <option value="" disabled>Delivery Vehicle Type</option>
                <option value="bike">Motorcycle (High Speed/High Risk)</option>
                <option value="cycle">Bicycle (High Traffic Risk)</option>
                <option value="ev">Electric Scooter (Battery Rain Risk)</option>
              </select>
            </div>

            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Current Safety Gear Checked:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '14px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', cursor: 'pointer', color: formData.gearReflector ? 'white' : 'var(--text-secondary)' }}>
                    <input type="checkbox" name="gearReflector" checked={formData.gearReflector} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                    High-Vis Reflector Jacket
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', cursor: 'pointer', color: formData.gearRaincoat ? 'white' : 'var(--text-secondary)' }}>
                    <input type="checkbox" name="gearRaincoat" checked={formData.gearRaincoat} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                    Heavy Duty Raincoat
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', cursor: 'pointer', color: formData.gearMask ? 'white' : 'var(--text-secondary)' }}>
                    <input type="checkbox" name="gearMask" checked={formData.gearMask} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }} />
                    N95 Anti-Pollution Mask
                </label>
            </div>
        </div>

        {/* Dynamic AI Safety Suggestion Box */}
        {riskAnalysis && (
            <div className="animate-slide-up" style={{ 
                background: riskAnalysis.type === 'rain' ? 'rgba(59, 130, 246, 0.15)' : (riskAnalysis.type === 'pollution' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(168, 85, 247, 0.15)'), 
                border: `1px solid ${riskAnalysis.type === 'rain' ? '#3b82f6' : (riskAnalysis.type === 'pollution' ? '#f59e0b' : '#a855f7')}`, 
                padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' 
            }}>
                <div style={{ fontSize: '1.8rem' }}>
                    {riskAnalysis.type === 'rain' ? '🌧️' : (riskAnalysis.type === 'pollution' ? '😷' : '🛡️')}
                </div>
                <div>
                    <strong style={{ color: 'white', display: 'block', marginBottom: '4px', fontSize: '1.05rem' }}>AI Safety Pulse</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        {riskAnalysis.msg}
                    </span>
                    
                    {riskAnalysis.type === 'rain' && !formData.gearRaincoat && (
                        <div style={{ marginTop: '10px', color: '#fca5a5', fontSize: '0.85rem', fontWeight: '700' }}>⚠️ Warning: You have not checked "Heavy Duty Raincoat"! Please acquire one to safely deliver in {formData.city}.</div>
                    )}
                    {riskAnalysis.type === 'pollution' && !formData.gearMask && (
                        <div style={{ marginTop: '10px', color: '#fca5a5', fontSize: '0.85rem', fontWeight: '700' }}>⚠️ Warning: You have not checked "N95 Mask"! Please protect your lungs in {formData.city}'s hazardous AQI zones.</div>
                    )}
                </div>
            </div>
        )}

        <div className="bottom-action animate-slide-up delay-300" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '432px' }}>
            <button type="submit" className="button-primary" disabled={isSubmitting || formData.city.length < 2 || !formData.workType || !formData.vehicle} style={{ padding: '20px', fontSize: '1.15rem' }}>
              {isSubmitting ? 'Analyzing Risk Core...' : 'Analyze My Risk \u2192'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
