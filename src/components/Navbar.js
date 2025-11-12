import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ❗ Path को ठीक कर दिया है
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 640;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hiddenRoutes = ["/login", "/register", "/forgot-password"];
  const currentPath = location.pathname.toLowerCase();
  if (hiddenRoutes.some((r) => currentPath.startsWith(r))) return null;

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

  const navStyle = {
    position: "relative",
    width: "100%",
    background: navBg,
    margin: "0",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    padding: "10px 0",
    zIndex: 2,
  };

  const containerStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "0px 15px",
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
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    border: "none",
    cursor: "pointer",
  };

  const applyHover = (e, transform, boxShadow) => {
    e.currentTarget.style.transform = transform;
    e.currentTarget.style.boxShadow = boxShadow;
  };

  return (
    <>
      {/* 🚀 Navbar */}
      <nav style={navStyle}>
        <div style={containerStyle}>
          <Link to="/" style={logoStyle}>
            🚀{" "}
            <span style={{ letterSpacing: "0.5px" }}>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #00E0FF, #60A5FA, #38BDF8)",
                  WebkitBackgroundClip: "text",
                  color: "#ffffffff",
                  fontWeight: 700,
                }}
              >
                Reapify
              </span>
              <span style={{ color: "#fff3f3ff", fontWeight: 500 }}>
                {" "}
                by Pinak
              </span>
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
                    applyHover(
                      e,
                      "scale(1.05)",
                      "0 6px 14px rgba(37,99,235,0.5)"
                    )
                  }
                  onMouseLeave={(e) =>
                    applyHover(
                      e,
                      "scale(1)",
                      "0 3px 10px rgba(37,99,235,0.35)"
                    )
                  }
                >
                  📊 Dashboard
                </Link>

                {/* --- ✨ NAYA ANALYTICS LINK --- */}
                {(auth.user?.role === "Admin" || !auth.user?.isSenior) && (
                  <Link
                    to="/analytics"
                    style={{
                      ...btnBaseStyle,
                      background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                      boxShadow: "0 3px 10px rgba(168,85,247,0.35)",
                    }}
                    onMouseEnter={(e) =>
                      applyHover(
                        e,
                        "scale(1.05)",
                        "0 6px 14px rgba(168,85,247,0.5)"
                      )
                    }
                    onMouseLeave={(e) =>
                      applyHover(
                        e,
                        "scale(1)",
                        "0 3px 10px rgba(168,85,247,0.35)"
                      )
                    }
                  >
                    📈 Analytics
                  </Link>
                )}
                {/* --- ✨ END --- */}

                <button
                  onClick={logoutHandler}
                  style={{
                    ...btnBaseStyle,
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 3px 10px rgba(239,68,68,0.35)",
                  }}
                  onMouseEnter={(e) =>
                    applyHover(
                      e,
                      "scale(1.05)",
                      "0 6px 14px rgba(239,68,68,0.5)"
                    )
                  }
                  onMouseLeave={(e) =>
                    applyHover(
                      e,
                      "scale(1)",
                      "0 3px 10px rgba(239,68,68,0.35)"
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
                    boxShadow: "0 3px 10px rgba(59,130,246,0.35)",
                  }}
                  onMouseEnter={(e) =>
                    applyHover(
                      e,
                      "scale(1.05)",
                      "0 6px 14px rgba(59,130,246,0.5)"
                    )
                  }
                  onMouseLeave={(e) =>
                    applyHover(
                      e,
                      "scale(1)",
                      "0 3px 10px rgba(59,130,246,0.35)"
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
                    boxShadow: "0 3px 10px rgba(5,150,105,0.35)",
                  }}
                  onMouseEnter={(e) =>
                    applyHover(
                      e,
                      "scale(1.05)",
                      "0 6px 14px rgba(5,150,105,0.5)"
                    )
                  }
                  onMouseLeave={(e) =>
                    applyHover(
                      e,
                      "scale(1)",
                      "0 3px 10px rgba(5,150,105,0.35)"
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

      {/* 🌀 Moving Tagline */}
         <div
        style={{
          background: "linear-gradient(90deg, #ff0000b9, #b10cfdbb)",
          color: "white",
          fontWeight: 600,
          padding: "6px 0",
          textAlign: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            paddingLeft: "100%", // ✅ start offset ताकि text instantly दिखे
            animation: "scrollText 18s linear infinite",
            animationDelay: "0.3s", // ✅ browser को time दो width calculate करने का
            willChange: "transform", // ✅ GPU optimization
            transform: "translate3d(5%, 0, 0)", // ✅ pre-offset से instant motion
            backfaceVisibility: "hidden", // ✅ mobile flicker fix
          }}
        >
          🌟 "Reapify — Top Seniors, Real Experience, True Guidance." 👉 (क्योंकि असली
          सीनियर्स वही हैं जो मदद करना जानते हैं) || भरोसेमंद प्लेटफ़ॉर्म जो छात्रों
          को सही जानकारी और सही दिशा देता है 🚀 || 24×7 Support Available
        </div>

      </div>
    </>
  );
}

export default Navbar;