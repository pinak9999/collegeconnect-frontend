import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // logout
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

  // Transparent Navbar for Home, Solid for Dashboards
  const isDashboard = location.pathname.includes("dashboard");
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)" // dark blue for dashboard
    : "linear-gradient(90deg, rgba(0,123,255,0.95), rgba(0,180,216,0.95))";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: navBg,
        color: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        backdropFilter: "blur(10px)",
        transition: "0.3s ease-in-out",
      }}
    >
      {/* Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px 20px",
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            textDecoration: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          🎓{" "}
          <span
            style={{
              letterSpacing: "0.5px",
              transition: "0.3s",
            }}
          >
            College
            <span style={{ color: "#dbeafe" }}>Connect</span>
          </span>
        </Link>

        {/* HAMBURGER ICON (Visible only on mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.9rem",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-toggle"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* DESKTOP NAV LINKS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
          className="desktop-links"
        >
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.15)")
                }
              >
                📊 Dashboard
              </Link>
              <button
                onClick={logoutHandler}
                style={{
                  background: "linear-gradient(90deg,#ef4444,#dc2626)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#f87171,#ef4444)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#ef4444,#dc2626)")
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
                  background: "linear-gradient(90deg,#3b82f6,#2563eb)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#60a5fa,#3b82f6)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#3b82f6,#2563eb)")
                }
              >
                📝 Register
              </Link>
              <Link
                to="/login"
                style={{
                  background: "linear-gradient(90deg,#10b981,#059669)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#34d399,#10b981)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(90deg,#10b981,#059669)")
                }
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU (Slide Down) */}
      <div
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          padding: "20px 0",
          borderRadius: "0 0 15px 15px",
          animation: "slideDown 0.4s ease",
        }}
      >
        {auth.isAuthenticated && auth.user ? (
          <>
            <Link
              to={getDashboardLink()}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#fff",
                textDecoration: "none",
                padding: "12px 30px",
                fontWeight: 600,
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                marginBottom: "10px",
              }}
            >
              📊 Dashboard
            </Link>
            <button
              onClick={() => {
                logoutHandler();
                setMenuOpen(false);
              }}
              style={{
                background: "linear-gradient(90deg,#ef4444,#dc2626)",
                color: "#fff",
                border: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              style={{
                background: "linear-gradient(90deg,#3b82f6,#2563eb)",
                color: "#fff",
                textDecoration: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              📝 Register
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                background: "linear-gradient(90deg,#10b981,#059669)",
                color: "#fff",
                textDecoration: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              🔐 Login
            </Link>
          </>
        )}
      </div>

      {/* Mobile Animation */}
      <style>
        {`
        @keyframes slideDown {
          from {opacity: 0; transform: translateY(-15px);}
          to {opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 768px) {
          .desktop-links { display: none; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none; }
        }
      `}
      </style>
    </nav>
  );
}

export default Navbar;
