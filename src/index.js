import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// --- 1. Google Provider को इम्पोर्ट करें ---
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- 2. .env फ़ाइल से Client ID लें ---
// (यह Vite 'import.meta.env' का उपयोग करता है)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// (अगर Client ID नहीं मिली तो डेवलपर को चेतावनी दें)
if (!googleClientId) {
  console.error("❌ Google Client ID नहीं मिली। कृपया .env.local फ़ाइल में VITE_GOOGLE_CLIENT_ID सेट करें।");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. AuthProvider को GoogleProvider से रैप करें */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider> 
        
        <Toaster 
          position="top-center"
          reverseOrder={false}
        />
        
        <App />

      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);