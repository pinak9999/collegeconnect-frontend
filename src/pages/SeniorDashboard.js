import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// 📦 Booking Cards Component
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const actionButton = (text, gradient, action) => ({
    background: gradient,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontSize: "13px",
    ...(action && { onClick: action }),
  });

  if (loading) return <p style={{ textAlign: "center", color: "#e0f2fe", fontWeight: 500, marginTop: "50px" }}>⏳ Loading bookings...</p>;

  if (!bookings || bookings.length === 0) return <p style={{ textAlign: "center", color: "#dbeafe", fontWeight: 500, marginTop: "50px" }}>No bookings found in this category.</p>;

  return (
    <div style={{ animation: "fadeIn 0.6s ease" }}>
      <h3 style={{ textAlign: "center", color: "#fff", marginBottom: "20px", fontWeight: 700, fontSize: "1.3rem" }}>{title}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "18px", padding: "0 10px" }}>
        {bookings.map((b) => {
          const status = (b.status || "").toLowerCase();
          const studentName = b.student?.name || "Student (Unknown)";
          const studentEmail = b.student?.email || "No Email";
          const studentAvatar = b.student?.avatar || "https://via.placeholder.com/60";

          return (
            <div key={b._id} style={{ background: "rgba(255,255,255,0.95)", borderRadius: "18px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", transition: "all 0.3s ease", border: b.dispute_status === "Pending" ? "2px solid #f59e0b" : "none" }}>
              
              <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px"}}>
                  <img src={studentAvatar} alt="student" style={{width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #3b82f6"}} />
                  <div>
                      <h4 style={{ margin: 0, color: "#111827", fontWeight: 600 }}>{studentName}</h4>
                      <p style={{ color: "#6b7280", margin: 0, fontSize: "0.85rem" }}>{studentEmail}</p>
                  </div>
              </div>
              
              <p style={{ color: "#2563eb", fontWeight: 600, marginBottom: "4px", textTransform: "capitalize" }}>
                Status: {status}
              </p>

              <p style={{ fontSize: "0.85rem", color: "#555" }}>
                 📅 {new Date(b.scheduledDate || b.createdAt).toLocaleDateString()}
              </p>

              <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "15px" }}>
                {b.dispute_status === "Pending"
                  ? `⚠ Dispute: ${b.dispute_reason?.reason || "Under Review"}`
                  : b.dispute_status ? `Dispute: ${b.dispute_status}` : "No Active Disputes"}
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                
                {status === "confirmed" && (
                  <>
                    <button style={actionButton("💬 Chat", "linear-gradient(45deg,#3b82f6,#2563eb)")} onClick={() => onStartChat(b._id)}>💬 Chat</button>
                    <button style={actionButton("✔ Mark Done", "linear-gradient(45deg,#10b981,#059669)")} onClick={() => onMarkComplete(b._id)}>✔ Done</button>
                  </>
                )}

                {status === "completed" && (
                  <span style={{ color: "#10b981", fontWeight: 600, padding: "5px 10px", background: "#dcfce7", borderRadius: "10px" }}>✅ Completed</span>
                )}
                
                {b.dispute_status === "Pending" && (
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ Under Review</span>
                )}
              </div>
            </div>
          );
        })}
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

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my",
        { headers: { "x-auth-token": token } }
      );
      const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMyBookings(sortedData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const markAsCompletedHandler = async (id) => {
    if (!window.confirm("Are you sure this session is completed?")) return;
    const toastId = toast.loading("Updating status...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${id}`,
        {}, 
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Session marked as Completed!");
      loadBookings(); 
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleStartChat = (id) => navigate(`/chat/${id}`);

  // 🟢 Correct Filtering Logic
  const tasks = myBookings.filter((b) => {
    const s = (b.status || "").toLowerCase();
    return s === "confirmed" && (!b.dispute_status || b.dispute_status === "Resolved");
  });

  const disputes = myBookings.filter((b) => b.dispute_status && b.dispute_status !== "Resolved");

  const history = myBookings.filter((b) => {
    const s = (b.status || "").toLowerCase();
    return s === "completed" || s === "cancelled";
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1e3a8a,#2563eb,#38bdf8)",
        padding: "20px 10px 60px",
        fontFamily: "'Poppins', sans-serif",
        animation: "fadeIn 0.6s ease-in-out",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "25px", color: "white" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
          Welcome, {auth.user?.name || "Senior"} 👋
        </h2>
        <p style={{ opacity: 0.9 }}>
          Manage your sessions, chat with students, and monitor your progress.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "rgba(255,255,255,0.2)",
          padding: "10px",
          borderRadius: "20px",
          width: "fit-content",
          margin: "0 auto 25px auto",
          backdropFilter: "blur(10px)",
        }}
      >
        {[
          { path: "/senior-dashboard", label: "🆕 New Tasks", count: tasks.length },
          { path: "/senior-dashboard/disputes", label: "⚠️ Disputes", count: disputes.length },
          { path: "/senior-dashboard/history", label: "✅ History", count: history.length },
        ].map((tab) => {
          const currentPath = location.pathname;
          const isActive = tab.path === "/senior-dashboard" 
            ? (currentPath === "/senior-dashboard" || currentPath === "/senior-dashboard/")
            : currentPath.startsWith(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: "none",
                padding: "8px 18px",
                borderRadius: "20px",
                fontWeight: 600,
                background: isActive ? "#fff" : "transparent",
                color: isActive ? "#2563eb" : "#fff",
                transition: "all 0.3s ease",
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
              }}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </Link>
          );
        })}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <BookingsTable
              title="Upcoming Sessions"
              bookings={tasks}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }
        />
        <Route
          path="disputes"
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
          path="history"
          element={
            <BookingsTable
              title="Session History"
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