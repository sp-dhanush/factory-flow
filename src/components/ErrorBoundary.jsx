import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-main, #0f172a)',
          color: 'var(--text-main, #f8fafc)',
          padding: '2rem',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'var(--card-bg, #1e293b)',
            border: '1px solid var(--border, #334155)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #94a3b8)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              An unexpected error occurred in Factory Flow. Don't worry, your ledger data is safe.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.6rem 1.2rem',
                background: 'var(--primary, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
