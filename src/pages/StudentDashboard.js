import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

// ⭐ Star Icon Component
const StarIcon = ({ filled }) => (
  <svg
    fill={filled ? "#f39c12" : "#e0e0e0"}
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

//
// ---------------------------------------------
// 🔹 FindSenior Component
// ---------------------------------------------
const FindSenior = () => {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [platformFee, setPlatformFee] = useState(20);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const API_URL = "https://collegeconnect-backend-mrkz.onrender.com";

        const [seniorsRes, collegesRes, tagsRes, settingsRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile/all`, { headers: { "x-auth-token": token } }),
          axios.get(`${API_URL}/api/colleges`, { headers: { "x-auth-token": token } }),
          axios.get(`${API_URL}/api/tags`, { headers: { "x-auth-token": token } }),
          axios.get(`${API_URL}/api/settings`),
        ]);

        setSeniors(seniorsRes.data);
        setColleges(collegesRes.data);
        setTags(tagsRes.data);
        setPlatformFee(settingsRes.data.platformFee);
      } catch (err) {
        const msg = err.response ? err.response.data.msg || err.response.data : err.message;
        setError("Error: " + msg);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredAndSortedSeniors = seniors
    .filter((senior) => {
      const query = searchQuery.toLowerCase();
      const matchesCollege = !selectedCollege || (senior.college && senior.college._id === selectedCollege);
      const matchesTag = !selectedTag || (senior.tags && senior.tags.some((tag) => tag._id === selectedTag));
      const matchesSearch =
        !query ||
        (senior.college && senior.college.name.toLowerCase().includes(query)) ||
        (senior.branch && senior.branch.toLowerCase().includes(query)) ||
        (senior.user && senior.user.name.toLowerCase().includes(query));
      return matchesCollege && matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")
        return a.price_per_session + platformFee - (b.price_per_session + platformFee);
      if (sortBy === "price_desc")
        return b.price_per_session + platformFee - (a.price_per_session + platformFee);
      return (b.average_rating || 0) - (a.average_rating || 0);
    });

  if (loading) return <h2>Loading Seniors...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by College, Branch, or Tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters & Sort"}
      </button>

      {showFilters && (
        <div className="filters-container">
          <div className="form-group">
            <label>Filter by College</label>
            <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
              <option value="">All Colleges</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Filter by Tag</label>
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">Rating: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      )}

      <div className="container senior-grid-container">
        {filteredAndSortedSeniors.length > 0 ? (
          <div className="senior-grid">
            {filteredAndSortedSeniors.map((profile) => (
              <div key={profile._id} className="senior-card">
                <img
                  src={profile.avatar || "https://via.placeholder.com/100"}
                  alt={profile.user ? profile.user.name : "Senior"}
                />
                <h4>{profile.user ? profile.user.name : "Senior"}</h4>

                <div style={{ display: "flex", justifyContent: "center", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(profile.average_rating)} />
                  ))}
                  <span style={{ marginLeft: "5px" }}>
                    ({profile.total_ratings || 0} reviews)
                  </span>
                </div>

                <p>{profile.college ? profile.college.name : "N/A"}</p>
                <p>
                  {profile.branch || "N/A"} ({profile.year || "N/A"})
                </p>
                <p>{(profile.bio || "").substring(0, 80)}...</p>

                <p>
                  ₹{(profile.price_per_session || 0) + platformFee} /{" "}
                  {profile.session_duration_minutes} min
                </p>

                <Link to={`/book/${profile.user?._id}`} className="btn btn-primary">
                  View Profile & Book
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>No seniors found.</p>
        )}
      </div>
    </>
  );
};

//
// ---------------------------------------------
// 🔹 MyBookings Component
// ---------------------------------------------
const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        setBookings(res.data);
      } catch (err) {
        const msg = err.response ? err.response.data.msg || err.response.data : err.message;
        setError("Error: " + msg);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleRate = (id) => navigate(`/rate-booking/${id}`);
  const handleDispute = (id) => navigate(`/raise-dispute/${id}`);
  const handleChat = (id) => navigate(`/chat/${id}`);

  if (loading) return <h2>Loading My Bookings...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  const upcoming = bookings.filter((b) => b.status === "Confirmed");
  const history = bookings.filter((b) => b.status === "Completed" || b.status === "Cancelled (Refunded)");

  return (
    <div className="my-bookings-container">
      <h2>My Upcoming Bookings</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming bookings.</p>
      ) : (
        upcoming.map((b) => (
          <div key={b._id} className="booking-card">
            <h3>{b.senior?.name || "Senior"}</h3>
            <p>{b.status}</p>
            <div>
              <button onClick={() => handleChat(b._id)} className="btn btn-primary">Chat</button>
              <button onClick={() => handleDispute(b._id)} className="btn btn-danger">Dispute</button>
            </div>
          </div>
        ))
      )}

      <h2 style={{ marginTop: "40px" }}>Booking History</h2>
      {history.length === 0 ? (
        <p>No completed bookings.</p>
      ) : (
        history.map((b) => (
          <div key={b._id} className="booking-card">
            <h3>{b.senior?.name || "Senior"}</h3>
            <p>Status: {b.status}</p>
            <p>Dispute: {b.dispute_status}</p>
            <button onClick={() => handleRate(b._id)} className="btn btn-secondary">Rate</button>
          </div>
        ))
      )}
    </div>
  );
};

//
// ---------------------------------------------
// 🔹 Main Student Dashboard
// ---------------------------------------------
function StudentDashboard() {
  const location = useLocation();
  const isBookingsTab = location.pathname.includes("/bookings");

  return (
    <div className="container page-container" style={{ minHeight: "60vh" }}>
      <div className="dashboard-nav">
        <Link to="/student-dashboard" className={`dashboard-nav-item ${!isBookingsTab ? "active" : ""}`}>
          Find a Senior
        </Link>
        <Link to="/student-dashboard/bookings" className={`dashboard-nav-item ${isBookingsTab ? "active" : ""}`}>
          My Bookings
        </Link>
      </div>

      <div style={{ marginTop: "30px" }}>
        <Routes>
          <Route path="/" element={<FindSenior />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
