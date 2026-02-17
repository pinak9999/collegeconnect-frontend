import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// 🌟 Star Icon (Gradient + Smooth)
const StarIcon = ({ filled, size = 24, isClickable = false }) => (
  <svg
    fill={filled ? "url(#grad)" : "#d1d5db"}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{
      transition: "0.3s",
      cursor: isClickable ? "pointer" : "default",
      transform: isClickable ? "scale(1.1)" : "scale(1)",
    }}
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#fbbf24" }} />
        <stop offset="100%" style={{ stopColor: "#f59e0b" }} />
      </linearGradient>
    </defs>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

//
// ---------------------------------------------------------
// 🎓 FindSenior Component
// ---------------------------------------------------------
// 🚀 Props से seniors, loading, colleges, और tags प्राप्त करें
const FindSenior = ({ seniors, loading, colleges, tags }) => {
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // 🚀 state और useEffect हटा दिया गया है, क्योंकि data props से आ रहा है

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
      <div style={{ textAlign: "center", color: "#3b82f6", marginTop: "60px" }}>
        <h3>✨ Finding Top Seniors...</h3>
      </div>
    );

  return (
    <div style={pageWrapper}>
      {/* 🔍 Search & Filters */}
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
            {/* 🚀 colleges prop का प्रयोग करें */}
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} style={selectStyle}>
            <option value="">🏷️ All Tags</option>
            {/* 🚀 tags prop का प्रयोग करें */}
            {tags.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="rating">⭐ Top Rated</option>
            <option value="price_asc">💰 Low Price</option>
            <option value="price_desc">💸 High Price</option>
          </select>
        </div>
      </div>

      {/* 👨‍🏫 Senior Cards */}
      <div style={gridStyle}>
        {filtered.length ? (
          filtered.map((p) => (
            <div
              key={p._id}
              style={seniorCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                <span style={{ marginLeft: "6px", color: "#666" }}>({p.total_ratings || 0})</span>
              </div>
              <p style={collegeStyle}>{p.college?.name}</p>
              <p style={bioStyle}>{p.bio?.substring(0, 80)}...</p>
              <p style={priceText}>₹{p.price_per_session || 0} / {p.session_duration_minutes || 20} min</p>
              <Link to={`/book/${p.user._id}`} style={btnPrimary}>
                🚀 Book Session
              </Link>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", gridColumn: "1 / -1" }}>No seniors found.</p>
        )}
      </div>
    </div>
  );
};

//
// ---------------------------------------------------------
// 📘 MyBookings Component (⭐ CSS Revamped)
// ---------------------------------------------------------
const MyBookings = ({ seniors }) => { // 🚀 seniors prop प्राप्त करें
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState({ bookingId: null, value: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        setBookings(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort by most recent
      } catch {
        toast.error("⚠️ Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleDispute = (id) => navigate(`/raise-dispute/${id}`);
  const handleChat = (id) => navigate(`/chat/${id}`);

  // ⭐ Rating Logic
  const handleRating = async (bookingId, seniorId, value) => {
    // Note: window.confirm is bad practice as it's blocking.
    // In a real app, use a custom modal. For this fix, we'll keep it.
    const confirmRating = window.confirm(
      "⚠️ Once you rate this senior, you cannot raise a dispute.\nDo you want to continue?"
    );
    if (!confirmRating) return toast("Rating cancelled ❌");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/ratings/submit/${bookingId}`,
        { rating: value },
        { headers: { "x-auth-token": token } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, rated: true, rating: value, dispute_status: "not_allowed" }
            : b
        )
      );

      toast.success(`⭐ You rated ${value} stars!`);
    } catch (err) {
      // 🚀 BOLD: बेहतर एरर हैंडलिंग जोड़ी गई
      console.error("Rating submission error:", err.response || err.message || err);
      // सर्वर से आने वाले खास एरर मैसेज को दिखाने की कोशिश करें
      const errorMsg = err.response?.data?.msg || "Failed to submit rating!";
      toast.error(`⚠️ ${errorMsg}`);
    }
  };
  
    // Helper to get status tag style
  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return { ...statusTag, ...statusConfirmed };
      case "completed":
        return { ...statusTag, ...statusCompleted };
      case "pending":
        return { ...statusTag, ...statusPending };
      case "cancelled":
        return { ...statusTag, ...statusCancelled };
      default:
        return { ...statusTag };
    }
  };

  // Helper to get dispute tag style
  const getDisputeTag = (dispute) => {
      switch (dispute?.toLowerCase()) {
      case "pending":
        return pendingTag;
      case "resolved":
        return resolvedTag;
      default:
        return null; // Don't show a tag if "none" or "not_allowed"
    }
  }

  // 🚀 NEW HELPER FUNCTION (नया हेल्पर फ़ंक्शन)
  // यह 'year' को "1st Year", "2nd Year" आदि में बदल देगा।
  const getYearSuffix = (year) => {
    if (!year) return null; // अगर साल नहीं है तो कुछ न दिखाएं
    const num = parseInt(year, 10);
    if (isNaN(num)) return year; // अगर यह पहले से "Final Year" जैसा कुछ है
    if (num === 1) return "1st Year";
    if (num === 2) return "2nd Year";
    if (num === 3) return "3rd Year";
    if (num >= 4) return `${num}th Year`;
    return `${num}th Year`; // डिफ़ॉल्ट
  };


  // ⭐ --- BINDING FUNCTION (Render Booking Card) ---
  // Ek function bana diya taaki code repeat na ho
  const renderBookingCard = (b) => {
    const dispute = b.dispute_status?.toLowerCase() || "none";
    const status = b.status?.toLowerCase();
    const disputeTagStyle = getDisputeTag(dispute);

    // 🚀 LOGIC FIX: seniors prop से सही प्रोफाइल ढूंढें
    const seniorProfile = seniors.find(s => s.user?._id === b.senior?._id);
    const correctAvatar = seniorProfile ? seniorProfile.avatar : null;

    // 🚀 GET YEAR TEXT (साल का टेक्स्ट यहाँ प्राप्त करें)
    // हम b.profile.year का उपयोग कर रहे हैं, यह मानते हुए कि API से यह डेटा आ रहा है
    const yearText = getYearSuffix(b.profile?.year);

    return (
      <div key={b._id} style={bookingCard}>
        {/* Card Header */}
        <div style={bookingHeader}>
          <div>
            <h3 style={bookingName}>{b.senior?.name}</h3>
            <p style={bookingCollege}>{b.profile?.college?.name}</p>
            {/* 🚀 YEAR ADDED HERE (साल यहाँ जोड़ा गया) */}
            {yearText && <p style={bookingYearStyle}>{yearText}</p>}
          </div>
          <img 
            // 🚀 पहले correctAvatar का, फिर b.profile.avatar का, और अंत में प्लेसहोल्डर का प्रयोग करें
            src={correctAvatar || b.profile?.avatar || "https://via.placeholder.com/60"} 
            alt={b.senior?.name} 
            style={bookingAvatar} 
          />
        </div>

        {/* Status Section */}
        <div style={statusRow}>
          <span style={getStatusTag(status)}>{b.status}</span>
          {disputeTagStyle && <span style={disputeTagStyle}>{b.dispute_status}</span>}
        </div>

        {/* NEW: Info Message */}
        {status === "confirmed" && (
          <p style={infoMessage}>
            ℹ️ सीनियर 6 घंटे के अंदर तुम्हारे मोबाइल नंबर पर कांटेक्ट करेगा।
          </p>
        )}

        {/* Rating Section */}
        {status === "completed" && !b.rated && (
          <div style={ratingSection}>
            <p style={ratingPrompt}>Rate this session:</p>
            <div style={ratingStarsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })}
                  onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })}
                  onClick={() => handleRating(b._id, b.senior?._id, star)}
                >
                  <StarIcon
                    filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)}
                    size={32}
                    isClickable={true}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Already Rated */}
        {b.rated && (
          <div style={ratedSection}>
            <span>You rated:</span>
            <div style={ratedStars}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < b.rating} size={20} />
                ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={buttonRow}>
          {status === "confirmed" && (
            <button style={btnBlue} onClick={() => handleChat(b._id)}>💬 Chat</button>
          )}
          {dispute === "none" && !b.rated && (
            <button style={btnRed} onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>
          )}
          
          {/* Dispute Status Message */}
          {(dispute === "not_allowed" || b.rated) && dispute !== 'pending' && dispute !== 'resolved' && (
            <span style={disputeNotAllowed}>
              🚫 Dispute not allowed after rating.
            </span>
          )}
        </div>
      </div>
    );
  };
  // ⭐ --- END BINDING FUNCTION ---


  if (loading)
    return (
      <h3 style={{ textAlign: "center", color: "#2563eb", marginTop: "40px" }}>
        ⏳ Loading your bookings...
      </h3>
    );

  // ⭐ NEW: Splitting the bookings array
  const activeBookings = bookings.filter(
    b => b.status?.toLowerCase() !== 'completed' && b.status?.toLowerCase() !== 'cancelled'
  );
  
  const pastBookings = bookings.filter(
    b => b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'cancelled'
  );


  return (
    <div style={pageWrapper}>
      <h2 style={titleStyle}>📘 My Bookings</h2>
      
      {bookings.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#555", fontSize: "1.1rem", marginTop: "30px" }}>
          You haven't booked any sessions yet.
        </p>
      )}

      {/* --- ⭐ Section 1: Active Bookings --- */}
      {activeBookings.length > 0 && (
        <>
          <h3 style={sectionTitleStyle}>Ongoing & Active Bookings</h3>
          <div style={gridStyle}>
            {activeBookings.map(renderBookingCard)}
          </div>
        </>
      )}

      {/* --- ⭐ Section 2: Past Bookings --- */}
      {pastBookings.length > 0 && (
          <>
          <h3 style={{...sectionTitleStyle, marginTop: '40px'}}>Completed & Past Bookings</h3>
          <div style={gridStyle}>
            {pastBookings.map(renderBookingCard)}
          </div>
        </>
      )}
      
    </div>
  );
};

//
// ---------------------------------------------------------
// 🌈 Main Dashboard
// ---------------------------------------------------------
const StudentDashboard = () => {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes("/bookings");

  // 🚀 LIFTED STATE: seniors, colleges, और tags को यहाँ fetch करें
  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
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
        toast.error("⚠️ Unable to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // यह StudentDashboard माउंट होने पर एक बार चलेगा

  return (
    <div style={mainContainer}>
      <div style={tabBar}>
        <Link to="/student-dashboard" style={!onBookingsTab ? tabActive : tabInactive}>🎓 Find Seniors</Link>
        <Link to="/student-dashboard/bookings" style={onBookingsTab ? tabActive : tabInactive}>📘 My Bookings</Link>
      </div>

      <Routes>
        <Route 
          path="/" 
          element={<FindSenior 
            seniors={seniors} 
            loading={loading} 
            colleges={colleges} 
            tags={tags} 
          />} 
        />
        <Route 
          path="/bookings" 
          element={<MyBookings 
            seniors={seniors} 
          />} 
        />
      </Routes>
    </div>
  );
};

//
// ---------------------------------------------------------
// ✨ Styles (Responsive + Modern)
// ---------------------------------------------------------
const mainContainer = {
  maxWidth: "1200px",
  margin: "auto",
  padding: "16px",
  fontFamily: "Inter, sans-serif", // Changed to Inter
  background: "#f8f9fa", // Lighter background
  minHeight: "100vh",
};
const pageWrapper = { padding: "10px" };
const searchSection = { textAlign: "center", marginBottom: "20px" }; // Increased margin
const inputStyle = {
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #ced4da", // Lighter border
  width: "92%",
  maxWidth: "400px",
  fontSize: "15px",
  outline: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  transition: "border-color 0.3s, box-shadow 0.3s",
};
// Add focus style (can't do with inline, but good practice)
// inputStyle[":focus"] = { borderColor: "#2563eb", boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)" };

const filterRow = {
  display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "12px", // Increased margin
};
const selectStyle = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #ced4da",
  background: "#fff",
  fontWeight: "500",
  cursor: "pointer",
  fontSize: "0.9rem", // Added
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Slightly wider min
  gap: "20px",
};
const seniorCard = {
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  padding: "18px",
  textAlign: "center",
  transition: "transform 0.3s ease, boxShadow 0.3s ease", // Added boxShadow transition
};
// Add hover style (can't do with inline)
// seniorCard[":hover"] = { transform: "scale(1.02)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" };

const imageWrapper = { display: "flex", justifyContent: "center" };
const avatar = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #2563eb",
};
const nameStyle = { color: "#1e40af", fontWeight: "600", fontSize: "1.1rem", margin: "8px 0 4px 0" }; // Adjusted margin
const collegeStyle = { color: "#555", fontSize: "0.9rem", margin: "0 0 4px 0" };
const bioStyle = { color: "#666", fontSize: "0.85rem", margin: "4px 0" };
const ratingContainer = { display: "flex", justifyContent: "center", alignItems: "center", gap: "2px", marginBottom: "8px" }; // Added margin
const priceText = { color: "#16a34a", fontWeight: "600", fontSize: "1rem", margin: "10px 0" };
const btnPrimary = {
  display: "inline-block",
  background: "linear-gradient(45deg,#2563eb,#3b82f6)",
  color: "#fff",
  padding: "10px 16px", // Increased padding
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
  transition: "0.3s",
  border: "none", // Added
  cursor: "pointer", // Added
};

// --- 📘 MyBookings Revamped Styles ---

const bookingCard = {
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.07)",
  padding: "20px",
  border: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  gap: "16px", // Space between sections
  transition: "0.3s ease",
};
// bookingCard[":hover"] = { boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)" };

const bookingHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "1px solid #f3f4f6",
  paddingBottom: "12px",
};
const bookingName = {
  color: "#1e40af",
  fontWeight: "600",
  fontSize: "1.2rem",
  margin: 0,
};
const bookingCollege = {
  color: "#555",
  fontSize: "0.9rem",
  margin: "4px 0 0 0",
};
// 🚀 NEW STYLE FOR YEAR (साल के लिए नई स्टाइल)
const bookingYearStyle = {
  color: "#1d4ed8", // थीम से मिलता-जुलता नीला रंग
  fontSize: "0.9rem",
  fontWeight: "500",
  margin: "4px 0 0 0",
};
const bookingAvatar = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #dee2e6",
};

const statusRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
};
const statusTag = {
  padding: "4px 12px",
  borderRadius: "99px",
  fontWeight: "600",
  fontSize: "0.8rem",
  textTransform: "capitalize",
};
const statusConfirmed = { background: "#dbeafe", color: "#1d4ed8" };
const statusCompleted = { background: "#dcfce7", color: "#166534" };
const statusPending = { background: "#fef9c3", color: "#854d0e" };
const statusCancelled = { background: "#fee2e2", color: "#991b1b" };

const infoMessage = {
  background: "#e0f2fe", // Light blue
  color: "#0c4a6e", // Dark blue text
  padding: "12px",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: "500",
  textAlign: "left",
  lineHeight: "1.5",
};

const ratingSection = {
  background: "#f9fafb",
  borderRadius: "8px",
  padding: "14px",
  textAlign: "center",
};
const ratingPrompt = {
  fontWeight: "600",
  color: "#2563eb",
  margin: "0 0 10px 0",
  fontSize: "0.95rem",
};
const ratingStarsContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "5px",
  flexWrap: "wrap",
};

const ratedSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '10px',
  background: '#f0fdf4',
  borderRadius: '8px',
  color: '#166534',
  fontWeight: '600',
};
const ratedStars = {
  display: 'flex',
  gap: '2px',
};


const buttonRow = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-start", // Align buttons left
  flexWrap: "wrap",
  marginTop: "10px", // Add margin for separation
  paddingTop: "16px",
  borderTop: "1px solid #f3f4f6",
};
const btnBlue = { ...btnPrimary, background: "linear-gradient(45deg,#3b82f6,#2563eb)", fontSize: "0.9rem", padding: "8px 14px" };
const btnRed = { ...btnPrimary, background: "linear-gradient(45deg,#ef4444,#dc2626)", fontSize: "0.9rem", padding: "8px 14px" };

const pendingTag = { 
  ...statusTag, 
  background: "#fef9c3", 
  color: "#854d0e",
};
const resolvedTag = { 
  ...statusTag, 
  background: "#dcfce7", 
  color: "#166534",
};
const disputeNotAllowed = {
  color: "#b91c1c",
  fontWeight: "500",
  fontSize: "0.85rem",
  padding: "8px 0",
};

// --- 🌈 Tab & Title Styles ---
const tabBar = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  padding: "10px",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};
const tabActive = {
  background: "linear-gradient(45deg, #2563eb, #6366f1)",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
  transition: "0.3s",
};
const tabInactive = {
  background: "#f3f4f6",
  color: "#2563eb", // मैंने इसे नीले रंग में बदल दिया ताकि यह एक्टिव टैब से मेल खाए
  padding: "10px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
  transition: "0.3s",
};
const titleStyle = { 
  textAlign: "center", 
  color: "#1e3a8a", 
  marginBottom: "20px", 
  fontWeight: "700" 
};

// ⭐ NEW: Style for section headings
const sectionTitleStyle = {
  color: "#1e40af",
  fontWeight: "600",
  fontSize: "1.5rem",
  margin: "20px 0 15px 0",
  borderBottom: "2px solid #dbeafe",
  paddingBottom: "8px",
};

export default StudentDashboard;