import React, { useState, useEffect } from "react";

function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    hero: {
      width: "100%",
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background:
        "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #023e8a 100%)",
      color: "#fff",
      padding: isMobile ? "2rem 1rem" : "4rem 2rem",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    glow: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      height: "500px",
      background:
        "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
      filter: "blur(80px)",
      zIndex: 0,
      animation: "pulse 6s ease-in-out infinite",
    },
    container: {
      position: "relative",
      zIndex: 1,
      maxWidth: "900px",
      margin: "0 auto",
    },
    heading: {
      fontSize: isMobile ? "2rem" : "3rem",
      fontWeight: 700,
      lineHeight: "1.2",
      marginBottom: "1rem",
      background: "linear-gradient(90deg,#fff,#dbeafe,#bfdbfe)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: isMobile ? "1rem" : "1.2rem",
      color: "rgba(255,255,255,0.9)",
      marginBottom: "2rem",
      lineHeight: "1.5",
    },
    searchBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      flexDirection: isMobile ? "column" : "row",
      background: "rgba(255,255,255,0.15)",
      padding: isMobile ? "0.8rem" : "1rem",
      borderRadius: "50px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      width: isMobile ? "90%" : "70%",
      margin: "0 auto",
      transition: "0.3s ease",
    },
    input: {
      flex: 1,
      padding: "0.9rem 1.2rem",
      border: "none",
      outline: "none",
      borderRadius: "30px",
      fontSize: "1rem",
      width: isMobile ? "100%" : "70%",
      background: focus ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
      transition: "all 0.3s ease",
      color: "#111",
    },
    button: {
      padding: "0.9rem 2rem",
      background: hover
        ? "linear-gradient(45deg,#1e3a8a,#2563eb)"
        : "linear-gradient(45deg,#2563eb,#1d4ed8)",
      border: "none",
      color: "#fff",
      borderRadius: "30px",
      fontWeight: 600,
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: hover
        ? "0 8px 15px rgba(37,99,235,0.3)"
        : "0 5px 12px rgba(0,0,0,0.1)",
      width: isMobile ? "100%" : "auto",
    },
  };

  // Animation keyframes
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.5; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);

  return (
    <header style={styles.hero}>
      <div style={styles.glow}></div>

      <div style={styles.container}>
        <h1 style={styles.heading}>Choose Your Best College in REAP 🎓</h1>
        <p style={styles.subtitle}>
          Hostel, Faculty, Placements? Ask a senior from that college directly.
        </p>

        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Enter college name or branch..."
            style={styles.input}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <button
            style={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            🔎 Search
          </button>
        </div>
      </div>
    </header>
  );
}

export default Hero;
