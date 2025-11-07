import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // route helpers
  const isDashboard = location.pathname.includes("dashboard");

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

  // theming
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)" // darker for dashboard
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  // IMPORTANT: sticky only on non-dashboard pages
  const navPosition = isDashboard ? "static" : "sticky";

  // shared button style
  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: "0.95rem",
    lineHeight: 1, // keeps vertical centering crisp
    textDecoration: "none",
    color: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
    transition: "transform .2s ease, box-shadow .2s ease, background .2s ease",
    whiteSpace: "nowrap",
  };

  return (
    <nav
      style={{
        position: navPosition,
        top: 0,
        zIndex: 1000,
        background: navBg,
        color: "#fff",
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        padding: "8px 0",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* container */}
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          padding: "0 16px",
          // center alignment fix:
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          minHeight: 60,
        }}
      >
        {/* logo */}
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "1.55rem",
            fontWeight: 700,
            textDecoration: "none",
            color: "#fff",
            lineHeight: 1, // perfect center
          }}
        >
          🎓 <span>College<span style={{ color: "#E0F2FE" }}>Connect</span></span>
        </Link>

        {/* actions */}
        <div
          style={{
            // center & alignment fix:
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            // wrap nicely on very small widths but keep centered block:
            flexWrap: "wrap",
          }}
        >
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  ...btnBase,
                  background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(37,99,235,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(37,99,235,0.35)";
                }}
              >
                <span style={{ fontSize: 18 }}>📊</span> Dashboard
              </Link>

              <button
                onClick={logoutHandler}
                style={{
                  ...btnBase,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(239,68,68,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(239,68,68,0.35)";
                }}
              >
                <span style={{ fontSize: 18 }}>🚪</span> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{
                  ...btnBase,
                  background: "linear-gradient(135deg,#60a5fa,#2563eb)",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(59,130,246,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(59,130,246,0.35)";
                }}
              >
                <span style={{ fontSize: 18 }}>📝</span> Register
              </Link>

              <Link
                to="/login"
                style={{
                  ...btnBase,
                  background: "linear-gradient(135deg,#34d399,#059669)",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(5,150,105,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(5,150,105,0.35)";
                }}
              >
                <span style={{ fontSize: 18 }}>🔐</span> Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* tiny helper for very small screens so buttons don't stick to edges */}
      <style>
        {`
          @media (max-width: 420px) {
            nav > div { padding-left: 12px !important; padding-right: 12px !important; }
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;
