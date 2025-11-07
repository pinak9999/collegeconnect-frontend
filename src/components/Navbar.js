import React, { useState, useEffect } from "react"; // 1. useState और useEffect को इम्पोर्ट करें
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. स्क्रीन की चौड़ाई को स्टोर करने के लिए State बनाएँ
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 640; // मोबाइल ब्रेकपॉइंट

  // 3. स्क्रीन का साइज़ बदलने पर उसे सुनें (Listen)
  useEffect(() => {
    // साइज़ बदलने पर state को अपडेट करने वाला फ़ंक्शन
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 'resize' इवेंट पर लिसनर लगाएँ
    window.addEventListener("resize", handleResize);

    // कंपोनेंट हटने पर लिसनर को साफ़ करें (Cleanup)
    return () => window.removeEventListener("resize", handleResize);
  }, []); // [] का मतलब है कि यह इफ़ेक्ट सिर्फ एक बार (माउंट पर) चलेगा

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

  // --- 🎨 स्टाइल ऑब्जेक्ट्स 🎨 ---

  // 4. Responsive Container Style
  const containerStyle = {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    // --- Responsive हिस्सा ---
    flexDirection: isMobile ? "column" : "row", // मोबाइल पर: कॉलम (ऊपर-नीचे)
    justifyContent: isMobile ? "center" : "space-between", // मोबाइल पर: बीच में
    gap: isMobile ? "15px" : "0", // मोबाइल पर: लोगो और बटन के बीच गैप
  };
  
  // 5. Responsive Menu Style
  const menuStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center", // बटन हमेशा बीच में रहेंगे
    width: isMobile ? "100%" : "auto", // मोबाइल पर: पूरी चौड़ाई लें
  };

  // 6. बटन स्टाइल्स को साफ़-सुथरा करना
  const btnBaseStyle = {
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "50px",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "0.95rem",
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
        top: 0,
        zIndex: 1000,
        background: navBg,
        color: "#fff",
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        padding: "10px 0",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* 7. Responsive स्टाइल को लागू करें */}
      <div style={containerStyle}>
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

        {/* 8. Responsive मेनू स्टाइल को लागू करें */}
        <div style={menuStyle}>
          {auth.isAuthenticated && auth.user ? (
            <>
              <Link
                to={getDashboardLink()}
                style={{
                  ...btnBaseStyle, // Base स्टाइल
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
                  ...btnBaseStyle, // Base स्टाइल
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
                  ...btnBaseStyle, // Base स्टाइल
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
                  ...btnBaseStyle, // Base स्टाइल
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