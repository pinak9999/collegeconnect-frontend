import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 1. 'Context' (कॉन्टेक्स्ट) (बक्सा) 'इम्पोर्ट' (import) करें
import toast from 'react-hot-toast'; // 2. 'Toasts' (टोस्ट) 'इम्पोर्ट' (import) करें

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 3. 'Context' (कॉन्टेक्स्ट) (बक्से) से 'login' (लॉगिन) 'फंक्शन' (function) 'लें' (Get)
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // (पेज (page) 'फ्रीज' (freeze) (जम) 'न' (not) 'हो' (get) 'इसके' (that's) 'लिए' (why))

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 
    setLoading(true); // (लोडिंग (Loading) 'शुरू' (Start))
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 4. (यह रहा 'नया' (New) 'Context' (कॉन्टेक्स्ट) (बक्सा) 'लॉजिक' (logic) (तर्क))
      login(res.data.token, res.data.user); // ('localStorage' (लोकल स्टोरेज) (लोकल स्टोरेज) 'की' (of) 'जगह' (place) 'Context' (कॉन्टेक्स्ट) (बक्से) 'को' (to) 'अपडेट' (update) 'करें' (do))
      // 5. (यह रहा 'नया' (New) 'Toast' (टोस्ट) 'मैसेज' (message) (संदेश))
      toast.success('Login Successful! Welcome back.');
      
      // 6. "स्मार्ट" (Smart) 'रीडायरेक्ट' (Redirect)
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === 'Admin') navigate('/admin-dashboard');
      else if (isSenior === true) navigate('/senior-dashboard');
      else navigate('/student-dashboard');
      
      // (window.location.reload() 'हटा' (remove) दिया गया है!)

    } catch (err) {
      let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
      toast.error('Error: ' + errorMsg); // 7. (नया 'Toast' (टोस्ट) 'एरर' (Error) (त्रुटि))
    }
    setLoading(false); // (लोडिंग (Loading) 'खत्म' (End))
  };

  // ... (onSubmitHandler 'फंक्शन' (function) 'के' (of) 'बाद' (after))
  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler}>
        <h2>Welcome Back!</h2>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={onChangeHandler} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={onChangeHandler} required />
        </div>
        
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
        </button>
        
        {/* --- (यह 'नया' (New) 'लिंक' (Link) 'है' (is)) --- */}
        <div style={{textAlign: 'right', marginTop: '10px'}}>
            <Link to="/forgot-password" style={{fontSize: '0.9rem', color: '#555'}}>Forgot Password?</Link>
        </div>
        {/* --- (अपडेट (Update) खत्म) --- */}
        
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;