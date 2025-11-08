import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const navigate = useNavigate();

  const API_URL = "https://collegeconnect-backend-mrkz.onrender.com/api/auth";

  // ✅ Responsive Setup
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      toast.dismiss(toastId);
      toast.success(res.data.msg || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = "Reset link expired or invalid.";
      if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      }
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  // 🎨 Inline Styles
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #023e8a 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1rem" : "2rem",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255,255,255,0.95)",
      padding: isMobile ? "1.5rem" : "2.5rem",
      borderRadius: "1.5rem",
      width: isMobile ? "90%" : "400px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "translateY(-6px)",
      boxShadow: "0 25px 45px rgba(0,0,0,0.25)",
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2rem",
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "1.2rem",
    },
    subtitle: {
      fontSize: "0.95rem",
      color: "#555",
      marginBottom: "1.5rem",
    },
    formGroup: {
      textAlign: "left",
      marginBottom: "1.2rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#333",
      marginBottom: "0.4rem",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      border: "1.8px solid #ddd",
      borderRadius: "12px",
      fontSize: "0.95rem",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 8px rgba(37,99,235,0.4)",
    },
    button: {
      width: "100%",
      padding: "0.9rem",
      background: "linear-gradient(45deg, #2563eb, #1e40af)",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "0.8rem",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(37,99,235,0.4)",
    },
  };

  return (
    <div style={styles.page}>
      <div
        style={{ ...styles.card, ...(cardHover ? styles.cardHover : {}) }}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <h2 style={styles.title}>Reset Your Password 🔒</h2>
        <p style={styles.subtitle}>
          Please enter your new password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                ...styles.input,
                ...(focusInput ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusInput(true)}
              onBlur={() => setFocusInput(false)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
