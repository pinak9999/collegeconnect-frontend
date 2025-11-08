import React, { useState, useEffect } from "react";

function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    footer: {
      width: "100%",
      background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
      color: "#fff",
      padding: isMobile ? "1.8rem 1rem" : "2.2rem 0",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
      marginTop: "40px",
    },
    glow: {
      position: "absolute",
      top: "-60px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "300px",
      height: "300px",
      background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)",
      filter: "blur(60px)",
      zIndex: 0,
    },
    container: {
      position: "relative",
      zIndex: 1,
      maxWidth: "900px",
      margin: "0 auto",
    },
    text: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: "rgba(255,255,255,0.85)",
      fontWeight: 400,
      transition: "color 0.3s ease",
    },
    brand: {
      color: hover ? "#60a5fa" : "#93c5fd",
      fontWeight: 700,
      letterSpacing: "0.5px",
      transition: "color 0.3s ease",
    },
    socialLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "1rem",
    },
    icon: {
      fontSize: "1.4rem",
      color: hover ? "#60a5fa" : "#ffffff",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.glow}></div>

      <div style={styles.container}>
        <p style={styles.text}>
          © 2025 <span
            style={styles.brand}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            College Connect
          </span>{" "}
          — All Rights Reserved.
        </p>

        {/* 🌐 Social Media Icons (optional) */}
        <div style={styles.socialLinks}>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            🌐
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            📸
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
            🐦
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
