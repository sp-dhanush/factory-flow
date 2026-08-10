import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Orders } from './components/Orders';
import { Products } from './components/Products';
import { Factories } from './components/Factories';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';

import { OrderModal } from './components/modals/OrderModal';
import { ProductModal } from './components/modals/ProductModal';
import { EntityModal } from './components/modals/EntityModal';
import { PayoutModal } from './components/modals/PayoutModal';
import { CollectionModal } from './components/modals/CollectionModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { FirebaseModal } from './components/modals/FirebaseModal';

import { KeyRound, ShieldCheck, Box } from 'lucide-react';

export const App = () => {
  const { activeTab, activeModal, syncNotice, setSyncNotice, user, loginWithGoogle, setActiveModal } = useApp();

  return (
    <>
      <Navbar />

      <main className="container">
        {syncNotice && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            color: '#f8fafc',
            fontSize: '0.85rem'
          }}>
            <span>⚠️ {syncNotice}</span>
            <button
              onClick={() => setSyncNotice(null)}
              style={{ background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &times;
            </button>
          </div>
        )}
        {!user ? (
          <div className="auth-hero-section">
            <div className="auth-ambient-glow"></div>

            <div className="auth-hero-grid">
              {/* Left Side: Feature Pills Stack */}
              <div className="auth-feature-list">
                <div className="auth-feature-pill">
                  <div className="auth-pill-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                    📦
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Box Specs Catalog</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Length × Width × Height, Ply & GSM</div>
                  </div>
                </div>

                <div className="auth-feature-pill">
                  <div className="auth-pill-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
                    💰
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Profit Margin Ledger</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Real-time net margin & payout receivables</div>
                  </div>
                </div>

                <div className="auth-feature-pill">
                  <div className="auth-pill-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--info)' }}>
                    📈
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Factory Balance Sheets</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Running liabilities & payout logs</div>
                  </div>
                </div>

                <div className="auth-feature-pill">
                  <div className="auth-pill-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
                    💬
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>WhatsApp PDF Reports</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>1-click monthly factory statement PDFs</div>
                  </div>
                </div>
              </div>

              {/* Right Side: Sleek Glassmorphic Login Card */}
              <div className="auth-card">
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 10px 25px rgba(168, 85, 247, 0.35)'
                }}>
                  <Box size={32} color="#ffffff" />
                </div>

                <h1 style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#ffffff' }}>
                  FACTORY FLOW
                </h1>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', fontWeight: 500 }}>
                  Log in to your Brokerage Dashboard
                </p>

                <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button
                    className="auth-google-btn"
                    onClick={loginWithGoogle}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Sign in with Google
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveModal('firebase')}
                    style={{
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.85rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <KeyRound size={16} />
                    Configure BYOF Firebase Credentials
                  </button>
                </div>

                <div style={{
                  marginTop: '2.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)'
                }}>
                  <ShieldCheck size={16} color="var(--success)" />
                  <span>Encrypted Row-Level User Isolation (`users/&#123;uid&#125;/...`)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'orders' && <Orders />}
            {activeTab === 'products' && <Products />}
            {activeTab === 'factories' && <Factories />}
            {activeTab === 'customers' && <Customers />}
            {activeTab === 'reports' && <Reports />}
          </>
        )}
      </main>

      <footer>
        Factory Flow &copy; 2026 • Serverless Carton Box Brokerage & Financial Ledger
      </footer>

      {activeModal === 'order' && <OrderModal />}
      {activeModal === 'product' && <ProductModal />}
      {activeModal === 'entity' && <EntityModal />}
      {activeModal === 'payout' && <PayoutModal />}
      {activeModal === 'collection' && <CollectionModal />}
      {activeModal === 'firebase' && <FirebaseModal />}
      <LightboxModal />
    </>
  );
};

export default App;
