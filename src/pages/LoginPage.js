import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  // Inline styles
  const styles = {
    page: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
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
      marginBottom: '2rem',
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
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>
          Sign in to continue your journey with <b>CollegeConnect</b>
        </p>

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
