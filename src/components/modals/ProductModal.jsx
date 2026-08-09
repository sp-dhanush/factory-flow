import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateBoxDescription } from '../../utils/helpers';

export const ProductModal = () => {
  const { customers, modalPayload, saveProductDoc, setActiveModal } = useApp();

  const p = modalPayload || {};
  const [customerId, setCustomerId] = useState(p.customerId || (customers[0]?.id || ''));
  const [productName, setProductName] = useState(p.productName || '');
  const [len, setLen] = useState(p.length || '');
  const [wid, setWid] = useState(p.width || '');
  const [hei, setHei] = useState(p.height || '');
  const [unit, setUnit] = useState(p.unit || 'mm');
  const [ply, setPly] = useState(p.ply || '5-ply');
  const [gsmBf, setGsmBf] = useState(p.gsmBf || '');

  const autoSentence = generateBoxDescription({ productName, length: len, width: wid, height: hei, unit, ply, gsmBf });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const custObj = customers.find(c => c.id === customerId);

    saveProductDoc(p.id, {
      customerId,
      customerName: custObj ? custObj.name : '',
      productName,
      length: parseFloat(len) || 0,
      width: parseFloat(wid) || 0,
      height: parseFloat(hei) || 0,
      unit,
      ply,
      gsmBf,
      description: autoSentence
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
      <div className="modal" style={{ maxWidth: 650 }}>
        <div className="modal-header">
          <h3>{p.id ? 'Edit Box Product Specification' : 'Add Box Product Specification'}</h3>
          <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
        </div>
        <div className="modal-body">
          <form id="form-product" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Customer</label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Product / Box Name</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. 1kg Medicine Master Carton" required />
              </div>
            </div>

            <div className="form-grid-dimensions" style={{ marginTop: '0.75rem' }}>
              <div className="form-group">
                <label>Length (L)</label>
                <input type="number" value={len} onChange={e => setLen(e.target.value)} placeholder="e.g. 350" required />
              </div>
              <div className="form-group">
                <label>Width (W)</label>
                <input type="number" value={wid} onChange={e => setWid(e.target.value)} placeholder="e.g. 250" required />
              </div>
              <div className="form-group">
                <label>Height (H)</label>
                <input type="number" value={hei} onChange={e => setHei(e.target.value)} placeholder="e.g. 200" required />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)}>
                  <option value="mm">mm</option>
                  <option value="inch">inch</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '0.75rem' }}>
              <div className="form-group">
                <label>Ply Type</label>
                <select value={ply} onChange={e => setPly(e.target.value)}>
                  <option value="3-ply">3-Ply</option>
                  <option value="5-ply">5-Ply</option>
                  <option value="7-ply">7-Ply</option>
                  <option value="9-ply">9-Ply</option>
                </select>
              </div>
              <div className="form-group">
                <label>Paper GSM / BF</label>
                <input type="text" value={gsmBf} onChange={e => setGsmBf(e.target.value)} placeholder="e.g. 180 GSM 24 BF" />
              </div>
            </div>

            <div className="form-group full-width" style={{ marginTop: '0.75rem' }}>
              <label>Auto-Generated Specification Sentence</label>
              <input type="text" value={autoSentence} readOnly style={{ background: 'rgba(99,102,241,0.12)', borderColor: 'var(--primary)', color: 'var(--text-main)', fontWeight: 600 }} />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Product Spec</button>
        </div>
      </div>
    </div>
  );
};
