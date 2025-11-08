import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending reset link...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/forgot-password",
        { email }
      );
      toast.dismiss(toastId);
      toast.success(res.data.msg || "Password reset link sent!");
    } catch (err) {
      toast.dismiss(toastId);
      let msg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("Error: " + msg);
    }
    setLoading(false);
  };

  // 🎨 Modern Unique Inline Styles
  const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#f0f4ff,#fefefe)",
      overflow: "hidden",
      fontFamily: "'Poppins', sans-serif",
    },
    floatingShapes: {
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      top: 0,
      left: 0,
      zIndex: 0,
    },
    shape: (size, color, top, left, delay) => ({
      position: "absolute",
      width: size,
      height: size,
      background: color,
      borderRadius: "50%",
      top,
      left,
      opacity: 0.2,
      animation: `floatShape 6s ease-in-out infinite`,
      animationDelay: delay,
    }),
    formCard: {
      position: "relative",
      zIndex: 1,
      width: isMobile ? "90%" : "400px",
      padding: isMobile ? "1.8rem" : "2.5rem",
      background: "rgba(255,255,255,0.95)",
      borderRadius: "25px",
      boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
      textAlign: "center",
      transform: hover ? "scale(1.02)" : "scale(1)",
      transition: "all 0.4s ease",
    },
    icon: {
      fontSize: "3rem",
      color: "#2563eb",
      background: "linear-gradient(45deg,#3b82f6,#1e3a8a)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "pulseIcon 2s infinite ease-in-out",
      marginBottom: "1rem",
    },
    title: {
      fontWeight: 700,
      fontSize: isMobile ? "1.7rem" : "2.1rem",
      color: "#1e40af",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "0.95rem",
      marginBottom: "2rem",
      lineHeight: "1.6",
    },
    input: {
      width: "100%",
      padding: "0.9rem 1rem",
      fontSize: "1rem",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.3s ease",
      boxShadow: focus ? "0 0 8px rgba(59,130,246,0.4)" : "none",
      borderColor: focus ? "#2563eb" : "#e5e7eb",
    },
    button: {
      width: "100%",
      marginTop: "1.5rem",
      padding: "0.9rem",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      color: "#fff",
      background: "linear-gradient(90deg,#2563eb,#1e40af)",
      boxShadow: hover ? "0 8px 20px rgba(37,99,235,0.3)" : "0 4px 10px rgba(0,0,0,0.1)",
      transform: hover ? "translateY(-3px)" : "translateY(0)",
      transition: "all 0.3s ease",
    },
  };

  // 💫 Keyframe Animations (Injected dynamically)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes floatShape {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes pulseIcon {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      {/* Floating background shapes */}
      <div style={styles.floatingShapes}>
        <div style={styles.shape("180px", "#60a5fa", "10%", "5%", "0s")} />
        <div style={styles.shape("250px", "#93c5fd", "70%", "60%", "1s")} />
        <div style={styles.shape("120px", "#bfdbfe", "30%", "80%", "2s")} />
        <div style={styles.shape("200px", "#3b82f6", "60%", "10%", "3s")} />
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={styles.formCard}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={styles.icon}>📧</div>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          We’ll send a reset link to your registered email address.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />

        <button type="submit" style={styles.button}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
