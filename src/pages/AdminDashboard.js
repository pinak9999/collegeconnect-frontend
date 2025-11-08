import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState("users");

  // 🔹 Load Users
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`,
        { headers: { "x-auth-token": token } }
      );
      setUsers(res.data.users);
      setUserPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load Bookings
  const loadBookings = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`,
        { headers: { "x-auth-token": token } }
      );
      setBookings(res.data.bookings);
      setBookingPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      setError("Failed to load bookings");
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    else loadBookings();
  }, [activeTab]);

  // 🔹 Make Senior
  const makeSeniorHandler = async (userId) => {
    if (!window.confirm("Make this user a Senior?")) return;
    const toastId = toast.loading("Updating...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}/make-senior`,
        null,
        { headers: { "x-auth-token": token } }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
      toast.dismiss(toastId);
      toast.success("User promoted to Senior!");
      navigate(`/admin-edit-profile/${userId}`);
    } catch {
      toast.dismiss(toastId);
      toast.error("Update failed");
    }
  };

  // 🔹 Delete User
  const deleteUserHandler = async (userId, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    const toastId = toast.loading("Deleting...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("Deleted successfully");
      loadUsers(userPageData.currentPage);
    } catch {
      toast.dismiss(toastId);
      toast.error("Delete failed");
    }
  };

  // 🔹 Resolve Dispute
  const resolveDisputeHandler = async (id) => {
    if (!window.confirm("Mark this dispute resolved?")) return;
    const toastId = toast.loading("Resolving...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${id}`,
        null,
        { headers: { "x-auth-token": token } }
      );
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data.booking : b)));
      toast.dismiss(toastId);
      toast.success("Resolved!");
    } catch {
      toast.dismiss(toastId);
      toast.error("Error resolving dispute");
    }
  };

  if (error)
    return (
      <div style={errorBox}>
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={btnPrimary}>
          🔄 Reload
        </button>
      </div>
    );

  return (
    <div style={mainWrapper}>
      <h1 style={headerTitle}>🛠 Admin Dashboard</h1>

      {/* 🔹 Top Management Buttons */}
      <div style={adminBtnWrapper}>
        {topButtons.map((btn, i) => (
          <Link key={i} to={btn.link} style={adminButton(btn.color)}>
            {btn.icon} {btn.text}
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div style={tabWrapper}>
        <button onClick={() => setActiveTab("users")} style={tab(activeTab === "users")}>
          👥 Users
        </button>
        <button onClick={() => setActiveTab("bookings")} style={tab(activeTab === "bookings")}>
          📖 Bookings
        </button>
      </div>

      {/* Main Data Section */}
      {loading ? (
        <h3 style={{ textAlign: "center", color: "#2563eb" }}>⏳ Loading...</h3>
      ) : activeTab === "users" ? (
        <>
          <h3 style={sectionTitle}>All Users</h3>
          <div style={gridContainer}>
            {users.map((u) => (
              <div key={u._id} style={userCard}>
                <h4 style={userName}>{u.name}</h4>
                <p style={userEmail}>{u.email}</p>
                <p style={userPhone}>📞 {u.mobileNumber}</p>
                <p style={{ fontWeight: 600, color: u.isSenior ? "#16a34a" : "#ef4444" }}>
                  {u.isSenior ? "Senior" : "Student"}
                </p>
                <div style={btnRow}>
                  {!u.isSenior && u.role !== "Admin" && (
                    <button style={btnBlue} onClick={() => makeSeniorHandler(u._id)}>
                      🎓 Make Senior
                    </button>
                  )}
                  {u.isSenior && (
                    <Link to={`/admin-edit-profile/${u._id}`} style={btnGradient}>
                      ✏ Edit Profile
                    </Link>
                  )}
                  {u.role === "Student" && (
                    <button style={btnRed} onClick={() => deleteUserHandler(u._id, u.name)}>
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={userPageData.currentPage}
            totalPages={userPageData.totalPages}
            onPageChange={(page) => loadUsers(page)}
          />
        </>
      ) : (
        <>
          <h3 style={sectionTitle}>All Bookings</h3>
          <div style={gridContainer}>
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  ...userCard,
                  background: b.dispute_status === "Pending" ? "#fff7ed" : "white",
                  borderLeft:
                    b.dispute_status === "Pending"
                      ? "5px solid #f97316"
                      : "5px solid #22c55e",
                }}
              >
                <h4 style={userName}>{b.student?.name}</h4>
                <p style={userEmail}>Senior: {b.senior?.name}</p>
                <p style={{ color: "#2563eb", fontWeight: 600 }}>
                  ₹{b.amount_paid} — {b.status}
                </p>
                <p style={{ color: "#ef4444" }}>
                  {b.dispute_status === "Pending"
                    ? "⚠ Dispute Pending"
                    : b.dispute_status}
                </p>
                {b.dispute_status === "Pending" && (
                  <button style={btnGreen} onClick={() => resolveDisputeHandler(b._id)}>
                    ✅ Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={bookingPageData.currentPage}
            totalPages={bookingPageData.totalPages}
            onPageChange={(page) => loadBookings(page)}
          />
        </>
      )}
    </div>
  );
}

/* 🎨 === Styles === */
const mainWrapper = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#eef2ff,#f9fafb)",
  padding: "40px 20px",
  fontFamily: "Poppins, sans-serif",
};

const headerTitle = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "2rem",
  background: "linear-gradient(90deg,#2563eb,#6366f1)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "25px",
};

const adminBtnWrapper = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "30px",
};

const adminButton = (color) => ({
  background: `linear-gradient(45deg,${color},#2563eb)`,
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
  transition: "0.3s",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
});

const topButtons = [
  { text: "Manage Payouts", icon: "💰", color: "#16a34a", link: "/admin-payouts" },
  { text: "Settings", icon: "⚙️", color: "#2563eb", link: "/admin-settings" },
  { text: "Tags", icon: "🏷", color: "#6366f1", link: "/admin-manage-tags" },
  { text: "Colleges", icon: "🎓", color: "#0891b2", link: "/admin-manage-colleges" },
  { text: "Dispute Reasons", icon: "⚠️", color: "#f97316", link: "/admin-manage-dispute-reasons" },
];

const tabWrapper = { textAlign: "center", marginBottom: "20px" };

const tab = (active) => ({
  padding: "10px 18px",
  borderRadius: "30px",
  border: "none",
  margin: "0 5px",
  background: active
    ? "linear-gradient(45deg,#2563eb,#1e40af)"
    : "#f3f4f6",
  color: active ? "#fff" : "#2563eb",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: active ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
});

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "15px",
  padding: "10px",
};

const userCard = {
  background: "rgba(255,255,255,0.9)",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  padding: "15px",
  textAlign: "center",
  transition: "0.3s",
  backdropFilter: "blur(6px)",
};

const userName = { margin: 0, color: "#111827", fontWeight: 600 };
const userEmail = { color: "#6b7280", margin: "4px 0" };
const userPhone = { color: "#2563eb", fontWeight: 500 };
const btnRow = { marginTop: "10px", display: "flex", justifyContent: "center", gap: "8px" };

const btnPrimary = {
  background: "linear-gradient(45deg,#2563eb,#1e40af)",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};
const btnBlue = { ...btnPrimary, background: "linear-gradient(45deg,#3b82f6,#2563eb)" };
const btnRed = { ...btnPrimary, background: "linear-gradient(45deg,#ef4444,#b91c1c)" };
const btnGreen = { ...btnPrimary, background: "linear-gradient(45deg,#22c55e,#16a34a)" };
const btnGradient = {
  ...btnPrimary,
  background: "linear-gradient(45deg,#6366f1,#2563eb)",
  textDecoration: "none",
  display: "inline-block",
};

const errorBox = {
  textAlign: "center",
  color: "red",
  padding: "40px",
  fontFamily: "Poppins",
};

const sectionTitle = {
  textAlign: "center",
  color: "#1e40af",
  marginBottom: "10px",
};

export default AdminDashboard;
