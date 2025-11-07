// src/components/MobileNumberModal.js

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // 1. AuthContext को इम्पोर्ट करें

export default function MobileNumberModal() {
  // 2. Auth स्टेट (यूज़र का नाम दिखाने के लिए) और updateUser फ़ंक्शन (Modal बंद करने के लिए) लें
  const { auth, updateUser } = useAuth(); 
  const [mobile, setMobile] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    const toastId = toast.loading('Updating mobile number...');
    try {
      const token = localStorage.getItem('token'); // टोकन लें
      
      // 3. Backend को मोबाइल नंबर भेजें (यह वही एंडपॉइंट है जो हमने बनाया था)
      const res = await axios.post(
        'https://collegeconnect-backend-mrkz.onrender.com/api/auth/update-mobile',
        { mobileNumber: mobile },
        { headers: { 'x-auth-token': token } }
      );
      
      toast.dismiss(toastId);
      toast.success('Mobile number updated!');
      
      // 4. AuthContext को बताएँ कि यूज़र अपडेट हो गया है
      // (यह 'updateUser' फ़ंक्शन 'auth.user' को अपडेट करेगा, जिससे Modal अपने आप बंद हो जाएगा)
      updateUser(res.data.user); 
      
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
      toast.error('❌ ' + errorMsg);
    }
  };

  return (
    // 5. पूरा Modal UI
    <div style={styles.overlay}>
      <div style={styles.content}>
        <h3>Welcome, {auth.user.name}!</h3>
        <p style={{color: '#555'}}>Please provide your mobile number to continue.</p>
        
        {/* ⭐⭐⭐ आपकी Warning यहाँ है ⭐⭐⭐ */}
        <div style={styles.warning}>
          "मोबाइल नंबर सही होना चाहिये, सीनियर आपसे इसी नंबर पर कॉल पर बात कर पायेगा।"
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="tel" // 'tel' टाइप मोबाइल कीपैड खोलता है
            placeholder="Enter your 10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} // सिर्फ नंबर लिखने देगा
            style={styles.input}
            maxLength="10" // 10 अंकों तक सीमित
          />
          <button type="submit" style={styles.button}>
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  overlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)', 
    zIndex: 1000,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backdropFilter: 'blur(5px)', // यह बैकग्राउंड को धुंधला करेगा
    padding: '1rem'
  },
  content: {
    background: 'white', 
    padding: '30px', 
    borderRadius: '10px',
    width: '100%', 
    maxWidth: '400px', 
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
    animation: 'slideUp 0.3s ease-out' // छोटा सा एनीमेशन
  },
  warning: {
    background: '#fffbe6', 
    border: '1px solid #ffe58f',
    padding: '12px', 
    borderRadius: '8px',
    fontSize: '0.9rem', 
    color: '#8a6d3b',
    marginBottom: '20px', 
    lineHeight: 1.5,
  },
  input: { 
    width: '100%', 
    padding: '12px', 
    fontSize: '1rem', 
    borderRadius: '8px', 
    border: '1.5px solid #ccc', 
    boxSizing: 'border-box', 
    marginBottom: '15px' 
  },
  button: { 
    width: '100%', 
    padding: '12px', 
    fontSize: '1rem', 
    background: 'linear-gradient(45deg, #2563eb, #1e40af)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontWeight: '500'
  }
};