import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';

export const Dashboard = () => {
  const { orders, setActiveModal, setLightboxImg, setModalPayload } = useApp();

  let totalProfit = 0;
  let totalReceivedMargin = 0;
  let totalBoxes = 0;

  orders.forEach(o => {
    const profit = (o.profitMargin || 0);
    totalProfit += profit;
    totalBoxes += (o.quantity || 0);

    const mStatus = o.marginPaymentStatus || o.factoryPaymentStatus || 'pending';
    const recAmt = o.receivedMarginAmount !== undefined 
      ? o.receivedMarginAmount 
      : (o.partialMarginAmount !== undefined ? o.partialMarginAmount : (mStatus === 'received' ? profit : 0));
    totalReceivedMargin += recAmt;
  });

  const pendingMarginReceivables = Math.max(0, totalProfit - totalReceivedMargin);
  const recentOrders = orders.slice(-5).reverse();

  return (
    <section id="tab-dashboard" className="tab-content active">
      {/* Bootstrap 5 Stat Cards Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid var(--bs-success) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Total Gross Profit Margin</span>
              <i className="bi bi-currency-rupee text-success fs-5"></i>
            </div>
            <div className="fs-3 fw-bold font-outfit tabular-nums text-success">{formatINR(totalProfit)}</div>
            <div className="text-muted small mt-1">Total margin generated across all orders</div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid #10b981 !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Commission Collected</span>
              <i className="bi bi-cash-stack text-success fs-5"></i>
            </div>
            <div className="fs-3 fw-bold font-outfit tabular-nums">{formatINR(totalReceivedMargin)}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>Settled margin payout received</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid var(--bs-danger) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Pending Margin Receivables</span>
              <i className="bi bi-activity text-danger fs-5"></i>
            </div>
            <div className="fs-3 fw-bold font-outfit tabular-nums text-danger">{formatINR(pendingMarginReceivables)}</div>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <i className="bi bi-exclamation-circle-fill text-danger"></i>
              <span>Outstanding balance to collect</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card h-100 border-0 shadow-sm p-3 bg-body-tertiary rounded-3" style={{ borderLeft: '4px solid var(--bs-info) !important' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-secondary small fw-medium">Total Orders Handled</span>
              <i className="bi bi-box-seam text-info fs-5"></i>
            </div>
            <div className="fs-3 fw-bold font-outfit tabular-nums">{orders.length}</div>
            <div className="text-muted small mt-1">{totalBoxes.toLocaleString('en-IN')} total boxes manufactured</div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit d-flex align-items-center gap-2">
          <i className="bi bi-layers-fill text-primary"></i>
          <span>Recent Box Orders</span>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => { setModalPayload(null); setActiveModal('order'); }}>
          <i className="bi bi-plus-lg"></i>
          <span>New Box Order</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Factory</th>
                <th>Box Specification</th>
                <th>Qty</th>
                <th>Factory Rate</th>
                <th>Margin</th>
                <th>Customer Price</th>
                <th>Total Bill</th>
                <th>Margin Profit</th>
                <th>Photos</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-center py-4 text-muted">
                    No orders created yet. Click "+ New Box Order" to get started.
                  </td>
                </tr>
              ) : (
                recentOrders.map(o => {
                  const specStr = o.boxSpecs.description || `${o.boxSpecs.length}×${o.boxSpecs.width}×${o.boxSpecs.height} ${o.boxSpecs.unit}, ${o.boxSpecs.ply}`;
                  const photoCount = o.photos ? o.photos.length : 0;
                  return (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{o.orderDate}</td>
                      <td>{o.customerName}</td>
                      <td>{o.factoryName}</td>
                      <td className="small text-muted">{specStr}</td>
                      <td className="tabular-nums">{o.quantity.toLocaleString('en-IN')}</td>
                      <td className="tabular-nums">₹{o.factoryUnitCost.toFixed(2)}</td>
                      <td className="tabular-nums text-success">+₹{o.marginPerUnit.toFixed(2)}</td>
                      <td className="tabular-nums">₹{o.customerUnitRate.toFixed(2)}</td>
                      <td className="tabular-nums"><strong>{formatINR(o.totalCustomerBill)}</strong></td>
                      <td className="tabular-nums text-success"><strong>{formatINR(o.profitMargin)}</strong></td>
                      <td>
                        {photoCount > 0 ? (
                          <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={() => setLightboxImg(o.photos[0].url)}>
                            <i className="bi bi-image"></i>
                            <span>{photoCount}</span>
                          </button>
                        ) : (
                          <span className="text-muted small">None</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${o.paymentStatus === 'paid' ? 'bg-success' : o.paymentStatus === 'partially_paid' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {o.paymentStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
