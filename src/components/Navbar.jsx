import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutGrid, ShoppingBag, Box, Factory, Users, FileText, Sun, Moon, LogIn, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, theme, toggleTheme, user, loginWithGoogle, logout, isConnected, isDemoMode, setActiveModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Box size={22} color="#fff" />
        </div>
        <span>Factory Flow</span>
      </div>

      {user && (
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabClick('dashboard')}>
            <LayoutGrid size={16} />
            Dashboard
          </button>
          <button className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => handleTabClick('orders')}>
            <ShoppingBag size={16} />
            Orders & Margins
          </button>
          <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleTabClick('products')}>
            <Box size={16} />
            Box Specs Catalog
          </button>
          <button className={`nav-btn ${activeTab === 'factories' ? 'active' : ''}`} onClick={() => handleTabClick('factories')}>
            <Factory size={16} />
            Factories Ledger
          </button>
          <button className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => handleTabClick('customers')}>
            <Users size={16} />
            Customers
          </button>
          <button className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleTabClick('reports')}>
            <FileText size={16} />
            Monthly PDF
          </button>

          <div className="mobile-auth-section">
            <button
              className={`btn btn-sm full-width ${isConnected && !isDemoMode ? 'badge-success' : 'badge-warning'}`}
              onClick={() => { setActiveModal('firebase'); setMobileMenuOpen(false); }}
              style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected && !isDemoMode ? '#10b981' : '#f59e0b' }}></span>
              {isConnected && !isDemoMode ? 'Cloud Live' : 'Demo Mode (Offline)'}
            </button>
            <button className="btn btn-secondary btn-sm full-width" onClick={() => { logout(); setMobileMenuOpen(false); }}>
              <LogOut size={15} />
              {user.displayName || user.email}
            </button>
          </div>
        </nav>
      )}

      <div className="nav-actions">
        <button
          className={`btn btn-sm nav-hide-mobile ${isConnected && !isDemoMode ? 'badge-success' : 'badge-warning'}`}
          onClick={() => setActiveModal('firebase')}
          title="Click to view or update Firebase connection settings"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', cursor: 'pointer' }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected && !isDemoMode ? '#10b981' : '#f59e0b', boxShadow: isConnected && !isDemoMode ? '0 0 6px #10b981' : '0 0 6px #f59e0b' }}></span>
          {isConnected && !isDemoMode ? 'Cloud Live' : 'Demo Mode'}
        </button>

        <button className="btn btn-secondary theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>
        {user ? (
          <button className="btn btn-secondary btn-sm nav-hide-mobile" onClick={logout}>
            <LogOut size={15} />
            {user.displayName || user.email}
          </button>
        ) : (
          <button className="btn btn-primary btn-sm nav-hide-mobile" onClick={loginWithGoogle}>
            <LogIn size={15} />
            Google Login
          </button>
        )}

        <button className="btn btn-secondary hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};
