export const getSavedFirebaseConfig = () => {
  const saved = localStorage.getItem('factory_flow_firebase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
};

export const saveFirebaseConfig = (config) => {
  localStorage.setItem('factory_flow_firebase_config', JSON.stringify(config));
};

export const clearFirebaseConfig = () => {
  localStorage.removeItem('factory_flow_firebase_config');
};
