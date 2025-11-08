import React, { useState } from "react";
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

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response
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
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  // ---------------- Inline Styles ----------------
  const styles = {
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #007BFF 0%, #00B4D8 50%, #48CAE4 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: "1rem",
      animation: "fadeIn 1s ease-in-out",
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      padding: "2.5rem",
      borderRadius: "1.5rem",
      boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
      transform: "translateY(0)",
      animation: "slideUp 0.9s ease",
      transition: "all 0.3s ease",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "0.3rem",
      color: "#1e3a8a",
      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
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
      display: "block",
      fontSize: "0.9rem",
      color: "#333",
      marginBottom: "0.4rem",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      border: "1.8px solid #ddd",
      borderRadius: "12px",
      fontSize: "0.95rem",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
    },
    inputFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 6px rgba(37, 99, 235, 0.3)",
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
      boxShadow: "0 6px 12px rgba(37, 99, 235, 0.3)",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      color: "#888",
      margin: "1.5rem 0",
    },
    dividerLine: {
      flex: 1,
      borderTop: "1px solid #ddd",
    },
    dividerText: {
      padding: "0 10px",
      fontSize: "0.9rem",
    },
    extraLinks: {
      marginTop: "1.2rem",
    },
    link: {
      color: "#2563eb",
      fontWeight: "500",
      textDecoration: "none",
    },
  };

  // To handle hover animations (React inline style trick)
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>
          Sign in to continue your journey with <b>CollegeConnect</b>
        </p>

        {/* Google Login */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled_black"
            size="large"
            width="320px"
          />
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        {/* Form */}
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
            style={{
              ...styles.button,
              ...(hover ? styles.buttonHover : {}),
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={styles.extraLinks}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot Password?
            </Link>
            <p style={{ marginTop: "0.7rem", color: "#555" }}>
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
