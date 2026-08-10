import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';

export const Factories = () => {
  const { factories, orders, transactions, setActiveModal, setModalPayload, deleteEntityDoc } = useApp();

  const factoryTxs = transactions.filter(t => t.type === 'factory_payout');

  return (
    <section id="tab-factories" className="tab-content active">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit">Factory Balance Sheets & Payout Logs</div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => { setModalPayload({ type: 'factory' }); setActiveModal('entity'); }}>
            <i className="bi bi-plus-lg"></i>
            <span>Add Factory</span>
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => setActiveModal('payout')}>
            <i className="bi bi-dash-circle-fill"></i>
            <span>Record Factory Payout</span>
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mb-4">
        {factories.map(f => {
          let factoryBilled = 0;
          orders.filter(o => o.factoryId === f.id).forEach(o => factoryBilled += (o.totalFactoryCost || 0));

          let factoryPaid = 0;
          transactions.filter(t => t.type === 'factory_payout' && t.entityId === f.id).forEach(t => factoryPaid += (t.amount || 0));

          const balance = factoryBilled - factoryPaid;

          return (
            <div key={f.id} className="col">
              <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid var(--bs-primary) !important' }}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <strong className="fs-5 text-reset font-outfit">{f.name}</strong>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => { setModalPayload({ type: 'factory', ...f }); setActiveModal('entity'); }} title="Edit Factory">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => deleteEntityDoc(f.id, 'factory')} title="Delete Factory">
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="text-muted small mb-3">{f.phone || ''} {f.address ? '• ' + f.address : ''}</div>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="text-secondary small">Total Billed Supply</div>
                    <div className="tabular-nums fw-bold fs-6">{formatINR(factoryBilled)}</div>
                  </div>
                  <div>
                    <div className="text-secondary small">Paid Settled</div>
                    <div className="tabular-nums fw-bold fs-6 text-success">{formatINR(factoryPaid)}</div>
                  </div>
                </div>
                <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                  <span className="small text-muted">Net Payable Dues</span>
                  <span className={`tabular-nums fs-5 fw-bold ${balance > 0 ? 'text-warning' : 'text-success'}`}>
                    {formatINR(balance)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="p-3 bg-body-tertiary border-bottom">
          <div className="fw-bold font-outfit fs-6">Factory Payment Ledger History</div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
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
                  <td colSpan="7" className="text-center py-4 text-muted">No payout records logged yet.</td>
                </tr>
              ) : (
                factoryTxs.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><strong>{t.entityName || 'Factory'}</strong></td>
                    <td><span className="badge bg-warning text-dark rounded-pill">Payout</span></td>
                    <td className="tabular-nums text-success">{formatINR(t.amount)}</td>
                    <td>{t.paymentMode}</td>
                    <td className="small text-muted">{t.referenceNo || '-'}</td>
                    <td className="small text-muted">{t.notes || ''}</td>
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
