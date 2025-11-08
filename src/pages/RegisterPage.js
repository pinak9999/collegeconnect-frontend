import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(null);
  const [cardHover, setCardHover] = useState(false);

  // ✅ Responsive handling
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Registering...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/register",
        formData
      );
      toast.dismiss(toastId);
      toast.success(res.data.msg || "Registration Successful 🎉");
      navigate("/login");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  // 🎨 Inline Styles
  const styles = {
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #00b4d8 0%, #007bff 50%, #023e8a 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1rem" : "2rem",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      padding: isMobile ? "1.5rem" : "2.5rem",
      borderRadius: "1.5rem",
      width: isMobile ? "90%" : "400px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "translateY(-6px)",
      boxShadow: "0 25px 45px rgba(0,0,0,0.25)",
    },
    title: {
      fontSize: isMobile ? "1.6rem" : "1.9rem",
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: "#555",
      fontSize: isMobile ? "0.9rem" : "1rem",
      marginBottom: "1.8rem",
    },
    formGroup: {
      textAlign: "left",
      marginBottom: "1.2rem",
    },
    label: {
      fontSize: "0.9rem",
      color: "#333",
      fontWeight: "500",
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
      marginTop: "0.5rem",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(37,99,235,0.4)",
    },
    footer: {
      marginTop: "1rem",
      color: "#555",
      fontSize: "0.9rem",
    },
    link: {
      color: "#2563eb",
      fontWeight: "500",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div
        style={{ ...styles.card, ...(cardHover ? styles.cardHover : {}) }}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <h2 style={styles.title}>Create Your Account 🚀</h2>
        <p style={styles.subtitle}>Join CollegeConnect in just a few seconds</p>

        <form onSubmit={onSubmitHandler}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={onChangeHandler}
              required
              style={{
                ...styles.input,
                ...(focusInput === "name" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusInput("name")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChangeHandler}
              required
              style={{
                ...styles.input,
                ...(focusInput === "email" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusInput("email")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              style={{
                ...styles.input,
                ...(focusInput === "password" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusInput("password")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>10-Digit Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="9876543210"
              value={formData.mobileNumber}
              onChange={onChangeHandler}
              required
              minLength="10"
              maxLength="10"
              style={{
                ...styles.input,
                ...(focusInput === "mobileNumber" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusInput("mobileNumber")}
              onBlur={() => setFocusInput(null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
