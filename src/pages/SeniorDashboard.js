import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// 📦 Bookings Card Component
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const renderActionColumn = (booking) => {
    const baseBtn = {
      padding: "8px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      cursor: "pointer",
      transition: "0.3s",
      border: "none",
      fontWeight: 600,
    };
    const primary = { ...baseBtn, background: "linear-gradient(45deg,#3b82f6,#2563eb)", color: "#fff" };
    const secondary = { ...baseBtn, background: "#fff", color: "#2563eb", border: "1px solid #2563eb" };

    if (booking.dispute_status === "Pending") {
      return (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ Under Review</span>
          <button onClick={() => onStartChat(booking._id)} style={secondary}>
            Chat
          </button>
        </div>
      );
    }

    if (booking.status === "Completed") {
      return (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <span style={{ color: "#10b981", fontWeight: 600 }}>✅ Done</span>
          <button onClick={() => onStartChat(booking._id)} style={secondary}>
            Chat History
          </button>
        </div>
      );
    }

    if (booking.status === "Confirmed") {
      return (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => onStartChat(booking._id)} style={primary}>
            💬 Start Chat
          </button>
          <button onClick={() => onMarkComplete(booking._id)} style={secondary}>
            ✔ Mark Done
          </button>
        </div>
      );
    }

    return null;
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#6b7280", fontWeight: 500 }}>
        ⏳ Loading bookings...
      </p>
    );

  if (bookings.length === 0)
    return (
      <p style={{ textAlign: "center", color: "#9ca3af", fontWeight: 500 }}>
        No bookings found.
      </p>
    );

  return (
    <div style={{ animation: "fadeIn 0.6s ease" }}>
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
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "20px",
          padding: "0 10px",
        }}
      >
        {bookings.map((b) => (
          <div
            key={b._id}
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
            }}
          >
            <h4 style={{ margin: 0, color: "#111827", fontWeight: 600 }}>
              👨‍🎓 {b.student?.name || "Student"}
            </h4>
            <p style={{ color: "#6b7280", margin: "4px 0" }}>
              📞 {b.student?.mobileNumber || "N/A"}
            </p>
            <p style={{ color: "#2563eb", fontWeight: 600, marginBottom: "4px" }}>
              Status: {b.status}
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              {b.dispute_status === "Pending"
                ? b.dispute_reason?.reason || "Under Review"
                : b.dispute_status}
            </p>
            <div style={{ marginTop: "10px" }}>{renderActionColumn(b)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🧠 Main Senior Dashboard
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.user?.name) toast.success(`Welcome ${auth.user.name}! 👋`);
  }, [auth?.user]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = auth?.token || localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my",
        { headers: { "x-auth-token": token } }
      );
      setMyBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const markAsCompletedHandler = async (id) => {
    if (!window.confirm("Mark this booking as completed?")) return;
    const toastId = toast.loading("Updating...");
    try {
      const token = auth?.token || localStorage.getItem("token");
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${id}`,
        null,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Marked as Completed!");
      loadBookings();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  const handleStartChat = (id) => navigate(`/chat/${id}`);

  const tasks = myBookings.filter(
    (b) => b.status === "Confirmed" && b.dispute_status !== "Pending"
  );
  const disputes = myBookings.filter((b) => b.dispute_status === "Pending");
  const history = myBookings.filter(
    (b) => b.status === "Completed" || b.dispute_status === "Resolved"
  );

  // 🩵 Background + Layout
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#007bff 0%,#00b4d8 50%,#caf0f8 100%)",
        padding: "20px 15px 50px",
        fontFamily: "'Poppins', sans-serif",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      {/* 🧭 Header */}
      <div style={{ textAlign: "center", paddingBottom: "25px" }}>
        <h2
          style={{
            background: "linear-gradient(90deg,#2563eb,#1e40af)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "1.8rem",
            fontWeight: 700,
          }}
        >
          Welcome, {auth.user?.name || "Senior"} 👋
        </h2>
        <p style={{ color: "#475569", fontSize: "0.95rem" }}>
          Manage your sessions, chat with students, and track your progress.
        </p>
      </div>

      {/* 📍 Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          background: "rgba(255,255,255,0.9)",
          padding: "12px 15px",
          borderRadius: "20px",
          width: "95%",
          margin: "0 auto 25px auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
          const isActive =
            (tab.path === "/senior-dashboard" && location.pathname === "/senior-dashboard") ||
            (tab.path !== "/senior-dashboard" &&
              location.pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: "none",
                padding: "8px 18px",
                borderRadius: "25px",
                fontWeight: 600,
                background: isActive
                  ? "linear-gradient(45deg,#3b82f6,#2563eb)"
                  : "#f3f4f6",
                color: isActive ? "#fff" : "#2563eb",
                boxShadow: isActive
                  ? "0 3px 12px rgba(37,99,235,0.3)"
                  : "none",
                transition: "all 0.3s",
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
          💰 My Earnings
        </Link>
      </div>

      {/* 🧾 Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <BookingsTable
              title="New Bookings"
              bookings={tasks}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
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
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
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
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default SeniorDashboard;
