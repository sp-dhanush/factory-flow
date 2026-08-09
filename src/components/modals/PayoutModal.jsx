import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const PayoutModal = () => {
  const { factories, saveTransactionDoc, setActiveModal } = useApp();
  const [factoryId, setFactoryId] = useState(factories[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('UPI');
  const [ref, setRef] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const factObj = factories.find(f => f.id === factoryId);

    saveTransactionDoc({
      type: 'factory_payout',
      entityId: factoryId,
      entityName: factObj ? factObj.name : '',
      amount: parseFloat(amount) || 0,
      date,
      paymentMode: mode,
      referenceNo: ref,
      notes
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3>Record Factory Payout</h3>
          <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Factory</label>
              <select value={factoryId} onChange={e => setFactoryId(e.target.value)} required>
                {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Payout Amount (₹)</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 50000" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)}>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reference # / UTR</label>
              <input type="text" value={ref} onChange={e => setRef(e.target.value)} placeholder="Transaction UTR / Cheque number" />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="2" placeholder="e.g. Advance payment for batch 2" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Payout</button>
        </div>
      </div>
    </div>
  );
};
