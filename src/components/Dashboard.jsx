import React from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';
import { DollarSign, Activity, Package, Layers } from 'lucide-react';

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
      <div className="stats-grid">
        <div className="stat-card" style={{ '--accent-color': 'var(--success)' }}>
          <div className="stat-header">
            <span>Total Gross Profit Margin</span>
            <DollarSign size={18} color="var(--success)" />
          </div>
          <div className="stat-value tabular-nums">{formatINR(totalProfit)}</div>
          <div className="stat-sub">Total margin generated across all orders</div>
        </div>

        <div className="stat-card" style={{ '--accent-color': '#10b981' }}>
          <div className="stat-header">
            <span>Commission Collected</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div className="stat-value tabular-nums">{formatINR(totalReceivedMargin)}</div>
          <div className="stat-sub">🟢 Cash received from full & partial settlements</div>
        </div>

        <div className="stat-card" style={{ '--accent-color': 'var(--danger)' }}>
          <div className="stat-header">
            <span>Pending Margin Receivables</span>
            <Activity size={18} color="var(--danger)" />
          </div>
          <div className="stat-value tabular-nums" style={{ color: 'var(--danger)' }}>{formatINR(pendingMarginReceivables)}</div>
          <div className="stat-sub">🔴 Outstanding balance to collect from factories</div>
        </div>

        <div className="stat-card" style={{ '--accent-color': 'var(--info)' }}>
          <div className="stat-header">
            <span>Total Orders Handled</span>
            <Package size={18} color="var(--info)" />
          </div>
          <div className="stat-value tabular-nums">{orders.length}</div>
          <div className="stat-sub">{totalBoxes.toLocaleString('en-IN')} total boxes manufactured</div>
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">
          <Layers size={20} />
          Recent Box Orders
        </div>
        <button className="btn btn-primary" onClick={() => { setModalPayload(null); setActiveModal('order'); }}>+ New Box Order</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
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
                  <td colSpan="13" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
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
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{specStr}</td>
                      <td className="tabular-nums">{o.quantity.toLocaleString('en-IN')}</td>
                      <td className="tabular-nums">₹{o.factoryUnitCost.toFixed(2)}</td>
                      <td className="tabular-nums" style={{ color: 'var(--success)' }}>+₹{o.marginPerUnit.toFixed(2)}</td>
                      <td className="tabular-nums">₹{o.customerUnitRate.toFixed(2)}</td>
                      <td className="tabular-nums"><strong>{formatINR(o.totalCustomerBill)}</strong></td>
                      <td className="tabular-nums" style={{ color: 'var(--success)' }}><strong>{formatINR(o.profitMargin)}</strong></td>
                      <td>
                        {photoCount > 0 ? (
                          <button className="btn btn-secondary btn-sm" onClick={() => setLightboxImg(o.photos[0].url)}>🖼️ {photoCount}</button>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>None</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${o.paymentStatus === 'paid' ? 'badge-success' : o.paymentStatus === 'partially_paid' ? 'badge-warning' : 'badge-danger'}`}>
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
