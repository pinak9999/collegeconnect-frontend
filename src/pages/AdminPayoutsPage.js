import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch Payout Data
  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payouts/admin",
        { headers: { "x-auth-token": token } }
      );
      setPayouts(res.data);
      setLoading(false);
    } catch (err) {
      setError("Error: " + (err.response ? err.response.data.msg : err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // 🔹 Mark as Paid Handler
  const markAsPaidHandler = async (seniorId) => {
    if (
      !window.confirm(
        "Are you sure you have paid this senior? This action cannot be undone."
      )
    )
      return;
    const toastId = toast.loading("Updating status...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/payouts/mark-paid/${seniorId}`,
        null,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success(res.data.msg);
      fetchPayouts();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  // 🔹 Loading & Error UI
  if (loading)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "#2563eb" }}>⚡ Loading Payouts...</h2>
      </div>
    );

  if (error)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );

  return (
    <div style={mainContainer}>
      <div style={headerBox}>
        <h2 style={heading}>💰 Admin Payouts Dashboard</h2>
        <p style={subText}>
          Track and manage all <b>completed & unpaid</b> sessions easily.
        </p>
      </div>

      {payouts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555", marginTop: "30px" }}>
          ✅ All payouts are cleared. Great job!
        </p>
      ) : (
        <div style={cardGrid}>
          {payouts.map((p, i) => (
            <div
              key={p.seniorId}
              style={{
                ...cardStyle,
                animation: `fadeSlideIn 0.6s ease ${i * 0.08}s forwards`,
              }}
            >
              <h3 style={seniorName}>👨‍🏫 {p.seniorName}</h3>

              <div style={infoRow}>
                <span style={label}>Completed Bookings:</span>
                <span style={value}>{p.totalBookings}</span>
              </div>

              <div style={infoRow}>
                <span style={label}>Platform Fee (Earned):</span>
                <span style={{ ...value, color: "#16a34a" }}>
                  ₹{p.totalPlatformFee}
                </span>
              </div>

              <div style={infoRow}>
                <span style={label}>Final Payout (To Senior):</span>
                <span style={{ ...value, color: "#2563eb" }}>
                  ₹{p.finalPayoutAmount}
                </span>
              </div>

              <button
                style={payButton}
                onClick={() => markAsPaidHandler(p.seniorId)}
              >
                ✅ Mark as Paid
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🌈 Inline Styles */

const mainContainer = {
  minHeight: "100vh",
  padding: "40px 20px 60px",
  background: "linear-gradient(135deg,#e0f7fa,#f9fafb)",
  fontFamily: "Poppins, sans-serif",
  color: "#111827",
};

const headerBox = {
  textAlign: "center",
  marginBottom: "25px",
};

const heading = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#1e40af",
  background: "linear-gradient(90deg,#2563eb,#3b82f6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
};

const subText = {
  color: "#555",
  fontSize: "0.95rem",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "20px",
  transition: "all 0.3s ease",
  textAlign: "center",
};

const seniorName = {
  color: "#2563eb",
  fontWeight: "600",
  marginBottom: "10px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
};

const label = {
  fontWeight: "500",
  color: "#444",
  fontSize: "0.9rem",
};

const value = {
  fontWeight: "600",
  color: "#111827",
  fontSize: "0.95rem",
};

const payButton = {
  marginTop: "15px",
  width: "100%",
  background: "linear-gradient(45deg,#22c55e,#16a34a)",
  border: "none",
  color: "#fff",
  borderRadius: "10px",
  padding: "10px 0",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 6px 15px rgba(34,197,94,0.3)",
  transition: "all 0.3s ease",
};

const centerBox = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
  flexDirection: "column",
};

/* ✨ Animations */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

export default AdminPayoutsPage;
