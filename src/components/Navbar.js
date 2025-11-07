import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  // --- 1. सारे 'Hooks' (हुक्स) सबसे ऊपर ---
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showNav, setShowNav] = useState(true);
  const isMobile = windowWidth <= 640;

  // --- 2. 'useEffect' को 'condition' (शर्त) से पहले 'move' (स्थानांतरित) किया गया (यह 'Fix' (फिक्स) है) ---
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    const handleScroll = () => {
      // (मैंने 'logic' (तर्क) को भी 'scroll' (स्क्रॉल) 'hide' (छिपाएँ) वाले 'logic' (तर्क) में बदल दिया है, जो ज़्यादा बेहतर है)
      if (window.scrollY <= 0) setShowNav(true); 
      else setShowNav(false);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // [] = सिर्फ एक बार चलो

  // --- 3. अब 'conditional return' (सशर्त रिटर्न) (यह 'safe' (सुरक्षित) है) ---
  const hiddenRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const currentPath = location.pathname.toLowerCase();
  
  // ('startsWith' (से शुरू होता है) का इस्तेमाल करें ताकि '/reset-password/:token' (रीसेट-पासवर्ड/:टोकन) भी 'match' (मेल) हो)
  if (hiddenRoutes.some((route) => currentPath.startsWith(route))) {
    return null; // ✅ 'Navbar' (नेवबार) 'render' (रेंडर) नहीं होगा
  }

  // --- 4. बाकी 'Logic' (तर्क) ---
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
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)"
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  // --- 5. 'Styles' (शैलियाँ) ---
  const navStyle = {
    position: "fixed", // ('fixed' (फिक्स्ड) 'scroll' (स्क्रॉल) 'animation' (एनीमेशन) के लिए 'sticky' (चिपचिपा) से बेहतर है)
    width: "100%", // (यह 'fixed' (फिक्स्ड) के लिए ज़रूरी है)
    top: showNav ? "0" : "-100px",
    opacity: showNav ? "1" : "0", // (Smooth 'fade' (फीका) 'effect' (प्रभाव))
    transition: "top 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
    zIndex: 1000,
    background: navBg,
    color: "#fff",
    boxShadow: showNav ? "0 4px 15px rgba(0,0,0,0.25)" : "none",
    padding: "8px 0",
    backdropFilter: "blur(10px)",
    boxSizing: 'border-box' // ('width: 100%' (चौड़ाई: 100%) को सही रखने के लिए)
  };

  const containerStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: isMobile ? "center" : "space-between",
    gap: isMobile ? "12px" : "0",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    textDecoration: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: isMobile ? "100%" : "auto",
  };

  const btnBaseStyle = {
    color: "#fff",
    padding: "7px 16px",
    borderRadius: "50px",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
  };

  const applyHover = (e, transform, boxShadow) => {
    e.target.style.transform = transform;
    e.target.style.boxShadow = boxShadow;
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LOGO */}
        <Link to="/" style={logoStyle}>
          🎓{" "}
          <span style={{ letterSpacing: "0.5px" }}>
            College<span style={{ color: "#E0F2FE" }}>Connect</span>
          </span>
        </Link>

        {/* MENU */}
        <div style={menuStyle}>
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                  boxShadow: "0 3px 10px rgba(37,99,235,0.4)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.07)", "0 5px 15px rgba(37,99,235,0.6)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(37,99,235,0.4)")
                }
              >
                📊 Dashboard
              </Link>

              <button
                onClick={logoutHandler}
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  boxShadow: "0 3px 10px rgba(239,68,68,0.4)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.07)", "0 5px 15px rgba(239,68,68,0.6)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(239,68,68,0.4)")
                }
            _profile-page>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#60a5fa,#2563eb)",
                  boxShadow: "0 3px 10px rgba(59,130,246,0.4)",
T              }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.07)", "0 5px 15px rgba(59,130,246,0.6)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(59,130,246,0.4)")
                }
              >
          m     📝 Register
              </Link>

              <Link
                to="/login"
N                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#34d399,#059669)",
                  boxShadow: "0 3px 10px rgba(5,150,105,0.4)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.07)", "0 5px 15px rgba(5,150,105,0.6)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(5,150,105,0.4)")
                }
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
Note      </div>
    </nav>
  );
}

export default Navbar;