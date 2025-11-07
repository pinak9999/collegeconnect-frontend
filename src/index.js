import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 1. 'Logic B' (लॉजिक बी) 'इम्पोर्ट' (import) करें
import { Toaster } from 'react-hot-toast'; // 2. 'Design A' (डिज़ाइन ए) 'इम्पोर्ट' (import) करें
import 'leaflet/dist/leaflet.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* 3. 'पूरी' (Whole) 'ऐप' (app) को 'Auth' (ऑथ) 'बक्से' (box) से 'रैप' (wrap) (लपेट) करें */}
      
      <Toaster  /* 4. 'पूरी' (Whole) 'ऐप' (app) के लिए 'Toast' (टोस्ट) 'नोटिफिकेशन्स' (notifications) (सूचनाएं) 'सेट' (set) करें */
        position="top-center"
        reverseOrder={false}
      />
      
      <App />

    </AuthProvider>
  </React.StrictMode>
);