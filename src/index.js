import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
console.log("Google Client ID जो मुझे मिली:", googleClientId);
// --- (1. बदलाव: 'variable' (वैरिएबल) को पढ़ने का तरीका बदला गया) ---
// (Create React App 'process.env' का इस्तेमाल करता है)
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// (अगर Client ID नहीं मिली तो डेवलपर को चेतावनी दें)
if (!googleClientId) {
  console.error("❌ Google Client ID नहीं मिली। कृपया .env.local फ़ाइल में REACT_APP_GOOGLE_CLIENT_ID सेट करें।");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. हम Client ID को यहाँ पास कर रहे हैं */}
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