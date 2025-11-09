import React, { useState, useEffect } from "react";

function Footer({ loading }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hovered, setHovered] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;

  const styles = {
    footer: {
      width: "100%",
      background: "#131A22",
      color: "#ddd",
      marginBottom:"-22px",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "-1rem 1rem" : "2.5rem 0 2rem 0",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      marginTop: "1px",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "0 10px" : "0 20px",
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
      gap: isMobile ? "20px" : "40px",
      textAlign: isMobile ? "center" : "left",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    heading: {
      color: "#fff",
      fontWeight: 600,
      fontSize: "1rem",
      marginBottom: "6px",
    },
    link: {
      color: "#ccc",
      textDecoration: "none",
      fontSize: "0.9rem",
      transition: "color 0.2s ease",
    },
    linkHover: {
      color: "#00a8e1",
    },
    socialRow: {
      display: "flex",
      justifyContent: isMobile ? "center" : "flex-start",
      gap: "12px",
      marginTop: "8px",
    },
    socialIcon: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      background: "#232f3e",
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
    },
    brandSection: {
      textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.15)",
      paddingTop: "1.5rem",
      marginTop: "1.5rem",
    },
    brandName: { color: "#00a8e1", fontWeight: 700 },
    bottomText: { fontSize: "0.85rem", color: "#aaa", marginTop: "4px" },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Column 1 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Get to Know Us</h4>
          {["About Us", "Careers", "Press Release", "Blog"].map((item, i) => (
            <a
              key={i}
              href="#"
              style={{
                ...styles.link,
                ...(hovered === item ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered("")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Column 2 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Let Us Help You</h4>
          {["Help Center", "Your Account", "Report Issue", "Contact Us"].map(
            (item, i) => (
              <a
                key={i}
                href="#"
                style={{
                  ...styles.link,
                  ...(hovered === item ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered("")}
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Column 3 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>For Students</h4>
          {["Find Mentors", "Book a Session", "REAP Guide", "Learning Hub"].map(
            (item, i) => (
              <a
                key={i}
                href="#"
                style={{
                  ...styles.link,
                  ...(hovered === item ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered("")}
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Column 4 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Connect With Us</h4>
          <div style={styles.socialRow}>
            {["🌐", "📸", "🐦", "💼"].map((icon, i) => (
              <div
                key={i}
                style={{
                  ...styles.socialIcon,
                  background:
                    hovered === icon
                      ? "linear-gradient(45deg,#00a8e1,#2563eb)"
                      : "#232f3e",
                  transform: hovered === icon ? "scale(1.1)" : "scale(1)",
                }}
                onMouseEnter={() => setHovered(icon)}
                onMouseLeave={() => setHovered("")}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Footer */}
      <div style={styles.brandSection}>
        <h3>
          <span style={styles.brandName}>College Connect</span> — Guiding Students to Success.
        </h3>
        <p style={styles.bottomText}>
          © 2025 College Connect. Made with ❤️ for Indian Students.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
