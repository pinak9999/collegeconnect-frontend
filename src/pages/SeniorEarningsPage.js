import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// 📊 StatsGrid Component
const StatsGrid = ({ stats, loading }) => {
  const statCards = [
    { title: "Pending Bookings", value: stats.totalPending, color: "#3B82F6" },
    { title: "Completed Calls", value: stats.totalCompleted, color: "#10B981" },
    { title: "Unpaid Earnings", value: `₹${stats.unpaidAmount}`, color: "#F59E0B" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "30px",
        padding: "0 10px",
      }}
    >
      {statCards.map((item, i) => (
        <div
          key={i}
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
          }}
        >
          <h4 style={{ color: "#374151", fontWeight: 600, marginBottom: "10px" }}>
            {item.title}
          </h4>
          <p
            style={{
              color: item.color,
              fontSize: "1.8rem",
              fontWeight: 700,
            }}
          >
            {loading ? "..." : item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

// 💰 SeniorEarningsPage Component
function SeniorEarningsPage() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalPending: 0,
    unpaidAmount: 0,
  });
  const [allBookings, setAllBookings] = useState([]);
  const [platformFee, setPlatformFee] = useState(20);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Responsive setup
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ Fetch Data
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = auth?.token;
        if (!token) {
          setLoading(false);
          setError("User not authenticated.");
          return;
        }

        const config = { headers: { "x-auth-token": token } };
        const [statsRes, bookingsRes, settingsRes] = await Promise.all([
          axios.get(
            "https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/stats",
            config
          ),
          axios.get(
            "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my",
            config
          ),
          axios.get(
            "https://collegeconnect-backend-mrkz.onrender.com/api/settings"
          ),
        ]);

        setStats(statsRes.data);
        setAllBookings(bookingsRes.data);
        setPlatformFee(settingsRes.data.platformFee);
        toast.success("Earnings data loaded successfully!");
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load earnings data.");
        toast.error("Failed to load earnings data.");
      }
      setLoading(false);
    };

    if (auth?.token) fetchEarnings();
  }, [auth?.token]);

  // ✅ Greet user on load
  useEffect(() => {
    if (auth?.user?.name) toast.success(`Welcome back, ${auth.user.name} 👋`);
  }, [auth?.user]);

  // 🚀 NEW LOGIC: Bookings ko 2 hisso mein baantna (Regular vs Promotional)
  const completedBookings = allBookings.filter((b) => b.status === "Completed");
  
  const regularBookings = completedBookings.filter(
    (b) => !b.isPromotional && b.paymentMethod !== "Coupon_Free"
  );
  
  const promoBookings = completedBookings.filter(
    (b) => b.isPromotional || b.paymentMethod === "Coupon_Free"
  );

  // --- Error UI ---
  if (error) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "linear-gradient(90deg, #2563EB, #1D4ED8)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            marginTop: "15px",
            cursor: "pointer",
          }}
        >
          🔄 Reload
        </button>
      </div>
    );
  }

  // --- Main UI ---
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #caf0f8 100%)",
        padding: isMobile ? "15px" : "30px 50px",
        fontFamily: "'Poppins', sans-serif",
        animation: "fadeIn 0.6s ease-in-out",
      }}
    >
      {/* 🔙 Back Button */}
      <Link
        to="/senior-dashboard"
        style={{
          display: "inline-block",
          background: "linear-gradient(90deg, #2563EB, #1D4ED8)",
          color: "white",
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(37,99,235,0.3)",
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* 🧾 Header */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2
          style={{
            background: "linear-gradient(90deg,#2563EB,#1E40AF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            fontSize: isMobile ? "1.5rem" : "1.9rem",
          }}
        >
          Earnings & Stats 💰
        </h2>
        <p style={{ color: "#334155", fontSize: "0.95rem" }}>
          Track your completed calls, pending bookings, and payout amount.
        </p>
      </div>

      {/* 📊 Stats */}
      <StatsGrid stats={stats} loading={loading} />

      <hr
        style={{
          margin: "40px 0",
          borderColor: "rgba(0,0,0,0.1)",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      {/* ========================================= */}
      {/* 🪙 SECTION 1: REGULAR EARNINGS HISTORY */}
      {/* ========================================= */}
      <div style={{ padding: "0 10px" }}>
        <h2
          style={{
            color: "#1E3A8A",
            textAlign: "center",
            marginBottom: "15px",
            fontSize: "1.5rem",
          }}
        >
          Completed Calls & Payouts (Regular)
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", color: "#6B7280" }}>Loading history...</p>
        ) : regularBookings.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "15px",
            }}
          >
            {regularBookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  background:
                    booking.payout_status === "Paid"
                      ? "linear-gradient(135deg, #ECFDF5, #D1FAE5)"
                      : "linear-gradient(135deg, #FFFFFF, #F9FAFB)",
                  borderRadius: "14px",
                  padding: "15px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.08)";
                }}
              >
                <h4 style={{ marginBottom: "6px", color: "#111827", fontWeight: 600 }}>
                  👨‍🎓 {booking.student ? booking.student.name : "Unknown Student"}
                </h4>
                <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "4px" }}>
                  📅 {new Date(booking.date).toLocaleDateString()}
                </p>
                <p
                  style={{
                    color: booking.payout_status === "Paid" ? "#10B981" : "#6B7280",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  💸 {booking.payout_status}
                </p>
                <p style={{ color: "#059669", fontWeight: 700, fontSize: "15px" }}>
                  Earnings: ₹{booking.amount_paid - platformFee}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6B7280" }}>
            You have no regular completed bookings yet.
          </p>
        )}
      </div>

      {/* ========================================= */}
      {/* 🎁 SECTION 2: PROMOTIONAL / FREE SESSIONS */}
      {/* ========================================= */}
      <div style={{ padding: "0 10px", marginTop: "50px" }}>
        <h2
          style={{
            color: "#065F46",
            textAlign: "center",
            marginBottom: "5px",
            fontSize: "1.5rem",
          }}
        >
          🎁 My Promotional Sessions
        </h2>
        <p style={{ textAlign: "center", color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>
          Sessions booked via Free Coupons. (Payout sponsored by Admin)
        </p>

        {loading ? null : promoBookings.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "15px",
            }}
          >
         {/* 🎁 SECTION 2: PROMOTIONAL / FREE SESSIONS (UI Update) */}
{promoBookings.map((booking) => (
  <div
    key={booking._id}
    style={{
      background: "#ECFDF5",
      borderRadius: "14px",
      padding: "15px",
      boxShadow: "0 5px 15px rgba(16, 185, 129, 0.15)",
      border: "2px dashed #10B981",
      position: "relative",
    }}
  >
    <span style={{ position: "absolute", top: "-12px", right: "15px", background: "#10B981", color: "white", fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "50px" }}>
      PROMOTIONAL
    </span>

    <h4 style={{ marginBottom: "6px", color: "#064E3B", fontWeight: 600 }}>
      👨‍🎓 {booking.student ? booking.student.name : "Unknown Student"}
    </h4>
    <p style={{ color: "#047857", fontSize: "13px" }}>📅 {new Date(booking.date).toLocaleDateString()}</p>
    
    <p style={{
      color: "#059669",
      fontWeight: "700",
      marginTop: "10px",
      fontSize: "0.9rem"
    }}>
      {/* 💸 Yahan ab zero ya fixed amount nahi, sirf status dikhega */}
      Earning: <span style={{ color: "#1e40af" }}>Admin Settlement</span>
    </p>
    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
      (This session will be paid separately by Admin)
    </p>
  </div>
))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6B7280" }}>
            No promotional sessions yet.
          </p>
        )}
      </div>
      
    </div>
  );
}

export default SeniorEarningsPage;