import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';

export const Customers = () => {
  const { customers, orders, transactions, setActiveModal, setModalPayload, deleteEntityDoc } = useApp();

  const customerTxs = transactions.filter(t => t.type === 'customer_collection');

  return (
    <section id="tab-customers" className="tab-content active">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit">Customer Accounts & Collection Dues</div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => { setModalPayload({ type: 'customer' }); setActiveModal('entity'); }}>
            <i className="bi bi-plus-lg"></i>
            <span>Add Customer</span>
          </button>
          <button className="btn btn-success d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => setActiveModal('collection')}>
            <i className="bi bi-plus-circle-fill"></i>
            <span>Record Customer Payment</span>
          </button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 mb-4">
        {customers.map(c => {
          let customerBilled = 0;
          orders.filter(o => o.customerId === c.id).forEach(o => customerBilled += (o.totalCustomerBill || 0));

          let customerPaid = 0;
          transactions.filter(t => t.type === 'customer_collection' && t.entityId === c.id).forEach(t => customerPaid += (t.amount || 0));

          const balance = customerBilled - customerPaid;

          return (
            <div key={c.id} className="col">
              <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid var(--bs-success) !important' }}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <strong className="fs-5 text-reset font-outfit">{c.name}</strong>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => { setModalPayload({ type: 'customer', ...c }); setActiveModal('entity'); }} title="Edit Customer">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => deleteEntityDoc(c.id, 'customer')} title="Delete Customer">
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="text-muted small mb-3">{c.phone || ''} {c.address ? '• ' + c.address : ''}</div>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="text-secondary small">Total Billed</div>
                    <div className="tabular-nums fw-bold fs-6">{formatINR(customerBilled)}</div>
                  </div>
                  <div>
                    <div className="text-secondary small">Collected</div>
                    <div className="tabular-nums fw-bold fs-6 text-success">{formatINR(customerPaid)}</div>
                  </div>
                </div>
                <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                  <span className="small text-muted">Pending Dues</span>
                  <span className={`tabular-nums fs-5 fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
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
          <div className="fw-bold font-outfit fs-6">Customer Collection History</div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
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
                  <td colSpan="6" className="text-center py-4 text-muted">No collection records logged yet.</td>
                </tr>
              ) : (
                customerTxs.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><strong>{t.entityName || 'Customer'}</strong></td>
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
