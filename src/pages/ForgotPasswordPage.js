import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

// ======================================
// 🚀 Premium Zomato-Style Forgot Password CSS
// ======================================
const forgotStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --zomato-red: #e23744;
  --zomato-hover: #cb202d;
  --zomato-gradient: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  --zomato-light: #fcebed;
}

.forgot-page-bg {
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

/* ✨ Premium Animated Background Blobs */
.forgot-page-bg::before, .forgot-page-bg::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: floatBlobs 8s ease-in-out infinite alternate;
}

.forgot-page-bg::before {
  width: 400px; height: 400px;
  background: rgba(226, 55, 68, 0.08);
  top: -100px; left: -100px;
}

.forgot-page-bg::after {
  width: 350px; height: 350px;
  background: rgba(255, 94, 107, 0.06);
  bottom: -100px; right: -100px;
  animation-delay: 4s;
}

@keyframes floatBlobs {
  0% { transform: translateY(0px) scale(1); }
  100% { transform: translateY(30px) scale(1.1); }
}

.forgot-card {
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
  transition: box-shadow 0.3s ease;
}

.forgot-card:hover {
  box-shadow: 0 25px 50px rgba(226, 55, 68, 0.08);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 🔐 Animated Icon Wrapper */
.icon-wrapper {
  width: 70px;
  height: 70px;
  background: var(--zomato-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(226, 55, 68, 0.15);
  animation: pulseIcon 2.5s infinite ease-in-out;
}

@keyframes pulseIcon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.forgot-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1c1c1c;
}

.forgot-title span {
  background: var(--zomato-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.forgot-subtitle {
  color: #696969;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
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

.forgot-btn {
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

.forgot-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(226, 55, 68, 0.35);
}

.forgot-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.forgot-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 24px;
  color: #696969;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--zomato-red);
}

/* 📱 Mobile Responsiveness */
@media (max-width: 480px) {
  .forgot-card { padding: 30px 20px; border-radius: 20px; }
  .forgot-title { font-size: 1.6rem; }
  .form-input { padding: 12px 14px; font-size: 0.95rem; }
  .forgot-btn { padding: 12px; font-size: 1rem; }
  .icon-wrapper { width: 60px; height: 60px; font-size: 1.6rem; margin-bottom: 15px;}
}
`;

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending reset link...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/forgot-password",
        { email }
      );
      toast.dismiss(toastId);
      toast.success(res.data.msg || "Password reset link sent!");
      setEmail(""); // ✅ Clear input after success
    } catch (err) {
      toast.dismiss(toastId);
      let msg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("❌ " + msg);
    }
    setLoading(false);
  };

  return (
    <div className="forgot-page-bg">
      <style>{forgotStyles}</style>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="forgot-card">
        
        {/* Animated Icon */}
        <div className="icon-wrapper">🔐</div>
        
        <h2 className="forgot-title">Forgot <span>Password?</span></h2>
        
        <p className="forgot-subtitle">
          Don't worry! Enter your registered email address and we'll send you a secure reset link.
        </p>

        <div className="form-group">
          <input
            type="email"
            placeholder="e.g. student@college.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <button type="submit" className="forgot-btn" disabled={loading}>
          {loading ? "⏳ Sending Link..." : "🚀 Send Reset Link"}
        </button>

        {/* Back to Login Link */}
        <Link to="/login" className="back-link">
          ⬅ Back to Login
        </Link>
        
      </form>
    </div>
  );
}

export default ForgotPasswordPage;