import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ======================================
// 🚀 Premium Login Page CSS (Glassmorphism & Animations)
// ======================================
const loginStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.login-page-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  /* 🌟 Premium Gradient Background */
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 50%, #ffb199 100%);
  background-size: 200% 200%;
  animation: gradientBG 10s ease infinite;
  padding: 20px;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-card {
  /* 🪟 Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeUp 0.6s ease-out forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #4f46e5, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.login-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.2s;
}
.google-btn-wrapper:hover {
  transform: scale(1.02);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1.5px solid #e2e8f0;
}
.divider:not(:empty)::before { margin-right: 15px; }
.divider:not(:empty)::after { margin-left: 15px; }

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  font-size: 1rem;
  font-family: inherit;
  color: #0f172a;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ec4899;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
}

.form-input::placeholder { color: #94a3b8; }

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #ec4899);
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(236, 72, 153, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.extra-links {
  margin-top: 24px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.link-text {
  color: #4f46e5;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.link-text:hover { color: #ec4899; }

/* 📱 Mobile Responsiveness */
@media (max-width: 480px) {
  .login-card { padding: 30px 20px; border-radius: 20px; }
  .login-title { font-size: 1.8rem; }
  .form-input { padding: 12px 14px; font-size: 0.95rem; }
  .login-btn { padding: 12px; font-size: 1rem; }
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
      
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">
          Sign in to continue your journey with <b>CampusConnect</b>
        </p>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled_black"
            size="large"
            shape="pill"
          />
        </div>

        <div className="divider">OR CONTINUE WITH EMAIL</div>

        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. student@college.edu"
              value={formData.email}
              onChange={onChangeHandler}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "⏳ Logging in..." : "🚀 Secure Login"}
          </button>

          <div className="extra-links">
            <Link to="/forgot-password" className="link-text" style={{ display: 'block', marginBottom: '12px' }}>
              Forgot Password?
            </Link>
            <p style={{ margin: 0 }}>
              Don’t have an account?{" "}
              <Link to="/register" className="link-text">
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;