import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch Current Platform Fee
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/settings"
        );
        setPlatformFee(res.data.platformFee);
        setLoading(false);
      } catch (err) {
        toast.error("⚠️ Failed to load settings.");
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 💾 Save Settings
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving settings...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://collegeconnect-backend-mrkz.onrender.com/api/settings",
        { platformFee: Number(platformFee) },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("✅ Platform Fee Updated Successfully!");
    } catch (err) {
      toast.dismiss(toastId);
      let msg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("❌ Error: " + msg);
    }
  };

  if (loading)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "#2563eb" }}>⚙️ Loading Settings...</h2>
      </div>
    );

  return (
    <div style={mainContainer}>
      <div style={settingsCard}>
        <h2 style={heading}>⚙️ Admin Site Settings</h2>
        <p style={subText}>
          Manage key configurations of your platform. <br />
          <b>Platform Fee</b> is added on top of every senior’s booking fee.
        </p>

        <form onSubmit={onSubmitHandler} style={formStyle}>
          <div style={inputGroup}>
            <label htmlFor="platformFee" style={labelStyle}>
              Platform Fee (₹)
            </label>
            <input
              type="number"
              id="platformFee"
              name="platformFee"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              required
              style={inputStyle}
            />
            <p style={noteText}>
              💡 Example: If senior fee = ₹200 and platform fee = ₹20, total
              booking = ₹220.
            </p>
          </div>

          <button type="submit" style={saveBtn}>
            💾 Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

/* === 🎨 Inline Styles === */

const mainContainer = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#e0f7fa,#f9fafb)",
  fontFamily: "Poppins, sans-serif",
  padding: "40px 20px",
};

const settingsCard = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "30px",
  width: "100%",
  maxWidth: "500px",
  textAlign: "center",
  animation: "fadeIn 0.6s ease",
};

const heading = {
  fontSize: "1.8rem",
  fontWeight: "700",
  background: "linear-gradient(90deg,#2563eb,#3b82f6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
};

const subText = {
  color: "#555",
  fontSize: "0.9rem",
  marginBottom: "20px",
  lineHeight: "1.4",
};

const formStyle = {
  textAlign: "left",
};

const inputGroup = {
  marginBottom: "25px",
};

const labelStyle = {
  display: "block",
  fontWeight: "600",
  color: "#1e3a8a",
  marginBottom: "8px",
  fontSize: "0.95rem",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  outline: "none",
  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  transition: "0.3s",
};

const noteText = {
  fontSize: "0.85rem",
  color: "#666",
  marginTop: "5px",
};

const saveBtn = {
  width: "100%",
  padding: "12px 18px",
  background: "linear-gradient(45deg,#2563eb,#1e40af)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(37,99,235,0.3)",
  transition: "0.3s ease",
};

const centerBox = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
  flexDirection: "column",
  fontFamily: "Poppins, sans-serif",
};

/* ✨ Animations */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

export default AdminSettingsPage;
