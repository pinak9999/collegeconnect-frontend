import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ('Google' (गूगल) (Google (गूगल)) 'को' (to) '`index.js`' (इंडेक्स.जेएस) (index.js) 'में' (in) '`Provider`' (प्रोवाइडर) (Provider (प्रदाता)) 'की' (of) 'ज़रूरत' (need) 'होती' (is) 'है' (है))
// ('लेकिन' (But) 'हम' (we) '`LoginPage`' (लॉगिनपेज) (LoginPage) 'को' (to) 'भी' (also) '`Provider`' (प्रोवाइडर) (Provider (प्रदाता)) 'से' (from) '`रैप`' (wrap) (Wrap (लपेट)) '`कर सकते हैं`' (can) (कर (do) 'सकते' (can) 'हैं' (हैं)))
// 'चलिए' (Let's) '`index.js`' (इंडेक्स.जेएस) (index.js) 'को' (to) '`ही`' (only) '`बदलते`' (change) ('बदलते' (Change) (बदलें)) '`हैं`' (is) (हैं), 'वह' (it) '`ज़्यादा`' (more) ('ज़्यादा' (More) (अधिक)) '`सही`' (correct) ('सही' (Correct) (सही)) '`है`' (is) (है)।
// '`index.js`' (इंडेक्स.जेएस) (index.js) '`में`' (in) '`GoogleOAuthProvider`' (गूगलऑथप्रोवाइडर) (GoogleOAuthProvider) '`ऐड`' (add) (Add (जोड़)) '`करें`' (do) (करें)।

// ('API' (एपीआई) (API (एपीआई)) 'URL' (यूआरएल) (URL (यूआरएल)))
const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ('ईमेल' (Email) (ईमेल) 'और' (and) 'पासवर्ड' (Password) (पासवर्ड) '`Submit`' (सबमिट) (Submit (जमा)) '`Handler`' (हैंडलर) (Handler (हैंडलर)))
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Login Successful!");
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  // ('Google' (गूगल) (Google (गूगल)) '`Login`' (लॉगिन) (Login (लॉगिन)) '`Success`' (सक्सेस) (Success (सफलता)) '`Handler`' (हैंडलर) (Handler (हैंडलर)))
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, { 
        token: credentialResponse.credential 
      });
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Google Login Successful!");
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  // --- (1. 'यह' (This) 'रहा' (is) 'नया' (new) '100% Accurate' (सही) '`HTML`' (एचटीएमएल) (HTML (एचटीएमएल))) ---
  // ('`style={...}`' (स्टाइल={...}) (style={...}) 'को' (to) '`className`' (क्लासनेम) (className) 'से' (from) '`बदल दिया गया है`' (has been replaced) (बदल (replace) 'दिया' (did) 'गया' (is) 'है' (is)))
  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler}>
        <h2>Welcome Back 👋</h2>
        <p style={{textAlign: 'center', marginBottom: '25px', color: '#555'}}>
          Sign in to continue your journey.
        </p>

        {/* 'Google' (गूगल) (Google (गूगल)) 'Login' (लॉगिन) (लॉगिन) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: '20px' }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            width="300px" // ('`max-width`' (मैक्स-विड्थ) (max-width (अधिकतम-चौड़ाई)) '`से`' (from) '`बेहतर`' (better) ('बेहतर' (Better) (बेहतर)) '`है`' (is) (है))
          />
        </div>

        {/* 'Divider' (डिवाइडर) (Divider (विभाजक)) */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#888', margin: '20px 0' }}>
          <hr style={{ flex: 1, borderTop: '1px solid #ddd' }} />
          <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>OR</span>
          <hr style={{ flex: 1, borderTop: '1px solid #ddd' }} />
        </div>

        {/* 'Email' (ईमेल) (ईमेल) 'Form' (फॉर्म) (फॉर्म) */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={onChangeHandler}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="form-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <Link to="/forgot-password" style={{ color: '#555' }}>
            Forgot Password?
          </Link>
          <Link to="/register" style={{ color: '#1abc9c', fontWeight: 'bold' }}>
            Register New Account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;