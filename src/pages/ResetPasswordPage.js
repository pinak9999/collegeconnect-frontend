import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // यह आपका सही backend URL है
  const API_URL = 'https://collegeconnect-backend-mrkz.onrender.com/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      const res = await axios.post(
        `${API_URL}/reset-password/${token}`,
        { password }
      );

      toast.dismiss(toastId);
      toast.success(res.data.msg || 'Password reset successful!');
      navigate('/login');

    } catch (err) {
      toast.dismiss(toastId);
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
            // --- (यहाँ 'e.g' को 'e' से बदल दिया गया है) ---
            onChange={(e) => setPassword(e.target.value)} // ✅ यह रहा फिक्स
            // ---
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