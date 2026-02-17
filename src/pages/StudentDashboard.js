import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// ... [Keep existing CSS strings, StarIcon, etc. exactly as they were in your file] ...
// I will only rewrite the MyBookings component and necessary wrappers to include the logic.

// 🌟 Star Icon (Gradient + Smooth)
const StarIcon = ({ filled, size = 24, isClickable = false }) => (
  <svg
    fill={filled ? "url(#grad)" : "var(--stroke, #d1d5db)"}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{
      transition: "0.25s",
      cursor: isClickable ? "pointer" : "default",
      transform: isClickable ? "scale(1.02)" : "scale(1)",
    }}
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#06b6d4" }} />
        <stop offset="100%" style={{ stopColor: "#7c3aed" }} />
      </linearGradient>
    </defs>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Chip = ({ active, onClick, children }) => (
  <button className={`cc-chip ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const SkeletonCard = () => (
  <div className="card" style={{ padding: 18 }}>
    <div className="skeleton" style={{ width: 90, height: 90, borderRadius: 999, margin: "8px auto" }} />
    <div className="skeleton" style={{ width: "60%", height: 14, margin: "14px auto" }} />
    <div className="skeleton" style={{ width: "40%", height: 12, margin: "8px auto" }} />
    <div className="skeleton" style={{ width: "80%", height: 10, margin: "16px auto" }} />
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="cc-btn" style={{background: 'var(--stroke)', color: 'var(--muted)'}}>Cancel</button>
          <button onClick={onConfirm} className="cc-btn danger">Yes, Continue</button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// 🎓 FindSenior (revamped UI)
// ===============================
const FindSenior = ({ seniors, loading, colleges, tags }) => {
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = seniors
    .filter(
      (x) =>
        (!selectedCollege || x.college?._id === selectedCollege) &&
        (!selectedTag || x.tags?.some((t) => t._id === selectedTag)) &&
        (x.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          x.college?.name?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.price_per_session ?? 0) - (b.price_per_session ?? 0);
      if (sortBy === "price_desc") return (b.price_per_session ?? 0) - (a.price_per_session ?? 0);
      return (b.average_rating || 0) - (a.average_rating || 0);
    });

  return (
    <div className="page-wrapper">
      <div className="panel-wrap">
        <div style={{ display: "grid", gap: 10 }}>
          <input
            className="cc-input"
            type="text"
            placeholder="🔎 Search by name, college or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-row">
            <select className="cc-select" value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
              <option value="">🎓 All Colleges</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <select className="cc-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">⭐ Top Rated</option>
              <option value="price_asc">💰 Low Price</option>
              <option value="price_desc">💸 High Price</option>
            </select>
          </div>
          <div className="tag-chips-container">
            <Chip active={selectedTag === ""} onClick={() => setSelectedTag("")}>🏷️ All Tags</Chip>
            {tags.slice(0, 10).map((t) => (
              <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>{t.name}</Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-style-seniors">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => (
              <div key={p._id} className="card senior-card">
                <div className="image-wrapper">
                  <img src={p.avatar || "https://via.placeholder.com/100"} alt={p.user?.name} className="avatar" loading="lazy" />
                </div>
                <h3 className="name-style">{p.user?.name}</h3>
                <div className="rating-row rating-container">
                  {[...Array(5)].map((_, i) => (<StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} />))}
                  <span className="rating-count">{p.average_rating?.toFixed?.(1) ?? "0.0"} • {p.total_ratings || 0}</span>
                </div>
                <p className="college-style">{p.college?.name}</p>
                <div className="price-row">
                  <span className="price-text">₹{p.price_per_session || 0}</span>
                  <span className="small-chip">{p.session_duration_minutes || 20} min</span>
                </div>
                <Link to={`/book/${p.user._id}`} className="cc-btn primary">🚀 Book Session</Link>
              </div>
            ))
          : <div className="card" style={{ padding: 24, textAlign: "center" }}>No seniors found</div>
        }
      </div>
    </div>
  );
};

// ===============================
// 📘 MyBookings (With Time Lock Logic)
// ===============================
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState({ bookingId: null, value: 0 });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState({ bookingId: null, value: 0 });

  // 🕒 Time Check Logic (Video Call Button)
  const isClassTime = (booking) => {
    if (!booking.scheduledDate || !booking.startTime) return false;
    const now = new Date();
    
    // Parse scheduledDate
    const meetingStart = new Date(booking.scheduledDate);
    const [hours, minutes] = booking.startTime.split(':');
    
    // Set hours/minutes on meeting date
    meetingStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const meetingEnd = new Date(meetingStart.getTime() + 30 * 60000); // 30 mins later
    
    // Unlock 5 mins before start
    const unlockTime = new Date(meetingStart.getTime() - 5 * 60000);

    return now >= unlockTime && now <= meetingEnd;
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token) return;
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(sortedData);
      } catch (err) {
        toast.error("⚠️ Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleDispute = (id) => navigate(`/raise-dispute/${id}`);
  const handleChat = (id) => navigate(`/chat/${id}`);

  const openRatingModal = (bookingId, value) => {
    setRatingData({ bookingId, value });
    setModalOpen(true);
  }

  const handleRating = async () => {
    const { bookingId, value } = ratingData;
    if (!bookingId) { setModalOpen(false); return; }
    setModalOpen(false); 
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/ratings/submit/${bookingId}`,
        { rating: value },
        { headers: { "x-auth-token": token } }
      );
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, rated: true, rating: value } : b));
      toast.success(`⭐ Rated ${value} stars!`);
    } catch (err) {
      toast.error("⚠️ Failed to submit rating!");
    }
  };

  const renderBookingCard = (b) => {
    const dispute = b.dispute_status?.toLowerCase() || "none";
    const status = b.status?.toLowerCase();
    
    const seniorName = b.mentor?.name || "Senior";
    const seniorAvatar = b.mentor?.avatar || "https://via.placeholder.com/60";
    
    const callActive = isClassTime(b);

    return (
      <div key={b._id} className="card booking-card">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{seniorName}</h3>
            {/* Show scheduled time */}
            <div style={{marginTop: 8, display: 'flex', gap: 12, fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500}}>
              <span>📅 {new Date(b.scheduledDate).toLocaleDateString()}</span>
              <span>⏰ {b.startTime} - {b.endTime}</span>
            </div>
          </div>
          <img src={seniorAvatar} alt={seniorName} className="booking-avatar" />
        </div>

        <div className="status-row">
          <span className="status-tag status-confirmed">{b.status}</span>
          {dispute !== "none" && <span className="status-tag status-pending">{b.dispute_status}</span>}
        </div>

        {status === "confirmed" && (
          <div className="button-row">
            <button className="cc-btn primary btn-compact" onClick={() => handleChat(b._id)}>💬 Chat</button>
            
            {/* 🚀 LOCKED VIDEO BUTTON */}
            <a 
              href={callActive ? `/video-call/${b.meetingLink}` : "#"}
              className={`cc-btn btn-compact ${callActive ? "success" : ""}`}
              style={{
                background: callActive ? '' : 'var(--stroke)',
                color: callActive ? '' : 'var(--muted)',
                cursor: callActive ? 'pointer' : 'not-allowed',
                pointerEvents: callActive ? 'auto' : 'none'
              }}
            >
              {callActive ? "📹 Join Video Call" : "⏳ Call Locked"}
            </a>
          </div>
        )}

        {status === "completed" && !b.rated && (
          <div className="rating-section">
            <p className="rating-prompt">Rate this session:</p>
            <div className="rating-stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })} onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })} onClick={() => openRatingModal(b._id, star)}>
                  <StarIcon filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)} size={30} isClickable={true} />
                </span>
              ))}
            </div>
          </div>
        )}

        {dispute === "none" && !b.rated && status !== "completed" && (
          <div style={{marginTop: 12, borderTop: '1px solid var(--stroke)', paddingTop: 12}}>
             <button className="cc-btn danger btn-compact" onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="grid-style-bookings">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>;

  return (
    <div className="page-wrapper">
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleRating} title="Confirm Rating">
        <p>Once you rate this senior, you cannot raise a dispute. Confirm {ratingData.value} Stars?</p>
      </ConfirmModal>
      <h2 className="title-style">📘 My Bookings</h2>
      <div className="grid-style-bookings">
        {bookings.length > 0 ? bookings.map(renderBookingCard) : <div className="card" style={{ padding: 40, textAlign: "center" }}>No bookings yet.</div>}
      </div>
    </div>
  );
};

// ===============================
// 🌈 Main Dashboard Shell
// ===============================
const StudentDashboard = () => {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes("/bookings");
  const [theme, setTheme] = useState('light');
  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  
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
        setSeniors(s.data); setColleges(c.data); setTags(t.data);
      } catch { toast.error("⚠️ Unable to load data"); } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  return (
    <div className={`page-bg ${theme}`}>
      <style>{`/* Keep your Global Styles Here (omitted for brevity) */`}</style>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="main-container">
        <div className="tab-bar">
          <Link to="/student-dashboard" className={`cc-tab ${!onBookingsTab ? "active" : ""}`}>🎓 Find Seniors</Link>
          <Link to="/student-dashboard/bookings" className={`cc-tab ${onBookingsTab ? "active" : ""}`}>📘 My Bookings</Link>
          <button onClick={toggleTheme} className="theme-toggle-btn">{theme === 'light' ? '🌙' : '☀️'}</button>
        </div>
        <Routes>
          <Route path="/" element={<FindSenior seniors={seniors} loading={loading} colleges={colleges} tags={tags} />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;