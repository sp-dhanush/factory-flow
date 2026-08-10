import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getUserSavedFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig } from '../../firebase-config';

export const FirebaseModal = () => {
  const { setActiveModal } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  useEffect(() => {
    const cfg = getUserSavedFirebaseConfig();
    if (cfg) {
      setApiKey(cfg.apiKey || '');
      setAuthDomain(cfg.authDomain || '');
      setProjectId(cfg.projectId || '');
      setStorageBucket(cfg.storageBucket || '');
      setMessagingSenderId(cfg.messagingSenderId || '');
      setAppId(cfg.appId || '');
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('Please enter a valid API Key and Project ID.');
      return;
    }

    saveFirebaseConfig({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId
    });

    window.location.reload();
  };

  const handleDemo = () => {
    clearFirebaseConfig();
    window.location.reload();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h3>⚙️ Bring Your Own Firebase (BYOF) Settings</h3>
          <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', padding: '0.85rem', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Factory Flow is 100% serverless. To connect your personal Firebase project, paste your credentials below. Follow <strong style={{ color: '#fff' }}>FIREBASE_SETUP.md</strong> for instructions.
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>API Key (apiKey)</label>
              <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="e.g. AIzaSyYOUR_CUSTOM_FIREBASE_API_KEY" />
            </div>
            <div className="form-group">
              <label>Auth Domain (authDomain)</label>
              <input type="text" value={authDomain} onChange={e => setAuthDomain(e.target.value)} placeholder="e.g. your-custom-app.firebaseapp.com" />
            </div>
            <div className="form-group">
              <label>Project ID (projectId)</label>
              <input type="text" value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="e.g. your-custom-project-id" />
            </div>
            <div className="form-group">
              <label>Storage Bucket (storageBucket)</label>
              <input type="text" value={storageBucket} onChange={e => setStorageBucket(e.target.value)} placeholder="e.g. your-custom-app.firebasestorage.app" />
            </div>
            <div className="form-group">
              <label>Messaging Sender ID (messagingSenderId)</label>
              <input type="text" value={messagingSenderId} onChange={e => setMessagingSenderId(e.target.value)} placeholder="e.g. 123456789012" />
            </div>
            <div className="form-group">
              <label>App ID (appId)</label>
              <input type="text" value={appId} onChange={e => setAppId(e.target.value)} placeholder="e.g. 1:123456789012:web:abcdef123456" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleDemo}>Use Local Demo Mode</button>
          <button className="btn btn-primary" onClick={handleSave}>Save & Connect Firebase</button>
        </div>
      </div>
    </div>
  );
};
