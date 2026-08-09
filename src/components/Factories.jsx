import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';

export const Factories = () => {
  const { factories, orders, transactions, setActiveModal, setModalPayload, deleteEntityDoc } = useApp();

  const factoryTxs = transactions.filter(t => t.type === 'factory_payout');

  return (
    <section id="tab-factories" className="tab-content active">
      <div className="section-header">
        <div className="section-title">Factory Balance Sheets & Payout Logs</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => { setModalPayload({ type: 'factory' }); setActiveModal('entity'); }}>+ Add Factory</button>
          <button className="btn btn-primary" onClick={() => setActiveModal('payout')}>+ Record Factory Payout</button>
        </div>
      </div>

      <div className="stats-grid">
        {factories.map(f => {
          let factoryBilled = 0;
          orders.filter(o => o.factoryId === f.id).forEach(o => factoryBilled += (o.totalFactoryCost || 0));

          let factoryPaid = 0;
          transactions.filter(t => t.type === 'factory_payout' && t.entityId === f.id).forEach(t => factoryPaid += (t.amount || 0));

          const balance = factoryBilled - factoryPaid;

          return (
            <div key={f.id} className="stat-card" style={{ '--accent-color': 'var(--primary)' }}>
              <div className="stat-header">
                <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{f.name}</strong>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setModalPayload({ type: 'factory', ...f }); setActiveModal('entity'); }} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteEntityDoc(f.id, 'factory')} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>🗑️</button>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{f.phone || ''} {f.address ? '• ' + f.address : ''}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <div>
                  <div className="stat-sub">Total Billed Supply</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatINR(factoryBilled)}</div>
                </div>
                <div>
                  <div className="stat-sub">Paid Settled</div>
                  <div className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{formatINR(factoryPaid)}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Payable Dues</span>
                <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 800, color: balance > 0 ? 'var(--warning)' : 'var(--success)' }}>
                  {formatINR(balance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Factory Payment Ledger History</div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Factory Name</th>
                <th>Type</th>
                <th>Amount Paid</th>
                <th>Payment Mode</th>
                <th>Reference #</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {factoryTxs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)' }}>No payout records logged yet.</td>
                </tr>
              ) : (
                factoryTxs.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><strong>{t.entityName || 'Factory'}</strong></td>
                    <td><span className="status-badge badge-warning">Payout</span></td>
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
