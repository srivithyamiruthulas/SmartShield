import { useState } from 'react';
import './index.css';

export default function AdminDashboard({ onNavigate }) {
  const stats = [
    { label: 'Total Users', value: '14,238', growth: '+12%' },
    { label: 'Active Policies', value: '11,402', growth: '+8%' },
    { label: 'Total Payouts', value: '₹2.4M', growth: '+22%' },
    { label: 'Disruptions', value: '1,842', growth: '+5%' }
  ];

  const fraudAlerts = [
    { id: 1, user: 'Rahul D.', reason: 'City mismatch (Delhi != Mumbai)', status: 'Blocked' },
    { id: 2, user: 'Priya K.', reason: 'Duplicate claim (Rain)', status: 'Blocked' },
    { id: 3, user: 'Amit S.', reason: 'Frequency rules tripped', status: 'Review' },
  ];

  const mockChartPoints1 = "0,80 20,60 40,70 60,30 80,45 100,10 120,40 140,20";
  const mockChartPoints2 = "0,20 20,30 40,35 60,80 80,60 100,90 120,70 140,85";

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="header animate-slide-up" style={{ marginBottom: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}><span className="text-gradient">Admin Analytics</span></h1>
          <p style={{ marginTop: '4px', fontSize: '1rem' }}>SmartShield Global Overview</p>
        </div>
      </div>

      <div className="animate-slide-up delay-100" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="info-card" style={{ padding: '16px', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px', color: 'white' }}>{stat.value}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: '600', marginTop: '8px' }}>{stat.growth} this week</span>
          </div>
        ))}
      </div>

      <div className="info-card animate-slide-up delay-200" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'white' }}>Live Network Activity</h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <div style={{ width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div> Disruptions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <div style={{ width: '12px', height: '12px', background: '#ec4899', borderRadius: '4px' }}></div> Claims Tracked
          </div>
        </div>
        <div style={{ height: '120px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 140 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <polyline points={mockChartPoints1} fill="none" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={mockChartPoints2} fill="none" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="info-card animate-slide-up delay-300" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Fraud Alerts & Blocked
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {fraudAlerts.map(alert => (
            <div key={alert.id} style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white', marginBottom: '2px' }}>{alert.user}</div>
                <div style={{ color: '#fca5a5', fontSize: '0.8rem', fontWeight: '500' }}>{alert.reason}</div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                {alert.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-action animate-slide-up delay-400" style={{ position: 'fixed', bottom: 0, left: '16px', right: '16px', padding: '20px 0', background: 'linear-gradient(to top, var(--bg-color) 60%, transparent)', display: 'flex', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <button onClick={() => onNavigate('dashboard')} className="button-primary" style={{ background: 'var(--surface-color)', border: '1.5px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'white', width: '100%' }}>
            Return to User Dashboard
          </button>
      </div>
    </div>
  );
}
