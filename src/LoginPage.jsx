import { useState, useEffect } from 'react';
import './index.css';

export default function LoginPage({ onNavigate }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('Touch ID to Authenticate');
  
  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus('Verifying Biometrics...');
    
    setTimeout(() => {
      setScanStatus('Identity Confirmed');
      setTimeout(() => {
        // Auto-detect existing user flow
        const hasData = localStorage.getItem('smartShieldUserData');
        if (hasData) onNavigate('dashboard');
        else onNavigate('onboarding');
      }, 1000);
    }, 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      <div className="header animate-slide-up" style={{ textAlign: 'center' }}>
        <div style={{ background: 'var(--accent-gradient)', display: 'inline-flex', padding: '16px', borderRadius: '24px', marginBottom: '20px', boxShadow: '0 10px 40px var(--accent-glow)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h1 style={{ fontSize: '2.5rem' }}><span className="text-gradient">SmartShield</span></h1>
        <p style={{ marginTop: '8px', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI Income Protector</p>
      </div>

      <div className="animate-slide-up delay-200" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
         <div 
           onClick={handleScan}
           style={{ 
             width: '140px', height: '140px', borderRadius: '50%', 
             background: isScanning ? 'var(--surface-light)' : 'var(--surface-glass)', 
             border: `2px solid ${isScanning ? 'var(--accent-hover)' : 'var(--accent-primary)'}`, 
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             cursor: 'pointer', boxShadow: isScanning ? '0 0 60px var(--accent-glow)' : '0 10px 30px rgba(0,0,0,0.3)',
             transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
             animation: isScanning ? 'pulse-glow 1.5s infinite' : 'pulse-active 3s infinite'
           }}
         >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke={scanStatus === 'Identity Confirmed' ? 'var(--success-color)' : (isScanning ? 'white' : 'var(--accent-primary)')} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.4s' }}>
                <path d="M22 17c0 2-4.5 4-10 4M2 17c0 2 4.5 4 10 4m0-4c-3.33-1.33-5-3.33-5-6v-1a5 5 0 0 1 10 0v1c0 2.67-1.67 4.67-5 6z"></path>
                <path d="M12 2A4 4 0 0 0 8 6"></path>
                <path d="M16 6a4 4 0 0 1-4-4"></path>
            </svg>
         </div>
         <div style={{ color: scanStatus === 'Identity Confirmed' ? 'var(--success-color)' : (isScanning ? 'white' : 'var(--text-secondary)'), fontWeight: '700', fontSize: '1.05rem', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.4s' }}>
            {scanStatus}
         </div>
      </div>
      
    </div>
  );
}
