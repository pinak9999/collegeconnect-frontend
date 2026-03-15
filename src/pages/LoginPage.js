import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ======================================
// 🚀 Ultra-Premium 2026 Login Page CSS
// ======================================
const loginStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --primary-red: #e23744;
  --primary-hover: #cb202d;
  --bg-gradient: linear-gradient(135deg, #f6f8fb 0%, #e5ebf4 100%);
  --card-bg: rgba(255, 255, 255, 0.85);
  --text-dark: #0f172a;
  --text-muted: #64748b;
  --input-bg: #f8fafc;
  --input-border: #e2e8f0;
}

* {
  box-sizing: border-box;
}

.login-page-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background: var(--bg-gradient);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* ✨ Premium Floating Orbs Background */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: float 10s ease-in-out infinite alternate;
}

.orb-1 {
  width: 450px; height: 450px;
  background: rgba(226, 55, 68, 0.12);
  top: -150px; left: -150px;
}

.orb-2 {
  width: 350px; height: 350px;
  background: rgba(139, 92, 246, 0.08); /* Subtle Purple glow for contrast */
  bottom: -100px; right: -100px;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 50px) scale(1.1); }
}

/* 🏢 The Glassmorphism Card */
.login-card {
  background: var(--card-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  padding: 45px 35px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 🚀 Staggered Animation Classes */
.animate-item {
  opacity: 0;
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  0% { opacity: 0; transform: translateY(25px); }
  100% { opacity: 1; transform: translateY(0); }
}

.login-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-dark);
  letter-spacing: -0.5px;
}

.login-title span {
  color: var(--primary-red);
}

.login-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 30px;
  line-height: 1.5;
}

/* 🌐 Perfect Alignment for Google Button */
.google-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 25px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.google-btn-wrapper:hover {
  transform: translateY(-2px);
}

.google-btn-wrapper > div {
  width: 100% !important; /* Forces Google button to take full width */
  display: flex;
  justify-content: center;
}

/* ➖ Modern Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0 0 25px 0;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #cbd5e1;
}
.divider:not(:empty)::before { margin-right: 15px; }
.divider:not(:empty)::after { margin-left: 15px; }

/* 📝 Form Elements */
.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 15px 16px;
  border-radius: 14px;
  border: 2px solid var(--input-border);
  background: var(--input-bg);
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  color: var(--text-dark);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-red);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(226, 55, 68, 0.1);
}

.form-input::placeholder { 
  color: #94a3b8; 
  font-weight: 400;
}

/* 🖱️ Action Button */
.login-btn {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 20px rgba(226, 55, 68, 0.2);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(226, 55, 68, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  background: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

/* 🔗 Links */
.extra-links {
  margin-top: 25px;
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 500;
}

.link-text {
  color: var(--primary-red);
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.link-text:hover { 
  color: var(--primary-hover); 
}

/* 📱 Mobile Responsiveness */
@media (max-width: 480px) {
  .login-card { padding: 35px 20px; border-radius: 24px; }
  .login-title { font-size: 2rem; }
  .form-input { padding: 14px; font-size: 0.95rem; }
  .login-btn { padding: 15px; font-size: 1.05rem; }
}
`;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/login",
        formData
      );
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Login Successful!");
      const { role, isSenior } = res.data.user;
      if (role === "Admin") navigate("/admin-dashboard");
      else if (isSenior) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/google",
        { token: credentialResponse.credential }
      );
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Google Login Successful!");
      const { role, isSenior } = res.data.user;
      if (role === "Admin") navigate("/admin-dashboard");
      else if (isSenior) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () =>
    toast.error("Google login failed. Please try again.");

  return (
    <div className="login-page-bg">
      <style>{loginStyles}</style>

      {/* Floating Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="login-card">
        
        {/* Animated Item 1: Title */}
        <div className="animate-item" style={{ animationDelay: '0.1s' }}>
          <h2 className="login-title">Welcome <span>Back</span></h2>
          <p className="login-subtitle">
            Sign in to continue your journey with <b>CampusConnect</b>
          </p>
        </div>

        {/* Animated Item 2: Google Button */}
        <div className="animate-item google-btn-wrapper" style={{ animationDelay: '0.2s' }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="outline"
            size="large"
            shape="rectangular"
            width="100%"
          />
        </div>

        {/* Animated Item 3: Divider */}
        <div className="animate-item divider" style={{ animationDelay: '0.3s' }}>
          OR CONTINUE WITH EMAIL
        </div>

        <form onSubmit={onSubmitHandler}>
          
          {/* Animated Item 4: Email Input */}
          <div className="animate-item form-group" style={{ animationDelay: '0.4s' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. hello@campusconnect.com"
              value={formData.email}
              onChange={onChangeHandler}
              required
              className="form-input"
            />
          </div>

          {/* Animated Item 5: Password Input */}
          <div className="animate-item form-group" style={{ animationDelay: '0.5s' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your secure password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className="form-input"
            />
          </div>

          {/* Animated Item 6: Button & Links */}
          <div className="animate-item" style={{ animationDelay: '0.6s' }}>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "⏳ Authenticating..." : "Secure Login →"}
            </button>

            <div className="extra-links">
              <Link to="/forgot-password" className="link-text" style={{ display: 'block', marginBottom: '15px' }}>
                Forgot Password?
              </Link>
              <p style={{ margin: 0 }}>
                Don’t have an account?{" "}
                <Link to="/register" className="link-text" style={{textDecoration: 'underline'}}>
                  Register Here
                </Link>
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;