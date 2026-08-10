import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateBoxDescription } from '../utils/helpers';

export const Products = () => {
  const { products, customers, setActiveModal, setModalPayload, deleteProductDoc } = useApp();
  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  const filtered = products.filter(p => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase()) || 
                        (p.customerName || '').toLowerCase().includes(search.toLowerCase()) || 
                        (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCust = !customerFilter || p.customerId === customerFilter;
    return matchSearch && matchCust;
  });

  return (
    <section id="tab-products" className="tab-content active">
      <div className="section-header">
        <div className="section-title">Customer Product & Box Specifications Catalog</div>
        <button className="btn btn-primary" onClick={() => { setModalPayload(null); setActiveModal('product'); }}>+ Add Product Specification</button>
      </div>

      <div className="filters-bar">
        <input 
          type="text" 
          placeholder="Search product name, customer, specs..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <select value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Name</th>
                <th>Dimensions (L×W×H)</th>
                <th>Ply</th>
                <th>GSM / BF</th>
                <th>Auto-Generated Product Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No product specifications found. Click "+ Add Product Specification" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const autoDesc = p.description || generateBoxDescription(p);
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.customerName || '-'}</strong></td>
                      <td><strong>{p.productName}</strong></td>
                      <td className="tabular-nums">{p.length}×{p.width}×{p.height} {p.unit}</td>
                      <td><span className="status-badge badge-info">{p.ply}</span></td>
                      <td>{p.gsmBf || '-'}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{autoDesc}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setModalPayload(p); setActiveModal('product'); }} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>✏️ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteProductDoc(p.id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>🗑️</button>
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
