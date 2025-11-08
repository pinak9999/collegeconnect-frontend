import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Ensure global margin/padding reset for body & html
// Add this line in your global CSS file (index.css or App.css):
// body, html { margin: 0; padding: 0; box-sizing: border-box; }
<nav
  style={{
    width: "100%",
    backgroundColor: "#0F172A", // dark navy background
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed", // 👈 fix navbar to top
    top: 0,            // 👈 0px from top
    left: 0,
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  }}
>
  {/* your navbar content */}
</nav>


function Navbar() {
  
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Responsive: only width handling
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 640;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide navbar on auth pages
  const hiddenRoutes = ["/login", "/register", "/forgot-password"];
  const currentPath = location.pathname.toLowerCase();
  if (hiddenRoutes.some((r) => currentPath.startsWith(r))) return null;

  // Logout logic
  const logoutHandler = () => {
    logout();
    toast.success("Logged out successfully 🎉");
    navigate("/");
  };

  // Dashboard logic
  const getDashboardLink = () => {
    if (auth.user?.role === "Admin") return "/admin-dashboard";
    if (auth.user?.isSenior) return "/senior-dashboard";
    return "/student-dashboard";
  };

  // Navbar background
  const isDashboard = location.pathname.includes("dashboard");
  const navBg = isDashboard
    ? "linear-gradient(90deg, #0f172a, #1e293b)"
    : "linear-gradient(90deg, #007BFF, #00B4D8)";

  // Main Navbar style: NO margin, NO padding at top
  const navStyle = {
    
    position: "relative",
    width: "100%",
    background: navBg,
    margin: "0", // prevents unwanted margin above navbar
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    padding: "10px 0",
    zIndex: 1,
  };

  // Container styling
  const containerStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "0px 0", // corrected typo from "4px px"
    flexDirection: isMobile ? "column" : "row",
    justifyContent: isMobile ? "center" : "space-between",
    gap: isMobile ? "12px" : "0",
  };

  // Logo styles
  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    textDecoration: "none",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  // Menu style
  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: isMobile ? "100%" : "auto",
  };

  // Button style
  const btnBaseStyle = {
    color: "#fff",
    padding: "7px 16px",
    borderRadius: "50px",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    border: "none",
    cursor: "pointer",
  };

  // Hover effects
  const applyHover = (e, transform, boxShadow) => {
    e.currentTarget.style.transform = transform;
    e.currentTarget.style.boxShadow = boxShadow;
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          🎓{" "}
          <span style={{ letterSpacing: "0.5px" }}>
            College<span style={{ color: "#E0F2FE" }}>Connect</span>
          </span>
        </Link>

        <div style={menuStyle}>
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                  boxShadow: "0 3px 10px rgba(37,99,235,0.35)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.05)", "0 6px 14px rgba(37,99,235,0.5)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(37,99,235,0.35)")
                }
              >
                📊 Dashboard
              </Link>
              <button
                onClick={logoutHandler}
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  boxShadow: "0 3px 10px rgba(239,68,68,0.35)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.05)", "0 6px 14px rgba(239,68,68,0.5)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(239,68,68,0.35)")
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
                  boxShadow: "0 3px 10px rgba(59,130,246,0.35)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.05)", "0 6px 14px rgba(59,130,246,0.5)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(59,130,246,0.35)")
                }
              >
                📝 Register
              </Link>
              <Link
                to="/login"
                style={{
                  ...btnBaseStyle,
                  background: "linear-gradient(135deg,#34d399,#059669)",
                  boxShadow: "0 3px 10px rgba(5,150,105,0.35)",
                }}
                onMouseEnter={(e) =>
                  applyHover(e, "scale(1.05)", "0 6px 14px rgba(5,150,105,0.5)")
                }
                onMouseLeave={(e) =>
                  applyHover(e, "scale(1)", "0 3px 10px rgba(5,150,105,0.35)")
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