import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    // If user is on any dashboard route, hide unnecessary nav clutter
    const dashboardPaths = ["/admin-dashboard", "/senior-dashboard", "/student-dashboard"];
    setIsDashboard(dashboardPaths.some((path) => location.pathname.startsWith(path)));
  }, [location.pathname]);

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

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: isDashboard
          ? "rgba(255, 255, 255, 0.95)"
          : "linear-gradient(90deg, #007BFF, #004AAD)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        padding: "12px 18px",
        transition: "all 0.4s ease",
      }}
    >
      {/* MAIN CONTAINER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: "1.6rem",
            fontWeight: "700",
            textDecoration: "none",
            color: isDashboard ? "#007BFF" : "#fff",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          🎓 <span>College</span>
          <span style={{ color: isDashboard ? "#004AAD" : "#BFDBFE" }}>Connect</span>
        </Link>

        {/* HAMBURGER (mobile only) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: isDashboard ? "#007BFF" : "#fff",
            fontSize: "1.8rem",
            cursor: "pointer",
            display: "block",
          }}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: isDashboard ? "#fff" : "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            marginTop: "10px",
            padding: "15px 0",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>

          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMenuOpen(false)}
                style={navButton("#007BFF", "Dashboard", "📊")}
              >
                📊 Dashboard
              </Link>
              <button
                onClick={() => {
                  logoutHandler();
                  setMenuOpen(false);
                }}
                style={navButton("#EF4444")}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                style={navButton("#4F46E5")}
              >
                📝 Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={navButton("#10B981")}
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      )}

      {/* DESKTOP NAV */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "15px",
          maxWidth: "1200px",
          margin: "10px auto 0",
        }}
        className="desktop-nav"
      >
        {auth.isAuthenticated && auth.user ? (
          <>
            <Link
              to={getDashboardLink()}
              style={{
                ...desktopBtn("#007BFF"),
                display: isDashboard ? "none" : "inline-block",
              }}
            >
              📊 Dashboard
            </Link>
            <button
              onClick={logoutHandler}
              style={{
                ...desktopBtn("#EF4444"),
                background: isDashboard ? "#EF4444" : "linear-gradient(45deg,#EF4444,#DC2626)",
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" style={desktopBtn("#4F46E5")}>
              📝 Register
            </Link>
            <Link to="/login" style={desktopBtn("#10B981")}>
              🔐 Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Reusable styles
const navButton = (color) => ({
  background: color,
  color: "#fff",
  textDecoration: "none",
  padding: "10px 20px",
  borderRadius: "10px",
  fontWeight: 600,
  width: "85%",
  textAlign: "center",
  marginBottom: "10px",
  border: "none",
  cursor: "pointer",
  boxShadow: `0 4px 12px ${color}40`,
  transition: "transform 0.2s ease",
});

const desktopBtn = (color) => ({
  background: `linear-gradient(45deg,${color},${color}90)`,
  color: "#fff",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: "10px",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  boxShadow: `0 3px 10px ${color}50`,
  transition: "all 0.3s ease",
});

export default Navbar;
