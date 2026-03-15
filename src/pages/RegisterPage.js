import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ======================================
// 🚀 Ultra-Premium 2026 Register Page CSS (Matches Login Page)
// ======================================
const registerStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.auth-container {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  background: #f8fafc;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 🎨 Subtle Background Blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: floatOrb 8s ease-in-out infinite alternate;
}
.blob-1 {
  width: 400px; height: 400px;
  background: rgba(226, 55, 68, 0.08); /* Zomato Red Glow */
  top: -10%; left: -10%;
}
.blob-2 {
  width: 300px; height: 300px;
  background: rgba(37, 99, 235, 0.06); /* Subtle Blue Glow */
  bottom: -10%; right: -10%;
  animation-delay: -4s;
}

@keyframes floatOrb {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(40px) scale(1.05); }
}

/* 🏢 The Card */
.auth-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px; 
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  border: 1px solid #f1f5f9;
  
  /* Flexbox for perfect mathematical alignment */
  display: flex;
  flex-direction: column;
  gap: 20px; 
  
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 🚀 Staggered Animation Classes */
.animate-item {
  opacity: 0;
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 🏷️ Headers */
.header-section {
  text-align: center;
  margin-bottom: 5px;
}
.auth-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}
.auth-title span {
  color: #e23744;
}
.auth-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 📝 Form Section */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Perfect spacing between inputs */
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-input {
  width: 100%;
  height: 52px; /* Fixed height for consistency */
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 500;
  color: #0f172a;
  transition: all 0.3s ease;
}

.premium-input:focus {
  outline: none;
  border-color: #e23744;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(226, 55, 68, 0.1);
}

.premium-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

/* 🖱️ Action Button */
.submit-btn {
  width: 100%;
  height: 54px; /* Matches input height closely */
  border-radius: 12px;
  border: none;
  background: #1c1c1c; /* Premium Dark */
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* 🔗 Links */
.footer-links {
  text-align: center;
  margin-top: 5px;
}

.redirect-text {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
}

.redirect-link {
  color: #e23744;
  font-weight: 700;
  text-decoration: none;
  margin-left: 5px;
}

.redirect-link:hover { 
  text-decoration: underline; 
}

/* 📱 Mobile Adjustments */
@media (max-width: 480px) {
  .auth-card {
    padding: 35px 20px;
    border-radius: 20px;
    gap: 18px;
  }
  .auth-title { font-size: 1.6rem; }
  .premium-input { height: 48px; font-size: 0.9rem; }
  .submit-btn { height: 50px; font-size: 1rem; }
}
`;

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/register",
        formData
      );
      toast.dismiss(toastId);
      toast.success(res.data.msg || "Registration Successful 🎉");
      navigate("/login");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <style>{registerStyles}</style>

      {/* Floating Background */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="auth-card">
        
        {/* 1. Headers */}
        <div className="header-section animate-item" style={{ animationDelay: '0.1s' }}>
          <h2 className="auth-title">Create <span>Account</span></h2>
          <p className="auth-subtitle">Join CampusConnect in seconds 🚀</p>
        </div>

        {/* 2. Form (Perfect Flexbox Spacing) */}
        <form className="auth-form" onSubmit={onSubmitHandler}>
          
          <div className="input-group animate-item" style={{ animationDelay: '0.2s' }}>
            <label className="input-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={onChangeHandler}
              required
              className="premium-input"
            />
          </div>

          <div className="input-group animate-item" style={{ animationDelay: '0.3s' }}>
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. hello@campusconnect.com"
              value={formData.email}
              onChange={onChangeHandler}
              required
              className="premium-input"
            />
          </div>

          <div className="input-group animate-item" style={{ animationDelay: '0.4s' }}>
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className="premium-input"
            />
          </div>

          <div className="input-group animate-item" style={{ animationDelay: '0.5s' }}>
            <label className="input-label">10-Digit Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="e.g. 9876543210"
              value={formData.mobileNumber}
              onChange={onChangeHandler}
              required
              minLength="10"
              maxLength="10"
              className="premium-input"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn animate-item" 
            style={{ animationDelay: '0.6s' }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account →"}
          </button>

        </form>

        {/* 3. Footer Links */}
        <div className="footer-links animate-item" style={{ animationDelay: '0.7s' }}>
          <p className="redirect-text">
            Already have an account?
            <Link to="/login" className="redirect-link">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;