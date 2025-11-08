import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// 📦 Bookings Card Component
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const renderActions = (booking) => {
    const base = {
      padding: "8px 14px",
      borderRadius: "10px",
      fontSize: "14px",
      border: "none",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    };
    const primary = { ...base, background: "linear-gradient(45deg,#3b82f6,#2563eb)", color: "#fff" };
    const outline = { ...base, background: "#fff", color: "#2563eb", border: "1px solid #2563eb" };

    if (booking.dispute_status === "Pending")
      return (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ Under Review</span>
          <button style={outline} onClick={() => onStartChat(booking._id)}>
            Chat
          </button>
        </div>
      );

    if (booking.status === "Completed")
      return (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <span style={{ color: "#10b981", fontWeight: 600 }}>✅ Done</span>
          <button style={outline} onClick={() => onStartChat(booking._id)}>
            Chat History
          </button>
        </div>
      );

    if (booking.status === "Confirmed")
      return (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
          <button style={primary} onClick={() => onStartChat(booking._id)}>
            💬 Start Chat
          </button>
          <button style={outline} onClick={() => onMarkComplete(booking._id)}>
            ✔ Mark Done
          </button>
        </div>
      );

    return null;
  };

  if (loading)
    return <p style={{ textAlign: "center", color: "#64748b" }}>⏳ Loading bookings...</p>;

  if (!bookings.length)
    return <p style={{ textAlign: "center", color: "#9ca3af" }}>No bookings found.</p>;

  return (
    <div style={{ animation: "fadeIn .5s ease" }}>
      <h3
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "18px",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
          gap: "20px",
          padding: "0 10px",
        }}
      >
        {bookings.map((b) => (
          <div
            key={b._id}
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 18,
              padding: "18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              transition: "all .3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
            }}
          >
            <h4 style={{ margin: 0, color: "#111827", fontWeight: 600 }}>
              👨‍🎓 {b.student?.name || "Student"}
            </h4>
            <p style={{ color: "#6b7280", margin: "4px 0" }}>📞 {b.student?.mobileNumber || "N/A"}</p>
            <p style={{ color: "#2563eb", fontWeight: 600 }}>Status: {b.status}</p>
            {b.dispute_status === "Pending" && (
              <p style={{ color: "#f59e0b", fontSize: "13px", margin: "2px 0" }}>
                {b.dispute_reason?.reason || "Under Review"}
              </p>
            )}
            <div style={{ marginTop: "10px" }}>{renderActions(b)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🧠 Senior Dashboard
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
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
    const toastId = toast.loading("Updating...");
    try {
      const token = auth?.token || localStorage.getItem("token");
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${id}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Marked as Completed!");
      fetchBookings();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  const startChat = (id) => navigate(`/chat/${id}`);

  // 🔍 Filters
  const tasks = bookings.filter((b) => b.status === "Confirmed" && b.dispute_status !== "Pending");
  const disputes = bookings.filter((b) => b.dispute_status === "Pending");
  const history = bookings.filter(
    (b) => b.status === "Completed" || b.dispute_status === "Resolved"
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#007bff 0%,#00b4d8 50%,#caf0f8 100%)",
        padding: isMobile ? "15px" : "25px 40px",
        fontFamily: "Poppins, sans-serif",
        transition: "all .3s ease",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2
          style={{
            background: "linear-gradient(90deg,#2563eb,#1e40af)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: isMobile ? "1.6rem" : "2rem",
            fontWeight: 700,
          }}
        >
          Welcome, {auth.user?.name || "Senior"} 👋
        </h2>
        <p style={{ color: "#475569", fontSize: "0.95rem", marginTop: "4px" }}>
          Manage your sessions, chat with students, and track your growth.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "rgba(255,255,255,0.9)",
          padding: isMobile ? "10px 12px" : "14px 20px",
          borderRadius: "25px",
          width: isMobile ? "98%" : "85%",
          margin: "0 auto 25px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 10,
          backdropFilter: "blur(10px)",
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
                padding: "8px 18px",
                borderRadius: "25px",
                fontWeight: 600,
                background: active ? "linear-gradient(45deg,#3b82f6,#2563eb)" : "#f3f4f6",
                color: active ? "#fff" : "#2563eb",
                boxShadow: active ? "0 3px 12px rgba(37,99,235,0.3)" : "none",
                transition: "all .3s ease",
              }}
            >
              {tab.label} ({tab.count})
            </Link>
          );
        })}
        <Link
          to="/senior-earnings"
          style={{
            background: "linear-gradient(45deg,#22c55e,#16a34a)",
            color: "#fff",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "25px",
            fontWeight: 600,
            boxShadow: "0 3px 12px rgba(22,163,74,0.3)",
          }}
        >
          💰 Earnings
        </Link>
      </div>

      {/* Routes */}
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
