import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportPDFStatement } from '../utils/pdfExporter';
import { formatINR } from '../utils/helpers';

export const Reports = () => {
  const { factories, orders, transactions } = useApp();
  const [selectedFactoryId, setSelectedFactoryId] = useState(factories[0]?.id || '');
  const [monthStr, setMonthStr] = useState('2026-08');

  const selectedFactory = factories.find(f => f.id === selectedFactoryId) || factories[0];
  const monthOrders = orders.filter(o => o.factoryId === (selectedFactory ? selectedFactory.id : '') && o.orderDate.startsWith(monthStr));

  let totalCost = 0;
  monthOrders.forEach(o => totalCost += (o.totalFactoryCost || 0));

  let totalPaid = 0;
  transactions
    .filter(t => t.type === 'factory_payout' && t.entityId === (selectedFactory ? selectedFactory.id : '') && t.date.startsWith(monthStr))
    .forEach(t => totalPaid += (t.amount || 0));

  const netBalance = totalCost - totalPaid;

  const handleDownloadPDF = () => {
    if (selectedFactory) {
      exportPDFStatement({ factory: selectedFactory, monthStr, orders, transactions });
    }
  };

  return (
    <section id="tab-reports" className="tab-content active">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit">Monthly Factory Statement & PDF Generator</div>
        <button className="btn btn-success d-flex align-items-center gap-2 rounded-3 px-3 py-2 shadow-sm" onClick={handleDownloadPDF}>
          <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
          <span>Download PDF Statement</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-body-tertiary">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase small fw-bold text-muted">Select Factory</label>
            <select className="form-select" value={selectedFactoryId} onChange={(e) => setSelectedFactoryId(e.target.value)}>
              {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label text-uppercase small fw-bold text-muted">Select Month & Year</label>
            <input type="month" className="form-control" value={monthStr} onChange={(e) => setMonthStr(e.target.value)} />
          </div>
        </div>
      </div>

      <div id="report-paper-container" className="report-paper">
        <div className="report-header">
          <div>
            <div className="report-title">{selectedFactory ? selectedFactory.name : 'Factory Statement'}</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{selectedFactory?.address || 'Carton Box Monthly Ledger Statement'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>{monthStr}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Generated: {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order #</th>
              <th>Customer</th>
              <th>Box Specs</th>
              <th>Quantity</th>
              <th>Unit Rate (₹)</th>
              <th>Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {monthOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
                  No factory orders recorded for {monthStr}.
                </td>
              </tr>
            ) : (
              monthOrders.map(o => {
                const specStr = `${o.boxSpecs.length}×${o.boxSpecs.width}×${o.boxSpecs.height} ${o.boxSpecs.unit}, ${o.boxSpecs.ply}`;
                return (
                  <tr key={o.id}>
                    <td>{o.orderDate}</td>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{o.customerName}</td>
                    <td>{specStr}</td>
                    <td style={{ textAlign: 'right' }}>{o.quantity.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right' }}>₹{o.factoryUnitCost.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}><strong>{formatINR(o.totalFactoryCost)}</strong></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px dashed #e5e7eb' }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>Payment Terms & Notes</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Please inspect statement balance. Direct all queries regarding order quantities or rates within 7 days.</div>
          </div>
          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              <span>Total Supply Cost:</span>
              <strong>{formatINR(totalCost)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#059669' }}>
              <span>Total Payments Settled:</span>
              <strong>{formatINR(totalPaid)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #111827', fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
              <span>Net Payable Balance:</span>
              <span>{formatINR(netBalance)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
