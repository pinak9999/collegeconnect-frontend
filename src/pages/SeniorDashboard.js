import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

/* -------------------------------------------
   🎨 Design Tokens & Styles
------------------------------------------- */
const palette = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  accent: "#00B4D8",
  ok: "#10B981",
  warn: "#F59E0B",
  danger: "#EF4444",
  text: "#0F172A",
  subtext: "#475569",
  glass: "rgba(255,255,255,0.85)",
};

const softShadow = "0 10px 30px rgba(0,0,0,0.08)";

/* -------------------------------------------
   📦 Reusable Components
------------------------------------------- */

const SkeletonCard = () => (
  <div
    style={{
      borderRadius: 20,
      padding: 24,
      background: "linear-gradient(180deg, rgba(255,255,255,.6), rgba(255,255,255,.9))",
      position: "relative",
      overflow: "hidden",
      boxShadow: softShadow,
      height: 180,
    }}
  >
    <div style={{ height: 20, width: "60%", background: "#e5e7eb", borderRadius: 8, marginBottom: 12 }} />
    <div style={{ height: 16, width: "40%", background: "#e5e7eb", borderRadius: 6, marginBottom: 16 }} />
    <div style={{ height: 16, width: "30%", background: "#e5e7eb", borderRadius: 6 }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent)",
        transform: "translateX(-100%)",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
  </div>
);

const Chip = ({ label, tone = "neutral" }) => {
  const colors =
    tone === "ok"
      ? { bg: "rgba(16,185,129,.15)", fg: palette.ok }
      : tone === "warn"
      ? { bg: "rgba(245,158,11,.15)", fg: palette.warn }
      : tone === "danger"
      ? { bg: "rgba(239,68,68,.15)", fg: palette.danger }
      : { bg: "rgba(37,99,235,.12)", fg: palette.primary };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: colors.bg,
        color: colors.fg,
        textTransform: "capitalize",
      }}
    >
      {label}
    </span>
  );
};

/* -------------------------------------------
   📦 Bookings Grid
------------------------------------------- */
const BookingsTable = ({
  title,
  bookings,
  loading,
  onMarkComplete,
  onStartChat,
}) => {
  const btnBase = {
    padding: "10px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
  };
  const btnPrimary = {
    ...btnBase,
    color: "#fff",
    background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
    boxShadow: "0 6px 14px rgba(37,99,235,.3)",
  };
  const btnOutline = {
    ...btnBase,
    color: palette.primary,
    background: "#fff",
    border: `2px solid ${palette.primary}`,
  };

  const renderActions = (b) => {
    // ⭐ LOGIC: Robust Case-Insensitive Logic
    const status = (b.status || "").toLowerCase();
    const disputeStatus = (b.dispute_status || "none").toLowerCase();

    if (disputeStatus === "pending") {
      return (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Chip label="Dispute Pending" tone="warn" />
          <button style={btnOutline} onClick={() => onStartChat(b._id)}>
            💬 Chat
          </button>
        </div>
      );
    }
    if (status === "completed") {
      return (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Chip label="Completed" tone="ok" />
          <button style={{...btnOutline, border: '1px solid #cbd5e1', color: '#64748b'}} onClick={() => onStartChat(b._id)}>
            History
          </button>
        </div>
      );
    }
    // Handle 'Confirmed' or 'confirmed'
    if (status === "confirmed") {
      return (
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button style={btnPrimary} onClick={() => onStartChat(b._id)}>
            💬 Chat
          </button>
          <button style={btnOutline} onClick={() => onMarkComplete(b._id)}>
            ✅ Mark Done
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ animation: "fadeIn .5s ease" }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: 24,
          fontWeight: 800,
          fontSize: "1.4rem",
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title} ({bookings.length})
      </h3>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 20,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: palette.subtext }}>
          <p style={{ fontSize: "1.1rem" }}>No bookings found in this category.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 20,
          }}
        >
          {bookings.map((b) => (
            <div
              key={b._id}
              style={{
                borderRadius: 20,
                padding: 24,
                background: palette.glass,
                backdropFilter: "blur(12px)",
                boxShadow: softShadow,
                border: "1px solid rgba(255,255,255,0.6)",
                transition: "transform .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", color: palette.text, fontWeight: 700 }}>
                    {b.student?.name || "Student Name"}
                  </h4>
                  <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: palette.subtext }}>
                   Student
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                   <p style={{ margin: 0, fontWeight: 700, color: palette.primary }}>
                     ₹{b.amount_paid}
                   </p>
                   <p style={{ margin: 0, fontSize: "0.8rem", color: palette.subtext }}>
                     {new Date(b.slot_time).toLocaleDateString()}
                   </p>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <p style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0", color: palette.subtext, fontSize: "0.95rem" }}>
                  📞 {b.student?.mobileNumber || "Hidden"}
                </p>
                <p style={{ display: "flex", alignItems: "center", gap: 6, margin: 0, color: palette.subtext, fontSize: "0.95rem" }}>
                  📧 {b.student?.email || "Hidden"}
                </p>
              </div>

              <div style={{ height: 1, background: "#e2e8f0", margin: "12px 0" }} />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                 <span style={{ fontSize: 13, color: palette.subtext, fontWeight: 600 }}>Status:</span>
                 <Chip
                   label={b.status}
                   tone={
                     b.status?.toLowerCase() === "completed" ? "ok" : 
                     b.status?.toLowerCase() === "confirmed" ? "neutral" : "warn"
                   } 
                 />
              </div>

              {renderActions(b)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------
   🧠 Senior Dashboard (Logic Fixes)
------------------------------------------- */
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Auth token missing");
        return;
      }
      // Fixed: Calls the correct backend route that populates student data
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my",
        { headers: { "x-auth-token": token } }
      );
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const markAsCompleted = async (id) => {
    if (!window.confirm("Are you sure you want to mark this session as completed?")) return;
    const t = toast.loading("Updating status...");
    try {
      const token = localStorage.getItem("token");
      // Fixed: Broken function URL structure
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${id}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(t);
      toast.success("Session Marked Completed! 🎉");
      fetchBookings();
    } catch (err) {
      toast.dismiss(t);
      toast.error("Failed to update booking.");
    }
  };

  const startChat = (id) => navigate(`/chat/${id}`);

  // ⭐ LOGIC: Robust Case-Insensitive Filtering
  const tasks = bookings.filter((b) => 
    (b.status || "").toLowerCase() === "confirmed" && 
    (b.dispute_status || "none").toLowerCase() !== "pending"
  );
  
  const disputes = bookings.filter((b) => 
    (b.dispute_status || "none").toLowerCase() === "pending"
  );
  
  const history = bookings.filter((b) => 
    (b.status || "").toLowerCase() === "completed" || 
    (b.dispute_status || "").toLowerCase() === "resolved"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: isMobile ? "20px 16px" : "40px 60px",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #F0F9FF 0%, #F1F5F9 100%)",
      }}
    >
      <style>{`
        @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: 30 }}>
        <h1
          style={{
            fontSize: isMobile ? "1.8rem" : "2.4rem",
            fontWeight: 800,
            color: palette.text,
            marginBottom: 8,
          }}
        >
          Senior Dashboard
        </h1>
        <p style={{ color: palette.subtext, fontSize: "1.1rem" }}>
          Welcome back, <span style={{ color: palette.primary, fontWeight: 700 }}>{auth.user?.name}</span>! 👋
        </p>
      </header>

      {/* Quick Stats / Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
          background: "rgba(255,255,255,0.7)",
          padding: 12,
          borderRadius: 24,
          backdropFilter: "blur(10px)",
          boxShadow: softShadow,
          maxWidth: 600,
          margin: "0 auto 40px",
          border: "1px solid rgba(255,255,255,0.8)"
        }}
      >
        {[
          { path: "/senior-dashboard", label: "🔥 New Tasks", count: tasks.length },
          { path: "/senior-dashboard/disputes", label: "⚠️ Disputes", count: disputes.length },
          { path: "/senior-dashboard/history", label: "📚 History", count: history.length },
        ].map((tab) => {
          const isActive =
            (tab.path === "/senior-dashboard" && location.pathname === "/senior-dashboard") ||
            (tab.path !== "/senior-dashboard" && location.pathname.startsWith(tab.path));

          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                transition: "all 0.2s",
                background: isActive ? palette.primary : "transparent",
                color: isActive ? "#fff" : palette.subtext,
                boxShadow: isActive ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
              }}
            >
              {tab.label} {tab.count > 0 && <span style={{ opacity: 0.8, fontSize: "0.9em", marginLeft: 4 }}>({tab.count})</span>}
            </Link>
          );
        })}
      </nav>

      {/* Content Area */}
      <Routes>
        <Route
          path="/"
          element={
            <BookingsTable
              title="Upcoming Sessions"
              bookings={tasks}
              loading={loading}
              onMarkComplete={markAsCompleted}
              onStartChat={startChat}
            />
          }
        />
        <Route
          path="/disputes"
          element={
            <BookingsTable
              title="Disputed Sessions"
              bookings={disputes}
              loading={loading}
              onMarkComplete={markAsCompleted}
              onStartChat={startChat}
            />
          }
        />
        <Route
          path="/history"
          element={
            <BookingsTable
              title="Past Sessions"
              bookings={history}
              loading={loading}
              onMarkComplete={markAsCompleted}
              onStartChat={startChat}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default SeniorDashboard;