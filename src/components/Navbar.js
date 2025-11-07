import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Logout handler
  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully 🎉");
    navigate("/");
  };

  // Dashboard route logic
  const getDashboardLink = () => {
    if (auth.user?.role === "Admin") return "/admin-dashboard";
    if (auth.user?.isSenior) return "/senior-dashboard";
    return "/student-dashboard";
  };

  // Background theme logic
  const isDashboard = location.pathname.includes("dashboard");
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)"
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: navBg,
        color: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Main container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "12px 20px",
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
          <span style={{ letterSpacing: "0.5px" }}>
            College<span style={{ color: "#E0F2FE" }}>Connect</span>
          </span>
        </Link>

        {/* Hamburger for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.8rem",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-toggle"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
          className="desktop-links"
        >
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
              >
                📊 Dashboard
              </Link>
              <button
                onClick={logoutHandler}
                style={{
                  background: "#F43F5E",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#E11D48")}
                onMouseLeave={(e) => (e.target.style.background = "#F43F5E")}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                📝 Register
              </Link>
              <Link
                to="/login"
                style={{
                  background: "linear-gradient(90deg, #10b981, #059669)",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          padding: "18px 0",
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
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: 500,
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
                background: "#F43F5E",
                color: "#fff",
                border: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: 500,
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
                background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                color: "#fff",
                textDecoration: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: 500,
                marginBottom: "10px",
              }}
            >
              📝 Register
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                background: "linear-gradient(90deg, #10b981, #059669)",
                color: "#fff",
                textDecoration: "none",
                padding: "10px 25px",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              🔐 Login
            </Link>
          </>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes slideDown {
            from {opacity: 0; transform: translateY(-10px);}
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
