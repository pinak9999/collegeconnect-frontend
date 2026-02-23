import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ==========================================
// 🔮 Dreamy Premium UI CSS (Like Image)
// ==========================================
const dreamyStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

@keyframes floatRocket {
  0% { transform: translate(0, 0) rotate(15deg); }
  50% { transform: translate(10px, -15px) rotate(20deg); }
  100% { transform: translate(0, 0) rotate(15deg); }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.3); }
  100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
}

@keyframes cloudsMove {
  0% { transform: translateX(-5%); }
  50% { transform: translateX(5%); }
  100% { transform: translateX(-5%); }
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dreamy-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  /* Deep space to pink dreamy gradient */
  background: linear-gradient(180deg, #150f36 0%, #3e1b60 40%, #8b4c9b 75%, #fbb7d0 100%);
}

/* Tiny Stars Background */
.stars-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 80px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 150px 120px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 250px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 350px 200px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 100px 250px, #fff, rgba(0,0,0,0));
  background-size: 400px 400px;
  opacity: 0.8;
  z-index: 0;
}

/* Glowing Orbs / Nebula effect */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
}
.nebula-1 { top: 10%; left: 10%; width: 400px; height: 400px; background: rgba(99, 102, 241, 0.3); }
.nebula-2 { bottom: 20%; right: 10%; width: 500px; height: 500px; background: rgba(236, 72, 153, 0.3); }

/* Fluffy Bottom Clouds (CSS Apporximation) */
.clouds-overlay {
  position: absolute;
  bottom: -50px; left: -10%; right: -10%;
  height: 250px;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(255,255,255,0.6) 0%, transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0%, transparent 50%);
  filter: blur(20px);
  z-index: 2;
  animation: cloudsMove 20s ease-in-out infinite;
}

/* 🚀 Floating Rocket */
.floating-rocket {
  position: absolute;
  top: -40px;
  right: -30px;
  font-size: 3.5rem;
  z-index: 10;
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
  animation: floatRocket 6s ease-in-out infinite;
}

/* Ultimate Glassmorphism Card */
.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 32px;
  padding: 40px 30px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.05);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
}

.glass-card.is-hovered {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
  animation: pulseGlow 3s infinite;
}

.title-text {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.subtitle-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 24px 0;
  font-weight: 400;
}
.subtitle-text b { color: #fff; font-weight: 600; }

.google-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 500;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.divider span { padding: 0 12px; }

.form-group {
  text-align: left;
  margin-bottom: 16px;
}
.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

/* Glass Inputs */
.glass-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  font-size: 0.95rem;
  color: white;
  outline: none;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.glass-input::placeholder { color: rgba(255, 255, 255, 0.5); }

.glass-input.is-focused, .glass-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Gradient Login Button */
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}
.login-btn.is-hovered {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(79, 70, 229, 0.6);
  background: linear-gradient(90deg, #5b54fa, #8b4dfa);
}

.extra-links {
  margin-top: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}
.link-text {
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}
.link-text:hover { opacity: 0.8; text-decoration: underline; }

/* Trust Badges matching the image */
.trust-badges {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.badge-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.badge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.badge-bottom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 600px) {
  .glass-card { padding: 30px 20px; border-radius: 24px; }
  .floating-rocket { font-size: 2.5rem; right: -15px; top: -30px; }
  .badge-row { flex-direction: column; gap: 8px; }
}
`;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(null);
  const [cardHover, setCardHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Handle responsiveness safely (Untouched Logic)
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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
    <div className="dreamy-page">
      <style>{dreamyStyles}</style>
      
      {/* Background Magical Elements */}
      <div className="stars-overlay"></div>
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="clouds-overlay"></div>

      {/* Main Glassmorphism Card */}
      <div 
        className={`glass-card ${cardHover ? 'is-hovered' : ''}`}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <div className="floating-rocket">🚀</div>

        <h2 className="title-text">Welcome Back 👋</h2>
        <p className="subtitle-text">
          Sign in to continue your journey<br/><b>CollegeConnect</b>
        </p>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled_black"
            size="large"
            shape="pill"
          />
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="davepinak3@gmail.com"
              value={formData.email}
              onChange={onChangeHandler}
              required
              className={`glass-input ${focusInput === "email" ? "is-focused" : ""}`}
              onFocus={() => setFocusInput("email")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="•••••••••"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className={`glass-input ${focusInput === "password" ? "is-focused" : ""}`}
              onFocus={() => setFocusInput("password")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`login-btn ${hover ? 'is-hovered' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="extra-links">
            <Link to="/forgot-password" className="link-text">
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Premium Trust Badges Matching Image */}
        <div className="trust-badges">
          <div className="badge-row">
            <div className="badge-item">
              <span>✅</span> Verified Platform
            </div>
            <div className="badge-item">
              <span>🛡️</span> Secure & Encrypted
            </div>
          </div>
          <div className="badge-bottom">
            <span>👥</span> Trusted by <b>1000+</b> Students
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;