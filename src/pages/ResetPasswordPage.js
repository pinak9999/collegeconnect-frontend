import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // (1) useNavigate इम्पोर्ट करें
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
  const { token } = useParams(); // URL से टोकन सही से मिल रहा है
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // (2) लोडिंग स्टेट जोड़ा गया
  const navigate = useNavigate(); // (3) रीडायरेक्ट के लिए जोड़ा गया

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      // (4) महत्वपूर्ण बदलाव:
      // URL को छोटा करें और 'token' को 'password' के साथ बॉडी में भेजें।
      // (कृपया 'mrkz' वाला URL कन्फर्म कर लें)
      const res = await axios.post(
        'https://collegeconnect-backend-mrkz.onrender.com/api/auth/reset-password',
        { password, token } // टोकन को यहाँ बॉडी में भेजें
      );
      
      toast.dismiss(toastId);
      toast.success(res.data.msg || 'Password reset successful!');
      
      // (5) सफलता पर लॉगिन पेज पर रीडायरेक्ट करें
      navigate('/login'); 

    } catch (err) {
      toast.dismiss(toastId);
      
      // (6) बैकएंड से असली एरर मैसेज दिखाएं
      let errorMsg = 'Reset link expired or invalid.'; // डिफ़ॉल्ट
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="form-container"> {/* (CSS के लिए क्लास बदला) */}
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"> {/* (CSS के लिए जोड़ा) */}
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn" 
          disabled={loading} // (7) लोडिंग होने पर बटन डिसेबल करें
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;