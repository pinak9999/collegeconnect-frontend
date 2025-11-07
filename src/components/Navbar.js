import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ States
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isMobile = windowWidth <= 640;

  // ✅ Responsive + Scroll Logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // --- Scroll down → hide navbar ---
      if (currentScroll > lastScrollY && currentScroll > 80) {
        setVisible(false);
      } 
      // --- Scroll up → show navbar ---
      else {
        setVisible(true);
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // ✅ Logout Handler
  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully 🎉");
    navigate("/");
  };

  // ✅ Dashboard Link Logic
  const getDashboardLink = () => {
    if (auth.user?.role === "Admin") return "/admin-dashboard";
    if (auth.user?.isSenior) return "/senior-dashboard";
    return "/student-dashboard";
  };

  // ✅ Hide Navbar on Auth Pages
  const hiddenRoutes = ["/login", "/register", "/forgot-password"];
  const currentPath = location.pathname.toLowerCase();
  const shouldHideNavbar = hiddenRoutes.some((route) =>
    currentPath.startsWith(route)
  );
  if (shouldHideNavbar) return null;

  // ✅ Background Color Logic
  const isDashboard = location.pathname.includes("dashboard");
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)"
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  // ✅ Navbar Animation Styles
  const navStyle = {
    position: "fixed",
    top: visible ? "0" : "-90px",
    opacity: visible ? 1 : 0,
    transition: "top 0.5s ease, opacity 0.4s ease",
    width: "100%",
    zIndex: 1000,
    background: navBg,
    color: "#fff",
    boxShadow: visible ? "0 4px 15px rgba(0,0,0,0.25)" : "none",
    padding: "10px 0",
    backdropFilter: "blur(10px)",
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
    transition: "transform 0.3s ease",
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
        <Link
          to="/"
          style={logoStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
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
                  applyHover(e, "scale(1.07)", "0 5px 15px rgba(59,130,246,0.6)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(59,130,246,0.4)")
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
      </div>
    </nav>
  );
}

export default Navbar;
