import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CollectionModal = () => {
  const { customers, saveTransactionDoc, setActiveModal } = useApp();
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('UPI');
  const [ref, setRef] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const custObj = customers.find(c => c.id === customerId);

    saveTransactionDoc({
      type: 'customer_collection',
      entityId: customerId,
      entityName: custObj ? custObj.name : '',
      amount: parseFloat(amount) || 0,
      date,
      paymentMode: mode,
      referenceNo: ref,
      notes: ''
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h3>Record Customer Payment Collection</h3>
          <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Amount Collected (₹)</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 75000" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)}>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reference # / UTR</label>
              <input type="text" value={ref} onChange={e => setRef(e.target.value)} placeholder="UTR or reference note" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
          <button className="btn btn-success" onClick={handleSubmit}>Save Payment</button>
        </div>
      </div>
    </div>
  );
};
