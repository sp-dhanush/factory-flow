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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fs-5 fw-bold font-outfit">Customer Product & Box Specifications Catalog</div>
        <button className="btn btn-primary d-flex align-items-center gap-1 rounded-3 px-3 py-2 shadow-sm" onClick={() => { setModalPayload(null); setActiveModal('product'); }}>
          <i className="bi bi-plus-lg"></i>
          <span>Add Product Specification</span>
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-body-tertiary border-secondary border-opacity-25">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search product name, customer, specs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <select className="form-select" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)}>
            <option value="">All Customers</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
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
                  <td colSpan="7" className="text-center py-4 text-muted">
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
                      <td><span className="badge bg-info text-dark rounded-pill">{p.ply}</span></td>
                      <td>{p.gsmBf || '-'}</td>
                      <td className="small text-muted fw-medium">{autoDesc}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" onClick={() => { setModalPayload(p); setActiveModal('product'); }} title="Edit Specification">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => deleteProductDoc(p.id)} title="Delete Specification">
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
