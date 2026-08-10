import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';
import { exportCSVData } from '../utils/csvExporter';
import { exportOrdersPDF } from '../utils/pdfExporter';

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit">Order Costing & Margin Master</div>
        <button className="btn btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => { setModalPayload(null); setActiveModal('order'); }}>
          <i className="bi bi-plus-lg"></i>
          <span>New Box Order</span>
        </button>
      </div>

      {/* Bootstrap Filters Bar */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-3">
          <div className="input-group">
            <span className="input-group-text bg-body-tertiary border-secondary border-opacity-25">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search order #, customer, factory..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="col-6 col-md">
          <select className="form-select" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">All Months</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md">
          <select className="form-select" value={factoryFilter} onChange={(e) => setFactoryFilter(e.target.value)}>
            <option value="">All Factories</option>
            {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="col-6 col-md">
          <select className="form-select" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="">All Customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-6 col-md">
          <select className="form-select" value={marginStatusFilter} onChange={(e) => setMarginStatusFilter(e.target.value)}>
            <option value="">All Margin Statuses</option>
            <option value="pending">Margin Pending</option>
            <option value="partial">Partial Commission</option>
            <option value="received">Commission Received</option>
          </select>
        </div>
        <div className="col-6 col-md">
          <select className="form-select" value={paymentModeFilter} onChange={(e) => setPaymentModeFilter(e.target.value)}>
            <option value="">All Payment Modes</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Export Dropdown */}
        <div className="col-auto" ref={dropdownRef}>
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1" 
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
            >
              <i className="bi bi-download"></i>
              <span>Export</span>
            </button>

            {exportOpen && (
              <ul className="dropdown-menu dropdown-menu-end show shadow-sm border-0 mt-1">
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 py-2"
                    onClick={() => {
                      exportOrdersPDF(filtered, monthFilter ? formatMonthLabel(monthFilter) : '');
                      setExportOpen(false);
                    }}
                  >
                    <i className="bi bi-file-earmark-pdf-fill text-danger fs-6"></i>
                    <span>Export as PDF</span>
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 py-2"
                    onClick={() => {
                      exportCSVData(filtered);
                      setExportOpen(false);
                    }}
                  >
                    <i className="bi bi-file-earmark-excel-fill text-success fs-6"></i>
                    <span>Export as Excel (CSV)</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
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
                  <td colSpan="13" className="text-center py-4 text-muted">
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
                      <td className="small text-muted" style={{ maxWidth: 180 }}>{specStr}</td>
                      <td className="tabular-nums">{o.quantity.toLocaleString('en-IN')}</td>
                      <td className="tabular-nums"><strong>{formatINR(o.totalCustomerBill)}</strong></td>
                      <td className="tabular-nums text-success"><strong>{formatINR(o.profitMargin)}</strong></td>
                      
                      {/* Margin Payout Status */}
                      <td>
                        {marginStatus === 'received' && (
                          <span className="badge bg-success rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-check-circle-fill"></i> Received
                          </span>
                        )}
                        {marginStatus === 'partial' && (
                          <span className="badge bg-warning text-dark rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-dash-circle-fill"></i> Partial (₹{receivedAmount.toLocaleString('en-IN')})
                          </span>
                        )}
                        {marginStatus === 'pending' && (
                          <span className="badge bg-danger rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-clock-fill"></i> Pending
                          </span>
                        )}
                      </td>

                      {/* Customer -> Factory Status */}
                      <td>
                        {(customerStatus === 'paid_to_factory' || customerStatus === 'paid') && (
                          <span className="badge bg-success rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-check-circle-fill"></i> Paid to Factory
                          </span>
                        )}
                        {customerStatus === 'partial' && (
                          <span className="badge bg-warning text-dark rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-dash-circle-fill"></i> Partial
                          </span>
                        )}
                        {customerStatus === 'pending' && (
                          <span className="badge bg-danger rounded-pill d-inline-flex align-items-center gap-1">
                            <i className="bi bi-clock-fill"></i> Pending
                          </span>
                        )}
                      </td>

                      {/* Payment Details */}
                      <td className="small">
                        <div className="fw-bold">{getModeLabel(o.paymentMode)}</div>
                        {o.paymentDate && <div className="text-muted"><i className="bi bi-calendar3 me-1"></i>{o.paymentDate}</div>}
                        {o.paymentNotes && <div className="text-muted text-truncate" style={{ maxWidth: 140 }} title={o.paymentNotes}><i className="bi bi-card-text me-1"></i>{o.paymentNotes}</div>}
                      </td>

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
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => { setModalPayload(o); setActiveModal('order'); }}
                            title="Edit Order & Payment Status"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => deleteOrderDoc(o.id)}>
                            <i className="bi bi-trash-fill"></i>
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
