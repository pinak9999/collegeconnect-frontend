import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// ===============================
// 🔮 Global CSS (Light + Dark Themes)
// ===============================
const globalStyles = `
@keyframes floatUp { 0%{transform:translateY(0)} 50%{transform:translateY(-4px)} 100%{transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

:root{
  --bg: #f4fcf6ff; --card: #ffffff; --panel: #ffffffcc; --stroke: #e5e7eb; --txt: #1f2937; --muted: #6b7280;
  --brand1: #7c3aed; --brand2: #06b6d4; --ok: #16a34a; --warn: #f59e0b; --danger: #ef4444;
  --bg-gradient: linear-gradient(180deg, #f4f7fc 0%, #f4f7fc 100%);
  --panel-bg: #ffffffcc; --input-bg: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  --tab-bg: #f3f4f6; --tab-hover-bg: #e5e7eb; --info-bg: #eff6ff; --info-color: #3b82f6;
  --rating-bg: #f9fafb; --rating-prompt-color: var(--brand1); --rated-bg: #f0fdf4; --rated-color: #166534;
  --dispute-color: #fca5a5; --modal-bg: #ffffff;
}

.dark {
  --bg: #0b1220; --card: #0f172a99; --panel: #101827cc; --stroke: #27324a; --txt: #e5e7eb; --muted: #9aa3b2;
  --brand1: #7c3aed; --brand2: #06b6d4; --ok: #16a34a; --warn: #f59e0b; --danger: #ef4444;
  --bg-gradient: linear-gradient(180deg, #050816 0%, #0b1220 100%);
  --panel-bg: #101827cc; --input-bg: linear-gradient(180deg, #0b1220 0%, #0b1220 60%, #0d1628 100%);
  --tab-bg: linear-gradient(180deg,#0e1628,#0b1323); --tab-hover-bg: linear-gradient(180deg,#0e1628,#0b1323); 
  --info-bg: linear-gradient(180deg, #0e1b31, #0b1426); --info-color: #c7d2fe;
  --rating-bg: linear-gradient(180deg, #0e1628, #0b1323); --rating-prompt-color: #c7d2fe;
  --rated-bg: linear-gradient(180deg, #0d1a2f, #0a1324); --rated-color: #86efac; --dispute-color: #fca5a5;
  --modal-bg: linear-gradient(145deg, #0f172a, #0b1220);
}

* { outline: none; box-sizing: border-box; }
.page-bg { min-height: 100vh; background: radial-gradient(1000px 400px at -10% -10%, rgba(124,58,237,.25), transparent 60%), radial-gradient(800px 350px at 110% 0%, rgba(6,182,212,.22), transparent 60%), var(--bg-gradient); background-color: var(--bg); font-family: "Poppins", sans-serif; transition: background 0.3s ease, color 0.3s ease; }
.main-container { max-width: 1180px; margin: 0 auto; padding: 20px 16px 60px; }
.page-wrapper { padding: 8px; color: var(--txt); animation: fadeIn 0.4s ease-out; }
.small-muted { color: var(--muted); font-size: .9rem; }

.cc-input, .cc-select { border:1px solid var(--stroke); background: var(--input-bg); color:var(--txt); border-radius:14px; padding:12px 16px; width:100%; transition:.25s border-color, .25s box-shadow; font-family: "Poppins", sans-serif; font-size: 1rem; }
.cc-input:focus, .cc-select:focus { border-color: #7dd3fc; box-shadow: 0 0 0 4px rgba(125,211,252,.15); transform: translateY(-1px); }

.cc-tab { border:1px solid var(--stroke); border-radius:12px; padding:10px 16px; font-weight:700; text-decoration:none; color:var(--txt); background: var(--tab-bg); transition:.25s transform,.25s box-shadow,.25s background; display:inline-block; }
.cc-tab.active { background: linear-gradient(90deg, var(--brand1), var(--brand2)); box-shadow: 0 8px 22px rgba(6,182,212,.25); color: white; border-color: transparent; }
.cc-tab:not(.active):hover { transform: translateY(-2px); background: var(--tab-hover-bg); }

.cc-btn { border:none; cursor:pointer; border-radius:12px; padding:10px 16px; font-weight:700; color:white; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition: transform .2s ease, box-shadow .2s ease; justify-content: center; }
.cc-btn:active { transform: translateY(1px) scale(.99) }
.cc-btn.primary { background: linear-gradient(120deg, var(--brand2), var(--brand1)); box-shadow: 0 8px 22px rgba(124,58,237,.25); }
.cc-btn.danger { background: linear-gradient(120deg, #fb7185, var(--danger)); box-shadow: 0 8px 22px rgba(239,68,68,.25); }
.cc-btn.success { background: linear-gradient(120deg, #10b981, #059669); box-shadow: 0 8px 22px rgba(16,185,129,.25); }
.cc-btn.disabled { background: var(--stroke); color: var(--muted); cursor: not-allowed; box-shadow: none; }

.cc-chip { border:1px solid var(--stroke); color:var(--muted); background: var(--tab-bg); border-radius:999px; padding:8px 12px; font-weight:600; cursor:pointer; margin: 4px; transition: .2s; }
.cc-chip.active { color:white; border-color: transparent; background: linear-gradient(90deg, var(--brand1), var(--brand2)); }

.card { background: var(--card); backdrop-filter: blur(12px); border:1px solid var(--stroke); border-radius:18px; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.dark .card { box-shadow: 0 30px 60px rgba(2,6,23,.35); } .light .card { box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
.card:hover { transform: translateY(-2px); border-color: var(--brand2); }

.skeleton { background: linear-gradient(90deg, #0d1526 25%, #111b31 50%, #0d1526 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite linear; border-radius: 10px; }
.light .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }

.tab-bar { display: flex; gap: 12px; padding: 10px; border-radius: 16px; background: var(--panel-bg); border: 1px solid var(--stroke); margin-bottom: 18px; position: sticky; top: 12px; z-index: 5; backdrop-filter: blur(10px); align-items: center; }
.theme-toggle-btn { height: 40px; width: 40px; border-radius: 10px; border: 1px solid var(--stroke); background: var(--tab-bg); color: var(--txt); font-size: 1.25rem; cursor: pointer; margin-left: auto; display: flex; align-items: center; justify-content: center; }

.title-style { text-align: left; color: var(--txt); margin-bottom: 16px; font-weight: 900; font-size: 1.4rem; }
.section-title-style { color: var(--txt); font-weight: 800; font-size: 1.15rem; margin: 10px 0 10px 2px; border-left: 3px solid var(--brand1); padding-left: 10px; }

/* Booking Card Specifics */
.grid-style-bookings { display: grid; grid-template-columns: 1fr; gap: 16px; }
.booking-card { padding: 18px; }
.booking-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--stroke); padding-bottom: 12px; gap: 12px; }
.booking-card .booking-name { color: var(--txt); font-weight: 800; font-size: 1.1rem; margin: 0; }
.booking-card .booking-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(124,58,237,.45); }
.status-tag { padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: .78rem; text-transform: capitalize; border: 1px solid transparent; margin-right: 6px; }
.status-confirmed { background: rgba(99,102,241,.15); color: #a5b4fc; } .light .status-confirmed { background: #e0e7ff; color: #4f46e5; }
.status-completed { background: rgba(34,197,94,.15); color: #86efac; } .light .status-completed { background: #dcfce7; color: #166534; }
.status-pending { background: rgba(245,158,11,.15); color: #fde68a; } .light .status-pending { background: #fef9c3; color: #a16207; }
.status-cancelled { background: rgba(239,68,68,.15); color: #fca5a5; } .light .status-cancelled { background: #fee2e2; color: #b91c1c; }

.info-message { background: var(--info-bg); color: var(--info-color); padding: 12px; border-radius: 10px; font-size: .95rem; font-weight: 600; border: 1px solid var(--stroke); margin-top: 10px; }
.button-row { display: flex; gap: 10px; margin-top: 12px; padding-top: 14px; border-top: 1px solid var(--stroke); flex-wrap: wrap; }
.btn-compact { font-size: .9rem; padding: 8px 14px; }

/* Modal */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s; }
.modal-content { background: var(--modal-bg); border: 1px solid var(--stroke); border-radius: 16px; width: 90%; max-width: 450px; padding: 20px; animation: slideIn 0.3s; color: var(--txt); }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

@media (max-width: 640px) {
  .main-container { padding: 8px 8px 40px; }
  .tab-bar { overflow-x: auto; }
  .filter-row { grid-template-columns: 1fr; }
}
`;

// 🌟 Star Icon
const StarIcon = ({ filled, size = 24, isClickable = false }) => (
  <svg fill={filled ? "url(#grad)" : "var(--stroke, #d1d5db)"} width={size} height={size} viewBox="0 0 24 24" style={{ transition: "0.25s", cursor: isClickable ? "pointer" : "default", transform: isClickable ? "scale(1.02)" : "scale(1)" }}>
    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{ stopColor: "#06b6d4" }} /><stop offset="100%" style={{ stopColor: "#7c3aed" }} /></linearGradient></defs>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Chip = ({ active, onClick, children }) => (<button className={`cc-chip ${active ? "active" : ""}`} onClick={onClick}>{children}</button>);
const SkeletonCard = () => (<div className="card" style={{ padding: 18 }}><div className="skeleton" style={{ width: 90, height: 90, borderRadius: 999, margin: "8px auto" }} /><div className="skeleton" style={{ width: "60%", height: 14, margin: "14px auto" }} /></div>);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div>{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="cc-btn" style={{background: 'var(--stroke)', color: 'var(--muted)'}}>Cancel</button>
          <button onClick={onConfirm} className="cc-btn danger">Confirm</button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// 🎓 FindSenior Component
// ===============================
const FindSenior = ({ seniors, loading, colleges, tags }) => {
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = seniors
    .filter(x => (!selectedCollege || x.college?._id === selectedCollege) && (!selectedTag || x.tags?.some(t => t._id === selectedTag)) && (x.user?.name?.toLowerCase().includes(search.toLowerCase()) || x.college?.name?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "price_asc" ? (a.price_per_session || 0) - (b.price_per_session || 0) : (b.average_rating || 0) - (a.average_rating || 0));

  return (
    <div className="page-wrapper">
      <div className="card" style={{ padding: 14, marginBottom: 16 }}>
        <input className="cc-input" type="text" placeholder="🔎 Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} style={{marginBottom: 10}}/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          <select className="cc-select" value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}><option value="">🎓 All Colleges</option>{colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select>
          <select className="cc-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="rating">⭐ Top Rated</option><option value="price_asc">💰 Low Price</option></select>
        </div>
        <div style={{marginTop: 10}}><Chip active={selectedTag === ""} onClick={() => setSelectedTag("")}>🏷️ All</Chip>{tags.slice(0, 5).map(t => <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>{t.name}</Chip>)}</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16}}>
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : filtered.length > 0 ? filtered.map(p => (
          <div key={p._id} className="card" style={{padding:18, textAlign:'center'}}>
            <img src={p.avatar || "https://via.placeholder.com/100"} alt={p.user?.name} style={{width:90, height:90, borderRadius:'50%', objectFit:'cover', margin:'0 auto', border:'3px solid var(--brand1)'}} />
            <h3 style={{color:'var(--txt)', margin:'10px 0 5px'}}>{p.user?.name}</h3>
            <p style={{color:'var(--muted)', fontSize:'.9rem'}}>{p.college?.name}</p>
            <div style={{display:'flex', justifyContent:'center', gap:5, margin:'10px 0'}}>
              <span style={{color:'var(--ok)', fontWeight:700}}>₹{p.price_per_session}</span>
              <span style={{color:'var(--muted)'}}>• {p.session_duration_minutes} min</span>
            </div>
            <Link to={`/book/${p.user._id}`} className="cc-btn primary" style={{width:'100%'}}>🚀 Book Session</Link>
          </div>
        )) : <div style={{textAlign:'center', padding:20, color:'var(--muted)'}}>No seniors found.</div>}
      </div>
    </div>
  );
};

// ===============================
// 📘 MyBookings (Fixed Logic)
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
    const meetingStart = new Date(booking.scheduledDate);
    const [h, m] = booking.startTime.split(':');
    meetingStart.setHours(parseInt(h), parseInt(m), 0);
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
        
        console.log("📡 Fetching bookings...");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        console.log("✅ Data:", res.data);
        setBookings(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  if (loading) return <div className="grid-style-bookings">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>;

  const activeBookings = bookings.filter(b => b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled");
  const pastBookings = bookings.filter(b => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "cancelled");

  const renderBookingCard = (b) => {
    const dispute = b.dispute_status?.toLowerCase() || "none";
    const status = b.status?.toLowerCase();
    const seniorName = b.mentor?.name || b.senior?.name || "Senior Mentor"; // Fixed: check both keys
    const seniorAvatar = b.mentor?.avatar || b.senior?.avatar || "https://via.placeholder.com/60";
    const callActive = isClassTime(b);

    return (
      <div key={b._id} className="card booking-card">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{seniorName}</h3>
            <div style={{marginTop: 6, fontSize: '0.9rem', color: 'var(--muted)'}}>
              <span>📅 {new Date(b.scheduledDate).toLocaleDateString()}</span>
              <span style={{marginLeft: 10}}>⏰ {b.startTime} - {b.endTime}</span>
            </div>
          </div>
          <img src={seniorAvatar} alt={seniorName} className="booking-avatar" />
        </div>

        <div style={{display:'flex', gap:10, marginTop:10}}>
          <span className={`status-tag ${status === 'confirmed' ? 'status-confirmed' : status === 'completed' ? 'status-completed' : 'status-pending'}`}>{status}</span>
          {dispute !== "none" && <span className="status-tag status-cancelled">{b.dispute_status}</span>}
        </div>

        {status === "confirmed" && (
          <div className="button-row">
            <button className="cc-btn primary btn-compact" onClick={() => handleChat(b._id)}>💬 Chat</button>
            <a 
              href={callActive ? `/video-call/${b.meetingLink}` : "#"} 
              target={callActive ? "_blank" : "_self"}
              className={`cc-btn btn-compact ${callActive ? "success" : "disabled"}`}
              style={{pointerEvents: callActive ? 'auto' : 'none'}}
            >
              {callActive ? "📹 Join Video Call" : "⏳ Call Locked"}
            </a>
          </div>
        )}

        {status === "completed" && !b.rated && (
          <div style={{marginTop:12, padding:10, background:'var(--rating-bg)', borderRadius:10, textAlign:'center'}}>
            <p style={{margin:'0 0 5px', fontWeight:700, color:'var(--brand1)'}}>Rate Session:</p>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })} onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })} onClick={() => openRatingModal(b._id, star)}>
                <StarIcon filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)} size={28} isClickable={true} />
              </span>
            ))}
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

  return (
    <div className="page-wrapper">
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleRating} title="Confirm Rating">
        <p>Once you rate this senior, you cannot raise a dispute. Confirm {ratingData.value} Stars?</p>
      </ConfirmModal>
      <h2 className="title-style">📘 My Bookings</h2>
      
      {bookings.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <h3>No bookings yet.</h3>
          <p style={{color:'var(--muted)'}}>Find a senior and book your first session!</p>
          <button onClick={() => window.location.href='/student-dashboard'} className="cc-btn primary" style={{marginTop: 15}}>Find Mentor</button>
        </div>
      )}

      {activeBookings.length > 0 && (
        <>
          <h3 className="section-title-style">Upcoming Sessions</h3>
          <div className="grid-style-bookings">{activeBookings.map(renderBookingCard)}</div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h3 className="section-title-style" style={{marginTop:20}}>Past Sessions</h3>
          <div className="grid-style-bookings">{pastBookings.map(renderBookingCard)}</div>
        </>
      )}
    </div>
  );
};

// ===============================
// 🌈 Main Dashboard
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
      <style>{globalStyles}</style>
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