import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

// ('API' (एपीआई) (API (एपीआई)) 'URL' (यूआरएल) (URL (यूआरएल)))
const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ('ईमेल' (Email) (ईमेल) 'और' (and) 'पासवर्ड' (Password) (पासवर्ड) '`Submit`' (सबमिट) (Submit (जमा)) '`Handler`' (हैंडलर) (Handler (हैंडलर)))
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Login Successful!");
      // ('स्मार्ट' (Smart) 'रीडायरेक्ट' (Redirect) (वही है))
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  // ('Google' (गूगल) (Google (गूगल)) '`Login`' (लॉगिन) (Login (लॉगिन)) '`Success`' (सक्सेस) (Success (सफलता)) '`Handler`' (हैंडलर) (Handler (हैंडलर)))
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, { 
        token: credentialResponse.credential 
      });
      login(res.data.token, res.data.user);
      toast.dismiss(toastId);
      toast.success("🎉 Google Login Successful!");
      // ('स्मार्ट' (Smart) 'रीडायरेक्ट' (Redirect) (वही है))
      const userRole = res.data.user.role;
      const isSenior = res.data.user.isSenior;
      if (userRole === "Admin") navigate("/admin-dashboard");
      else if (isSenior === true) navigate("/senior-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("❌ " + errorMsg);
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    // ('`style`' (स्टाइल) (style) 'की' (of) 'जगह' (place) '`className`' (क्लासनेम) (className) 'का' (of) 'इस्तेमाल' (Use) 'करें' (do))
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">
          Sign in to continue your journey with <b>CollegeConnect</b>
        </p>

        {/* 'Google' (गूगल) (Google (गूगल)) 'Login' (लॉगिन) (लॉगिन) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled_black"
            width="320px"
          />
        </div>

        {/* 'Divider' (डिवाइडर) (Divider (विभाजक)) */}
        <div className="login-divider">
          <hr className="login-divider-line" />
          <span className="login-divider-text">OR</span>
          <hr className="login-divider-line" />
        </div>

        {/* 'Form' (फॉर्म) (फॉर्म) */}
        <form onSubmit={onSubmitHandler}>
          <div className="login-form-group">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChangeHandler}
              required
              className="login-input" // ('CSS' (सीएसएस) (CSS (सीएसएस)) 'क्लास' (class) (कक्षा))
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              className="login-input" // ('CSS' (सीएसएस) (CSS (सीएसएस)) 'क्लास' (class) (कक्षा))
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button" // ('CSS' (सीएसएस) (CSS (सीएसएस)) 'क्लास' (class) (कक्षा))
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="login-extra-links">
            <Link to="/forgot-password" className="login-link link-forgot">
              Forgot Password?
            </Link>
            <Link to="/register" className="login-link link-register">
                Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;