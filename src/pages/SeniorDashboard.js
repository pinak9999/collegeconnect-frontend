import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

/* -------------------------------------------
   🎨 Design Tokens (single place to tweak UI)
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
  glass: "rgba(255,255,255,0.88)",
};

const softShadow = "0 10px 30px rgba(0,0,0,0.10)";

/* -------------------------------------------
   🧱 Reusable UI Pieces
------------------------------------------- */

// Shimmer skeleton card (for loading state)
const SkeletonCard = () => (
  <div
    style={{
      borderRadius: 20,
      padding: 18,
      background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.9))",
      position: "relative",
      overflow: "hidden",
      boxShadow: softShadow,
      height: 150,
    }}
  >
    <div style={{ height: 16, width: "60%", background: "#e5e7eb", borderRadius: 8, marginBottom: 10 }} />
    <div style={{ height: 12, width: "40%", background: "#e5e7eb", borderRadius: 6, marginBottom: 8 }} />
    <div style={{ height: 12, width: "30%", background: "#e5e7eb", borderRadius: 6 }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent)",
        transform: "translateX(-100%)",
        animation: "shimmer 1.3s infinite",
      }}
    />
    {/* keyframes via style tag below in parent */}
  </div>
);

// Tiny status chip
const Chip = ({ label, tone = "neutral" }) => {
  const colors =
    tone === "ok"
      ? { bg: "rgba(16,185,129,.12)", fg: palette.ok }
      : tone === "warn"
      ? { bg: "rgba(245,158,11,.12)", fg: palette.warn }
      : tone === "danger"
      ? { bg: "rgba(239,68,68,.12)", fg: palette.danger }
      : { bg: "rgba(37,99,235,.10)", fg: palette.primary };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {label}
    </span>
  );
};

/* -------------------------------------------
   📦 Bookings Grid (cards with gradient ring)
------------------------------------------- */
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const btnBase = {
    padding: "10px 14px",
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
    background: `linear-gradient(45deg, ${palette.primary}, ${palette.primaryDark})`,
    boxShadow: "0 6px 14px rgba(37,99,235,.35)",
  };
  const btnOutline = {
    ...btnBase,
    color: palette.primary,
    background: "#fff",
    border: `1.5px solid ${palette.primary}`,
  };

  const renderActions = (b) => {
    if (b.dispute_status === "Pending") {
      return (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Chip label="Under Review" tone="warn" />
          <button
            style={btnOutline}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            onClick={() => onStartChat(b._id)}
          >
            Chat
          </button>
        </div>
      );
    }
    if (b.status === "Completed") {
      return (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Chip label="Completed" tone="ok" />
          <button
            style={btnOutline}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            onClick={() => onStartChat(b._id)}
          >
            Chat History
          </button>
        </div>
      );
    }
    if (b.status === "Confirmed") {
      return (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={btnPrimary}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            onClick={() => onStartChat(b._id)}
          >
            💬 Start Chat
          </button>
          <button
            style={btnOutline}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            onClick={() => onMarkComplete(b._id)}
          >
            ✔ Mark Done
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ animation: "fadeIn .45s ease" }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: 16,
          fontWeight: 800,
          fontSize: "1.2rem",
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.primaryDark})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h3>

      {/* Loading state */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 18,
            padding: "0 10px",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p style={{ textAlign: "center", color: "#94a3b8" }}>No bookings found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
            gap: 18,
            padding: "0 10px",
          }}
        >
          {bookings.map((b) => (
            <div
              key={b._id}
              style={{
                position: "relative",
                borderRadius: 20,
                padding: 18,
                background: palette.glass,
                backdropFilter: "blur(10px)",
                boxShadow: softShadow,
                overflow: "hidden",
                transition: "transform .25s, box-shadow .25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = softShadow;
              }}
            >
              {/* Gradient ring accent */}
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: 22,
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,.45), rgba(0,180,216,.35), rgba(16,185,129,.35))",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  pointerEvents: "none",
                }}
              />
              <h4 style={{ margin: 0, color: palette.text, fontWeight: 700 }}>
                👨‍🎓 {b.student?.name || "Student"}
              </h4>
              <p style={{ color: palette.subtext, margin: "6px 0" }}>
                📞 {b.student?.mobileNumber || "N/A"}
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={`Status: ${b.status}`} tone={b.status === "Completed" ? "ok" : "neutral"} />
                {b.dispute_status === "Pending" && (
                  <Chip
                    label={b.dispute_reason?.reason || "Under Review"}
                    tone="warn"
                  />
                )}
              </div>

              <div style={{ marginTop: 12 }}>{renderActions(b)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------
   🧠 Senior Dashboard (Hybrid Light Theme)
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

  useEffect(() => {
    if (auth?.user?.name) toast.success(`Welcome ${auth.user.name}! 👋`);
  }, [auth?.user]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = auth?.token || localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my",
        { headers: { "x-auth-token": token } }
      );
      setBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const markAsCompleted = async (id) => {
    if (!window.confirm("Mark this booking as completed?")) return;
    const t = toast.loading("Updating...");
    try {
      const token = auth?.token || localStorage.getItem("token");
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${id}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(t);
      toast.success("Marked as Completed!");
      fetchBookings();
    } catch (err) {
      toast.dismiss(t);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  const startChat = (id) => navigate(`/chat/${id}`);

  // Filters
  const tasks = bookings.filter((b) => b.status === "Confirmed" && b.dispute_status !== "Pending");
  const disputes = bookings.filter((b) => b.dispute_status === "Pending");
  const history = bookings.filter((b) => b.status === "Completed" || b.dispute_status === "Resolved");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: isMobile ? "16px" : "28px 48px",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        overflowX: "hidden",
        // layered soft gradient background
        background:
          "radial-gradient(1200px 600px at -10% -10%, #e0f2fe 0%, transparent 60%), radial-gradient(1000px 600px at 110% -20%, #ccfbf1 0%, transparent 55%), linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)",
      }}
    >
      {/* keyframes for shimmer */}
      <style>
        {`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          @keyframes fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:translateY(0)} }
        `}
      </style>

      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: 20,
          animation: "fadeIn .4s ease",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "1.6rem" : "2rem",
            fontWeight: 800,
            lineHeight: 1.1,
            background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          Welcome, {auth.user?.name || "Senior"} 👋
        </h1>
        <p style={{ color: palette.subtext, marginTop: 8 }}>
          Manage sessions, chat with students & track progress—seamlessly.
        </p>
      </header>

      {/* Floating Tabs (glass) */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 10,
          background: palette.glass,
          borderRadius: 28,
          padding: isMobile ? "10px 12px" : "12px 18px",
          width: isMobile ? "98%" : "85%",
          margin: "0 auto 24px",
          boxShadow: softShadow,
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 10,
          zIndex: 10,
        }}
      >
        {[
          { path: "/senior-dashboard", label: "🆕 New", count: tasks.length },
          { path: "/senior-dashboard/disputes", label: "⚠️ Disputes", count: disputes.length },
          { path: "/senior-dashboard/history", label: "✅ History", count: history.length },
        ].map((tab) => {
          const active =
            (tab.path === "/senior-dashboard" && location.pathname === "/senior-dashboard") ||
            (tab.path !== "/senior-dashboard" && location.pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: "none",
                padding: "10px 18px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                background: active
                  ? `linear-gradient(45deg, ${palette.primary}, ${palette.primaryDark})`
                  : "#f1f5f9",
                color: active ? "#fff" : palette.primary,
                boxShadow: active ? "0 6px 16px rgba(37,99,235,.35)" : "none",
                transition: "transform .2s, box-shadow .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {tab.label} ({tab.count})
            </Link>
          );
        })}
        <Link
          to="/senior-earnings"
          style={{
            textDecoration: "none",
            padding: "10px 16px",
            borderRadius: 999,
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(45deg, #22c55e, #16a34a)",
            boxShadow: "0 6px 16px rgba(22,163,74,.35)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          💰 Earnings
        </Link>
      </nav>

      {/* Routes -> three grids */}
      <Routes>
        <Route
          path="/"
          element={
            <BookingsTable
              title="New Bookings"
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
              title="Active Disputes"
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
              title="Completed History"
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
