import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Background logic
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
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        padding: "10px 0",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          flexWrap: "wrap",
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
            gap: "6px",
          }}
        >
          🎓{" "}
          <span style={{ letterSpacing: "0.5px" }}>
            College<span style={{ color: "#E0F2FE" }}>Connect</span>
          </span>
        </Link>

        {/* Always Visible Buttons (No Hamburger) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 3px 10px rgba(37,99,235,0.4)",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.07)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(37,99,235,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 3px 10px rgba(37,99,235,0.4)";
                }}
              >
                📊 Dashboard
              </Link>

              <button
                onClick={logoutHandler}
                style={{
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(239,68,68,0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.07)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(239,68,68,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 3px 10px rgba(239,68,68,0.4)";
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{
                  background: "linear-gradient(135deg,#60a5fa,#2563eb)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 3px 10px rgba(59,130,246,0.4)",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.07)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(59,130,246,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 3px 10px rgba(59,130,246,0.4)";
                }}
              >
                📝 Register
              </Link>

              <Link
                to="/login"
                style={{
                  background: "linear-gradient(135deg,#34d399,#059669)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "50px",
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: "0 3px 10px rgba(5,150,105,0.4)",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.07)";
                  e.target.style.boxShadow =
                    "0 5px 15px rgba(5,150,105,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow =
                    "0 3px 10px rgba(5,150,105,0.4)";
                }}
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
