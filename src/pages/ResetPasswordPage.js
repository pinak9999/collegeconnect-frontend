import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
  const { token } = useParams(); // URL से टोकन (यह सही है)
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // यह आपका सही backend URL है (जैसा 'forgot-password' में था)
  const API_URL = 'https://collegeconnect-backend-mrkz.onrender.com/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      // (1) URL को सही API एड्रेस से बदलें
      // (2) टोकन को URL (params) में भेजें और पासवर्ड को बॉडी में
      const res = await axios.post(
        `${API_URL}/reset-password/${token}`, // टोकन URL में
        { password } // पासवर्ड बॉडी में
      );

      toast.dismiss(toastId);
      toast.success(res.data.msg || 'Password reset successful!');
      navigate('/login'); // सफलता पर लॉगिन पेज पर भेजें

    } catch (err) {
      toast.dismiss(toastId);
      
      // बैकएंड से असली एरर मैसेज दिखाएं
      let errorMsg = 'Reset link expired or invalid.';
      if (err.response && err.response.data && err.response.data.msg) {
        errorMsg = err.response.data.msg;
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.g.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;