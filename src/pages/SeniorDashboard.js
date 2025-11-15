import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

// 📦 Booking Cards Component (Modern UI)
const BookingsTable = ({
  title,
  bookings,
  loading,
  onMarkComplete,
  onStartChat,
  onAcceptTime,
  onRejectTime,
  actionLoading, // 🚀 NAYA: Loading state prop
}) => {
  const actionButton = (text, gradient, action, disabled = false) => ({ // 🚀 NAYA: disabled prop
    background: gradient,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", // 🚀 NAYA: cursor change
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontSize: "13px",
    opacity: disabled ? 0.6 : 1, // 🚀 NAYA: opacity change
    ...(action && !disabled && { onClick: action }), // 🚀 NAYA: action sirf tab jab disabled na ho
  });

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#6b7280", fontWeight: 500 }}>
        ⏳ Loading bookings...
      </p>
    );

  if (!bookings.length)
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
          color: "#1e3a8a",
          marginBottom: "20px",
          fontWeight: 700,
          fontSize: "1.3rem",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "18px",
          padding: "0 10px",
        }}
      >
        {bookings.map((b) => {
          // 🚀 NAYA: Check karo ki is specific card par action ho raha hai
          const isLoading = actionLoading === b._id; 
          
          return (
            <div
              key={b._id}
              style={{
                background: "rgba(255,255,255,0.85)",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                border:
                  b.dispute_status === "Pending" ? "2px solid #f59e0b" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
            >
              <h4 style={{ margin: 0, color: "#111827", fontWeight: 600 }}>
                👨‍🎓 {b.student?.name || "Student"}
              </h4>
              <p style={{ color: "#6b7280", margin: "5px 0" }}>
                📞 {b.student?.mobileNumber || "N/A"}
              </p>
              <p
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                Status: {b.status}
              </p>

              <p
                style={{ color: "#64748b", fontSize: "13px", marginBottom: "10px" }}
              >
                {b.dispute_status === "Pending"
                  ? `⚠ ${b.dispute_reason?.reason || "Under Review"}`
                  : b.dispute_status || "No dispute"}
              </p>

              {/* 🚀 NAYA Time Status UI (STEP 3) */}
              <p style={{ color: "#1e3a8a", fontWeight: 600, fontSize: "14px", margin: "10px 0", borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                🕒 Call Time:
                {b.status_timing === "not_set" && " ⏳ Waiting for student..."}
                {b.status_timing === "student_proposed" && ` 🙋‍♂️ Proposed: ${new Date(b.proposed_time.student_time).toLocaleString()}`}
                {b.status_timing === "confirmed_time" && ` ✅ Confirmed: ${new Date(b.final_time).toLocaleString()}`}
              </p>
              {/* 🚀 END NAYA UI */}


              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {b.status === "Confirmed" && (
                  <>
                    {/* 🚀 PURA NAYA BUTTON LOGIC (STEP 3) */}
                    
                    {/* Case 1: Student ne time propose kiya hai */}
                    {b.status_timing === "student_proposed" && (
                      <>
                        <button
                          style={actionButton("✅ Accept", "linear-gradient(45deg,#10b981,#059669)", null, isLoading)} // 🚀 NAYA: disabled
                          onClick={() => onAcceptTime(b._id)}
                          disabled={isLoading} // 🚀 NAYA: disabled
                        >
                          {isLoading ? "Accepting..." : "✅ Accept"}
                        </button>
                        <button
                          style={actionButton("❌ Reject", "linear-gradient(45deg,#ef4444,#b91c1c)", null, isLoading)} // 🚀 NAYA: disabled
                          onClick={() => onRejectTime(b._id)}
                          disabled={isLoading} // 🚀 NAYA: disabled
                        >
                          {isLoading ? "Rejecting..." : "❌ Reject"}
                        </button>
                      </>
                    )}

                    {/* Case 2: Time confirm ho gaya hai */}
                    {b.status_timing === "confirmed_time" && (
                      <Link
                        to={`/session/${b._id}`}
                        style={actionButton("📞 Join Call", "linear-gradient(45deg,#7c3aed,#4f46e5)")}
                      >
                        📞 Join Call
                      </Link>
                    )}
                    
                    {/* Common Buttons */}
                    <button
                      style={actionButton("💬 Chat", "linear-gradient(45deg,#3b82f6,#2563eb)", null, isLoading)}
                      onClick={() => onStartChat(b._id)}
                      disabled={isLoading} // 🚀 NAYA: disabled
                    >
                      💬 Chat
                    </button>
                    <button
                      style={actionButton("✔ Mark Done", "linear-gradient(45deg,#f59e0b,#b45309)", null, isLoading)}
                      onClick={() => onMarkComplete(b._id)}
                      disabled={isLoading} // 🚀 NAYA: disabled
                    >
                      ✔ Done
                    </button>
                    {/* 🚀 END NAYA BUTTON LOGIC */}
                  </>
                )}
                {b.status === "Completed" && (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>
                    ✅ Completed
                  </span>
                )}
                {b.dispute_status === "Pending" && (
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                    ⚠ Under Review
                  </span>
                )}
              </div>
            </div>
          )
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
  const [actionLoading, setActionLoading] = useState(null); // 🚀 NAYA: Loading state

  // API URL (Aapke code se liya gaya)
  const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";
  // 🚀 NAYA (STEP 5)
  const socket = io(API_URL);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = auth?.token || localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/bookings/senior/my`,
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

    // 🚀 NAYA SOCKET.IO LOGIC (STEP 5)
    // Auth se senior ID lein
    const seniorId = auth.user?.id; 
    if (seniorId) {
      socket.emit("join_room", seniorId); // Apni personal room join karein
    }

    socket.on("student_time_proposed", (booking) => {
      toast.success(`🙋‍♂️ Student proposed a new time!`);
      loadBookings(); // List refresh karein
    });
    
    // Cleanup
    return () => {
      socket.off("student_time_proposed");
      if (seniorId) {
         // socket.emit("leave_room", seniorId); // Optional
      }
    };
    
  }, [loadBookings, auth.user?.id]); 

  const markAsCompletedHandler = async (id) => {
    if (actionLoading) return; // 🚀 NAYA: Agar action loading hai to return
    setActionLoading(id); // 🚀 NAYA
    if (!window.confirm("Mark this booking as completed?")) {
      setActionLoading(null); // 🚀 NAYA
      return;
    }
    const toastId = toast.loading("Updating...");
    try {
      const token = auth?.token || localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/bookings/mark-complete/${id}`,
        null,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Marked as Completed!");
      loadBookings();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        "Error: " + (err.response ? err.response.data.msg : err.message)
      );
    } finally {
      setActionLoading(null); // 🚀 NAYA
    }
  };

  // 🚀 NAYA FUNCTION (Accept) (STEP 3)
  const acceptTime = async (id) => {
    if (actionLoading) return; // 🚀 NAYA
    if (!window.confirm("Accept this time and confirm the call?")) return;
    setActionLoading(id); // 🚀 NAYA
    try {
      const token = auth?.token || localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/bookings/accept-time/${id}`,
        {}, // No body needed
        { headers: { "x-auth-token": token } }
      );
      toast.success("Time confirmed! Student notified.");
      loadBookings(); // Reload list
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error accepting time");
    } finally {
      setActionLoading(null); // 🚀 NAYA
    }
  };

  // 🚀 NAYA FUNCTION (Reject) (STEP 3)
  const rejectTime = async (id) => {
    if (actionLoading) return; // 🚀 NAYA
    if (!window.confirm("Reject this time? The student will be notified.")) return;
    setActionLoading(id); // 🚀 NAYA
    try {
      const token = auth?.token || localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/bookings/reject-time/${id}`,
        {}, // No body needed
        { headers: { "x-auth-token": token } }
      );
      toast.warn("Time rejected. Student notified.");
      loadBookings(); // Reload list
    } catch (e) {
      toast.error(e.response?.data?.msg || "Error rejecting time");
    } finally {
      setActionLoading(null); // 🚀 NAYA
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
      {/* 🧭 Header */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2
          style={{
            color: "#fff",
            fontSize: "2rem",
            fontWeight: 700,
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          Welcome, {auth.user?.name || "Senior"} 👋
        </h2>
        <p style={{ color: "#dbeafe", fontSize: "0.95rem" }}>
          Manage your sessions, chat with students, and monitor your progress
          easily.
        </p>
      </div>

      {/* 🪄 Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          background: "rgba(255,255,255,0.15)",
          padding: "10px 15px",
          borderRadius: "20px",
          width: "95%",
          margin: "0 auto 25px auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          backdropFilter: "blur(15px)",
          position: "sticky",
          top: 10,
          zIndex: 10,
        }}
      >
        {[
          { path: "/senior-dashboard", label: "🆕 New", count: tasks.length },
          {
            path: "/senior-dashboard/disputes",
            label: "⚠️ Disputes",
            count: disputes.length,
          },
          {
            path: "/senior-dashboard/history",
            label: "✅ History",
            count: history.length,
          },
        ].map((tab) => {
          const isActive =
            (tab.path === "/senior-dashboard" &&
              location.pathname === "/senior-dashboard") ||
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
                  : "rgba(255,255,255,0.2)",
                color: isActive ? "#fff" : "#e0f2fe",
                boxShadow: isActive
                  ? "0 3px 10px rgba(37,99,235,0.4)"
                  : "none",
                transition: "all 0.3s ease",
              }}
            >
              {tab.label} ({tab.count})
            </Link>
          );
        })}

        <Link
          to="/senior-earnings"
          style={{
            background: "linear-gradient(45deg,#16a34a,#22c55e)",
            color: "#fff",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "25px",
            fontWeight: 600,
            boxShadow: "0 3px 10px rgba(22,163,74,0.4)",
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
              onAcceptTime={acceptTime}
              onRejectTime={rejectTime}
              actionLoading={actionLoading} // 🚀 NAYA: Prop pass karein
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
              onAcceptTime={acceptTime}
              onRejectTime={rejectTime}
              actionLoading={actionLoading} // 🚀 NAYA: Prop pass karein
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
              onAcceptTime={acceptTime}
              onRejectTime={rejectTime}
              actionLoading={actionLoading} // 🚀 NAYA: Prop pass karein
            />
          }
        />
      </Routes>
    </div>
  );
}

export default SeniorDashboard;