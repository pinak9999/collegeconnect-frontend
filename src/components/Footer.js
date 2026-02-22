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

  // 🚀 PRO FIX: 404 Error रोकने के लिए फंक्शन
  const handleComingSoon = (e) => {
    e.preventDefault(); // पेज को 404 पर जाने से रोकेगा
    alert("🚀 This page is currently under construction. Coming soon!");
  };

  const linksMap = {
    "Get to Know Us": [
      { name: "About Us", href: "/about" }, // इसका पेज बन चुका है
      { name: "Careers", href: "/careers" },
      { name: "Press Release", href: "/press" },
      { name: "Blog", href: "/blog" },
    ],
    "Let Us Help You": [
      { name: "Help Center", href: "/help" },
      { name: "Your Account", href: "/account" },
      { name: "Report Issue", href: "/report-issue" },
      { name: "Contact Us", href: "/contact" },
    ],
    "For Students": [
      { name: "Find Mentors", href: "/find-mentors" },
      { name: "Book a Session", href: "/book-session" },
      { name: "REAP Guide", href: "/reap-guide" },
      { name: "Learning Hub", href: "/learning" },
    ],
  };

  const socialLinks = [
    { icon: "🌐", href: "https://yourwebsite.com", name: "Website" },
    { icon: "📸", href: "https://instagram.com/yourprofile", name: "Instagram" },
    { icon: "🐦", href: "https://twitter.com/yourprofile", name: "Twitter" },
    { icon: "💼", href: "https://linkedin.com/company/yourprofile", name: "LinkedIn" },
  ];

  const styles = {
    footer: {
      width: "100%",
      background: "#131A22",
      color: "#ddd",
      marginBottom: "-22px",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "2rem 1rem" : "2.5rem 0 2rem 0",
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
      cursor: "pointer",
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
      textDecoration: "none",
    },
    brandSection: {
      textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.15)",
      paddingTop: "1.5rem",
      marginTop: "1.5rem",
    },
    brandName: { color: "#00a8e1", fontWeight: 700, fontSize: "1.2rem" },
    bottomText: { fontSize: "0.85rem", color: "#aaa", marginTop: "4px" },
    tagline: {
      fontSize: "1rem", 
      color: "#ddd", 
      margin: "0 0 8px 0",
      fontWeight: 300,
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Column 1 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Get to Know Us</h4>
          {linksMap["Get to Know Us"].map((item) => (
            // 🚀 MAGIC: अगर "About Us" है तो <Link> चलाओ, वर्ना <a> पर Alert
            item.name === "About Us" ? (
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
            ) : (
              <a
                key={item.name}
                href={item.href}
                onClick={handleComingSoon}
                style={{
                  ...styles.link,
                  ...(hovered === item.name ? styles.linkHover : {}),
                }}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered("")}
              >
                {item.name}
              </a>
            )
          ))}
        </div>

        {/* Column 2 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Let Us Help You</h4>
          {linksMap["Let Us Help You"].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleComingSoon} // 🚀 यहाँ Alert लगा दिया
              style={{
                ...styles.link,
                ...(hovered === item.name ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered("")}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Column 3 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>For Students</h4>
          {linksMap["For Students"].map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleComingSoon} // 🚀 यहाँ Alert लगा दिया
              style={{
                ...styles.link,
                ...(hovered === item.name ? styles.linkHover : {}),
              }}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered("")}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Column 4 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Connect With Us</h4>
          <div style={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleComingSoon} // 🚀 Social icons पर भी Alert
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.socialIcon,
                  background:
                    hovered === link.name
                      ? "linear-gradient(45deg,#00a8e1,#2563eb)"
                      : "#232f3e",
                  transform: hovered === link.name ? "scale(1.1)" : "scale(1)",
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
      </div>

      {/* Brand Footer */}
      <div style={styles.brandSection}>
        <h3>
          <span style={styles.brandName}>Reapify by Pinak</span>
        </h3>
        <p style={styles.tagline}>
          Simplifying engineering admission & beyond
        </p>
        <p style={styles.bottomText}>
          © 2026 Reapify by Pinak. Made with ❤️ for Indian Students.
        </p>
      </div>
    </footer>
  );
}

export default Footer;