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

  const handleComingSoon = (e) => {
    e.preventDefault();
    alert("🚀 Need Help? We're here for you. 📧 davepinak0@gmail.com 📞 +917665054856")
  };

  // 🔥 UPDATE: Razorpay के लिए Legal & Policies जोड़े गए और 4 ज़रूरी लिंक्स को "active: true" किया गया
  const linksMap = {
    "Get to Know Us": [
      { name: "About Us", href: "/about", active: false }, 
      { name: "Contact Us", href: "/contact", active: true }, // Razorpay Needs this
      { name: "Careers", href: "/careers", active: false },
      { name: "Blog", href: "/blog", active: false },
    ],
    "Legal & Policies": [
      { name: "Terms & Conditions", href: "/terms", active: true }, // Razorpay Needs this
      { name: "Privacy Policy", href: "/privacy", active: true }, // Razorpay Needs this
      { name: "Refund & Cancellation", href: "/refund", active: true }, // Razorpay Needs this
      { name: "Report Issue", href: "/report-issue", active: false },
    ],
    "For Students": [
      { name: "Find Mentors", href: "/find-mentors", active: false },
      { name: "Book a Session", href: "/book-session", active: false },
      { name: "REAP Guide", href: "/reap-guide", active: false },
      { name: "Learning Hub", href: "/learning", active: false },
    ],
  };

  const socialLinks = [
    { icon: "🌐", href: "https://reapcampusconnect.in", name: "Website" },
    { icon: "📸", href: "https://instagram.com/", name: "Instagram" },
    { icon: "🐦", href: "https://twitter.com/", name: "Twitter" },
    { icon: "💼", href: "https://linkedin.com/", name: "LinkedIn" },
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
        
        {/* Dynamic Columns Rendering */}
        {Object.keys(linksMap).map((colName) => (
          <div key={colName} style={styles.column}>
            <h4 style={styles.heading}>{colName}</h4>
            {linksMap[colName].map((item) => (
              item.active ? (
                // 🚀 जो लिंक्स रेज़रपे के लिए चाहिए, वो असली 'Link' टैग हैं
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
                // बाकि के लिए Alert आएगा
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
        ))}

        {/* Social Icons */}
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