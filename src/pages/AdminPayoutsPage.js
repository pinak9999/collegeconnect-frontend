import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🎟️ Coupon Management State
  const [couponSettings, setCouponSettings] = useState({
    limit: 15,
    isActive: true,
    used: 0 // Ye backend se aayega
  });
  const [isUpdatingCoupon, setIsUpdatingCoupon] = useState(false);

  // 🔹 Fetch Payout Data & Coupon Stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetching Payouts
      const payoutsRes = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payouts/admin",
        { headers: { "x-auth-token": token } }
      );
      setPayouts(payoutsRes.data);

      // 🚀 Fetching Coupon Settings (Yeh API hum backend me banayenge)
      try {
        const couponRes = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/coupon-stats",
          { headers: { "x-auth-token": token } }
        );
        setCouponSettings({
          limit: couponRes.data.limit || 15,
          isActive: couponRes.data.isActive !== undefined ? couponRes.data.isActive : true,
          used: couponRes.data.totalUsed || 0
        });
      } catch (couponErr) {
        console.warn("Coupon API not ready yet, using defaults.");
      }

      setLoading(false);
    } catch (err) {
      setError("Error: " + (err.response ? err.response.data.msg : err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData(); // Refresh list
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  // 🎟️ Update Coupon Settings Handler
  const handleCouponUpdate = async () => {
    setIsUpdatingCoupon(true);
    const toastId = toast.loading("Updating Coupon Settings...");
    try {
      const token = localStorage.getItem("token");
      // Yeh API route hum backend ke SiteSettings me add karenge
      await axios.put(
        "https://collegeconnect-backend-mrkz.onrender.com/api/settings/update-coupon",
        { limit: couponSettings.limit, isActive: couponSettings.isActive },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Coupon Settings Updated!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to update coupon settings.");
    }
    setIsUpdatingCoupon(false);
  };

  // 🔹 Loading & Error UI
  if (loading)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "#2563eb" }}>⚡ Loading Dashboard...</h2>
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
        <h2 style={heading}>💰 Admin Finance Dashboard</h2>
        <p style={subText}>Manage Free Coupons and Senior Payouts from one place.</p>
      </div>

      {/* ======================================= */}
      {/* 🎟️ SECTION 1: COUPON MANAGEMENT CARD    */}
      {/* ======================================= */}
      <div style={couponCard}>
        <h3 style={{ margin: "0 0 15px 0", color: "#1e40af", display: "flex", alignItems: "center", gap: "8px" }}>
          🎟️ FREE15 Coupon Control
        </h3>
        
        <div style={couponControlsWrapper}>
          {/* Status Toggle */}
          <div style={inputGroup}>
            <label style={couponLabel}>Coupon Status</label>
            <button 
              onClick={() => setCouponSettings({...couponSettings, isActive: !couponSettings.isActive})}
              style={couponSettings.isActive ? activeBtn : inactiveBtn}
            >
              {couponSettings.isActive ? "✅ ACTIVE (Running)" : "❌ INACTIVE (Stopped)"}
            </button>
          </div>

          {/* Limit Input */}
          <div style={inputGroup}>
            <label style={couponLabel}>Maximum Slots (Limit)</label>
            <input 
              type="number" 
              value={couponSettings.limit}
              onChange={(e) => setCouponSettings({...couponSettings, limit: parseInt(e.target.value) || 0})}
              style={couponInput}
              min="0"
            />
          </div>

          {/* Usage Stats */}
          <div style={inputGroup}>
            <label style={couponLabel}>Current Usage</label>
            <div style={usageBox}>
              <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "#16a34a" }}>{couponSettings.used}</span>
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}> / {couponSettings.limit} Used</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCouponUpdate} 
          disabled={isUpdatingCoupon}
          style={saveCouponBtn}
        >
          {isUpdatingCoupon ? "Saving..." : "💾 Save Coupon Settings"}
        </button>
      </div>

      {/* ======================================= */}
      {/* 💰 SECTION 2: SENIOR PAYOUTS            */}
      {/* ======================================= */}
      <h3 style={{ color: "#1f2937", marginTop: "40px", marginBottom: "20px", paddingLeft: "10px", borderLeft: "5px solid #2563eb" }}>
        Pending Payouts
      </h3>

      {payouts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555", marginTop: "30px", background: "white", padding: "30px", borderRadius: "15px" }}>
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

              {/* 🚀 Updated Info Rows to show Promo vs Regular */}
              <div style={infoRow}>
                <span style={label}>Regular Bookings:</span>
                <span style={value}>{p.regularBookings || p.totalBookings}</span>
              </div>
              
              <div style={infoRow}>
                <span style={label}>🎁 Free (Promo) Bookings:</span>
                <span style={{...value, color: "#16a34a"}}>{p.promoBookings || 0}</span>
              </div>

              <div style={infoRow}>
                <span style={label}>Total Platform Fee:</span>
                <span style={{ ...value, color: "#ef4444" }}>
                  ₹{p.totalPlatformFee}
                </span>
              </div>

              <hr style={{ border: "0.5px dashed #ccc", margin: "10px 0" }} />

              <div style={infoRow}>
                <span style={label}>Final Payout (To Senior):</span>
                <span style={{ ...value, color: "#2563eb", fontSize: "1.1rem" }}>
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

/* 🎟️ Coupon UI Styles */
const couponCard = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  border: "1px solid #e5e7eb",
  maxWidth: "800px",
  margin: "0 auto",
};

const couponControlsWrapper = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const inputGroup = {
  flex: "1 1 200px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const couponLabel = {
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#4b5563",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const activeBtn = {
  padding: "10px", borderRadius: "10px", border: "2px solid #16a34a", background: "#dcfce7", color: "#16a34a", fontWeight: "700", cursor: "pointer", transition: "0.2s"
};
const inactiveBtn = {
  padding: "10px", borderRadius: "10px", border: "2px solid #ef4444", background: "#fee2e2", color: "#ef4444", fontWeight: "700", cursor: "pointer", transition: "0.2s"
};

const couponInput = {
  padding: "10px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "1rem", fontWeight: "600", fontFamily: "inherit"
};

const usageBox = {
  padding: "10px", borderRadius: "10px", background: "#f3f4f6", border: "1px dashed #9ca3af", display: "flex", alignItems: "center", gap: "5px"
};

const saveCouponBtn = {
  width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#1f2937", color: "white", fontWeight: "600", fontSize: "1rem", cursor: "pointer", transition: "0.3s"
};

/* 💰 Payout Cards Styles */
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  border: "1px solid #f3f4f6",
  padding: "20px",
  transition: "all 0.3s ease",
  textAlign: "center",
};

const seniorName = {
  color: "#1e40af",
  fontWeight: "700",
  fontSize: "1.2rem",
  marginBottom: "15px",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
};

const label = {
  fontWeight: "500",
  color: "#4b5563",
  fontSize: "0.9rem",
};

const value = {
  fontWeight: "700",
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
  padding: "12px 0",
  fontSize: "1rem",
  fontWeight: "700",
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