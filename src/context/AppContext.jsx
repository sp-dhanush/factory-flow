import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getSavedFirebaseConfig } from '../firebase-config';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const getThemeCookie = () => {
    const match = document.cookie.match(/(?:^|; )factory_flow_theme=([^;]*)/);
    return match ? match[1] : (localStorage.getItem('factory_flow_theme') || 'dark');
  };

  const [theme, setTheme] = useState(getThemeCookie);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('factory_flow_theme', theme);
    document.cookie = `factory_flow_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);

  const [factories, setFactories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [activeModal, setActiveModal] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const unsubscribersRef = React.useRef([]);

  const detachListeners = () => {
    unsubscribersRef.current.forEach(unsub => typeof unsub === 'function' && unsub());
    unsubscribersRef.current = [];
  };

  useEffect(() => {
    initFirebase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initFirebase = () => {
    detachListeners();
    const config = getSavedFirebaseConfig();
    if (config.apiKey && config.projectId) {
      try {
        let app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
        let firebaseAuth = getAuth(app);
        let firebaseDb = getFirestore(app);

        setAuth(firebaseAuth);
        setDb(firebaseDb);
        setIsConnected(true);
        setIsDemoMode(false);

        onAuthStateChanged(firebaseAuth, (currentUser) => {
          setUser(currentUser);
          detachListeners();
          if (currentUser) {
            loadFirestore(firebaseDb, currentUser.uid);
          } else {
            setFactories([]);
            setCustomers([]);
            setProducts([]);
            setOrders([]);
            setTransactions([]);
          }
        });

        return;
      } catch (e) {
        console.warn('Firebase init failed, switching to demo mode', e);
      }
    }
    loadDemoMode();
  };

  const loadDemoMode = () => {
    detachListeners();
    setIsDemoMode(true);
    setIsConnected(false);
    const local = localStorage.getItem('factory_flow_demo_data');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.orders && parsed.orders.some(o => o.orderNumber === 'ORD-2026-01' || o.id === 'o1')) {
          localStorage.removeItem('factory_flow_demo_data');
          setFactories([]);
          setCustomers([]);
          setProducts([]);
          setOrders([]);
          setTransactions([]);
          return;
        }
        setFactories(parsed.factories || []);
        setCustomers(parsed.customers || []);
        setProducts(parsed.products || []);
        setOrders(parsed.orders || []);
        setTransactions(parsed.transactions || []);
        return;
      } catch (e) {
        console.warn('Local demo data error', e);
      }
    }
    setFactories([]);
    setCustomers([]);
    setProducts([]);
    setOrders([]);
    setTransactions([]);
  };

  const [syncNotice, setSyncNotice] = useState(null);

  const loadFirestore = (firestoreDb, userId) => {
    if (!userId) return;
    detachListeners();

    const errHandler = (err) => {
      console.warn('Firestore snapshot error', err);
      setSyncNotice('Cloud sync issue detected. Operating in local demo mode.');
      loadDemoMode();
    };

    const unsubFact = onSnapshot(collection(firestoreDb, 'users', userId, 'factories'), snap => {
      setFactories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, errHandler);

    const unsubCust = onSnapshot(collection(firestoreDb, 'users', userId, 'customers'), snap => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, errHandler);

    const unsubProd = onSnapshot(collection(firestoreDb, 'users', userId, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, errHandler);

    const unsubOrd = onSnapshot(collection(firestoreDb, 'users', userId, 'orders'), snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, errHandler);

    const unsubTx = onSnapshot(collection(firestoreDb, 'users', userId, 'transactions'), snap => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, errHandler);

    unsubscribersRef.current = [unsubFact, unsubCust, unsubProd, unsubOrd, unsubTx];
  };

  const loginWithGoogle = async () => {
    if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e) {
        alert('Google Sign-in failed: ' + e.message);
      }
    } else {
      alert('Please configure your Firebase credentials first!');
    }
  };

  const logout = async () => {
    detachListeners();
    setUser(null);
    setFactories([]);
    setCustomers([]);
    setProducts([]);
    setOrders([]);
    setTransactions([]);
    if (auth) {
      await signOut(auth);
    }
  };

  const sanitizeForFirestore = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const clean = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        clean[key] = obj[key];
      }
    });
    return clean;
  };

  const saveOrderDoc = async (ordData, id = null) => {
    const targetId = id || ordData.id;
    const cleanData = sanitizeForFirestore(ordData);
    if (targetId) {
      delete cleanData.id;
      if (!isDemoMode && db && user) {
        await updateDoc(doc(db, 'users', user.uid, 'orders', targetId), cleanData);
      } else {
        const updated = orders.map(o => o.id === targetId ? { ...o, ...cleanData, id: targetId } : o);
        setOrders(updated);
        saveLocalDemoState({ orders: updated });
      }
    } else {
      if (!isDemoMode && db && user) {
        await addDoc(collection(db, 'users', user.uid, 'orders'), cleanData);
      } else {
        const newOrd = { ...cleanData, id: 'o_' + Date.now() };
        const updated = [newOrd, ...orders];
        setOrders(updated);
        saveLocalDemoState({ orders: updated });
      }
    }
  };

  const deleteOrderDoc = async (id) => {
    if (confirm('Delete this order?')) {
      if (!isDemoMode && db && user) {
        await deleteDoc(doc(db, 'users', user.uid, 'orders', id));
      } else {
        const updated = orders.filter(o => o.id !== id);
        setOrders(updated);
        saveLocalDemoState({ orders: updated });
      }
    }
  };

  const saveProductDoc = async (id, item) => {
    const cleanItem = sanitizeForFirestore(item);
    if (id) {
      if (!isDemoMode && db && user) {
        await updateDoc(doc(db, 'users', user.uid, 'products', id), cleanItem);
      } else {
        const updated = products.map(p => p.id === id ? { ...p, ...cleanItem } : p);
        setProducts(updated);
        saveLocalDemoState({ products: updated });
      }
    } else {
      if (!isDemoMode && db && user) {
        await addDoc(collection(db, 'users', user.uid, 'products'), cleanItem);
      } else {
        const updated = [{ ...cleanItem, id: 'p_' + Date.now() }, ...products];
        setProducts(updated);
        saveLocalDemoState({ products: updated });
      }
    }
  };

  const deleteProductDoc = async (id) => {
    const p = products.find(i => i.id === id);
    if (confirm(`Delete product spec "${p ? p.productName : ''}"?`)) {
      if (!isDemoMode && db && user) {
        await deleteDoc(doc(db, 'users', user.uid, 'products', id));
      } else {
        const updated = products.filter(i => i.id !== id);
        setProducts(updated);
        saveLocalDemoState({ products: updated });
      }
    }
  };

  const saveEntityDoc = async (id, type, item) => {
    const cleanItem = sanitizeForFirestore(item);
    const coll = type === 'factory' ? 'factories' : 'customers';
    if (id) {
      if (!isDemoMode && db && user) {
        await updateDoc(doc(db, 'users', user.uid, coll, id), cleanItem);
      } else {
        if (type === 'factory') {
          const updated = factories.map(f => f.id === id ? { ...f, ...cleanItem } : f);
          setFactories(updated);
          saveLocalDemoState({ factories: updated });
        } else {
          const updated = customers.map(c => c.id === id ? { ...c, ...cleanItem } : c);
          setCustomers(updated);
          saveLocalDemoState({ customers: updated });
        }
      }
    } else {
      if (!isDemoMode && db && user) {
        await addDoc(collection(db, 'users', user.uid, coll), cleanItem);
      } else {
        if (type === 'factory') {
          const updated = [{ ...cleanItem, id: 'f_' + Date.now() }, ...factories];
          setFactories(updated);
          saveLocalDemoState({ factories: updated });
        } else {
          const updated = [{ ...cleanItem, id: 'c_' + Date.now() }, ...customers];
          setCustomers(updated);
          saveLocalDemoState({ customers: updated });
        }
      }
    }
  };

  const deleteEntityDoc = async (id, type) => {
    const list = type === 'factory' ? factories : customers;
    const item = list.find(i => i.id === id);
    if (confirm(`Delete ${type} "${item ? item.name : ''}"?`)) {
      if (!isDemoMode && db && user) {
        await deleteDoc(doc(db, 'users', user.uid, type === 'factory' ? 'factories' : 'customers', id));
      } else {
        if (type === 'factory') {
          const updated = factories.filter(f => f.id !== id);
          setFactories(updated);
          saveLocalDemoState({ factories: updated });
        } else {
          const updated = customers.filter(c => c.id !== id);
          setCustomers(updated);
          saveLocalDemoState({ customers: updated });
        }
      }
    }
  };

  const saveTransactionDoc = async (item) => {
    const cleanItem = sanitizeForFirestore(item);
    if (!isDemoMode && db && user) {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), cleanItem);
    } else {
      const updated = [{ ...cleanItem, id: 't_' + Date.now() }, ...transactions];
      setTransactions(updated);
      saveLocalDemoState({ transactions: updated });
    }
  };

  const saveLocalDemoState = (partial) => {
    const current = { factories, customers, products, orders, transactions, ...partial };
    localStorage.setItem('factory_flow_demo_data', JSON.stringify(current));
  };

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      theme, toggleTheme,
      isDemoMode, setIsDemoMode,
      isConnected, syncNotice, setSyncNotice,
      user, loginWithGoogle, logout,
      factories, customers, products, orders, transactions,
      activeModal, setActiveModal,
      modalPayload, setModalPayload,
      lightboxImg, setLightboxImg,
      saveOrderDoc, deleteOrderDoc,
      saveProductDoc, deleteProductDoc,
      saveEntityDoc, deleteEntityDoc,
      saveTransactionDoc,
      reloadFirebase: () => initFirebase()
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
