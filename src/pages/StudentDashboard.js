import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

// ⭐ Gradient Star
const StarIcon = ({ filled }) => (
  <svg
    fill={filled ? "url(#grad)" : "#cbd5e1"}
    width="22"
    height="22"
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#facc15" }} />
        <stop offset="100%" style={{ stopColor: "#f59e0b" }} />
      </linearGradient>
    </defs>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const FindSenior = () => {
  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const API = "https://collegeconnect-backend-mrkz.onrender.com";
        const [s, c, t] = await Promise.all([
          axios.get(`${API}/api/profile/all`, { headers: { "x-auth-token": token } }),
          axios.get(`${API}/api/colleges`, { headers: { "x-auth-token": token } }),
          axios.get(`${API}/api/tags`, { headers: { "x-auth-token": token } }),
        ]);
        setSeniors(s.data);
        setColleges(c.data);
        setTags(t.data);
      } catch {
        alert("⚠️ Unable to load seniors");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = seniors
    .filter(
      (x) =>
        (!selectedCollege || x.college?._id === selectedCollege) &&
        (!selectedTag || x.tags?.some((t) => t._id === selectedTag)) &&
        (x.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          x.college?.name?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price_per_session - b.price_per_session;
      if (sortBy === "price_desc") return b.price_per_session - a.price_per_session;
      return (b.average_rating || 0) - (a.average_rating || 0);
    });

  if (loading)
    return (
      <div style={{ textAlign: "center", color: "#818cf8", marginTop: "40px" }}>
        <h3>✨ Finding Top Seniors...</h3>
      </div>
    );

  return (
    <div style={pageWrapper}>
      {/* Search + Filters */}
      <div style={searchSection}>
        <input
          type="text"
          placeholder="🔍 Search by name, college or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <div style={filterRow}>
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} style={selectStyle}>
            <option value="">🎓 All Colleges</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} style={selectStyle}>
            <option value="">🏷️ All Tags</option>
            {tags.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="rating">⭐ Top Rated</option>
            <option value="price_asc">💰 Low Price</option>
            <option value="price_desc">💸 High Price</option>
          </select>
        </div>
      </div>

      {/* Senior Cards */}
      <div style={gridStyle}>
        {filtered.length ? (
          filtered.map((p) => (
            <div
              key={p._id}
              style={seniorCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={imageWrapper}>
                <img
                  src={p.avatar || "https://via.placeholder.com/100"}
                  alt={p.user?.name}
                  style={avatar}
                />
              </div>
              <h3 style={nameStyle}>{p.user?.name}</h3>
              <div style={ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.round(p.average_rating)} />
                ))}
                <span style={{ marginLeft: "6px", color: "#555" }}>({p.total_ratings || 0})</span>
              </div>
              <p style={collegeStyle}>{p.college?.name}</p>
              <p style={bioStyle}>{p.bio?.substring(0, 80)}...</p>
              <p style={priceText}>₹{p.price_per_session || 0} / {p.session_duration_minutes || 20} min</p>
              <Link to={`/book/${p.user._id}`} style={btnPrimary}>🚀 Book Session</Link>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>No seniors found.</p>
        )}
      </div>
    </div>
  );
};

// 🎯 MyBookings
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        setBookings(res.data);
      } catch {
        alert("⚠️ Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleDispute = (id) => navigate(`/raise-dispute/${id}`);
  const handleChat = (id) => navigate(`/chat/${id}`);

  if (loading)
    return (
      <h3 style={{ textAlign: "center", color: "#6366f1", marginTop: "30px" }}>
        🔄 Loading bookings...
      </h3>
    );

  return (
    <div style={pageWrapper}>
      <h2 style={titleStyle}>📘 My Bookings</h2>
      <div style={gridStyle}>
        {bookings.map((b) => {
          const dispute = b.dispute_status?.toLowerCase() || "none";
          const status = b.status?.toLowerCase();

          return (
            <div key={b._id} style={bookingCard}>
              <h3 style={nameStyle}>{b.senior?.name}</h3>
              <p style={collegeStyle}>{b.profile?.college?.name}</p>
              <p style={bioStyle}>Status: <b>{b.status}</b></p>
              <p style={bioStyle}>Dispute: {b.dispute_status || "None"}</p>

              <div style={buttonRow}>
                {status === "confirmed" && (
                  <button style={btnBlue} onClick={() => handleChat(b._id)}>💬 Chat</button>
                )}
                {dispute === "none" && (
                  <button style={btnRed} onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>
                )}
                {dispute === "pending" && <span style={pendingTag}>🛑 Pending</span>}
                {dispute === "resolved" && <span style={resolvedTag}>✅ Resolved</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 🌈 Main Dashboard
const StudentDashboard = () => {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes("/bookings");

  return (
    <div style={mainContainer}>
      <div style={tabBar}>
        <Link to="/student-dashboard" style={onBookingsTab ? tabInactive : tabActive}>🎓 Find Seniors</Link>
        <Link to="/student-dashboard/bookings" style={onBookingsTab ? tabActive : tabInactive}>📘 My Bookings</Link>
      </div>

      <Routes>
        <Route path="/" element={<FindSenior />} />
        <Route path="/bookings" element={<MyBookings />} />
      </Routes>
    </div>
  );
};

// ✨ Styles
const mainContainer = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "20px",
  fontFamily: "Poppins, sans-serif",
  background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
  minHeight: "100vh",
};

const pageWrapper = { padding: "10px" };
const searchSection = { textAlign: "center", marginBottom: "20px" };
const inputStyle = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  width: "90%",
  maxWidth: "400px",
  fontSize: "15px",
  outline: "none",
  boxShadow: "0 3px 10px rgba(99,102,241,0.1)",
};
const filterRow = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginTop: "12px",
};
const selectStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(8px)",
  cursor: "pointer",
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};
const seniorCard = {
  background: "rgba(255,255,255,0.85)",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "18px",
  textAlign: "center",
  transition: "0.3s ease",
  backdropFilter: "blur(12px)",
};
const imageWrapper = { display: "flex", justifyContent: "center" };
const avatar = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #6366f1",
};
const nameStyle = { color: "#2563eb", fontWeight: "600" };
const collegeStyle = { color: "#555", fontSize: "0.9rem" };
const bioStyle = { color: "#666", fontSize: "0.85rem" };
const ratingContainer = { display: "flex", justifyContent: "center", alignItems: "center" };
const priceText = { color: "#16a34a", fontWeight: "600", fontSize: "1rem", margin: "10px 0" };
const btnPrimary = {
  display: "inline-block",
  background: "linear-gradient(45deg, #6366f1, #2563eb)",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "600",
  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
};
const bookingCard = {
  ...seniorCard,
  borderLeft: "5px solid #6366f1",
};
const buttonRow = { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" };
const btnBlue = { ...btnPrimary, border: "none", background: "linear-gradient(45deg,#3b82f6,#2563eb)" };
const btnRed = { ...btnPrimary, border: "none", background: "linear-gradient(45deg,#ef4444,#dc2626)" };
const pendingTag = { color: "#b91c1c", fontWeight: "bold" };
const resolvedTag = { color: "#16a34a", fontWeight: "bold" };
const tabBar = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  padding: "10px",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
};
const tabActive = {
  background: "linear-gradient(45deg, #2563eb, #6366f1)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
};
const tabInactive = {
  background: "#f1f5f9",
  color: "#2563eb",
  padding: "10px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
};
const titleStyle = { textAlign: "center", color: "#2563eb", marginBottom: "20px" };

export default StudentDashboard;
