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
  const [lastScrollY, setLastScrollY] = useState(0);

  // --- USE EFFECT (Resize and Scroll) ---
  useEffect(() => {
    // 1. Resize Handler
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 2. Scroll Handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling Down
        setShowNav(false);
      } else {
        // Scrolling Up
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Re-run effect when lastScrollY changes

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

  // --- 🎨 STYLE OBJECTS 🎨 ---

  const containerStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: isMobile ? "center" : "space-between",
    gap: isMobile ? "15px" : "0",
  };

  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: isMobile ? "100%" : "auto",
  };

  // 6. बटन स्टाइल्स (छोटे)
  const btnBaseStyle = {
    color: "#fff",
    padding: "8px 18px", // छोटा किया
    borderRadius: "50px",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "0.9rem", // छोटा किया
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
    <nav
      style={{
        position: "sticky",
        // --- SCROLL ANIMATION ---
        top: showNav ? "0" : "-100px", // Hides by moving up
        transition: "top 0.3s ease", // The animation
        // -------------------------
        zIndex: 1000,
        background: navBg,
        color: "#fff",
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        padding: "8px 0", // पतला किया
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={containerStyle}>
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: "1.4rem", // छोटा किया
            fontWeight: 700,
            textDecoration: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          🎓{" "}
          <span style={{ letterSpacing: "0.5px" }}>
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