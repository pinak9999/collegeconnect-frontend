import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(null);
  const [cardHover, setCardHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Handle responsiveness safely
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/login",
        formData
      );
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Login Successful!");
      const { role, isSenior } = res.data.user;
      if (role === "Admin") navigate("/admin-dashboard");
      else if (isSenior) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/auth/google",
        { token: credentialResponse.credential }
      );
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Google Login Successful!");
      const { role, isSenior } = res.data.user;
      if (role === "Admin") navigate("/admin-dashboard");
      else if (isSenior) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      const errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () =>
    toast.error("Google login failed. Please try again.");

  // ✅ Inline styles (Vercel safe)
  const styles = {
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #48cae4 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1rem" : "2rem",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255,255,255,0.95)",
      padding: isMobile ? "1.5rem" : "2.5rem",
      borderRadius: "1.5rem",
      width: isMobile ? "90%" : "400px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: "translateY(0px)",
    },
    cardHover: {
      transform: "translateY(-6px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
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
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "1.5rem 0",
      color: "#777",
    },
    dividerLine: {
      flex: 1,
      borderTop: "1px solid #ccc",
    },
    dividerText: {
      padding: "0 10px",
      fontSize: "0.9rem",
    },
    extraLinks: {
      marginTop: "1.2rem",
      fontSize: "0.9rem",
      color: "#555",
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
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>
          Sign in to continue your journey with <b>CollegeConnect</b>
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled_black"
            size="large"
          />
        </div>

        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        <form onSubmit={onSubmitHandler}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot Password?
            </Link>
            <p style={{ marginTop: "0.7rem" }}>
              Don’t have an account?{" "}
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
