import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ======================================
// 🚀 Premium Navbar CSS (Stacked Mobile UI - Logo Up, Buttons Down)
// ======================================
const navbarStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* --- Global Navbar Wrapper --- */
.nav-wrapper {
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* --- Main Navbar Container --- */
.main-nav {
  width: 100%;
  transition: background 0.3s ease;
  padding: 12px 0;
}

/* 🔥 Gradient Background */
.main-nav.dashboard-bg,
.main-nav.default-bg {
  background: linear-gradient(900deg, #1e3a8a 0%, #2563eb 100%); 
}

/* --- Inner Layout --- */
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

/* --- Brand Logo --- */
.brand-logo {
  font-size: 1.6rem;
  font-weight: 800;
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.5px;
  white-space: nowrap; 
}
.brand-highlight {
  background: linear-gradient(90deg, #00E0FF, #60A5FA, #38BDF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin-right: 2px;
}
.brand-text {
  color: #f8f9fa;
  font-weight: 600;
}

/* --- Navigation Buttons --- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn {
  color: #fff;
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  white-space: nowrap; 
}
.nav-btn:active { transform: scale(0.96); }

/* Specific Button Styles */
.btn-dashboard { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); }
.btn-dashboard:hover { box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4); transform: translateY(-2px); }

.btn-logout { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }
.btn-logout:hover { box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4); transform: translateY(-2px); }

.btn-register { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25); }
.btn-register:hover { box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4); transform: translateY(-2px); }

.btn-login { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
.btn-login:hover { box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); transform: translateY(-2px); }

/* --- Scrolling Tagline (Marquee) --- */
.scrolling-bar {
  background: linear-gradient(90deg, #f43f5e 0%, #d946ef 50%, #8b5cf6 100%);
  color: #ffffff;
  font-weight: 600;
  padding: 8px 0;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.scrolling-text {
  display: inline-block;
  padding-left: 100%;
  animation: scrollMarquee 22s linear infinite;
  will-change: transform;
}
@keyframes scrollMarquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-100%, 0, 0); }
}

/* =========================================
   📱 MOBILE RESPONSIVE FIXES (STACKED UI)
   ========================================= */
@media (max-width: 768px) {
  .main-nav { 
    padding: 16px 0; 
  }
  .nav-container {
    flex-direction: column; /* 🔥 Logo upar, Buttons niche */
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    gap: 16px; /* Logo aur buttons ke beech perfectly balanced space */
  }
  
  .brand-logo { 
    font-size: 1.6rem; /* Pura naam ache se dikhega */
    padding-top: 0;
  }
  .brand-highlight { display: inline; } /* 'Reap' word wapas la diya */
  
  .nav-actions { 
    width: 100%; 
    justify-content: center; 
    flex-wrap: nowrap; 
    gap: 12px; 
    margin-right: 0px; 
  }
  
  .nav-btn { 
    flex: 1; /* 🔥 Dono buttons 50-50% width lenge */
    max-width: 160px; /* Buttons zyada failyenge nahi */
    justify-content: center; /* Text ekdum center mein */
    padding: 10px 16px; 
    font-size: 0.9rem; 
    border-radius: 12px; /* Thoda modern curve diya hai */
  }
  
  .scrolling-bar { font-size: 0.75rem; padding: 6px 0; }
  .scrolling-text { animation-duration: 18s; } 
}

/* 🔥 EXTRA SMALL DEVICES (like 360px Androids / older iPhones) */
@media (max-width: 400px) {
  .nav-container { padding: 0 12px; gap: 4px; }
  .brand-logo { font-size: 1.7rem; margin-right: -15px ;        margin-top: -10px;
 }
  .nav-btn { padding: 8px 12px; font-size: 0.85rem; max-width: 140px; }
}
`;

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on specific routes
  const hiddenRoutes = ["/login", "/register", "/forgot-password"];
  const currentPath = location.pathname.toLowerCase();
  if (hiddenRoutes.some((r) => currentPath.startsWith(r))) return null;

  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully 🎉");
    navigate("/");
  };

  const getDashboardLink = () => {
    if (auth.user?.role === "Admin") return "/admin-dashboard";
    if (auth.user?.isSenior) return "/senior-dashboard";
    return "/student-dashboard";
  };

  const isDashboard = location.pathname.includes("dashboard");

  return (
    <>
      <style>{navbarStyles}</style>

      <div className="nav-wrapper">
        
        {/* 🚀 Main Navbar */}
        <nav className={`main-nav ${isDashboard ? 'dashboard-bg' : 'default-bg'}`}>
          <div className="nav-container">
            
            {/* Logo (Top on Mobile) */}
            <Link to="/" className="brand-logo">
             
              <span>
                <span className="brand-highlight">Reap</span>
                <span className="brand-text"> CampusConnect</span>
              </span>
            </Link>

            {/* Actions / Buttons (Bottom on Mobile) */}
            <div className="nav-actions">
              {auth.isAuthenticated && auth.user ? (
                <>
                  <Link to={getDashboardLink()} className="nav-btn btn-dashboard">
                    📊 Dashboard
                  </Link>
                  <button onClick={logoutHandler} className="nav-btn btn-logout">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="nav-btn btn-register">
                    📝 Register
                  </Link>
                  <Link to="/login" className="nav-btn btn-login">
                    🔐 Login
                  </Link>
                </>
              )}
            </div>

          </div>
        </nav>

        {/* 🌀 Premium Scrolling Tagline */}
        <div className="scrolling-bar">
          <div className="scrolling-text">
            🌟 "Rajasthan — Top Seniors, Real Experience, True Guidance." 👉 (क्योंकि
            असली सीनियर्स वही हैं जो मदद करना जानते हैं) || भरोसेमंद प्लेटफ़ॉर्म जो
            छात्रों को सही जानकारी और सही दिशा देता है 🚀 || 24×7 Support Available
          </div>
        </div>

      </div>
    </>
  );
}

export default Navbar;