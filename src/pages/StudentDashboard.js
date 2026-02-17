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
@keyframes subtleGlow { 0%{box-shadow:0 0 0 rgba(99,102,241,0)} 100%{box-shadow:0 8px 28px rgba(99,102,241,.18)} }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

/* =================================
  1. DEFAULT (LIGHT/COLORFUL) THEME
================================= */
:root{
  --bg: #f4fcf6ff;                  /* Light page background */
  --card: #ffffff;                /* White card */
  --panel: #ffffffcc;             /* Translucent panel */
  --stroke: #e5e7eb;              /* Light borders */
  --txt: #1f2937;                /* Dark primary text */
  --muted: #6b7280;              /* Dark secondary text */
  --brand1: #7c3aed;              /* Violet */
  --brand2: #06b6d4;              /* Cyan */
  --ok: #16a34a;                  /* Success */
  --warn: #f59e0b;                /* Warning */
  --danger: #ef4444;              /* Danger */
  
  --bg-gradient: linear-gradient(180deg, #f4f7fc 0%, #f4f7fc 100%);
  --panel-bg: #ffffffcc;
  --input-bg: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  --tab-bg: #f3f4f6;
  --tab-hover-bg: #e5e7eb;
  --info-bg: #eff6ff;
  --info-color: #3b82f6;
  --rating-bg: #f9fafb;
  --rating-prompt-color: var(--brand1);
  --rated-bg: #f0fdf4;
  --rated-color: #166534;
  --dispute-color: #fca5a5;
  --modal-bg: #ffffff;
}

/* =================================
  2. DARK THEME VARIABLES
================================= */
.dark {
  --bg: #0b1220;
  --card: #0f172a99;
  --panel: #101827cc;
  --stroke: #27324a;
  --txt: #e5e7eb;
  --muted: #9aa3b2;
  --brand1: #7c3aed;
  --brand2: #06b6d4;
  --ok: #16a34a;
  --warn: #f59e0b;
  --danger: #ef4444;

  --bg-gradient: linear-gradient(180deg, #050816 0%, #0b1220 100%);
  --panel-bg: #101827cc;
  --input-bg: linear-gradient(180deg, #0b1220 0%, #0b1220 60%, #0d1628 100%);
  --tab-bg: linear-gradient(180deg,#0e1628,#0b1323);
  --tab-hover-bg: linear-gradient(180deg,#0e1628,#0b1323); 
  --info-bg: linear-gradient(180deg, #0e1b31, #0b1426);
  --info-color: #c7d2fe;
  --rating-bg: linear-gradient(180deg, #0e1628, #0b1323);
  --rating-prompt-color: #c7d2fe;
  --rated-bg: linear-gradient(180deg, #0d1a2f, #0a1324);
  --rated-color: #86efac;
  --dispute-color: #fca5a5;
  --modal-bg: linear-gradient(145deg, #0f172a, #0b1220);
}

* { outline: none; box-sizing: border-box; }

/* =================================
  3. Page Layout (Theme-Aware)
================================= */
.page-bg {
  min-height: 100vh;
  background:
    radial-gradient(1000px 400px at -10% -10%, rgba(124,58,237,.25), transparent 60%),
    radial-gradient(800px 350px at 110% 0%, rgba(6,182,212,.22), transparent 60%),
    var(--bg-gradient);
  background-color: var(--bg); /* Fallback */
  font-family: "Poppins", sans-serif;
  transition: background 0.3s ease, color 0.3s ease;
}
.main-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 16px 60px;
}
.page-wrapper {
  padding: 8px;
  color: var(--txt);
  animation: fadeIn 0.4s ease-out;
}
.small-muted {
  color: var(--muted);
  font-size: .9rem;
}
.rating-row svg {
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.25));
}
.light .rating-row svg {
  filter: none;
}

/* =================================
  4. Reusable Components (Theme-Aware)
================================= */
.cc-input, .cc-select {
  border:1px solid var(--stroke);
  background: var(--input-bg);
  color:var(--txt);
  border-radius:14px;
  padding:12px 16px;
  width:100%;
  transition:.25s border-color, .25s box-shadow, .25s transform;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}
  
.cc-input:focus, .cc-select:focus {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 4px rgba(125,211,252,.15);
  transform: translateY(-1px);
}
.cc-tab {
  border:1px solid var(--stroke);
  border-radius:12px;
  padding:10px 16px;
  font-weight:700;
  text-decoration:none;
  color:var(--txt);
  background: var(--tab-bg);
  transition:.25s transform,.25s box-shadow,.25s background;
  will-change: transform;
  white-space: nowrap;
}
.cc-tab.active {
  background: linear-gradient(90deg, var(--brand1), var(--brand2));
  box-shadow: 0 8px 22px rgba(6,182,212,.25);
  color: white;
  border-color: transparent;
}
.cc-tab:not(.active):hover { 
  transform: translateY(-2px); 
  background: var(--tab-hover-bg);
}
.cc-btn {
  border:none; cursor:pointer; border-radius:12px; padding:10px 16px; font-weight:700;
  color:white; text-decoration:none; display:inline-flex; align-items:center; gap:8px;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  justify-content: center;
}
.cc-btn:active { transform: translateY(1px) scale(.99) }
.cc-btn.primary {
  background: linear-gradient(120deg, var(--brand2), var(--brand1));
  box-shadow: 0 8px 22px rgba(124,58,237,.25);
}
.cc-btn.danger {
  background: linear-gradient(120deg, #fb7185, var(--danger));
  box-shadow: 0 8px 22px rgba(239,68,68,.25);
}
.cc-btn.success {
  background: linear-gradient(120deg, #10b981, #059669);
  box-shadow: 0 8px 22px rgba(16,185,129,.25);
}
.cc-chip {
  border:1px solid var(--stroke);
  color:var(--muted);
  background: var(--tab-bg);
  border-radius:999px;
  padding:8px 12px;
  font-weight:600;
  cursor:pointer;
  transition:.2s transform,.2s box-shadow,.2s color,.2s background,.2s border-color;
  margin: 4px;
}
.cc-chip:hover { transform: translateY(-1px) }
.cc-chip.active {
  color:white;
  border-color: transparent;
  background: linear-gradient(90deg, var(--brand1), var(--brand2));
  box-shadow: 0 8px 22px rgba(124,58,237,.25);
}
.card {
  background: var(--card);
  backdrop-filter: blur(12px);
  border:1px solid var(--stroke);
  border-radius:18px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.dark .card {
  box-shadow: 0 30px 60px rgba(2,6,23,.35);
}
.light .card {
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}
.card:hover { transform: translateY(-2px); border-color:#334155; }
.dark .card:hover { border-color:#334155; }
.light .card:hover { border-color:var(--brand2); }

.skeleton {
  background: linear-gradient(90deg, #0d1526 25%, #111b31 50%, #0d1526 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 10px;
}
.light .skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
}

/* =================================
  5. Tabs & Headings (Theme-Aware)
================================= */
.tab-bar {
  display: flex;
  gap: 12px;
  padding: 10px;
  border-radius: 16px;
  background: var(--panel-bg);
  border: 1px solid var(--stroke);
  margin-bottom: 18px;
  position: sticky;
  top: 12px;
  z-index: 5;
  backdrop-filter: blur(10px);
  align-items: center;
}
.dark .tab-bar {
  box-shadow: 0 20px 40px rgba(2,6,23,.35);
}
.light .tab-bar {
  background: #ffffff99;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.theme-toggle-btn {
  height: 40px;
  width: 40px;
  min-width: 40px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid var(--stroke);
  background: var(--tab-bg);
  color: var(--txt);
  font-size: 1.25rem;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-toggle-btn:hover {
  transform: translateY(-2px);
  border-color: var(--brand2);
  color: var(--brand2);
}

.title-style {
  text-align: left;
  color: var(--txt);
  margin-bottom: 16px;
  font-weight: 900;
  letter-spacing: .3px;
  font-size: 1.4rem;
}
.dark .title-style {
  text-shadow: 0 1px 0 rgba(0,0,0,.4);
}
.light .title-style {
  text-shadow: none;
}
.section-title-style {
  color: var(--txt);
  font-weight: 800;
  font-size: 1.15rem;
  margin: 10px 0 10px 2px;
  border-left: 3px solid var(--brand1);
  padding-left: 10px;
}

/* =================================
  6. FindSenior Component Styles
================================= */
.panel-wrap {
  border: 1px solid var(--stroke);
  background: var(--panel-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 16px;
}
.dark .panel-wrap {
  box-shadow: 0 20px 40px rgba(2,6,23,.35);
}
.light .panel-wrap {
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.filter-row {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
}
.tag-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.grid-style-seniors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.senior-card {
  padding: 18px;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.senior-card .image-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}
.senior-card .avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(124,58,237,.55);
  box-shadow: 0 10px 24px rgba(124,58,237,.25);
}
.light .senior-card .avatar {
  border-color: var(--brand1);
}

.senior-card .name-style {
  color: var(--txt);
  font-weight: 800;
  font-size: 1.05rem;
  margin: 10px 0 6px;
}
.light .senior-card .name-style {
  color: var(--brand1);
}
.senior-card .college-style {
  color: var(--muted);
  font-size: .92rem;
  margin: 0 0 6px;
}
.senior-card .bio-style {
  color: var(--txt);
  font-size: .92rem;
  margin: 6px 0 12px;
  min-height: 40px;
  flex-grow: 1;
}
.light .senior-card .bio-style {
  color: var(--muted);
}
.senior-card .rating-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin-bottom: 6px;
}
.senior-card .rating-count {
  margin-left: 8px;
  color: var(--muted);
  font-weight: 600;
}
.senior-card .price-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 14px;
}
.senior-card .small-chip {
  border: 1px solid var(--stroke);
  color: var(--txt);
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: .8rem;
}
.senior-card .price-text {
  color: #86efac;
  font-weight: 800;
  font-size: 1.05rem;
}
.light .senior-card .price-text {
  color: var(--ok);
}

/* =================================
  7. MyBookings Component Styles
================================= */
.grid-style-bookings {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.booking-card {
  padding: 18px;
}
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--stroke);
  padding-bottom: 12px;
  gap: 12px;
}
.booking-card .booking-name {
  color: var(--txt);
  font-weight: 800;
  font-size: 1.1rem;
  margin: 0;
}
.light .booking-card .booking-name {
  color: var(--brand1);
}
.booking-card .booking-college {
  color: var(--muted);
  font-size: .92rem;
  margin: 6px 0 0 0;
}
.booking-card .booking-year-style {
  color: #a5b4fc;
  font-size: .9rem;
  font-weight: 700;
  margin: 6px 0 0 0;
}
.light .booking-card .booking-year-style {
  color: var(--brand1);
}
.booking-card .booking-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(124,58,237,.45);
  box-shadow: 0 8px 18px rgba(124,58,237,.25);
  flex-shrink: 0;
}
.booking-card .status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
}
.booking-card .status-tag {
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: .78rem;
  text-transform: capitalize;
  border: 1px solid transparent;
}
.dark .booking-card .status-tag {
  border: 1px solid var(--stroke);
}

/* Status Tag Colors */
.status-tag.status-confirmed { background: rgba(99,102,241,.15); color: #a5b4fc; }
.status-tag.status-completed { background: rgba(34,197,94,.15); color: #86efac; }
.status-tag.status-pending { background: rgba(245,158,11,.15); color: #fde68a; }
.status-tag.status-cancelled { background: rgba(239,68,68,.15); color: #fca5a5; }
.light .status-tag.status-confirmed { background: #e0e7ff; color: #4f46e5; }
.light .status-tag.status-completed { background: #dcfce7; color: #166534; }
.light .status-tag.status-pending { background: #fef9c3; color: #a16207; }
.light .status-tag.status-cancelled { background: #fee2e2; color: #b91c1c; }

.booking-card .info-message {
  background: var(--info-bg);
  color: var(--info-color);
  padding: 12px;
  border-radius: 10px;
  font-size: .95rem;
  font-weight: 600;
  text-align: left;
  line-height: 1.5;
  border: 1px solid var(--stroke);
  margin-top: 10px;
}
.booking-card .rating-section {
  background: var(--rating-bg);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  border: 1px solid var(--stroke);
  margin-top: 8px;
}
.booking-card .rating-prompt {
  font-weight: 800;
  color: var(--rating-prompt-color);
  margin: 0 0 10px 0;
  font-size: .95rem;
}
.booking-card .rating-stars-container {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.booking-card .rated-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: var(--rated-bg);
  border-radius: 10px;
  color: var(--rated-color);
  font-weight: 800;
  border: 1px solid var(--stroke);
  margin-top: 6px;
}
.light .booking-card .rated-section {
  border-color: #bbf7d0;
}
.booking-card .rated-stars {
  display: flex;
  gap: 2px;
}
.booking-card .button-row {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--stroke);
}
.booking-card .btn-compact {
  font-size: .9rem;
  padding: 8px 14px;
}
.booking-card .dispute-not-allowed {
  color: var(--dispute-color);
  font-weight: 700;
  font-size: .86rem;
  padding: 8px 0;
}

/* =================================
  8. Modal (Theme-Aware)
================================= */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}
.modal-content {
  background: var(--modal-bg);
  border: 1px solid var(--stroke);
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  animation: slideIn 0.3s ease;
  overflow: hidden;
}
.dark .modal-content {
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.light .modal-content {
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--stroke);
}
.modal-title {
  color: var(--brand1);
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}
.modal-close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--muted);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}
.modal-close-btn:hover {
  color: var(--txt);
}
.modal-body {
  padding: 20px;
  color: var(--txt);
  font-size: 1rem;
  line-height: 1.6;
}
.modal-body strong {
  color: var(--brand1);
  font-weight: 700;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid var(--stroke);
}
.light .modal-footer {
  background: #f9fafb;
}

/* =================================
  9. MOBILE RESPONSIVE FIXES
================================= */
@media (max-width: 640px) {
  .main-container {
    padding: 8px 8px 40px;
  }
  
  .tab-bar {
    justify-content: flex-start;
    overflow-x: auto;
    padding: 8px;
    gap: 8px;
  }
  .tab-bar::-webkit-scrollbar { display: none; }
  .tab-bar { -ms-overflow-style: none; scrollbar-width: none; }
  
  .cc-tab {
    padding: 8px 12px;
  }
  .theme-toggle-btn {
    height: 38px;
    width: 38px;
    min-width: 38px;
  }

  .panel-wrap {
    padding: 10px;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .booking-header {
     flex-direction: column-reverse;
     align-items: center;
     text-align: center;
     gap: 12px;
  }
  
  .booking-card .booking-avatar {
     width: 70px;
     height: 70px;
  }
  
  .title-style, .section-title-style {
    font-size: 1.1rem;
    padding-left: 8px;
  }
}
`;

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

// ======================================
// 🎛️ Small UI atoms
// ======================================
const Chip = ({ active, onClick, children }) => (
  <button className={`cc-chip ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

// ===============================
// ✨ Skeletons
// ===============================
const SkeletonCard = () => (
  <div className="card" style={{ padding: 18 }}>
    <div className="skeleton" style={{ width: 90, height: 90, borderRadius: 999, margin: "8px auto" }} />
    <div className="skeleton" style={{ width: "60%", height: 14, margin: "14px auto" }} />
    <div className="skeleton" style={{ width: "40%", height: 12, margin: "8px auto" }} />
    <div className="skeleton" style={{ width: "80%", height: 10, margin: "16px auto" }} />
    <div className="skeleton" style={{ width: "50%", height: 12, margin: "16px auto" }} />
    <div className="skeleton" style={{ width: "70%", height: 36, margin: "16px auto", borderRadius: 12 }} />
  </div>
);

// ===============================
// 🚀 Custom Modal Component
// ===============================
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button 
            onClick={onClose} 
            className="cc-btn" 
            style={{background: 'var(--stroke)', color: 'var(--muted)'}}
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="cc-btn danger">
            Yes, Continue
          </button>
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
              🏷️ All Tags
            </Chip>
            {tags.slice(0, 10).map((t) => (
              <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>
                {t.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-style-seniors">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => (
              <div
                key={p._id}
                className="card senior-card"
              >
                <div className="image-wrapper">
                  <img
                    src={p.avatar || "https://via.placeholder.com/100"}
                    alt={p.user?.name}
                    className="avatar"
                    loading="lazy"
                  />
                </div>

                <h3 className="name-style">{p.user?.name}</h3>

                <div className="rating-row rating-container">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} />
                  ))}
                  <span className="rating-count">
                    {p.average_rating?.toFixed?.(1) ?? "0.0"} • {p.total_ratings || 0}
                  </span>
                </div>

                <p className="college-style">{p.college?.name}</p>
                <p className="bio-style">{(p.bio || "—").substring(0, 90)}{(p.bio?.length ?? 0) > 90 ? "…" : ""}</p>

                <div className="price-row">
                  <span className="price-text">₹{p.price_per_session || 0}</span>
                  <span className="small-chip">{p.session_duration_minutes || 20} min</span>
                </div>

                <Link to={`/book/${p.user._id}`} className="cc-btn primary">
                  🚀 Book Session
                </Link>
              </div>
            ))
          : (
            <div className="card" style={{ padding: 24, gridColumn: "1 / -1", textAlign: "center" }}>
              <div style={{ fontSize: 18, color: "var(--txt)", fontWeight: 700 }}>No seniors found</div>
              <div className="small-muted" style={{ marginTop: 6 }}>Try adjusting filters or search keywords.</div>
            </div>
          )}
      </div>
    </div>
  );
};
// ===============================
// 📘 MyBookings (Fixed & 100% Working)
// ===============================
const MyBookings = ({ seniors }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState({ bookingId: null, value: 0 });
  const navigate = useNavigate();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingData, setRatingData] = useState({ bookingId: null, seniorId: null, value: 0 });

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token) return;

        console.log("📡 Loading bookings...");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my",
          { headers: { "x-auth-token": token } }
        );
        
        console.log("✅ Bookings Received:", res.data); // Debugging
        
        // Data ko sort karein latest first
        const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(sortedData);
      
      } catch (err) {
        console.error("❌ Error loading bookings:", err);
        toast.error("⚠️ Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleDispute = (id) => navigate(`/raise-dispute/${id}`);
  const handleChat = (id) => navigate(`/chat/${id}`);

  // 🕒 Time Check Logic (Video Call Button)
  const isClassTime = (booking) => {
    if (!booking.scheduledDate || !booking.startTime) return false;
    const now = new Date();
    const meetingDate = new Date(booking.scheduledDate);
    const [h, m] = booking.startTime.split(':');
    
    meetingDate.setHours(parseInt(h), parseInt(m), 0);
    const endTime = new Date(meetingDate.getTime() + 30 * 60000); // 30 mins session

    // Button active: 5 mins before start -> until end time
    return now >= new Date(meetingDate.getTime() - 5 * 60000) && now <= endTime;
  };

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
      console.error("Rating submission error:", err);
      toast.error("⚠️ Failed to submit rating!");
    }
  };

  // Helper functions for styles
  const getStatusTagClass = (status) => {
    const base = "status-tag";
    switch ((status || "").toLowerCase()) {
      case "confirmed": return `${base} status-confirmed`;
      case "completed": return `${base} status-completed`;
      case "pending":   return `${base} status-pending`;
      case "cancelled": return `${base} status-cancelled`;
      default:          return base;
    }
  };

  const getDisputeTagClass = (dispute) => {
    const d = (dispute || "").toLowerCase();
    if (d === "pending")  return "status-tag status-pending";
    if (d === "resolved") return "status-tag status-completed";
    return null;
  };

  // Render Single Booking Card
  const renderBookingCard = (b) => {
    const dispute = b.dispute_status?.toLowerCase() || "none";
    const status = b.status?.toLowerCase();
    const disputeTagClass = getDisputeTagClass(dispute);
    
    // Find senior profile details from props or booking data
    const seniorName = b.mentor?.name || b.senior?.name || "Senior";
    const seniorAvatar = b.mentor?.avatar || b.senior?.avatar || "https://via.placeholder.com/60";
    const collegeName = b.profile?.college?.name || "College info unavailable";
    const yearText = b.profile?.year ? `${b.profile.year}th Year` : "";

    return (
      <div key={b._id} className="card booking-card">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{seniorName}</h3>
            <p className="booking-college">{collegeName}</p>
            {yearText && <p className="booking-year-style">{yearText}</p>}
            
            <div style={{marginTop: 8, display: 'flex', gap: 8, fontSize: '0.85rem', color: 'var(--muted)'}}>
              <span>📅 {new Date(b.scheduledDate).toLocaleDateString()}</span>
              <span>⏰ {b.startTime} - {b.endTime}</span>
            </div>
          </div>
          <img
            src={seniorAvatar}
            alt={seniorName}
            className="booking-avatar"
            loading="lazy"
          />
        </div>

        <div className="status-row">
          <span className={getStatusTagClass(status)}>{b.status || "Scheduled"}</span>
          {disputeTagClass && <span className={disputeTagClass}>{b.dispute_status}</span>}
        </div>

        {status === "confirmed" && (
          <p className="info-message">
            ℹ️ The senior will contact you. Join the video call at the scheduled time.
          </p>
        )}

        {/* Rating Section */}
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
                  <StarIcon
                    filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)}
                    size={30}
                    isClickable={true}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
        
        {b.rated && (
          <div className="rated-section">
            <span>You rated:</span>
            <div className="rated-stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < b.rating} size={20} />
              ))}
            </div>
          </div>
        )}

        <div className="button-row">
          {status === "confirmed" && (
            <>
              <button className="cc-btn primary btn-compact" onClick={() => handleChat(b._id)}>💬 Chat</button>
              
              {/* 🚀 VIDEO CALL BUTTON with Logic */}
              <a 
                href={`/video-call/${b.meetingLink}`} 
                target="_blank"
                rel="noreferrer"
                className={`cc-btn btn-compact ${isClassTime(b) ? "success" : "disabled"}`} 
                style={{
                  textDecoration:'none', 
                  opacity: isClassTime(b) ? 1 : 0.6,
                  pointerEvents: isClassTime(b) ? 'auto' : 'none',
                  background: isClassTime(b) ? '' : 'var(--stroke)',
                  color: isClassTime(b) ? '' : 'var(--muted)'
                }}
              >
                {isClassTime(b) ? "📹 Join Call" : "Wait for Time"}
              </a>
            </>
          )}

          {dispute === "none" && !b.rated && (
            <button className="cc-btn danger btn-compact" onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid-style-bookings">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // Filter Active vs Past
  const activeBookings = bookings.filter(
    (b) => b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled"
  );
  const pastBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "cancelled"
  );

  return (
    <div className="page-wrapper">
      {/* Modal same as before */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleRating}
        title="⚠️ Confirm Rating"
      >
        <p>
          Once you rate this senior, you cannot raise a dispute.<br />
          Confirm rating: <strong>{ratingData.value} Stars</strong>?
        </p>
      </ConfirmModal>
    
      <h2 className="title-style">📘 My Bookings</h2>

      {bookings.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: '1.2rem', color: "var(--txt)", fontWeight: 700 }}>You haven't booked any sessions yet.</div>
          <div className="small-muted" style={{ marginTop: 10 }}>Find a senior and schedule your first session.</div>
          <button 
             onClick={() => window.location.href='/student-dashboard'} 
             className="cc-btn primary" 
             style={{marginTop: 20}}
          >
            Find a Mentor
          </button>
        </div>
      )}

      {activeBookings.length > 0 && (
        <>
          <h3 className="section-title-style">Ongoing & Active</h3>
          <div className="grid-style-bookings">{activeBookings.map(renderBookingCard)}</div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h3 className="section-title-style" style={{ marginTop: 28 }}>Completed & Past</h3>
          <div className="grid-style-bookings">{pastBookings.map(renderBookingCard)}</div>
        </>
      )}
    </div>
  );
};
// ===============================
// 🌈 Main Dashboard Shell
// ===============================
const StudentDashboard = () => {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes("/bookings");

  const [theme, setTheme] = useState('light'); // Default to light

  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
  }, []);

  return (
    <div className={`page-bg ${theme}`}>
      <style>{globalStyles}</style>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="main-container">
        <div className="tab-bar">
          <Link to="/student-dashboard" className={`cc-tab ${!onBookingsTab ? "active" : ""}`}>🎓 Find Seniors</Link>
          <Link to="/student-dashboard/bookings" className={`cc-tab ${onBookingsTab ? "active" : ""}`}>📘 My Bookings</Link>
          
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
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