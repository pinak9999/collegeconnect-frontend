import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- RESPONSIVE STATE ---
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 640;

  // --- SCROLL ANIMATION STATE ---
  const [showNav, setShowNav] = useState(true);
  // 'lastScrollY' state ki ab zaroorat nahi hai.

  // --- USE EFFECT (Resize and Scroll) ---
  useEffect(() => {
    // 1. Resize Handler
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 2. Scroll Handler (Aapki requirement ke hisab se naya logic)
    const handleScroll = () => {
      if (window.scrollY === 0) {
        // Sirf tab dikhao jab page bilkul top par ho
        setShowNav(true);
      } else {
        // Jaise hi 1px bhi scroll ho, chhipa do
        setShowNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Ab dependency array ki zaroorat nahi, yeh sirf ek baar chalega.

  // Logout handler
  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully 🎉");
    navigate("/");
  };

  // Dashboard link logic
  const getDashboardLink = () => {
    if (auth.user?.role === "Admin") return "/admin-dashboard";
    if (auth.user?.isSenior) return "/senior-dashboard";
    return "/student-dashboard";
  };

  // Background logic (Dynamic)
  const isDashboard = location.pathname.includes("dashboard");
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)"
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  // --- 🎨 STYLE OBJECTS (Balanced Design) 🎨 ---

  // Main Nav Style
  const navStyle = {
    position: "sticky",
    top: showNav ? "0" : "-100px",
    transition: "top 0.3s ease",
    zIndex: 1000,
    background: navBg,
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    padding: "8px 0", // ⭐ Navbar ko patla kar diya gaya hai
    backdropFilter: "blur(8px)",
  };

  // Container Style
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

  // Logo Style
  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    textDecoration: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  // Menu (Buttons Container) Style
  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: isMobile ? "100%" : "auto",
  };

  // Base Button Style
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

  // Hover इफ़ेक्ट के लिए फंक्शंस
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
          <span style={{ letterSpacing: "3px" }}>
            College<span style={{ color: "#E0F2FE" }}>Connect</span>
          </span>
        </Link>

        {/* Menu Buttons */}
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
                  applyHover(
                    e,
                    "scale(1.07)",
                    "0 5px 15px rgba(37,99,235,0.6)"
                  )
                }
                onMouseLeave={(e) =>
                  applyHover(
                    e,
                    "scale(1)",
                    "0 3px 10px rgba(37,99,235,0.4)"
                  )
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
                  applyHover(
                    e,
                    "scale(1.07)",
                    "0 5px 15px rgba(239,68,68,0.6)"
                  )
                }
                onMouseLeave={(e) =>
                  applyHover(
                    e,
                    "scale(1)",
                    "0 3px 10px rgba(239,68,68,0.4)"
                  )
                }
              >
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
                }}
                onMouseEnter={(e) =>
                  applyHover(
                    e,
                    "scale(1.07)",
                    "0 5px 15px rgba(59,130,246,0.6)"
                  )
                }
                onMouseLeave={(e) =>
                  applyHover(
                    e,
                    "scale(1)",
                    "0 3px 10px rgba(59,130,246,0.4)"
                  )
                }
              >
                📝 Register
              </Link>

              <Link
                to="/login"
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#34d399,#059669)",
                  boxShadow: "0 3px 10px rgba(5,150,105,0.4)",
                }}
                onMouseEnter={(e) =>
                  applyHover(
                    e,
                    "scale(1.07)",
                    "0 5px 15px rgba(5,150,105,0.6)"
                  )
                }
                onMouseLeave={(e) =>
                  applyHover(
                    e,
                    "scale(1)",
                    "0 3px 10px rgba(5,150,105,0.4)"
                  )
                }
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;