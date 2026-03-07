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
    alert("🚀Need Help? We're here for you.📧 davepinak0@gmail.com 📞 +917665054856")
  };

  const linksMap = {
    "Get to Know Us": [
      { name: "About Us", href: "/about" }, 
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
      marginBottom: isMobile ? "-25px" : "0", 
      fontFamily: "'Poppins', sans-serif",
      /* 🔥 टॉप और बॉटम पैडिंग को बेहतर किया गया है */
      padding: isMobile ? "2.5rem 0 1.5rem 0" : "3rem 0 2rem 0",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      /* 🔥 FIX: मोबाइल में लेफ्ट-राइट 20px की पैडिंग दी गई है ताकि कंटेंट बीच में रहे */
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
      color: "#a1a1aa", // मॉडर्न हल्का ग्रे कलर
      textDecoration: "none",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "inline-block", // ट्रांसफॉर्म इफ़ेक्ट के लिए ज़रूरी
    },
    linkHover: {
      color: "#38bdf8", // प्रीमियम स्काई ब्लू
      transform: "translateX(6px)", // 🔥 PRO: होवर करने पर हल्का सा आगे खिसकेगा
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
      background: "rgba(255,255,255,0.05)", // ट्रांसपेरेंट बैकग्राउंड
      border: "1px solid rgba(255,255,255,0.1)", // हल्का बॉर्डर
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
      gridColumn: "1 / -1", // पूरे ग्रिड में फैलेगा
      
    },
    brandName: { 
      /* 🔥 ब्रांड नेम को प्रीमियम ग्रेडिएंट लुक दिया है */
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
        
        {/* Column 1 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Get to Know Us</h4>
          {linksMap["Get to Know Us"].map((item) => (
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
          ))}
        </div>

        {/* Column 3 */}
        <div style={styles.column}>
          <h4 style={styles.heading}>For Students</h4>
          {linksMap["For Students"].map((item) => (
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
                onClick={handleComingSoon}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.socialIcon,
                  background:
                    hovered === link.name
                      ? "linear-gradient(135deg, #00E0FF, #38BDF8)"
                      : "rgba(255,255,255,0.05)",
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