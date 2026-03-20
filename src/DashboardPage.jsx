import { useState, useEffect } from 'react';
import './index.css';

export default function DashboardPage({ onNavigate }) {
  const [coverageAmount, setCoverageAmount] = useState(1000);
  const [remainingCoverage, setRemainingCoverage] = useState(1000);
  
  // Real-time states
  const [weatherCondition, setWeatherCondition] = useState('Clear / Sunny');
  const [workStatus, setWorkStatus] = useState('Normal');
  const [claimStatus, setClaimStatus] = useState('No active claim');
  const [activeAlert, setActiveAlert] = useState(null);
  const [lastPayout, setLastPayout] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [totalPayoutsReceived, setTotalPayoutsReceived] = useState(0);

  // Advanced Fraud Logic States (7 Layers)
  const [simGPSMismatch, setSimGPSMismatch] = useState(false);
  const [simActiveDeliveries, setSimActiveDeliveries] = useState(false);
  const [simWrongTime, setSimWrongTime] = useState(false);
  const [simSameDevice, setSimSameDevice] = useState(false);
  const [simAbnormalPattern, setSimAbnormalPattern] = useState(false);
  const [simLightEvent, setSimLightEvent] = useState(false);
  
  const [claimedEvents, setClaimedEvents] = useState([]);
  
  // Verification UI State (0 = hidden, 1-7 = verifying layer, 8 = success)
  const [verifyingLayer, setVerifyingLayer] = useState(0);
  const [failedLayerConfig, setFailedLayerConfig] = useState(null);

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your AI Support Assistant. How can I protect you today?' }
  ]);

  useEffect(() => {
    const plan = localStorage.getItem('smartShieldPlan');
    let initial = 1000;
    if (plan === 'basic') initial = 500;
    else if (plan === 'standard') initial = 1000;
    else if (plan === 'premium') initial = 1500;
    
    setCoverageAmount(initial);
    setRemainingCoverage(initial);
  }, []);

  const triggerDisruption = async (type) => {
    if (isProcessing) return;

    if (remainingCoverage <= 0) {
      setActiveAlert('❌ Weekly coverage exhausted. No more claims can proceed this week.');
      return;
    }

    let weather = '';
    let disruptionName = '';
    if (type === 'rain') { weather = simLightEvent ? 'Light Rain (5mm)' : 'Heavy Rain (150mm)'; disruptionName = 'Rainfall Event'; }
    else if (type === 'pollution') { weather = 'Severe AQI (450)'; disruptionName = 'Severe Pollution'; }
    else if (type === 'curfew') { weather = 'City Curfew Active'; disruptionName = 'City Curfew'; }

    setWeatherCondition(weather);
    setWorkStatus('Disrupted');
    setClaimStatus('Running 7-Layer Verification...');
    setActiveAlert('⏳ Initiating Deep Smart Cross-Check System...');
    setIsProcessing(true);
    setVerifyingLayer(1);
    setFailedLayerConfig(null);

    // Define 7 verification layers
    const layers = [
      { id: 1, name: 'GPS & Geofencing', check: simGPSMismatch, failMsg: 'User outside Disruption Zone (Area Mismatch)' },
      { id: 2, name: 'Platform Activity', check: simActiveDeliveries, failMsg: 'Active deliveries detected during disruption event. User was earning.' },
      { id: 3, name: 'Time Validation', check: simWrongTime, failMsg: 'Event occurred outside user recorded working hours (e.g., 3 AM).' },
      { id: 4, name: 'Device Fingerprinting', check: simSameDevice, failMsg: 'Multiple identical claims from same IP / Device ID flagged.' },
      { id: 5, name: 'Claim Frequency', check: claimedEvents.length >= 3, failMsg: 'Maximum weekly claim frequency exceeded (> 3 payouts/week).' },
      { id: 6, name: 'Behavior Analysis (AI)', check: simAbnormalPattern, failMsg: 'AI flagged highly suspicious & sudden abnormal claiming pattern.' },
      { id: 7, name: 'Event Severity', check: simLightEvent, failMsg: 'Disruption severity below automatic payout threshold (Light event).' }
    ];

    // Simulate multi-layer verification checks
    for (let i = 0; i < layers.length; i++) {
        setVerifyingLayer(layers[i].id);
        
        // Wait 600ms per layer check to look impressive
        await new Promise(r => setTimeout(r, 600));

        if (layers[i].check) {
            // FAILED at this layer
            const failReason = layers[i].failMsg;
            setFailedLayerConfig(layers[i]);
            setClaimStatus('Suspicious Activity Detected');
            setActiveAlert(`🚨 BLOCK at Layer ${layers[i].id}: ${failReason}`);
            setIsProcessing(false);

            // Log Fraud into localStorage for Admin Panel
            const existingFrauds = JSON.parse(localStorage.getItem('smartShieldFrauds') || '[]');
            const newFraud = { 
                id: Date.now(), 
                user: 'Protector User', 
                reason: `L${layers[i].id} | ${failReason}`, 
                status: 'BLOCKED' 
            };
            localStorage.setItem('smartShieldFrauds', JSON.stringify([newFraud, ...existingFrauds]));
            return;
        }
    }

    // Passed all 7 layers!
    setVerifyingLayer(8);
    setClaimStatus('Valid Claim Verified');
    const fixedPayout = Math.min(300, remainingCoverage);
    
    setTimeout(() => {
      setClaimedEvents(prev => [...prev, type]);
      setLastPayout(fixedPayout);
      setRemainingCoverage(prev => Math.max(0, prev - fixedPayout));
      setTotalPayoutsReceived(prev => prev + fixedPayout);
      
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
        reason: disruptionName,
        amount: fixedPayout
      };
      setPayoutHistory(prev => [newHistoryItem, ...prev]);

      setActiveAlert(`✅ 7-Layer Verification Passed. ₹${fixedPayout} instantly credited to account!`);
      setIsProcessing(false);
      setTimeout(() => setVerifyingLayer(0), 3000); // hide verifier after delay
    }, 1000);
  };

  const processSOS = () => {
    if (isProcessing) return;
    setActiveAlert('🚨 EMERGENCY SOS TRIGGERED. Support team is calling you now.');
    setWorkStatus('Emergency');
    setWeatherCondition('Unknown');
  };

  const resetSimulation = () => {
    setWeatherCondition('Clear / Sunny');
    setWorkStatus('Normal');
    setClaimStatus('No active claim');
    setActiveAlert(null);
    setLastPayout(0);
    setIsProcessing(false);
    setPayoutHistory([]);
    setClaimedEvents([]);
    setTotalPayoutsReceived(0);
    setRemainingCoverage(coverageAmount);
    setVerifyingLayer(0);
    setFailedLayerConfig(null);
  };

  const getClaimStatusColor = () => {
    if (claimStatus === 'Suspicious Activity Detected') return 'var(--danger-color)'; 
    if (claimStatus === 'Valid Claim Verified') return 'var(--success-color)'; 
    if (claimStatus === 'Running 7-Layer Verification...') return '#a855f7'; 
    return 'var(--text-secondary)'; 
  };

  const getAlertStyle = () => {
    if (!activeAlert) return {};
    if (activeAlert.includes('🚨')) return { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--danger-color)', color: '#fca5a5', shadow: 'rgba(239,68,68,0.2)' };
    if (activeAlert.includes('✅')) return { bg: 'rgba(16, 185, 129, 0.1)', border: 'var(--success-color)', color: '#6ee7b7', shadow: 'rgba(16,185,129,0.2)' };
    if (activeAlert.includes('❌') || activeAlert.includes('⚠️')) return { bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--danger-color)', color: '#fca5a5', shadow: 'rgba(239,68,68,0.2)' };
    return { bg: 'rgba(168, 85, 247, 0.15)', border: '#c084fc', color: '#e879f9', shadow: 'rgba(168,85,247,0.3)' };
  };

  const alertStyle = getAlertStyle();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let botReply = 'I am your AI Support agent. Try pressing SOS if your issue is urgent.';
      const inputLower = userMsg.text.toLowerCase();
      
      if (inputLower.includes('claim') || inputLower.includes('blocked') || inputLower.includes('fraud')) {
        botReply = 'Please review the 7-layer verification checks. Mismatches in Location, Device IP, or Activity during disruptions may trigger blocks automatically.';
      } else if (inputLower.includes('coverage') || inputLower.includes('plan')) {
        botReply = `Your plan protects up to ₹${coverageAmount} per week. You have ₹${remainingCoverage} remaining total.`;
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  const chartPoints = `0,50 20,45 40,65 60,30 80,40 100,10 120,20 140,5`;

  const verificationLayerNames = [
    'Layer 1: GPS & Geofencing Check',
    'Layer 2: Platform Activity Matching',
    'Layer 3: Time-Based Validation',
    'Layer 4: Device & IP Fingerprinting',
    'Layer 5: Claim Frequency Analysis',
    'Layer 6: Behavior Pattern Analysis (AI)',
    'Layer 7: Event Severity Matching'
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '32px 24px 100px 24px' }}>
      <div className="header animate-slide-up" style={{ marginBottom: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Dashboard</h1>
          <p style={{ marginTop: '2px', fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Welcome back, Protector</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setActiveAlert('🔔 You have 1 unread notification: "Storm incoming tomorrow, please drive carefully".')} style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '16px', background: 'var(--surface-glass)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className="pulse-active" style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', background: 'var(--danger-color)', borderRadius: '50%' }}></span>
          </button>
          <button onClick={() => onNavigate('profile')} style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--surface-glass)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>
        </div>
      </div>

      {activeAlert && (
         <div className="animate-slide-up" style={{
             background: alertStyle.bg, border: `1px solid ${alertStyle.border}`, color: alertStyle.color,
             padding: '16px 20px', borderRadius: '16px', marginBottom: '20px', fontWeight: '700', fontSize: '0.95rem',
             display: 'flex', alignItems: 'center', gap: '12px', boxShadow: `0 8px 30px ${alertStyle.shadow}`,
             backdropFilter: 'blur(10px)'
         }}>
             {isProcessing && verifyingLayer === 0 && (
               <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                 <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                </svg>
             )}
             {activeAlert}
         </div>
      )}

      {/* Dynamic 7-Layer Verification Output UI */}
      {verifyingLayer > 0 && (
         <div className="info-card animate-slide-up" style={{ border: '1px solid #c084fc', background: 'rgba(168, 85, 247, 0.05)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#e879f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              Smart Cross-Checking System
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               {verificationLayerNames.map((name, index) => {
                  const layerId = index + 1;
                  const isCurrent = verifyingLayer === layerId;
                  const isDone = verifyingLayer > layerId;
                  const isFailed = failedLayerConfig && failedLayerConfig.id === layerId;

                  let iconColor = 'var(--text-secondary)';
                  let icon = <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"></circle>;

                  if (isDone) {
                     iconColor = 'var(--success-color)';
                     icon = <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2.5"></path>; 
                  } else if (isFailed) {
                     iconColor = 'var(--danger-color)';
                     icon = <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5"></path>;
                  } else if (isCurrent) {
                     iconColor = '#c084fc';
                  }

                  return (
                    <div key={layerId} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: isCurrent ? '700' : '500', color: isCurrent || isDone || isFailed ? 'white' : 'var(--text-secondary)', opacity: isDone && !isFailed ? 0.8 : 1 }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: iconColor }}>
                          {isCurrent && !isFailed ? <circle cx="12" cy="12" r="10" stroke="#c084fc" strokeWidth="2.5" strokeDasharray="15 30" style={{ animation: 'spin 1.5s linear infinite' }}></circle> : icon}
                          {isDone && !isFailed && <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></polyline>}
                       </svg>
                       <span style={{ textDecoration: isFailed ? 'line-through' : 'none', color: isFailed ? 'var(--danger-color)' : 'inherit' }}>{name}</span>
                    </div>
                  );
               })}
            </div>
         </div>
      )}

      {/* 0. AI Risk Prediction Widget */}
      <div className="info-card animate-slide-up delay-100" style={{ padding: '20px', border: '1.5px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(236,72,153,0.1))', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--accent-glow)', padding: '12px', borderRadius: '14px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              Next Week Risk Prediction 
              <span style={{ background: 'var(--accent-primary)', color: 'white', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '8px', fontWeight: '800', letterSpacing: '0.05em' }}>AI</span>
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px', lineHeight: 1.4 }}>
              High chance of severe rain disrupting routes next week in your primary delivery zones.
            </p>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.3)', fontSize: '0.85rem', color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}>
              ↑ Upgrade your plan for better protection
            </div>
          </div>
        </div>
      </div>

      {/* 1. Earnings vs Protection Graph */}
      <div className="info-card animate-slide-up delay-100" style={{ marginBottom: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Protected Earnings</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={remainingCoverage > 0 ? "pulse-active" : ""} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: remainingCoverage > 0 ? 'var(--success-color)' : 'var(--danger-color)', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.95rem', color: remainingCoverage > 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '700' }}>{remainingCoverage > 0 ? 'Shield Active' : 'Shield Exhausted'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Remaining</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#60a5fa' }}>₹{remainingCoverage}</div>
          </div>
        </div>

        {/* Beautiful Mock Graph */}
        <div style={{ height: '80px', width: '100%', position: 'relative', marginTop: '8px' }}>
          <svg viewBox="0 0 140 70" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`M0,70 L0,50 L20,45 L40,65 L60,30 L80,40 L100,10 L120,20 L140,5 L140,70 Z`} fill="url(#chartGradient)" />
            <polyline points={chartPoints} fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="140" cy="5" r="4" fill="white" stroke="#60a5fa" strokeWidth="2.5" />
          </svg>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Limit</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>₹{coverageAmount}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Valid Till</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>In 7 Days</div>
          </div>
        </div>
      </div>

      {/* 2. Live Status Section */}
      <div className="animate-slide-up delay-200" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 4px' }}>Live Conditions</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="info-card" style={{ flex: 1, padding: '20px', marginBottom: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path>
                  <path d="M16 14v6"></path>
                  <path d="M8 14v6"></path>
                  <path d="M12 16v6"></path>
              </svg>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Weather</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'white' }}>{weatherCondition}</div>
          </div>
          <div className="info-card" style={{ flex: 1, padding: '20px', marginBottom: 0, border: workStatus === 'Normal' ? '1px solid var(--border-color)' : '1px solid var(--danger-color)', background: workStatus === 'Normal' ? 'var(--surface-glass)' : 'var(--danger-bg)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: workStatus === 'Normal' ? 'var(--success-bg)' : 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={workStatus === 'Normal' ? 'var(--success-color)' : 'var(--danger-color)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 {workStatus === 'Normal' ? (
                   <>
                     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                     <polyline points="22 4 12 14.01 9 11.01"></polyline>
                   </>
                 ) : (
                   <>
                     <circle cx="12" cy="12" r="10"></circle>
                     <line x1="12" y1="8" x2="12" y2="12"></line>
                     <line x1="12" y1="16" x2="12.01" y2="16"></line>
                   </>
                 )}
              </svg>
            </div>
            <div style={{ fontSize: '0.85rem', color: workStatus === 'Normal' ? 'var(--text-secondary)' : 'var(--danger-color)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Work Status</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: workStatus === 'Normal' ? 'white' : 'var(--danger-color)' }}>{workStatus}</div>
          </div>
        </div>
      </div>

      <div className="animate-slide-up delay-200" style={{ marginBottom: '24px' }}>
        <button className="sos-button" onClick={processSOS} disabled={isProcessing}>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pulse-sos" style={{ borderRadius: '50%' }}>
             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
           </svg>
           EMERGENCY SOS
        </button>
      </div>

      {/* 3 & 4. Claim & Payout Section */}
      <h3 className="animate-slide-up delay-300" style={{ fontSize: '1.25rem', margin: '0 0 12px 4px' }}>Claim Activity</h3>
      <div className="info-card animate-slide-up delay-300" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ width: '52px', height: '52px', background: claimStatus === 'No active claim' ? 'var(--surface-light)' : (claimStatus === 'Suspicious Activity Detected' ? 'rgba(239,68,68,0.2)' : 'var(--success-bg)'), borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={getClaimStatusColor()} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
             </svg>
           </div>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Claim Status</div>
             <div style={{ fontSize: '1.15rem', fontWeight: '800', color: getClaimStatusColor() }}>{claimStatus}</div>
           </div>
        </div>
        
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
           <div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Total Payouts</div>
             <div style={{ fontSize: '1.6rem', fontWeight: '800', color: totalPayoutsReceived > 0 ? 'white' : 'var(--text-secondary)' }}>₹{totalPayoutsReceived}</div>
           </div>
        </div>
      </div>

      {/* 5. Payout History */}
      {payoutHistory.length > 0 && (
        <div className="animate-slide-up delay-300" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 12px 4px' }}>Payout Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payoutHistory.map((item) => (
              <div key={item.id} className="info-card" style={{ marginBottom: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'var(--success-bg)', padding: '12px', borderRadius: '14px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <line x1="12" y1="1" x2="12" y2="23"></line>
                       <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '2px', color: 'white' }}>{item.reason}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '2px', color: 'white' }}>+ ₹{item.amount}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--success-color)', fontWeight: '700' }}>Credited</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart 7-Layer Verification Controls */}
      <h3 className="animate-slide-up delay-400" style={{ fontSize: '1.25rem', margin: '40px 0 16px 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
         </svg>
         7-Layer Advanced Dev Simulation
      </h3>
      
      {/* Simulation Toggle Switches */}
      <div className="info-card animate-slide-up delay-400" style={{ padding: '20px', marginBottom: '20px', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
           <h4 style={{ color: '#e879f9', marginBottom: '16px', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Fraud Layer Configuration</h4>
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '14px' }}>
              
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simGPSMismatch ? '#fca5a5' : 'white' }}>
                 <span>L1: Simulate GPS Disruption Mismatch</span>
                 <input type="checkbox" checked={simGPSMismatch} onChange={(e) => setSimGPSMismatch(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simActiveDeliveries ? '#fca5a5' : 'white' }}>
                 <span>L2: Simulate Active Deliveries (Earning)</span>
                 <input type="checkbox" checked={simActiveDeliveries} onChange={(e) => setSimActiveDeliveries(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simWrongTime ? '#fca5a5' : 'white' }}>
                 <span>L3: Simulate Event Outside Work Hours</span>
                 <input type="checkbox" checked={simWrongTime} onChange={(e) => setSimWrongTime(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simSameDevice ? '#fca5a5' : 'white' }}>
                 <span>L4: Simulate Suspicious Device ID (Duplicate)</span>
                 <input type="checkbox" checked={simSameDevice} onChange={(e) => setSimSameDevice(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simAbnormalPattern ? '#fca5a5' : 'white' }}>
                 <span>L6: AI Flag Abnormal Claim Pattern</span>
                 <input type="checkbox" checked={simAbnormalPattern} onChange={(e) => setSimAbnormalPattern(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer', color: simLightEvent ? '#fca5a5' : 'white' }}>
                 <span>L7: Trigger Mild Event (Below Threshold)</span>
                 <input type="checkbox" checked={simLightEvent} onChange={(e) => setSimLightEvent(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
              </label>
           </div>
      </div>

      <div className="info-card animate-slide-up delay-400" style={{ display: 'flex', gap: '12px', flexDirection: 'column', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => triggerDisruption('rain')} style={{ flex: '1 1 calc(33% - 10px)', padding: '16px 8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', color: '#60a5fa', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: '700', opacity: isProcessing ? 0.5 : 1 }} disabled={isProcessing}>
                🌧️ Rain
            </button>
            <button onClick={() => triggerDisruption('pollution')} style={{ flex: '1 1 calc(33% - 10px)', padding: '16px 8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', color: '#fbbf24', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: '700', opacity: isProcessing ? 0.5 : 1 }} disabled={isProcessing}>
                🌫️ AQI
            </button>
            <button onClick={() => triggerDisruption('curfew')} style={{ flex: '1 1 calc(33% - 10px)', padding: '16px 8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', color: '#ef4444', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: '700', opacity: isProcessing ? 0.5 : 1 }} disabled={isProcessing}>
                🛑 Curfew
            </button>
          </div>

          <button onClick={resetSimulation} style={{ width: '100%', padding: '16px', background: 'var(--surface-light)', border: '1px solid var(--border-color)', borderRadius: '16px', color: 'white', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '0.95rem', marginTop: '8px', fontWeight: '700', opacity: isProcessing ? 0.5 : 1 }} disabled={isProcessing}>
              ↺ Reset Environment
          </button>
      </div>

      <div className="bottom-action animate-slide-up delay-400" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="button-primary" onClick={() => onNavigate('admin')} style={{ background: 'var(--surface-glass)', border: '1px solid var(--accent-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'white' }}>
            Enter Admin Dashboard &rarr;
          </button>
          <button className="button-primary" onClick={() => onNavigate('onboarding')} style={{ background: 'transparent', border: '1px solid var(--border-color)', boxShadow: 'none', color: 'var(--text-secondary)' }}>
            Sign Out
          </button>
      </div>

      <button onClick={() => setIsChatOpen(prev => !prev)} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '64px', height: '64px', borderRadius: '20px', background: 'var(--accent-gradient)', color: 'white', border: 'none', boxShadow: '0 10px 40px var(--accent-glow)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: isChatOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1) rotate(0deg)' }}>
        {isChatOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {isChatOpen && (
        <div className="animate-slide-up" style={{ position: 'fixed', bottom: '104px', right: '24px', width: 'calc(100% - 48px)', maxWidth: '380px', height: '500px', background: 'var(--surface-glass)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', zIndex: 99, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: 'var(--surface-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>AI Support</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: '700', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="pulse-active" style={{ width: '6px', height: '6px', background: 'var(--success-color)', borderRadius: '50%', display: 'block' }}></span>
                Online
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)' }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? 'var(--accent-gradient)' : 'var(--surface-light)', color: 'white', padding: '14px 18px', borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', maxWidth: '85%', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.5', border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)' }}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'var(--surface-glass)' }}>
            <input type="text" placeholder="Ask anything..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="input-field" style={{ margin: 0, flex: 1, padding: '14px 16px', borderRadius: '16px', outline: 'none' }} />
            <button type="submit" style={{ background: 'var(--accent-primary)', border: 'none', color: 'white', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px var(--accent-glow)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
