import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Orders } from './components/Orders';
import { Products } from './components/Products';
import { Factories } from './components/Factories';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';

import { OrderModal } from './components/modals/OrderModal';
import { ProductModal } from './components/modals/ProductModal';
import { EntityModal } from './components/modals/EntityModal';
import { PayoutModal } from './components/modals/PayoutModal';
import { CollectionModal } from './components/modals/CollectionModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { FirebaseModal } from './components/modals/FirebaseModal';

export const App = () => {
  const { activeTab, activeModal } = useApp();

  return (
    <>
      <Navbar />

      <main className="container">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'factories' && <Factories />}
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'reports' && <Reports />}
      </main>

      <footer>
        BoxLedger / Factory Flow &copy; 2026 - Generic Serverless React Carton Box Brokerage & Financial Ledger
      </footer>

      {activeModal === 'order' && <OrderModal />}
      {activeModal === 'product' && <ProductModal />}
      {activeModal === 'entity' && <EntityModal />}
      {activeModal === 'payout' && <PayoutModal />}
      {activeModal === 'collection' && <CollectionModal />}
      {activeModal === 'firebase' && <FirebaseModal />}
      <LightboxModal />
    </>
  );
};

export default App;
