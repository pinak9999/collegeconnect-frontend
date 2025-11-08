import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BookingSuccessPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [hover, setHover] = useState(false);

  // ✅ Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎨 Inline styles
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #00b4d8 0%, #007bff 50%, #023e8a 100%)",
      padding: isMobile ? "1rem" : "3rem",
      fontFamily: "'Poppins', sans-serif",
      color: "#333",
      textAlign: "center",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "1.5rem",
      padding: isMobile ? "2rem 1rem" : "3rem 2.5rem",
      width: isMobile ? "90%" : "500px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      animation: "fadeIn 1s ease",
      transition: "all 0.3s ease",
    },
    heading: {
      color: "green",
      fontSize: isMobile ? "2rem" : "2.5rem",
      fontWeight: "700",
      marginBottom: "1rem",
    },
    message: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "0.5rem",
    },
    note: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: "#555",
      marginTop: "0.5rem",
    },
    button: {
      display: "inline-block",
      marginTop: "1.8rem",
      padding: "0.9rem 1.8rem",
      background: "linear-gradient(45deg, #2563eb, #1e40af)",
      color: "white",
      fontWeight: "600",
      border: "none",
      borderRadius: "10px",
      fontSize: isMobile ? "0.95rem" : "1rem",
      textDecoration: "none",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(37,99,235,0.3)",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Booking Confirmed! ✅</h2>
        <p style={styles.message}>
          The Senior will contact you within <b>6 hours.</b>
        </p>
        <p style={styles.note}>
          (कृपया अपनी <b>My Bookings</b> सेक्शन (जो <b>Student Dashboard</b> पर है) को समय-समय पर चेक करते रहें)
        </p>

        <Link
          to="/student-dashboard"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default BookingSuccessPage;
