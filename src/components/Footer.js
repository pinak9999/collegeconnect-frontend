import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Footer({ loading }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hovered, setHovered] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;

  // 🔥 UPDATE: 0% Risk. Sare faltu links hata diye gaye hain. 
  // Ab har link ek asli page par jayega. Koi 'Coming Soon' alert nahi aayega.
  const linksMap = {
    "Get to Know Us": [
      { name: "About Us", href: "/about" }, 
      { name: "Contact Us", href: "/contact" }, 
    ],
    "Legal & Policies": [
      { name: "Terms & Conditions", href: "/terms" }, 
      { name: "Privacy Policy", href: "/privacy" }, 
      { name: "Refund & Cancellation", href: "/refund" }, 
    ],
    "For Students": [
      { name: "Find Mentors", href: "/" },
      { name: "Book a Session", href: "/" },
      { name: "Help Center", href: "/contact" },
    ],
  };

  const socialLinks = [
    { icon: "🌐", href: "https://reapcampusconnect.in", name: "Website" },
    { icon: "📸", href: "https://reapcampusconnect.in", name: "Instagram" },
    { icon: "🐦", href: "https://reapcampusconnect.in", name: "Twitter" },
    { icon: "💼", href: "https://reapcampusconnect.in", name: "LinkedIn" },
  ];

  const styles = {
    footer: {
      width: "100%",
      background: "#131A22",
      color: "#ddd",
      marginBottom: isMobile ? "-25px" : "0", 
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "2.5rem 0 1.5rem 0" : "3rem 0 2rem 0",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: isMobile ? "0 39px" : "0 40px",
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))",
      gap: isMobile ? "35px 20px" : "40px", 
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: "12px", 
      width: "100%",
    },
    heading: {
      color: "#ffffff",
      fontWeight: 600,
      fontSize: isMobile ? "1.05rem" : "1.15rem",
      marginBottom: "4px",
      letterSpacing: "0.5px",
    },
    link: {
      color: "#a1a1aa", 
      textDecoration: "none",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "inline-block", 
    },
    linkHover: {
      color: "#38bdf8", 
      transform: "translateX(6px)", 
    },
    socialRow: {
      display: "flex",
      justifyContent: "flex-start",
      gap: "12px",
      marginTop: "4px",
      flexWrap: "wrap", 
    },
    socialIcon: {
      width: isMobile ? "36px" : "40px",
      height: isMobile ? "36px" : "40px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.05)", 
      border: "1px solid rgba(255,255,255,0.1)", 
      color: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: isMobile ? "1.1rem" : "1.2rem",
      transition: "all 0.3s ease",
      textDecoration: "none",
    },
    brandSection: {
      textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      paddingTop: "2rem",
      marginTop: "3rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      padding: "0 15px",
      gridColumn: "1 / -1", 
    },
    brandName: { 
      background: "linear-gradient(90deg, #00E0FF, #38BDF8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 800, 
      fontSize: isMobile ? "1.4rem" : "1.6rem" 
    },
    bottomText: { fontSize: "0.8rem", color: "#64748b", marginTop: "6px" },
    tagline: {
      fontSize: isMobile ? "0.9rem" : "0.95rem", 
      color: "#94a3b8", 
      fontWeight: 400,
      textAlign: "center",
      margin:"-4px",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Dynamic Columns Rendering - Sare Links 100% Working Hain */}
        {Object.keys(linksMap).map((colName) => (
          <div key={colName} style={styles.column}>
            <h4 style={styles.heading}>{colName}</h4>
            {linksMap[colName].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    ...styles.link,
                    ...(hovered === item.name ? styles.linkHover : {}),
                  }}
                  onMouseEnter={() => setHovered(item.name)}
                  onMouseLeave={() => setHovered("")}
                >
                  {item.name}
                </Link>
            ))}
          </div>
        ))}

        {/* Social Icons - Inhe bhi safe URL pe point kar diya gaya hai */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Connect With Us</h4>
          <div style={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.socialIcon,
                  background: hovered === link.name ? "linear-gradient(135deg, #00E0FF, #38BDF8)" : "rgba(255,255,255,0.05)",
                  borderColor: hovered === link.name ? "transparent" : "rgba(255,255,255,0.1)",
                  transform: hovered === link.name ? "translateY(-4px)" : "translateY(0)",
                }}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered("")}
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Brand Footer */}
        <div style={styles.brandSection}>
          <div>
            <span style={styles.brandName}>Campus Connect</span>
          </div>
          <p style={styles.tagline}>
            Simplifying engineering admission & beyond
          </p>
          <p style={styles.bottomText}>
            © 2026 RajasthanCampus Connect. Made with ❤️ for Indian Students.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;