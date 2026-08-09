import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const EntityModal = () => {
  const { modalPayload, saveEntityDoc, setActiveModal } = useApp();
  const item = modalPayload || {};
  const type = item.type || 'factory';

  const [name, setName] = useState(item.name || '');
  const [phone, setPhone] = useState(item.phone || '');
  const [address, setAddress] = useState(item.address || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      phone,
      address
    };
    if (type === 'customer') {
      payload.company = name;
    }

    saveEntityDoc(item.id, type, payload);

    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
      <div className="modal" style={{ maxWidth: 450 }}>
        <div className="modal-header">
          <h3>{item.id ? `Edit ${type === 'factory' ? 'Factory' : 'Customer'}` : `Add ${type === 'factory' ? 'Manufacturing Factory' : 'Customer Account'}`}</h3>
          <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={type === 'factory' ? 'Factory Name' : 'Customer / Company Name'} />
            </div>
            <div className="form-group">
              <label>Phone / Contact</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" />
            </div>
            <div className="form-group">
              <label>Address / Location</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Office / Plant address" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
