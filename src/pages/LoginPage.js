import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// --- (1. नया इम्पोर्ट) ---
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- (2. आपका मौजूदा 'onSubmitHandler' - कोई बदलाव नहीं) ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'https://collegeconnect-backend-mrkz.onrender.com/api/auth/login',
        formData
      );
      login(res.data.token, res.data.user);
      toast.success('🎉 Login Successful! Welcome back.');

      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;

      if (userRole === 'Admin') navigate('/admin-dashboard');
      else if (isSenior === true) navigate('/senior-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
      toast.error('❌ ' + errorMsg);
    }
    setLoading(false);
  };

  // --- (3. Google Login के लिए नए फ़ंक्शंस) ---
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      // Backend को Google token भेजें (यह वही एंडपॉइंट है जो हमने बनाया था)
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/google",
        { token: credentialResponse.credential }
      );
      
      // Backend से मिले token और user से लॉगिन करें (बिलकुल नार्मल लॉगिन की तरह)
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success('🎉 Google Login Successful! Welcome.');

      // वही रोल-बेस्ड नेविगेशन लॉजिक
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;

      if (userRole === 'Admin') navigate('/admin-dashboard');
      else if (isSenior === true) navigate('/senior-dashboard');
      else navigate('/student-dashboard');

    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
      toast.error('❌ ' + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  // Inline styles
  const styles = {
    page: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', // 'height' की जगह 'minHeight' बेहतर है
      background: 'linear-gradient(135deg,  #007BFF, #00B4D8)',
      fontFamily: "'Poppins', sans-serif",
      padding: '1rem',
    },
    card: {
      background: '#fff',
      padding: '2.5rem',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
      animation: 'slideUp 0.8s ease',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '0.4rem',
      color: '#1e3a8a',
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1.5rem', // (स्पेसिंग बदली गई)
    },
    formGroup: {
      textAlign: 'left',
      marginBottom: '1.3rem',
    },
    label: {
      display: 'block',
      fontSize: '0.9rem',
      color: '#444',
      marginBottom: '0.4rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1.8px solid #ddd',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      outline: 'none',
      boxSizing: 'border-box', // (यह हमेशा अच्छा होता है)
    },
    button: {
      width: '100%',
      padding: '0.9rem',
      background: 'linear-gradient(45deg, #2563eb, #1e40af)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: '0.3s',
    },
    extraLinks: {
      marginTop: '1rem',
    },
    link: {
      color: '#2563eb',
      fontWeight: '500',
      textDecoration: 'none',
    },
    // --- (4. डिवाइडर के लिए नए स्टाइल्स) ---
    divider: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: '#888',
      margin: '1.5rem 0'
    },
    dividerLine: {
      flex: 1,
      borderTop: '1px solid #ddd'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>
          Sign in to continue your journey with <b>CollegeConnect</b>
        </p>

        {/* --- (5. Google Login बटन) --- */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="outline"
            size="large"
            width="320px" // कार्ड की चौड़ाई के हिसाब से
          />
        </div>

        {/* --- (6. "OR" डिवाइडर) --- */}
        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={{padding: '0 10px'}}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        {/* --- (7. आपका मौजूदा फ़ॉर्म) --- */}
        <form onSubmit={onSubmitHandler}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChangeHandler}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
            <p style={{ marginTop: '0.6rem', color: '#555' }}>
              Don’t have an account?{' '}
              <Link to="/register" style={styles.link}>Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;