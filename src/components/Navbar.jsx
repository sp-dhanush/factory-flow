import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { activeTab, setActiveTab, theme, toggleTheme, user, loginWithGoogle, logout, isConnected, isDemoMode, setActiveModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar navbar-expand-lg border-bottom sticky-top shadow-sm" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(12px)', zIndex: 1050 }}>
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex align-items-center gap-2 brand">
          <div className="brand-icon">
            <i className="bi bi-box-seam-fill text-white fs-5"></i>
          </div>
          <span className="fw-bold fs-5 text-reset font-outfit">Factory Flow</span>
        </div>

        {user && (
          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <button className={`nav-btn btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('dashboard')}>
              <i className="bi bi-grid-fill me-1"></i>
              Dashboard
            </button>
            <button className={`nav-btn btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => handleTabClick('orders')}>
              <i className="bi bi-bag-check-fill me-1"></i>
              Orders & Margins
            </button>
            <button className={`nav-btn btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleTabClick('products')}>
              <i className="bi bi-box-seam-fill me-1"></i>
              Box Specs Catalog
            </button>
            <button className={`nav-btn btn ${activeTab === 'factories' ? 'active' : ''}`} onClick={() => handleTabClick('factories')}>
              <i className="bi bi-building-gear me-1"></i>
              Factories Ledger
            </button>
            <button className={`nav-btn btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => handleTabClick('customers')}>
              <i className="bi bi-people-fill me-1"></i>
              Customers
            </button>
            <button className={`nav-btn btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleTabClick('reports')}>
              <i className="bi bi-file-earmark-pdf-fill me-1"></i>
              Monthly PDF
            </button>

            <div className="mobile-auth-section d-lg-none mt-3 pt-3 border-top">
              <button
                className={`btn btn-sm w-100 ${isConnected && !isDemoMode ? 'badge-success' : 'badge-warning'}`}
                onClick={() => { setActiveModal('firebase'); setMobileMenuOpen(false); }}
                style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected && !isDemoMode ? '#10b981' : '#f59e0b' }}></span>
                {isConnected && !isDemoMode ? 'Cloud Live' : 'Demo Mode (Offline)'}
              </button>
              <button className="btn btn-secondary btn-sm w-100" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                <i className="bi bi-box-arrow-right me-1"></i>
                {user.displayName || user.email}
              </button>
            </div>
          </nav>
        )}

        <div className="d-flex align-items-center gap-2 ms-auto">
          <button
            className={`btn btn-sm d-none d-md-inline-flex align-items-center gap-1 ${isConnected && !isDemoMode ? 'badge-success' : 'badge-warning'}`}
            onClick={() => setActiveModal('firebase')}
            title="Click to view or update Firebase connection settings"
            style={{ fontSize: '0.78rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', cursor: 'pointer' }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected && !isDemoMode ? '#10b981' : '#f59e0b', boxShadow: isConnected && !isDemoMode ? '0 0 6px #10b981' : '0 0 6px #f59e0b' }}></span>
            {isConnected && !isDemoMode ? 'Cloud Live' : 'Demo Mode'}
          </button>

          <button className="btn btn-secondary theme-toggle-btn rounded-circle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
            {theme === 'dark' ? <i className="bi bi-sun-fill text-warning"></i> : <i className="bi bi-moon-stars-fill text-primary"></i>}
          </button>
          {user ? (
            <button className="btn btn-secondary btn-sm d-none d-md-inline-flex align-items-center gap-1" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i>
              {user.displayName || user.email}
            </button>
          ) : (
            <button className="btn btn-primary btn-sm d-none d-md-inline-flex align-items-center gap-1" onClick={loginWithGoogle}>
              <i className="bi bi-box-arrow-in-right"></i>
              Google Login
            </button>
          )}

          <button className="btn btn-secondary d-lg-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list fs-5"></i>}
          </button>
        </div>
      </div>
    </header>
  );
};
