import { useState, useEffect } from 'react';
import './index.css';

export default function PlanSelectionPage({ onNavigate }) {
  const [city, setCity] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    const data = localStorage.getItem('smartShieldUserData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setCity(parsed.city || '');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const plans = [
    { id: 'basic', price: 10, protection: 500, name: 'Basic Shield' },
    { id: 'standard', price: 20, protection: 1000, name: 'Standard Shield' },
    { id: 'premium', price: 30, protection: 1500, name: 'Premium Shield' },
  ];

  const displayHighRisk = city.length > 0;
  const handleSelect = (planId) => setSelectedPlan(planId);

  const initiatePayment = () => {
    if (!selectedPlan) return;
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      localStorage.setItem('smartShieldPlan', selectedPlan);
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      onNavigate('dashboard');
    }, 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '120px', position: 'relative' }}>
      
      {/* Dim Background Overlay when Payment Modal is Open */}
      {showPaymentModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)', zIndex: 40 }}></div>
      )}

      <div className="header animate-slide-up" style={{ marginBottom: '32px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.4rem' }}>Select Policy</h1>
        <p style={{ marginTop: '8px', fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Weekly AI-Driven Insurance</p>
      </div>

      {displayHighRisk && (
        <div className="info-card animate-slide-up delay-100" style={{ border: '1px solid rgba(245, 158, 11, 0.4)', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(0,0,0,0))', padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '14px', flexShrink: 0 }}>
            <svg fill="none" stroke="var(--warning-color)" viewBox="0 0 24 24" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--warning-color)', fontSize: '1.05rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>High Risk Area: {city}</strong><br/>
            AI models strongly predict elevated disruptions this week. Recommended plan: ₹20 / wk
          </div>
        </div>
      )}

      <div className="plans-container animate-slide-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {plans.map((plan) => {
          const isRecommended = displayHighRisk && plan.price === 20;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <div 
              key={plan.id}
              onClick={() => handleSelect(plan.id)}
              className="info-card"
              style={{
                border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: isSelected ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.5))' : 'var(--surface-glass)',
                padding: '28px', cursor: 'pointer', position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 10px 40px var(--accent-glow)' : '0 10px 30px rgba(0,0,0,0.3)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                marginBottom: 0
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute', top: '-14px', right: '24px',
                  background: 'var(--warning-color)', color: '#fff', fontSize: '0.75rem', fontWeight: '800',
                  padding: '6px 14px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.5)',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  AI Recommended
                </div>
              )}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '24px',
                  background: 'var(--success-color)', color: 'white', width: '28px', height: '28px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)',
                  animation: 'pulse-glow 2s infinite'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{plan.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Weekly Policy</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', color: isSelected ? 'var(--accent-hover)' : 'var(--accent-primary)' }}>
                    ₹{plan.price}
                  </span>
                  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>/wk</span>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>Income Protection up to ₹{plan.protection}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="bottom-action animate-slide-up delay-300" style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <button 
            onClick={initiatePayment} 
            className="button-primary" 
            disabled={!selectedPlan}
            style={{ padding: '20px', fontSize: '1.2rem', opacity: selectedPlan ? 1 : 0.5, transform: selectedPlan ? 'translateY(0)' : 'none' }}
          >
            {selectedPlan ? `Proceed to Payment \u2192` : 'Select a Plan'}
          </button>
        </div>
      </div>

      {/* Payment Gateway Modal Mockup */}
      {showPaymentModal && (
        <div className="animate-slide-up" style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '380px',
          background: 'var(--surface-glass)', border: '1px solid var(--border-color)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 50
        }}>
          <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '8px' }}>Secure Checkout</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Authorize your unified mandate via UPI or Card.</p>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ background: '#2563eb', width: '40px', height: '24px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: 'white', fontWeight: 800, fontStyle: 'italic' }}>VISA</span>
                 </div>
                 <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>•••• 4920</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
            <span>Total To Pay</span>
            <span style={{ color: 'var(--accent-hover)' }}>₹{plans.find(p => p.id === selectedPlan)?.price} / wk</span>
          </div>

          <button onClick={confirmPayment} className="button-primary" disabled={isProcessingPayment} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
             {isProcessingPayment ? (
                <>
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line></svg>
                  Processing Bank Details...
                </>
             ) : (
                'Pay Securely \u2192'
             )}
          </button>

          {!isProcessingPayment && (
            <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '100%', padding: '12px', marginTop: '12px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
              Cancel
            </button>
          )}

          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
