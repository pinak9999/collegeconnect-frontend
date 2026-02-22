import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ======================================
// 🔮 Global CSS (Dark Space + Glassmorphism)
// ======================================
const globalStyles = `
@keyframes floatUp { 0%{transform:translateY(0)} 50%{transform:translateY(-4px)} 100%{transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes twinkle { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

:root {
  --bg: #090a0f;              
  --card: rgba(17, 24, 39, 0.45);              
  --stroke: rgba(139, 92, 246, 0.35);              
  --txt: #ffffff;              
  --muted: #9ca3af;              
  --brand1: #8b5cf6;              
  --brand2: #3b82f6;              
  --ok: #34d399;              
  --warn: #fbbf24;              
  --danger: #ef4444;              
  
  --input-bg: rgba(17, 24, 39, 0.6);
  --tab-bg: rgba(255, 255, 255, 0.05);
  --tab-hover-bg: rgba(255, 255, 255, 0.1);
  --info-bg: rgba(59, 130, 246, 0.1);
  --info-color: #a5b4fc;
  --rating-bg: rgba(17, 24, 39, 0.6);
  --rating-prompt-color: #c7d2fe;
  --rated-bg: rgba(16, 185, 129, 0.1);
  --rated-color: #6ee7b7;
  --dispute-color: #fca5a5;
  --modal-bg: #0f172a;
}

* { outline: none; box-sizing: border-box; }

.page-bg {
  min-height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  color: var(--txt);
  font-family: "Poppins", sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Stars Background */
.page-bg::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: twinkle 5s infinite;
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
}

.main-container { max-width: 600px; margin: 0 auto; padding: 20px 16px 60px; position: relative; z-index: 2; }
.page-wrapper { padding: 8px 0; color: var(--txt); }
.small-muted { color: var(--muted); font-size: .9rem; }

/* Inputs & Selects - Pill Shaped */
.cc-input, .cc-select { 
  border: 1px solid var(--stroke); 
  background: var(--input-bg); 
  color: var(--txt); 
  border-radius: 30px; 
  padding: 12px 20px; 
  width: 100%; 
  transition: .3s all; 
  font-family: "Poppins", sans-serif; 
  font-size: 0.95rem; 
  box-shadow: inset 0 0 10px rgba(139, 92, 246, 0.05);
}
.cc-input::placeholder { color: #6b7280; }
.cc-input:focus, .cc-select:focus { 
  border-color: var(--brand1); 
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.1); 
}

/* Tab Bar - Exact Match to Screenshot */
.tab-bar { 
  display: flex; 
  gap: 15px; 
  margin-bottom: 25px; 
  justify-content: center;
}
.cc-tab { 
  flex: 1;
  border: 1px solid var(--stroke); 
  border-radius: 30px; 
  padding: 12px 16px; 
  font-weight: 600; 
  text-align: center;
  text-decoration: none; 
  color: var(--muted); 
  background: var(--input-bg); 
  transition: all .3s ease; 
  backdrop-filter: blur(10px);
}
.cc-tab.active { 
  background: linear-gradient(90deg, #312e81, #4338ca); 
  border-color: var(--brand1);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5), inset 0 0 10px rgba(139, 92, 246, 0.3); 
  color: white; 
}

/* Buttons */
.cc-btn { 
  border: none; cursor: pointer; border-radius: 30px; padding: 10px 20px; font-weight: 600; 
  color: white; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; 
  transition: all .3s ease; justify-content: center; font-size: 0.9rem;
}
.cc-btn.primary { 
  background: linear-gradient(90deg, #312e81, #4338ca); 
  border: 1px solid rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.2); 
}
.cc-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.6), inset 0 0 15px rgba(139, 92, 246, 0.4); 
}
.cc-btn.danger { background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #fca5a5; }

/* Filter Chips */
.cc-chip { 
  border: 1px solid var(--stroke); color: var(--muted); background: var(--tab-bg); 
  border-radius: 30px; padding: 6px 14px; font-weight: 500; font-size: 0.85rem; cursor: pointer; 
  transition: all .3s ease; margin: 4px; 
}
.cc-chip.active { 
  color: white; border-color: var(--brand1); 
  background: rgba(139, 92, 246, 0.2); 
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); 
}

/* Cards (Glassmorphism) */
.card { 
  background: var(--card); 
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--stroke); 
  border-radius: 20px; 
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(139, 92, 246, 0.1);
  transition: all .3s ease; 
  margin-bottom: 20px;
}
.card:hover { border-color: rgba(139, 92, 246, 0.6); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.2); }

/* Horizontal Card Layout (Like Screenshot) */
.card-top-row { display: flex; align-items: center; gap: 16px; margin-bottom: 15px; }
.card-avatar { 
  width: 65px; height: 65px; border-radius: 50%; object-fit: cover; 
  border: 2px solid rgba(139, 92, 246, 0.6); 
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4); 
  flex-shrink: 0;
}
.card-info { flex: 1; text-align: left; }
.card-name { color: #ffffff; font-weight: 700; font-size: 1.1rem; margin: 0 0 4px 0; text-shadow: 0 0 10px rgba(255,255,255,0.2); }
.card-subtext { color: var(--muted); font-size: 0.85rem; margin: 0 0 2px 0; line-height: 1.4; }
.card-status { color: #a5b4fc; font-size: 0.85rem; margin-top: 10px; font-weight: 500; }

.card-bottom-row { 
  display: flex; align-items: center; justify-content: space-between; 
  margin-top: 15px;
}
.price-text { color: #2dd4bf; font-weight: 700; font-size: 1.1rem; text-shadow: 0 0 10px rgba(45, 212, 191, 0.3); }
.duration-text { color: var(--muted); font-size: 0.9rem; font-weight: 400; text-shadow: none; }

.skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite linear; border-radius: 10px; }

/* Filter Section */
.filter-panel { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
.filter-row { display: grid; gap: 15px; grid-template-columns: 1fr 1fr; }
.tag-chips-container { display: flex; flex-wrap: wrap; gap: 6px; }

/* Status Tags */
.status-tag { padding: 6px 14px; border-radius: 30px; font-weight: 600; font-size: .8rem; text-transform: capitalize; border: 1px solid transparent; }
.status-confirmed { background: rgba(99,102,241,.15); color: #a5b4fc; border-color: rgba(99,102,241,.3); }
.status-completed { background: rgba(16,185,129,.15); color: #6ee7b7; border-color: rgba(16,185,129,.3); }
.status-pending { background: rgba(245,158,11,.15); color: #fde68a; border-color: rgba(245,158,11,.3); }
.status-cancelled { background: rgba(239,68,68,.15); color: #fca5a5; border-color: rgba(239,68,68,.3); }

/* Modals */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s ease; }
.modal-content { background: var(--modal-bg); border: 1px solid var(--stroke); border-radius: 20px; width: 90%; max-width: 400px; animation: slideIn 0.3s ease; overflow: hidden; box-shadow: 0 0 30px rgba(139,92,246,0.2); }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
.modal-title { color: #ffffff; margin: 0; font-size: 1.2rem; font-weight: 700; }
.modal-close-btn { background: none; border: none; font-size: 2rem; color: var(--muted); cursor: pointer; line-height: 1; padding: 0; }
.modal-body { padding: 20px; color: #d1d5db; font-size: 0.95rem; line-height: 1.6; }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); }

/* Remove Theme Toggle Button as UI is fixed to Dark Space */
.theme-toggle-btn { display: none; }
`;

const StarIcon = ({ filled, size = 18, isClickable = false }) => (
  <svg
    fill={filled ? "url(#grad)" : "rgba(255,255,255,0.1)"}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ 
      transition: "0.25s",
      cursor: isClickable ? "pointer" : "default",
      transform: isClickable ? "scale(1.1)" : "scale(1)",
      filter: filled ? 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))' : 'none'
    }}
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#a5b4fc" }} />
        <stop offset="100%" style={{ stopColor: "#8b5cf6" }} />
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
  <div className="card" style={{ padding: "20px" }}>
    <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
      <div className="skeleton" style={{ width: "65px", height: "65px", borderRadius: "50%" }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: "60%", height: "14px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ width: "80%", height: "10px", marginBottom: "6px" }} />
        <div className="skeleton" style={{ width: "40%", height: "10px" }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: "100%", height: "40px", borderRadius: "30px", marginTop: "10px" }} />
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
      <div className="filter-panel">
        <input
          className="cc-input"
          type="text"
          placeholder="🔍 Search by name, college or branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <select className="cc-select" value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
            <option value="">🏢 All Colleges</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
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
            🏷️ All
          </Chip>
          {tags.slice(0, 10).map((t) => (
            <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>
              {t.name}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => {
              const seniorName = p.user?.name || 'Senior';
              const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=312e81&color=ffffff&size=150&font-size=0.4&bold=true`;

              return (
                <div key={p._id} className="card">
                  <div className="card-top-row">
                    <img
                      src={p.avatar || fallbackImage}
                      alt={seniorName}
                      className="card-avatar"
                      loading="lazy"
                      onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = fallbackImage;
                      }}
                    />
                    <div className="card-info">
                      <h3 className="card-name">{seniorName}</h3>
                      <p className="card-subtext">{p.college?.name || "College N/A"}</p>
                      <p className="card-subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} size={14} />
                        ))}
                        <span style={{ color: "var(--muted)", marginLeft: "4px" }}>({p.total_ratings || 0})</span>
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Line Split */}
                  <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }}></div>

                  <div className="card-bottom-row">
                    <div className="price-text">
                      ₹{(p.price_per_session || 0) + platformFee} <span className="duration-text">• {p.session_duration_minutes || 20} min</span>
                    </div>
                    <Link to={`/book/${p.user._id}`} className="cc-btn primary">
                      Join Call
                    </Link>
                  </div>
                </div>
              );
            })
          : (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--txt)" }}>No seniors found</div>
              <div className="small-muted" style={{ marginTop: "10px" }}>Try adjusting filters or search keywords.</div>
            </div>
          )}
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
    if (!bookingId) {
      setModalOpen(false);
      return;
    }
    
    setModalOpen(false); 

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
      console.error("Rating submission error:", err.response || err.message || err);
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
    const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=312e81&color=ffffff&size=150&font-size=0.4&bold=true`;
    const correctAvatar = seniorProfile ? seniorProfile.avatar : null;
    const finalAvatar = correctAvatar || b.profile?.avatar || fallbackImage;
    
    const yearText = getYearSuffix(b.profile?.year);

    return (
      <div key={b._id} className="card">
        <div className="card-top-row" style={{ alignItems: "flex-start" }}>
          <img
            src={finalAvatar}
            alt={seniorName}
            className="card-avatar"
            loading="lazy"
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = fallbackImage;
            }}
          />
          <div className="card-info">
            <h3 className="card-name">{seniorName}</h3>
            <p className="card-subtext">{b.profile?.college?.name}</p>
            {yearText && <p className="card-subtext">{yearText}</p>}
            
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
              <span className={getStatusTagClass(status)}>{b.status}</span>
              {disputeTagClass && <span className={disputeTagClass}>{b.dispute_status}</span>}
            </div>
          </div>
        </div>

        {status === "confirmed" && (
          <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#a5b4fc", padding: "10px 15px", borderRadius: "10px", fontSize: "0.9rem", marginTop: "10px", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
            ℹ️ The senior will contact you within 6 hours.
          </div>
        )}

        {status === "completed" && !b.rated && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "10px", padding: "15px", textAlign: "center", marginTop: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ margin: "0 0 10px 0", color: "#c7d2fe", fontSize: "0.9rem" }}>Rate this session:</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })}
                  onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })}
                  onClick={() => openRatingModal(b._id, b.senior?._id, star)}
                >
                  <StarIcon
                    filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)}
                    size={28}
                    isClickable={true}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
        
        {b.rated && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 15px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "10px", marginTop: "10px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <span style={{ color: "#6ee7b7", fontSize: "0.9rem" }}>You rated:</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < b.rating} size={16} />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
          {status === "confirmed" && (
            <button className="cc-btn primary" onClick={() => handleChat(b._id)}>💬 Chat</button>
          )}
          {dispute === "none" && !b.rated && (
            <button className="cc-btn danger" onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>
          )}
          {(dispute === "not_allowed" || b.rated) && dispute !== "pending" && dispute !== "resolved" && (
            <span style={{ color: "#fca5a5", fontSize: "0.85rem", padding: "8px 0" }}>🚫 Dispute not allowed after rating.</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const activeBookings = bookings.filter(
    (b) => b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled"
  );
  const pastBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "cancelled"
  );

  return (
    <div className="page-wrapper">
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRating}
        title="⚠️ Confirm Rating"
      >
        <p>
          Once you rate this senior, you cannot raise a dispute.
          <br /><br />
          Are you sure you want to give a rating of 
          <strong style={{ color: "#a5b4fc" }}> {ratingData.value} {ratingData.value > 1 ? "stars" : "star"}</strong>?
        </p>
      </ConfirmModal>
    
      {bookings.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--txt)" }}>You haven't booked any sessions yet.</div>
          <div className="small-muted" style={{ marginTop: "8px" }}>Find a senior and schedule your first session.</div>
        </div>
      )}

      {activeBookings.length > 0 && (
        <>
          <h3 style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "15px", paddingLeft: "5px" }}>Ongoing & Active</h3>
          <div>{activeBookings.map(renderBookingCard)}</div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h3 style={{ fontSize: "1.1rem", color: "#ffffff", marginBottom: "15px", marginTop: "30px", paddingLeft: "5px" }}>Completed & Past</h3>
          <div>{pastBookings.map(renderBookingCard)}</div>
        </>
      )}
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cc-btn" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>Cancel</button>
          <button onClick={onConfirm} className="cc-btn primary">Yes, Continue</button>
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

  const [theme, setTheme] = useState('dark');

  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [platformFee, setPlatformFee] = useState(20); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
        
        setSeniors(s.data);
        setColleges(c.data);
        setTags(t.data);
        
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
    <div className="page-bg">
      <style>{globalStyles}</style>

      <div className="main-container">
        {/* Top Pills Tab Bar like Screenshot */}
        <div className="tab-bar">
          <Link to="/student-dashboard" className={`cc-tab ${!onBookingsTab ? "active" : ""}`}>
            📄 Find Seniors
          </Link>
          <Link to="/student-dashboard/bookings" className={`cc-tab ${onBookingsTab ? "active" : ""}`}>
            📘 My Bookings
          </Link>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <FindSenior
                seniors={seniors}
                loading={loading}
                colleges={colleges}
                tags={tags}
                platformFee={platformFee} 
              />
            }
          />
          <Route path="/bookings" element={<MyBookings seniors={seniors} />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;