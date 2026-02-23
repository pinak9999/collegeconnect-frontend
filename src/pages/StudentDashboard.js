import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ======================================
// 🔮 Reapify by Pinak - Dreamy UI CSS 
// ======================================
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
@keyframes twinkle { 0% { opacity: 0.5; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.5; transform: scale(0.8); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

:root {
  --bg-dreamy: linear-gradient(180deg, #f4e8ff 0%, #e0f2fe 50%, #fef2f2 100%);
  --hero-grad: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  --card-bg: rgba(255, 255, 255, 0.95);
  --panel-bg: rgba(255, 255, 255, 0.85);
  
  --brand-purple: #8b5cf6;
  --brand-purple-dark: #6d28d9;
  --brand-button: linear-gradient(90deg, #8b5cf6, #c084fc);
  --brand-button-hover: linear-gradient(90deg, #7c3aed, #a855f7);
  
  --txt-main: #1e293b;
  --txt-purple: #5b21b6;
  --txt-muted: #64748b;
  --stroke: #e2e8f0;
  
  --price-green: #10b981;
  --price-bg: #ecfdf5;
  
  --shadow-soft: 0 8px 20px rgba(139, 92, 246, 0.08);
  --shadow-card: 0 10px 25px rgba(0, 0, 0, 0.05), 0 0 15px rgba(139, 92, 246, 0.1);
  --shadow-hover: 0 15px 35px rgba(139, 92, 246, 0.15), 0 0 20px rgba(139, 92, 246, 0.2);
}

.dark {
  --bg-dreamy: linear-gradient(180deg, #1e1b4b 0%, #0f172a 50%, #171717 100%);
  --card-bg: rgba(30, 41, 59, 0.85);
  --panel-bg: rgba(30, 41, 59, 0.75);
  --txt-main: #f8fafc;
  --txt-purple: #c4b5fd;
  --txt-muted: #94a3b8;
  --stroke: rgba(139, 92, 246, 0.3);
  --price-bg: rgba(16, 185, 129, 0.2);
}

* { outline: none; box-sizing: border-box; }
body { margin: 0; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; }

/* Magical Starry Background */
.page-bg {
  min-height: 100vh;
  background: var(--bg-dreamy);
  color: var(--txt-main);
  position: relative;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.stars-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(3px 3px at 90px 40px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.6;
}

.main-container { max-width: 1100px; margin: 0 auto; padding: 20px 16px 80px; position: relative; z-index: 1; }
.page-wrapper { animation: fadeIn 0.4s ease-out forwards; }

/* Top Navbar / Tabs */
.top-nav-bar {
  display: flex; justify-content: space-between; align-items: center;
  background: #0f172a; border-radius: 16px; padding: 12px 24px;
  margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.brand-logo { color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; }
.nav-actions { display: flex; gap: 12px; }

.tab-bar-floating { 
  display: flex; gap: 12px; padding: 6px; border-radius: 16px; 
  background: var(--panel-bg); border: 1px solid var(--stroke); 
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); 
  align-items: center; justify-content: center; width: max-content; margin: 0 auto 24px;
  box-shadow: var(--shadow-soft);
}
.cc-tab { 
  border: none; border-radius: 12px; padding: 10px 20px; font-weight: 600; font-size: 0.95rem;
  text-decoration: none; color: var(--txt-muted); background: transparent; 
  transition: all 0.3s ease; display: flex; align-items: center; gap: 6px;
}
.cc-tab.active { background: var(--brand-button); color: white; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
.cc-tab:not(.active):hover { color: var(--brand-purple); background: rgba(139, 92, 246, 0.1); }

/* Hero Banner (As seen in image) */
.hero-banner {
  background: url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000') center/cover;
  border-radius: 24px; padding: 40px; margin-bottom: 24px; position: relative;
  overflow: hidden; box-shadow: var(--shadow-card);
  display: flex; flex-direction: column; justify-content: center; min-height: 220px;
}
.hero-banner::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(139,92,246,0.8) 0%, rgba(236,72,153,0.6) 100%);
}
.hero-content { position: relative; z-index: 1; color: white; text-align: left; }
.hero-content h1 { font-size: 2.2rem; font-weight: 800; margin: 0 0 8px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.hero-content p { font-size: 1.1rem; font-weight: 500; margin: 0; line-height: 1.4; }
.hero-content strong { font-weight: 800; }

/* Search & Filters */
.filter-panel { background: var(--panel-bg); border-radius: 20px; padding: 20px; box-shadow: var(--shadow-card); margin-bottom: 24px; border: 1px solid var(--stroke); backdrop-filter: blur(12px); }
.search-wrapper { position: relative; margin-bottom: 12px; }
.cc-input { 
  border: 1px solid var(--stroke); background: white; color: var(--txt-main); 
  border-radius: 12px; padding: 14px 16px 14px 40px; width: 100%; 
  transition: all 0.3s ease; font-family: 'Poppins', sans-serif; font-size: 0.95rem; 
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--brand-purple); }
.cc-input:focus { border-color: var(--brand-purple); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }

.filter-row { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
.cc-select {
  border: 1px solid var(--stroke); background: white; color: var(--txt-main); 
  border-radius: 12px; padding: 12px 16px; width: 100%; font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
}

.tag-chips-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; align-items: center; }
.cc-chip { 
  border: 1px solid var(--stroke); color: var(--txt-muted); background: white; 
  border-radius: 20px; padding: 6px 14px; font-weight: 500; font-size: 0.85rem; 
  cursor: pointer; transition: all 0.2s ease;
}
.cc-chip:hover { border-color: var(--brand-purple); color: var(--brand-purple); }
.cc-chip.active { color: white; background: var(--brand-button); border-color: transparent; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3); }

/* Senior Cards (Exact Match to Image) */
.grid-style-seniors { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.senior-card { 
  background: var(--card-bg); border: 1px solid var(--stroke); border-radius: 24px; 
  padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center;
  box-shadow: var(--shadow-card); transition: all 0.3s ease; backdrop-filter: blur(10px);
}
.senior-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: rgba(139, 92, 246, 0.4); }

.senior-card .avatar-ring {
  width: 86px; height: 86px; border-radius: 50%; padding: 3px;
  background: var(--brand-button); margin-bottom: 16px;
}
.senior-card .avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid white; }

.senior-card .name-style { color: var(--txt-purple); font-weight: 700; font-size: 1.15rem; margin: 0 0 4px 0; }
.senior-card .college-style { color: var(--txt-muted); font-size: 0.85rem; margin: 0 0 8px 0; font-weight: 500; }
.senior-card .rating-container { display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 12px; }
.senior-card .rating-count { color: var(--txt-muted); font-weight: 600; font-size: 0.85rem; }
.senior-card .bio-style { color: var(--txt-muted); font-size: 0.8rem; margin: 0 0 16px 0; font-style: italic; }

.senior-card .price-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
.senior-card .price-text { background: var(--price-bg); color: var(--price-green); padding: 4px 12px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; }
.senior-card .small-chip { background: transparent; border: 1px solid var(--stroke); color: var(--txt-main); padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 0.85rem; }

.cc-btn { 
  border: none; cursor: pointer; border-radius: 12px; padding: 12px 24px; width: 100%;
  font-weight: 600; font-size: 0.95rem; text-decoration: none; display: inline-flex; 
  align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; 
}
.cc-btn:active { transform: scale(0.97); }
.cc-btn.primary { background: var(--brand-button); color: white; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); }
.cc-btn.primary:hover { background: var(--brand-button-hover); box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4); }

/* Footer Highlights */
.footer-highlights {
  display: flex; justify-content: center; flex-wrap: wrap; gap: 16px;
  background: var(--panel-bg); border-radius: 16px; padding: 16px 24px;
  margin-top: 32px; box-shadow: var(--shadow-card); border: 1px solid var(--stroke);
  backdrop-filter: blur(12px); font-size: 0.9rem; font-weight: 500; color: var(--txt-main);
}
.highlight-item { display: flex; align-items: center; gap: 6px; }
.highlight-item span { color: #f59e0b; }

/* Bookings Card Styling */
.grid-style-bookings { display: grid; grid-template-columns: 1fr; gap: 20px; }
.booking-card { padding: 24px; background: var(--card-bg); border-radius: 24px; border: 1px solid var(--stroke); box-shadow: var(--shadow-card); }
.booking-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--stroke); padding-bottom: 16px; margin-bottom: 16px; }
.booking-card .booking-name { color: var(--txt-purple); font-weight: 700; font-size: 1.15rem; margin: 0 0 4px 0; }
.booking-card .booking-college { color: var(--txt-muted); font-size: 0.9rem; margin: 0; }
.booking-card .booking-year-style { color: var(--brand-purple); font-size: 0.85rem; font-weight: 600; margin: 4px 0 0 0; }
.booking-card .booking-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--brand-purple); }
.booking-card .status-row { display: flex; gap: 8px; margin-bottom: 16px; }
.booking-card .status-tag { padding: 6px 14px; border-radius: 12px; font-weight: 600; font-size: 0.8rem; text-transform: capitalize; }
.status-confirmed { background: rgba(139,92,246,0.1); color: var(--brand-purple); }
.status-completed { background: var(--price-bg); color: var(--price-green); }
.status-pending { background: #fef3c7; color: #d97706; }
.status-cancelled { background: #fee2e2; color: #ef4444; }

.info-message { background: rgba(139,92,246,0.05); color: var(--txt-purple); padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 500; border: 1px solid rgba(139,92,246,0.1); margin-bottom: 16px; }
.rating-section { background: #fafafa; border-radius: 16px; padding: 20px; text-align: center; border: 1px dashed var(--stroke); margin-bottom: 16px; }
.rating-prompt { font-weight: 600; color: var(--txt-main); margin: 0 0 12px 0; }
.rating-stars-container { display: flex; justify-content: center; gap: 6px; }

/* Modals */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.2s ease; }
.modal-content { background: var(--card-bg); border-radius: 24px; width: 90%; max-width: 400px; padding: 24px; text-align: center; box-shadow: var(--shadow-hover); }
.modal-title { color: var(--txt-purple); margin: 0 0 16px 0; font-size: 1.2rem; font-weight: 700; }
.modal-body { color: var(--txt-main); font-size: 0.95rem; margin-bottom: 24px; }
.modal-footer { display: flex; gap: 12px; justify-content: center; }

@media (max-width: 640px) {
  .hero-banner { padding: 24px; text-align: center; min-height: auto; }
  .hero-content h1 { font-size: 1.6rem; }
  .hero-content p { font-size: 0.95rem; }
  .filter-row { grid-template-columns: 1fr; }
  .footer-highlights { flex-direction: column; align-items: center; }
  .booking-header { flex-direction: column-reverse; text-align: center; gap: 16px; }
}
`;

const StarIcon = ({ filled, size = 18, isClickable = false }) => (
  <svg
    fill={filled ? "#f59e0b" : "#e2e8f0"}
    width={size} height={size} viewBox="0 0 24 24"
    style={{ transition: "all 0.2s", cursor: isClickable ? "pointer" : "default", transform: isClickable ? "scale(1.1)" : "scale(1)" }}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Chip = ({ active, onClick, children }) => (
  <button className={`cc-chip ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const SkeletonCard = () => (
  <div className="senior-card" style={{opacity: 0.7}}>
    <div className="avatar-ring" style={{background: '#e2e8f0'}} />
    <div style={{width: '60%', height: '16px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px'}} />
    <div style={{width: '40%', height: '12px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px'}} />
    <div style={{width: '100%', height: '40px', background: '#e2e8f0', borderRadius: '12px', marginTop: 'auto'}} />
  </div>
);

// ===============================
// 🎓 FindSenior 
// ===============================
const FindSenior = ({ seniors, loading, colleges, tags, platformFee }) => {
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
      {/* 🚀 Hero Banner Matching the Image */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to Reapify</h1>
          <p>Connect with <strong>Top Seniors</strong>,<br/>True Guidance for Success</p>
        </div>
      </div>

      <div className="filter-panel">
        <div className="search-wrapper">
          <span className="search-icon">🔎</span>
          <input
            className="cc-input"
            type="text"
            placeholder="Search by name, college or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
          <Chip active={selectedTag === ""} onClick={() => setSelectedTag("")}>
            🚀 All Tags
          </Chip>
          {tags.slice(0, 10).map((t) => (
            <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>
              {t.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid-style-seniors">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => {
              const seniorName = p.user?.name || 'Senior';
              const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=8b5cf6&color=fff&size=150&font-size=0.4&bold=true`;

              return (
                <div key={p._id} className="senior-card">
                  <div className="avatar-ring">
                    <img
                      src={p.avatar || fallbackImage}
                      alt={seniorName}
                      className="avatar"
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                    />
                  </div>

                  <h3 className="name-style">{seniorName}</h3>
                  <div className="rating-container">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} size={14} />
                    ))}
                    <span className="rating-count">{p.average_rating?.toFixed?.(1) ?? "0.0"} • {p.total_ratings || 0}</span>
                  </div>

                  <p className="bio-style">Please ask Admin to update this profile.</p>

                  <div className="price-row">
                    <span className="price-text">₹{(p.price_per_session || 0) + platformFee}</span>
                    <span className="small-chip">{p.session_duration_minutes || 20} min</span>
                  </div>

                  <Link to={`/book/${p.user._id}`} className="cc-btn primary">
                    🚀 Book Session
                  </Link>
                </div>
              );
            })
          : (
            <div className="filter-panel" style={{gridColumn: '1/-1', textAlign: 'center'}}>
              <h3 style={{color: 'var(--txt-purple)'}}>No seniors found</h3>
              <p className="small-muted">Try adjusting filters or search keywords.</p>
            </div>
          )}
      </div>

      {/* Trust Highlights Bottom */}
      <div className="footer-highlights">
        <div className="highlight-item"><span>⭐</span> Verified Senior Mentors</div>
        <div className="highlight-item" style={{borderLeft: '1px solid var(--stroke)', borderRight: '1px solid var(--stroke)', padding: '0 16px'}}><span>⭐</span> Trusted by 1000+ Students</div>
        <div className="highlight-item"><span>⭐</span> 24/7 Support</div>
      </div>
    </div>
  );
};

// ===============================
// 📘 MyBookings 
// ===============================
const MyBookings = ({ seniors }) => {
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
        setBookings(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  const [modalOpen, setModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState({ bookingId: null, seniorId: null, value: 0 });

  const openRatingModal = (bookingId, seniorId, value) => {
    setRatingData({ bookingId, seniorId, value });
    setModalOpen(true);
  }

  const handleRating = async () => {
    const { bookingId, seniorId, value } = ratingData;
    if (!bookingId) { setModalOpen(false); return; }
    setModalOpen(false); 

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/ratings/submit/${bookingId}`,
        { rating: value },
        { headers: { "x-auth-token": token } }
      );

      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, rated: true, rating: value, dispute_status: "not_allowed" } : b )
      );
      toast.success(`⭐ You rated ${value} stars!`);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to submit rating!";
      toast.error(`⚠️ ${errorMsg}`);
    }
  };

  const getStatusTagClass = (status) => {
    const base = "status-tag";
    switch ((status || "").toLowerCase()) {
      case "confirmed": return `${base} status-confirmed`;
      case "completed": return `${base} status-completed`;
      case "pending":   return `${base} status-pending`;
      case "cancelled": return `${base} status-cancelled`;
      default:          return base;
    }
  };

  const getDisputeTagClass = (dispute) => {
    const d = (dispute || "").toLowerCase();
    if (d === "pending")  return "status-tag status-pending";
    if (d === "resolved") return "status-tag status-completed";
    return null;
  };

  const getYearSuffix = (year) => {
    if (!year) return null;
    const num = parseInt(year, 10);
    if (isNaN(num)) return year;
    if (num === 1) return "1st Year";
    if (num === 2) return "2nd Year";
    if (num === 3) return "3rd Year";
    return `${num}th Year`;
  };

  const renderBookingCard = (b) => {
    const dispute = b.dispute_status?.toLowerCase() || "none";
    const status = b.status?.toLowerCase();
    const disputeTagClass = getDisputeTagClass(dispute);
    
    const seniorProfile = seniors.find((s) => s.user?._id === b.senior?._id);
    const seniorName = b.senior?.name || 'Senior';
    const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=8b5cf6&color=fff&size=150&font-size=0.4&bold=true`;
    const finalAvatar = seniorProfile?.avatar || b.profile?.avatar || fallbackImage;
    const yearText = getYearSuffix(b.profile?.year);

    return (
      <div key={b._id} className="booking-card">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{seniorName}</h3>
            <p className="booking-college">{b.profile?.college?.name}</p>
            {yearText && <p className="booking-year-style">{yearText}</p>}
          </div>
          <img
            src={finalAvatar}
            alt={seniorName}
            className="booking-avatar"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          />
        </div>

        <div className="status-row">
          <span className={getStatusTagClass(status)}>{b.status}</span>
          {disputeTagClass && <span className={disputeTagClass}>{b.dispute_status}</span>}
        </div>

        {status === "confirmed" && (
          <p className="info-message">ℹ️ The senior will contact you on your phone within 6 hours.</p>
        )}

        {status === "completed" && !b.rated && (
          <div className="rating-section">
            <p className="rating-prompt">Rate this session:</p>
            <div className="rating-stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })}
                  onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })}
                  onClick={() => openRatingModal(b._id, b.senior?._id, star)}
                >
                  <StarIcon filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)} size={28} isClickable={true} />
                </span>
              ))}
            </div>
          </div>
        )}
        
        {b.rated && (
          <div className="status-row" style={{background: 'var(--price-bg)', padding: '10px', borderRadius: '12px', display: 'inline-flex'}}>
            <span style={{color: 'var(--price-green)', fontWeight: 600}}>You rated:</span>
            <div style={{display:'flex', gap:'2px'}}>
              {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < b.rating} size={16} />)}
            </div>
          </div>
        )}

        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px'}}>
          {status === "confirmed" && <button className="cc-btn primary" style={{width:'auto'}} onClick={() => handleChat(b._id)}>💬 Chat</button>}
          {dispute === "none" && !b.rated && <button className="cc-btn" style={{background:'#fee2e2', color:'#ef4444', width:'auto'}} onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>}
          {(dispute === "not_allowed" || b.rated) && dispute !== "pending" && dispute !== "resolved" && (
            <span style={{color:'var(--txt-muted)', fontSize:'0.85rem', alignSelf:'center'}}>🚫 Dispute not allowed after rating.</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="grid-style-bookings">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>;

  const activeBookings = bookings.filter((b) => b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled");
  const pastBookings = bookings.filter((b) => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "cancelled");

  return (
    <div className="page-wrapper">
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleRating} title="⚠️ Confirm Rating">
        Once you rate this senior, you cannot raise a dispute.<br /><br />
        Are you sure you want to give a rating of <strong>{ratingData.value} {ratingData.value > 1 ? "stars" : "star"}</strong>?
      </ConfirmModal>
    
      <h2 style={{color: 'var(--txt-purple)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '24px'}}>📘 My Bookings</h2>

      {bookings.length === 0 && (
        <div className="filter-panel" style={{textAlign: 'center'}}>
          <div style={{fontWeight: 700, color: 'var(--txt-main)', fontSize: '1.1rem'}}>You haven't booked any sessions yet.</div>
          <div className="small-muted">Find a senior and schedule your first session.</div>
        </div>
      )}

      {activeBookings.length > 0 && (
        <><h3 style={{color:'var(--txt-main)', marginBottom:'16px'}}>Ongoing & Active</h3><div className="grid-style-bookings">{activeBookings.map(renderBookingCard)}</div></>
      )}

      {pastBookings.length > 0 && (
        <><h3 style={{color:'var(--txt-main)', margin:'32px 0 16px 0'}}>Completed & Past</h3><div className="grid-style-bookings">{pastBookings.map(renderBookingCard)}</div></>
      )}
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="cc-btn" style={{background: 'var(--stroke)', color: 'var(--txt-main)', width: 'auto'}}>Cancel</button>
          <button onClick={onConfirm} className="cc-btn primary" style={{width: 'auto'}}>Yes, Continue</button>
        </div>
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
  const [platformFee, setPlatformFee] = useState(20); 
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const API = "https://collegeconnect-backend-mrkz.onrender.com";
        const [s, c, t, settingsRes] = await Promise.all([
          axios.get(`${API}/api/profile/all`, { headers: { "x-auth-token": token } }),
          axios.get(`${API}/api/colleges`, { headers: { "x-auth-token": token } }),
          axios.get(`${API}/api/tags`, { headers: { "x-auth-token": token } }),
          axios.get(`${API}/api/settings`)
        ]);
        setSeniors(s.data); setColleges(c.data); setTags(t.data);
        if (settingsRes.data && settingsRes.data.platformFee !== undefined) {
          setPlatformFee(settingsRes.data.platformFee);
        }
      } catch {
        toast.error("⚠️ Unable to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className={`page-bg ${theme}`}>
      <style>{globalStyles}</style>
      <div className="stars-bg"></div>

      <div className="main-container">
        
        {/* Mock Top Navbar from the Image */}
        <div className="top-nav-bar">
          <div className="brand-logo">🚀 Reapify by Pinak</div>
          <div className="nav-actions">
            <button 
              className="cc-btn" 
              style={{background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 16px', fontSize: '0.8rem', width: 'auto'}} 
              onClick={toggleTheme}
            >
               {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </div>

        {/* Inner Tab Bar */}
        <div className="tab-bar-floating">
          <Link to="/student-dashboard" className={`cc-tab ${!onBookingsTab ? "active" : ""}`}>
            ✨ Find Seniors
          </Link>
          <Link to="/student-dashboard/bookings" className={`cc-tab ${onBookingsTab ? "active" : ""}`}>
            📘 My Bookings
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<FindSenior seniors={seniors} loading={loading} colleges={colleges} tags={tags} platformFee={platformFee} />} />
          <Route path="/bookings" element={<MyBookings seniors={seniors} />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;