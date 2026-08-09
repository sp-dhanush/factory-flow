import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';

export const Customers = () => {
  const { customers, orders, transactions, setActiveModal, setModalPayload, deleteEntityDoc } = useApp();

  const customerTxs = transactions.filter(t => t.type === 'customer_collection');

  return (
    <section id="tab-customers" className="tab-content active">
      <div className="section-header">
        <div className="section-title">Customer Accounts & Collection Dues</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => { setModalPayload({ type: 'customer' }); setActiveModal('entity'); }}>+ Add Customer</button>
          <button className="btn btn-success" onClick={() => setActiveModal('collection')}>+ Record Customer Payment</button>
        </div>
      </div>

      <div className="stats-grid">
        {customers.map(c => {
          let customerBilled = 0;
          orders.filter(o => o.customerId === c.id).forEach(o => customerBilled += (o.totalCustomerBill || 0));

          let customerPaid = 0;
          transactions.filter(t => t.type === 'customer_collection' && t.entityId === c.id).forEach(t => customerPaid += (t.amount || 0));

          const balance = customerBilled - customerPaid;

          return (
            <div key={c.id} className="stat-card" style={{ '--accent-color': 'var(--success)' }}>
              <div className="stat-header">
                <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{c.name}</strong>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setModalPayload({ type: 'customer', ...c }); setActiveModal('entity'); }} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteEntityDoc(c.id, 'customer')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>🗑️</button>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.phone || ''} {c.address ? '• ' + c.address : ''}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <div>
                  <div className="stat-sub">Total Billed</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatINR(customerBilled)}</div>
                </div>
                <div>
                  <div className="stat-sub">Collected</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{formatINR(customerPaid)}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Dues</span>
                <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 800, color: balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {formatINR(balance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Customer Collection History</div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Amount Collected</th>
                <th>Payment Mode</th>
                <th>Reference #</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {customerTxs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)' }}>No collection records logged yet.</td>
                </tr>
              ) : (
                customerTxs.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><strong>{t.entityName || 'Customer'}</strong></td>
                    <td className="tabular-nums" style={{ color: 'var(--success)' }}>{formatINR(t.amount)}</td>
                    <td>{t.paymentMode}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.referenceNo || '-'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t.notes || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
