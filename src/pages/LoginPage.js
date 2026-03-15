import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ======================================
// 🚀 Premium Zomato-Style Login Page CSS
// ======================================
const loginStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --zomato-red: #e23744;
  --zomato-hover: #cb202d;
  --zomato-gradient: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  --zomato-light: #fcebed;
}

.login-page-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background: #fdfdfd;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* ✨ Premium Animated Background Blobs (Zomato Vibe) */
.login-page-bg::before, .login-page-bg::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: floatBlobs 8s ease-in-out infinite alternate;
}

.login-page-bg::before {
  width: 400px; height: 400px;
  background: rgba(226, 55, 68, 0.08); /* Light Zomato Red */
  top: -100px; left: -100px;
}

.login-page-bg::after {
  width: 350px; height: 350px;
  background: rgba(255, 94, 107, 0.06);
  bottom: -100px; right: -100px;
  animation-delay: 4s;
}

@keyframes floatBlobs {
  0% { transform: translateY(0px) scale(1); }
  100% { transform: translateY(30px) scale(1.1); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 55, 68, 0.15);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
  animation: fadeUp 0.6s ease-out forwards;
  position: relative;
  z-index: 1;
}

.login-card:hover {
  box-shadow: 0 25px 50px rgba(226, 55, 68, 0.08);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1c1c1c;
}

.login-title span {
  background: var(--zomato-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  color: #696969;
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
  color: #a0a0a0;
  font-size: 0.9rem;
  font-weight: 600;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1.5px solid #e8e8e8;
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
  color: #1c1c1c;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid #e8e8e8;
  background: #fdfdfd;
  font-size: 1rem;
  font-family: inherit;
  color: #1c1c1c;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--zomato-red);
  background: #ffffff;
  box-shadow: 0 0 0 4px var(--zomato-light);
}

.form-input::placeholder { color: #a0a0a0; }

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: var(--zomato-gradient);
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(226, 55, 68, 0.25);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(226, 55, 68, 0.35);
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
  color: #696969;
  font-weight: 500;
}

.link-text {
  color: var(--zomato-red);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.link-text:hover { color: var(--zomato-hover); }

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
        <h2 className="login-title">Welcome <span>Back</span></h2>
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
              placeholder="e.g. xyz@gmail.com"
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
               Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;