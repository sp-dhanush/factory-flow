import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';
import { exportCSVData } from '../utils/csvExporter';
import { exportOrdersPDF } from '../utils/pdfExporter';
import { Search, Plus, Edit2, Trash2, Download, FileText, FileSpreadsheet, ChevronDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const Orders = () => {
  const { orders, factories, customers, setActiveModal, setModalPayload, deleteOrderDoc, setLightboxImg } = useApp();
  const [search, setSearch] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [marginStatusFilter, setMarginStatusFilter] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique available YYYY-MM months from orders
  const availableMonths = Array.from(
    new Set(orders.map(o => o.orderDate ? o.orderDate.substring(0, 7) : '').filter(Boolean))
  ).sort().reverse();

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                        o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                        o.factoryName.toLowerCase().includes(search.toLowerCase()) ||
                        (o.paymentNotes && o.paymentNotes.toLowerCase().includes(search.toLowerCase()));
    const matchFact = !factoryFilter || o.factoryId === factoryFilter;
    const matchCust = !customerFilter || o.customerId === customerFilter;

    const currentMarginStatus = o.marginPaymentStatus || o.factoryPaymentStatus || 'pending';
    const matchMarginStatus = !marginStatusFilter || currentMarginStatus === marginStatusFilter;

    const matchMode = !paymentModeFilter || o.paymentMode === paymentModeFilter;
    const matchMonth = !monthFilter || (o.orderDate && o.orderDate.startsWith(monthFilter));

    return matchSearch && matchFact && matchCust && matchMarginStatus && matchMode && matchMonth;
  });

  const formatMonthLabel = (ymStr) => {
    if (!ymStr) return '';
    const [y, m] = ymStr.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getModeLabel = (mode) => {
    switch(mode) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'upi': return 'UPI';
      case 'cheque': return 'Cheque';
      case 'cash': return 'Cash';
      case 'other': return 'Other';
      default: return mode || 'N/A';
    }
  };

  return (
    <section id="tab-orders" className="tab-content active">
      <div className="section-header">
        <div className="section-title">Order Costing & Margin Master</div>
        <button className="btn btn-primary" onClick={() => { setModalPayload(null); setActiveModal('order'); }}>+ New Box Order</button>
      </div>

      <div className="filters-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search order #, customer, factory, notes..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ flex: '1 1 200px' }}
        />
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{formatMonthLabel(m)}</option>
          ))}
        </select>
        <select value={factoryFilter} onChange={(e) => setFactoryFilter(e.target.value)}>
          <option value="">All Factories</option>
          {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={marginStatusFilter} onChange={(e) => setMarginStatusFilter(e.target.value)}>
          <option value="">All Margin Statuses</option>
          <option value="pending">🔴 Margin Pending</option>
          <option value="partial">🟡 Partial Commission</option>
          <option value="received">🟢 Commission Received</option>
        </select>
        <select value={paymentModeFilter} onChange={(e) => setPaymentModeFilter(e.target.value)}>
          <option value="">All Payment Modes</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="upi">UPI</option>
          <option value="cheque">Cheque</option>
          <option value="cash">Cash</option>
        </select>

        {/* Export Dropdown Button Next to Filters */}
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setExportOpen(!exportOpen)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
          >
            <Download size={15} />
            Export
            <ChevronDown size={14} style={{ transform: exportOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {exportOpen && (
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                backgroundColor: 'var(--card-bg, #1e293b)',
                border: '1px solid var(--border, #334155)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                zIndex: 100,
                minWidth: '170px',
                padding: '4px 0',
                overflow: 'hidden'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  exportOrdersPDF(filtered, monthFilter ? formatMonthLabel(monthFilter) : '');
                  setExportOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main, #f8fafc)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(255,255,255,0.08))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'none'}
              >
                <FileText size={15} color="#ef4444" />
                Export as PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  exportCSVData(filtered);
                  setExportOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '9px 14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main, #f8fafc)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg, rgba(255,255,255,0.08))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'none'}
              >
                <FileSpreadsheet size={15} color="#10b981" />
                Export as Excel (CSV)
              </button>
            </div>
          )}
        </div>
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
                <th>Total Bill</th>
                <th>Net Profit</th>
                <th>My Margin Status</th>
                <th>Cust → Factory</th>
                <th>Payment Details</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filtered.map(o => {
                  const specStr = o.boxSpecs?.description || `${o.boxSpecs?.length || 0}×${o.boxSpecs?.width || 0}×${o.boxSpecs?.height || 0} ${o.boxSpecs?.unit || ''}, ${o.boxSpecs?.ply || ''}`;
                  const photoCount = o.photos ? o.photos.length : 0;
                  const marginStatus = o.marginPaymentStatus || o.factoryPaymentStatus || 'pending';
                  const customerStatus = o.customerPaymentStatus || o.paymentStatus || 'pending';
                  const receivedAmount = o.receivedMarginAmount !== undefined ? o.receivedMarginAmount : (o.partialMarginAmount !== undefined ? o.partialMarginAmount : (marginStatus === 'received' ? (o.profitMargin || 0) : 0));

                  return (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{o.orderDate}</td>
                      <td>{o.customerName}</td>
                      <td>{o.factoryName}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 180 }}>{specStr}</td>
                      <td className="tabular-nums">{o.quantity.toLocaleString('en-IN')}</td>
                      <td className="tabular-nums"><strong>{formatINR(o.totalCustomerBill)}</strong></td>
                      <td className="tabular-nums" style={{ color: 'var(--success)' }}><strong>{formatINR(o.profitMargin)}</strong></td>
                      
                      {/* Margin Payout Status */}
                      <td>
                        {marginStatus === 'received' && (
                          <span className="status-badge badge-success" title={`Commission margin fully received: ₹${(o.profitMargin || 0).toLocaleString('en-IN')}`}>🟢 Received</span>
                        )}
                        {marginStatus === 'partial' && (
                          <span className="status-badge badge-warning" title={`Received ₹${receivedAmount.toLocaleString('en-IN')} out of ₹${(o.profitMargin || 0).toLocaleString('en-IN')}`}>
                            🟡 Partial (₹{receivedAmount.toLocaleString('en-IN')})
                          </span>
                        )}
                        {marginStatus === 'pending' && (
                          <span className="status-badge badge-danger" title="Margin payment pending from factory">🔴 Pending</span>
                        )}
                      </td>

                      {/* Customer -> Factory Status */}
                      <td>
                        {(customerStatus === 'paid_to_factory' || customerStatus === 'paid') && (
                          <span className="status-badge badge-success">🟢 Paid to Factory</span>
                        )}
                        {customerStatus === 'partial' && (
                          <span className="status-badge badge-warning">🟡 Partial</span>
                        )}
                        {customerStatus === 'pending' && (
                          <span className="status-badge badge-danger">🔴 Pending</span>
                        )}
                      </td>

                      {/* Payment Details */}
                      <td style={{ fontSize: '0.78rem' }}>
                        <div><strong>{getModeLabel(o.paymentMode)}</strong></div>
                        {o.paymentDate && <div style={{ color: 'var(--text-muted)' }}>📅 {o.paymentDate}</div>}
                        {o.paymentNotes && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={o.paymentNotes}>📝 {o.paymentNotes}</div>}
                      </td>

                      <td>
                        {photoCount > 0 ? (
                          <button className="btn btn-secondary btn-sm" onClick={() => setLightboxImg(o.photos[0].url)}>🖼️ {photoCount}</button>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>None</span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => { setModalPayload(o); setActiveModal('order'); }}
                            title="Edit Order & Payment Status"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteOrderDoc(o.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
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
