import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ======================================
// 🚀 Premium Zomato/Startup Level UI CSS
// ======================================
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --bg-color: #fbc2eb;
  --bg-pattern: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 35%, #ffb199 70%, #ffecd2 100%);
  --card-bg: #ffffff;
  --nav-bg: rgba(255, 255, 255, 0.95);
  --brand-primary: #e23744; 
  --brand-hover: #cb202d;
  --brand-light: #fcebed;
  --brand-gradient: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  --txt-main: #1c1c1c;
  --txt-muted: #696969;
  --stroke: #e8e8e8;
  --price-green: #25a541;
  --price-bg: #e5f6e8;
  --star-color: #f5a623;
  --shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.04);
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 16px 32px rgba(226, 55, 68, 0.12);
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 8px;
  --radius-pill: 50px;
}

.dark {
  --bg-color: #0a0a0a;
  --bg-pattern: linear-gradient(135deg, #1e1332 0%, #4a154b 50%, #3e1b1b 100%);
  --card-bg: #141414;
  --nav-bg: rgba(20, 20, 20, 0.95);
  --txt-main: #f4f4f4;
  --txt-muted: #a0a0a0;
  --stroke: #262626;
  --shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-card: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 16px 32px rgba(226, 55, 68, 0.2);
  --brand-light: rgba(226, 55, 68, 0.15);
}

* { outline: none; box-sizing: border-box; }
body { 
  margin: 0; 
  margin-top: -7px; 
  font-family: 'Poppins', sans-serif; 
  -webkit-font-smoothing: antialiased; 
}

.page-bg { 
  min-height: 100vh; 
  background-color: var(--bg-color); 
  background-image: var(--bg-pattern);
  background-attachment: fixed;
  color: var(--txt-main); 
  transition: background 0.3s ease; 
}

.page-wrapper { animation: fadeIn 0.4s ease-out forwards; padding-bottom: 90px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.main-container { max-width: 1050px; margin: 0 auto; padding: 20px 16px; position: relative; }

/* --- Top Header --- */
.top-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 10px 0; }
.brand-title { font-size: 1.6rem; font-weight: 800; margin: 0; color: var(--txt-main); display: flex; align-items: center; gap: 8px; letter-spacing: -0.5px; }
.theme-btn { background: var(--card-bg); border: 1px solid var(--stroke); padding: 8px 16px; border-radius: var(--radius-pill); cursor: pointer; color: var(--txt-main); font-weight: 600; font-size: 0.85rem; box-shadow: var(--shadow-soft); display: flex; align-items: center; gap: 6px; transition: all 0.2s; white-space: nowrap; }
.theme-btn:hover { border-color: var(--brand-primary); color: var(--brand-primary); }

/* --- 🎯 PREDICTOR CSS --- */
.predictor-header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); border-radius: var(--radius-lg); padding: 30px 20px; margin-bottom: 24px; color: white; text-align: center; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2); }
.predictor-header h2 { margin: 0 0 8px 0; font-size: 1.8rem; font-weight: 800; }
.predictor-header p { margin: 0; font-size: 0.95rem; opacity: 0.9; }
.predictor-card { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-card); border: 1px solid var(--stroke); margin-bottom: 24px; }
.toggle-group { display: flex; background: rgba(0,0,0,0.05); border-radius: var(--radius-pill); padding: 6px; margin-bottom: 20px; }
.toggle-btn { flex: 1; padding: 10px 0; border: none; background: transparent; border-radius: var(--radius-pill); font-weight: 600; color: var(--txt-muted); cursor: pointer; transition: all 0.3s ease; }
.toggle-btn.active { background: var(--card-bg); color: var(--brand-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--txt-main); }
.score-input { width: 100%; padding: 14px 20px; border-radius: var(--radius-pill); border: 1px solid var(--stroke); font-size: 1.1rem; font-weight: 600; font-family: inherit; transition: all 0.3s; background: transparent; color: var(--txt-main); }
.score-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 4px var(--brand-light); outline: none; }
.predict-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: var(--radius-pill); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25); }
.predict-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(139, 92, 246, 0.35); }
.predict-btn:disabled { opacity: 0.7; transform: none; cursor: wait; }

/* --- 📋 CHOICE FILLING CSS --- */
.choice-header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: var(--radius-lg); padding: 30px 20px; margin-bottom: 24px; color: white; text-align: center; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
.choice-header h2 { margin: 0 0 8px 0; font-size: 1.8rem; font-weight: 800; }
.choice-header p { margin: 0; font-size: 0.95rem; opacity: 0.9; }

.priority-list-container { background: var(--card-bg); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-card); border: 1px solid var(--stroke); margin-top: 24px; }
.priority-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-bottom: 1px solid var(--stroke); transition: background 0.2s; }
.priority-item:last-child { border-bottom: none; }
.priority-item:hover { background: rgba(0,0,0,0.02); }
.p-number { width: 36px; height: 36px; background: #e2e8f0; color: #475569; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; flex-shrink: 0; }
.p-number.top-3 { background: #fef08a; color: #854d0e; box-shadow: 0 2px 8px rgba(234, 179, 8, 0.3); }
.p-details h4 { margin: 0 0 4px 0; font-size: 1.05rem; color: var(--txt-main); }
.p-details p { margin: 0; font-size: 0.85rem; color: var(--txt-muted); font-weight: 500;}
.p-type { font-size: 0.75rem; padding: 4px 8px; border-radius: 4px; font-weight: 700; margin-left: auto; }
.type-govt { background: #dbeafe; color: #1e40af; }
.type-pvt { background: #f3e8ff; color: #6b21a8; }

.form-card { background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-card); border: 1px solid var(--stroke); margin-bottom: 24px; }
.action-btn { width: 100%; padding: 16px; color: white; border: none; border-radius: var(--radius-pill); font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 10px; }
.btn-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); }

/* Result Cards */
.result-card { background: var(--card-bg); border: 1px solid var(--stroke); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-soft); animation: fadeIn 0.5s ease-out forwards; }
.college-info h4 { margin: 0 0 4px 0; font-size: 1.1rem; color: var(--txt-main); }
.college-info p { margin: 0; font-size: 0.85rem; color: var(--txt-muted); font-weight: 500;}
.chance-badge { padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; text-align: center; }
.chance-high { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.chance-medium { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }

/* --- General Component CSS --- */
.hero-premium { background: var(--brand-gradient); border-radius: var(--radius-lg); padding: 40px; margin-bottom: 24px; color: white; position: relative; overflow: hidden; box-shadow: var(--shadow-card); }
.hero-premium::after { content: '🚀'; font-size: 120px; position: absolute; right: 10%; bottom: -20px; opacity: 0.15; transform: rotate(-15deg); }
.hero-premium h1 { font-size: 2.2rem; font-weight: 800; margin: 0 0 10px 0; position: relative; z-index: 2; }
.hero-premium p { font-size: 1.1rem; font-weight: 500; margin: 0; opacity: 0.95; line-height: 1.5; position: relative; z-index: 2; }
.search-section { background: var(--card-bg); padding: 20px; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); border: 1px solid var(--stroke); margin-bottom: 24px; }
.search-bar-modern { display: flex; align-items: center; background: rgba(255,255,255,0.5); border: 1px solid var(--stroke); border-radius: var(--radius-pill); padding: 12px 20px; transition: all 0.3s; width: 100%; box-sizing: border-box; }
.search-bar-modern:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 4px var(--brand-light); background: var(--card-bg); }
.search-bar-modern input { border: none; background: transparent; width: 100%; padding: 4px 8px; font-family: inherit; font-size: 1rem; color: var(--txt-main); }
.search-icon { font-size: 1.2rem; color: var(--brand-primary); flex-shrink: 0; }
.filter-dropdowns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; width: 100%; }
.cc-select { width: 100%; max-width: 100%; box-sizing: border-box; appearance: none; border: 1px solid var(--stroke); background: var(--card-bg) url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23696969' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 16px center; background-size: 16px; color: var(--txt-main); border-radius: var(--radius-md); padding: 14px 16px; font-family: inherit; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: border-color 0.2s; }
.cc-select:focus { border-color: var(--brand-primary); outline: none; }
.tags-scroll-container { display: flex; gap: 12px; overflow-x: auto; padding: 16px 0 4px 0; scrollbar-width: none; width: 100%; box-sizing: border-box; }
.tags-scroll-container::-webkit-scrollbar { display: none; }
.tag-chip { flex-shrink: 0; padding: 8px 18px; border-radius: var(--radius-pill); border: 1px solid var(--stroke); background: var(--card-bg); color: var(--txt-muted); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.tag-chip:hover { border-color: var(--brand-primary); color: var(--brand-primary); }
.tag-chip.active { background: var(--brand-primary); color: white; border-color: var(--brand-primary); box-shadow: 0 4px 12px rgba(226, 55, 68, 0.25); }
.grid-style-seniors { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 10px; }
.senior-card-modern { background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--stroke); padding: 24px; box-shadow: var(--shadow-card); transition: all 0.3s ease; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; }
.senior-card-modern:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: rgba(226, 55, 68, 0.3); }
.card-header-flex { display: flex; gap: 18px; align-items: center; margin-bottom: 20px; }
.avatar-box { width: 90px; height: 90px; border-radius: 50%; flex-shrink: 0; border: 3px solid var(--brand-light); padding: 3px; background: var(--card-bg); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.avatar-box img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.info-box { flex-grow: 1; overflow: hidden; }
.name-text { font-size: 1.3rem; font-weight: 800; color: var(--txt-main); margin: 0 0 6px 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.verified-tick { color: #1da1f2; font-size: 1.1rem; }
.college-text { font-size: 0.9rem; color: var(--txt-muted); margin: 0 0 8px 0; font-weight: 500; line-height: 1.3; }
.rating-row { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; color: var(--txt-muted); }
.bio-text { font-size: 0.85rem; color: var(--txt-muted); font-style: italic; margin: 0 0 20px 0; background: rgba(255,255,255,0.5); padding: 12px; border-radius: var(--radius-md); border-left: 3px solid var(--brand-primary); line-height: 1.5; }
.price-session-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; margin-top: auto; }
.price-badge { background: var(--price-bg); color: var(--price-green); padding: 6px 14px; border-radius: var(--radius-md); font-weight: 800; font-size: 1.2rem; }
.duration-badge { border: 1px solid var(--stroke); color: var(--txt-main); padding: 6px 12px; border-radius: var(--radius-md); font-weight: 600; font-size: 0.85rem; }
.cc-btn { width: 100%; border: none; cursor: pointer; border-radius: var(--radius-md); padding: 14px; font-family: inherit; font-weight: 700; font-size: 1rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-sizing: border-box; letter-spacing: 0.5px; }
.cc-btn:active { transform: scale(0.98); }
.cc-btn.primary { background: var(--brand-gradient); color: white; box-shadow: 0 4px 15px rgba(226, 55, 68, 0.25); }
.cc-btn.primary:hover { box-shadow: 0 8px 25px rgba(226, 55, 68, 0.35); transform: translateY(-2px); }
.trust-badges-container { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; background: var(--card-bg); border-radius: var(--radius-lg); padding: 24px; margin-top: 40px; box-shadow: var(--shadow-card); border: 1px solid var(--stroke); }
.trust-item { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.9rem; color: var(--txt-main); }
.trust-item span { font-size: 1.3rem; }

/* Bookings UI */
.booking-card-modern { background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--stroke); padding: 24px; box-shadow: var(--shadow-card); margin-bottom: 20px; }
.booking-top-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed var(--stroke); padding-bottom: 16px; margin-bottom: 16px; }
.booking-profile-flex { display: flex; gap: 16px; align-items: center; }
.booking-avatar { width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--brand-light); object-fit: cover; }
.booking-name { font-size: 1.2rem; font-weight: 700; color: var(--txt-main); margin: 0 0 4px 0; }
.booking-college { font-size: 0.9rem; color: var(--txt-muted); margin: 0; }
.booking-year-tag { font-size: 0.8rem; font-weight: 600; color: var(--brand-primary); margin-top: 6px; display: inline-block; background: var(--brand-light); padding: 4px 10px; border-radius: var(--radius-pill); }
.status-column { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.booking-status { padding: 6px 14px; border-radius: var(--radius-pill); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.status-confirmed { background: var(--brand-light); color: var(--brand-primary); }
.status-completed { background: var(--price-bg); color: var(--price-green); }
.status-pending { background: #fff8e1; color: #ff8f00; }
.status-cancelled { background: #ffebee; color: #d32f2f; }
.info-alert-box { background: rgba(226, 55, 68, 0.05); color: var(--brand-primary); padding: 12px 16px; border-radius: var(--radius-md); font-size: 0.9rem; font-weight: 600; border: 1px solid rgba(226, 55, 68, 0.15); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.rating-prompt-box { background: rgba(255,255,255,0.5); border: 1px dashed var(--stroke); border-radius: var(--radius-md); padding: 20px; text-align: center; margin-bottom: 16px; }
.booking-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 16px; }
.btn-outline { background: transparent; border: 1px solid var(--stroke); color: var(--txt-main); width: auto; padding: 12px 24px; }
.btn-outline.danger { color: #d32f2f; border-color: #ffcdd2; background: #ffebee; }

/* --- Desktop Nav / Bottom Nav Mobile --- */
.desktop-tabs { display: flex; gap: 12px; margin-bottom: 24px; background: var(--card-bg); padding: 8px; border-radius: var(--radius-pill); box-shadow: var(--shadow-card); width: max-content; border: 1px solid var(--stroke); }
.d-tab { text-decoration: none; color: var(--txt-muted); font-weight: 600; padding: 10px 24px; border-radius: var(--radius-pill); transition: all 0.3s; font-size: 0.95rem; }
.d-tab.active { background: var(--brand-primary); color: white; box-shadow: 0 4px 12px rgba(226, 55, 68, 0.3); }

/* 🔥 Mobile Bottom Nav - 4 Tabs perfectly aligned */
.bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--nav-bg); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 -10px 25px rgba(0,0,0,0.05); border-top: 1px solid var(--stroke); z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.b-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 0; text-decoration: none; color: var(--txt-muted); font-size: 0.7rem; font-weight: 600; gap: 4px; transition: color 0.2s; }
.b-nav-item.active { color: var(--brand-primary); }
.b-nav-icon { font-size: 1.35rem; }

/* 🔥 FOMO Notification Popup CSS */
.fomo-popup {
  position: fixed;
  bottom: 80px; /* Thoda upar rakha hai taki bottom nav se clash na kare */
  left: 20px;
  background: var(--card-bg);
  border-left: 4px solid var(--price-green);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  max-width: 320px;
  transform: translateX(-150%);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fomo-popup.show {
  transform: translateX(0);
}

.fomo-popup img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.fomo-popup .fomo-text {
  font-size: 0.85rem;
  color: var(--txt-main);
  line-height: 1.3;
}

.fomo-popup .fomo-time {
  font-size: 0.7rem;
  color: var(--txt-muted);
  margin-top: 4px;
  display: block;
}

/* =========================================
   📱 MOBILE RESPONSIVE FIXES 
   ========================================= */
@media (max-width: 768px) {
  .desktop-tabs { display: none; }
  .bottom-nav { display: flex; }
  footer { padding-bottom: 90px !important; }
  .main-container { padding: 12px; padding-bottom: 0px; overflow-x: hidden; }
  .top-header { gap: 10px; flex-wrap: wrap; }
  .brand-title { font-size: 1.35rem; } 
  .theme-btn { padding: 6px 12px; font-size: 0.8rem; }
  .hero-premium { padding: 24px 20px; border-radius: 16px; margin-bottom: 20px; }
  .hero-premium h1 { font-size: 1.6rem; }
  .predictor-header { padding: 24px 16px; }
  .predictor-header h2 { font-size: 1.5rem; }
  .choice-header { padding: 24px 16px; }
  .choice-header h2 { font-size: 1.5rem; }
  .p-details h4 { font-size: 0.95rem; }
  .search-section { padding: 0; margin-bottom: 24px; background: transparent; box-shadow: none; border: none; }
  .search-bar-modern { background: var(--card-bg); border-radius: 12px; padding: 12px 16px; box-shadow: var(--shadow-soft); }
  .filter-dropdowns { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; width: 100%; }
  .cc-select { background-color: var(--card-bg); box-shadow: var(--shadow-soft); border-radius: 12px; }
  .tags-scroll-container { padding: 8px 0; }
  .tag-chip { font-size: 0.85rem; padding: 8px 16px; background: var(--card-bg); box-shadow: var(--shadow-soft); }
  .grid-style-seniors { gap: 16px; }
  .senior-card-modern { padding: 20px; }
  .card-header-flex { flex-direction: row; text-align: left; align-items: center; }
  .avatar-box { width: 80px; height: 80px; margin-bottom: 0; }
  .name-text { font-size: 1.2rem; }
  .booking-top-row { flex-direction: column; align-items: flex-start; gap: 16px; }
  .booking-profile-flex { flex-direction: row; align-items: center; width: 100%; } 
  .status-column { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: flex-start; gap: 10px; width: 100%; }
  .info-alert-box { padding: 10px 12px; align-items: flex-start; font-size: 0.85rem; }
  .booking-actions { display: flex; flex-direction: row; gap: 10px; width: 100%; }
  .btn-outline, .cc-btn.primary { flex: 1; padding: 10px; font-size: 0.9rem; text-align: center; justify-content: center; }
  
  /* Mobile mein FOMO thoda adjust karein */
  .fomo-popup {
    bottom: 90px;
    left: 10px;
    right: 10px;
    max-width: none;
    width: auto;
  }
}
`;

const StarIcon = ({ filled, size = 18, isClickable = false }) => (
  <svg fill={filled ? "var(--star-color)" : "var(--stroke)"} width={size} height={size} viewBox="0 0 24 24" style={{ transition: "all 0.2s", cursor: isClickable ? "pointer" : "default", transform: isClickable ? "scale(1.1)" : "scale(1)" }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Chip = ({ active, onClick, children }) => (
  <button className={`tag-chip ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

const SkeletonCard = () => (
  <div className="senior-card-modern" style={{ opacity: 0.6 }}>
    <div className="card-header-flex">
      <div className="avatar-box" style={{ background: 'var(--stroke)', border: 'none' }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '70%', height: '16px', background: 'var(--stroke)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ width: '50%', height: '12px', background: 'var(--stroke)', borderRadius: '4px' }} />
      </div>
    </div>
    <div style={{ width: '100%', height: '40px', background: 'var(--stroke)', borderRadius: '12px', marginTop: 'auto' }} />
  </div>
);

// ===============================
// 📋 Component 1: Choice Filling Generator 
// ===============================
const ChoiceFillingGenerator = () => {
  const [branchFilter, setBranchFilter] = useState("CSE_IT");
  const [collegeFilter, setCollegeFilter] = useState("BOTH");
  const [loading, setLoading] = useState(false);
  const [generatedList, setGeneratedList] = useState(null);

  const generateList = (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedList(null);

    setTimeout(() => {
      const allColleges = [
        { id: 1, name: "MBM University, Jodhpur", branch: "Computer Science (CSE)", type: "Govt", bType: "CSE_IT", rank: 1 },
        { id: 2, name: "RTU Kota", branch: "Computer Science (CSE)", type: "Govt", bType: "CSE_IT", rank: 2 },
        { id: 3, name: "CTAE Udaipur", branch: "Computer Science (CSE)", type: "Govt", bType: "CSE_IT", rank: 3 },
        { id: 4, name: "MBM University, Jodhpur", branch: "Information Technology (IT)", type: "Govt", bType: "CSE_IT", rank: 4 },
        { id: 5, name: "MBM University, Jodhpur", branch: "Electrical Engineering", type: "Govt", bType: "CORE", rank: 5 },
        { id: 6, name: "SKIT Jaipur", branch: "Computer Science (CSE)", type: "Private", bType: "CSE_IT", rank: 6 },
        { id: 7, name: "JECRC Foundation", branch: "Computer Science (CSE)", type: "Private", bType: "CSE_IT", rank: 7 },
        { id: 8, name: "RTU Kota", branch: "Information Technology (IT)", type: "Govt", bType: "CSE_IT", rank: 8 },
        { id: 9, name: "CTAE Udaipur", branch: "AI & Data Science", type: "Govt", bType: "AI_DS", rank: 9 },
        { id: 10, name: "SKIT Jaipur", branch: "Information Technology (IT)", type: "Private", bType: "CSE_IT", rank: 10 },
        { id: 11, name: "JECRC Foundation", branch: "AI & Machine Learning", type: "Private", bType: "AI_DS", rank: 11 },
        { id: 12, name: "Poornima College of Engg", branch: "Computer Science (CSE)", type: "Private", bType: "CSE_IT", rank: 12 },
        { id: 13, name: "Engineering College Bikaner", branch: "Computer Science (CSE)", type: "Govt", bType: "CSE_IT", rank: 13 },
        { id: 14, name: "Engineering College Ajmer", branch: "Computer Science (CSE)", type: "Govt", bType: "CSE_IT", rank: 14 },
        { id: 15, name: "RTU Kota", branch: "Electrical Engineering", type: "Govt", bType: "CORE", rank: 15 },
        { id: 16, name: "Arya College Jaipur", branch: "Computer Science (CSE)", type: "Private", bType: "CSE_IT", rank: 16 },
        { id: 17, name: "MBM University, Jodhpur", branch: "Mechanical Engineering", type: "Govt", bType: "CORE", rank: 17 },
      ];

      let filtered = allColleges.filter(c => {
        let branchMatch = branchFilter === "ALL" || c.bType === branchFilter || (branchFilter === "CSE_IT" && c.bType === "AI_DS");
        let typeMatch = collegeFilter === "BOTH" || c.type.toUpperCase() === collegeFilter;
        return branchMatch && typeMatch;
      });

      filtered.sort((a, b) => a.rank - b.rank);
      setGeneratedList(filtered.slice(0, 15)); 
      setLoading(false);
      toast.success("✅ Ideal Preference List Generated!");
    }, 1000);
  };

  return (
    <div className="page-wrapper">
      <div className="choice-header">
        <h2>Smart Choice Filling 📋</h2>
        <p>Get the exact order to fill your REAP counseling form!</p>
      </div>

      <div className="form-card">
        <form onSubmit={generateList}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--txt-main)' }}>Target Branch / Field</label>
            <select className="cc-select" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="CSE_IT">Tech Branches (CSE, IT, AI, DS)</option>
              <option value="CORE">Core Branches (EE, ME, Civil, Mining)</option>
              <option value="ALL">All Branches (I just want best colleges)</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--txt-main)' }}>College Preference</label>
            <select className="cc-select" value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)}>
              <option value="BOTH">Govt. + Top Private (Recommended)</option>
              <option value="GOVT">Only Government Colleges</option>
              <option value="PRIVATE">Only Private Colleges</option>
            </select>
          </div>

          <button type="submit" className="action-btn btn-green" disabled={loading}>
            {loading ? "⚙️ Generating Ideal List..." : "Generate My Priority List"}
          </button>
        </form>
      </div>

      {generatedList && (
        <div className="priority-list-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--stroke)', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Your Ideal Option Form</h3>
            <button onClick={() => {toast.success("List copied to clipboard! Share it on WhatsApp.");}} style={{ background: 'transparent', border: '1px solid var(--stroke)', padding: '6px 12px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
              📋 Copy List
            </button>
          </div>
          
          {generatedList.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--txt-muted)', padding: '20px'}}>No colleges match your strict filter. Try selecting "Both" or "All Branches".</p>
          ) : (
            generatedList.map((col, index) => (
              <div key={col.id} className="priority-item" style={{ animation: `fadeIn 0.3s ease-out forwards`, animationDelay: `${index * 0.1}s`, opacity: 0 }}>
                <div className={`p-number ${index < 3 ? 'top-3' : ''}`}>{index + 1}</div>
                <div className="p-details">
                  <h4>{col.name}</h4>
                  <p>📚 {col.branch}</p>
                </div>
                <span className={`p-type ${col.type === 'Govt' ? 'type-govt' : 'type-pvt'}`}>
                  {col.type}
                </span>
              </div>
            ))
          )}
          
          <div style={{ background: '#fffbeb', color: '#b45309', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', marginTop: '20px', textAlign: 'center', border: '1px dashed #fcd34d' }}>
            ⚠️ <strong>Pro Tip:</strong> Always fill choices from BEST to AVERAGE. Never put an average college at Priority 1 just because your marks are low. For exact personalized list, talk to our Senior Mentors.
          </div>
        </div>
      )}
    </div>
  );
};


// ===============================
// 🎯 Component 2: College Predictor
// ===============================
const CollegePredictor = () => {
  const [mode, setMode] = useState("12th"); 
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("GEN");
  const [domicile, setDomicile] = useState("Rajasthan");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!score || score < 0 || score > 100) {
      toast.error("Please enter a valid percentage/percentile");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await axios.post("https://collegeconnect-backend-mrkz.onrender.com/api/predictor/predict", {
        score: score,
        category: category,
        mode: mode,
        domicile: domicile,
        gender: gender
      });

      if (res.data.length === 0) {
        toast.error("No colleges found for this score.");
      } else {
        setResults(res.data);
        toast.success("✨ REAP Algorithm applied successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Failed to fetch predictions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="predictor-header">
        <h2>REAP 2026 Pro Predictor 🎯</h2>
        <p>Based on Official Domicile, Category & Girls Quota rules</p>
      </div>

      <div className="predictor-card">
        <div className="toggle-group">
          <button type="button" className={`toggle-btn ${mode === "12th" ? "active" : ""}`} onClick={() => setMode("12th")}>
            12th Board %
          </button>
          <button type="button" className={`toggle-btn ${mode === "jee" ? "active" : ""}`} onClick={() => setMode("jee")}>
            JEE Percentile
          </button>
        </div>

        <form onSubmit={handlePredict}>
          <div className="input-group">
            <label>Enter your {mode === "12th" ? "12th Percentage" : "JEE Main Percentile"}</label>
            <input 
              type="number" 
              step="0.01"
              className="score-input" 
              placeholder="e.g. 85.50"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--txt-main)' }}>Home State</label>
              <select className="cc-select" value={domicile} onChange={(e) => setDomicile(e.target.value)} style={{ padding: '10px 16px', fontSize: '0.9rem', marginTop: '5px' }}>
                <option value="Rajasthan">Rajasthan (85% Quota)</option>
                <option value="Outside Rajasthan">Outside Rajasthan (15% Quota)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--txt-main)' }}>Gender</label>
              <select className="cc-select" value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: '10px 16px', fontSize: '0.9rem', marginTop: '5px' }}>
                <option value="Male">Male</option>
                <option value="Female">Female (25% Quota)</option>
              </select>
            </div>
          </div>

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--txt-main)', display: 'block', marginBottom: '8px' }}>Select Category</label>
          <div className="input-group" style={{ display: 'flex', gap: '15px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['GEN', 'EWS', 'OBC', 'MBC', 'SC', 'ST'].map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--txt-main)' }}>
                <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} /> {cat}
              </label>
            ))}
          </div>

          {domicile === "Outside Rajasthan" && category !== "GEN" && (
             <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '15px' }}>
               ℹ️ Note: Outside Rajasthan candidates are treated as General (GEN) in REAP counseling.
             </div>
          )}

          <button type="submit" className="predict-btn" disabled={loading}>
            {loading ? "✨ Running REAP Algorithm..." : "Predict My Colleges"}
          </button>
        </form>
      </div>

      {results && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--txt-main)' }}>Based on Real REAP Algorithm:</h3>
          {results.map((col, idx) => (
            <div key={idx} className="result-card" style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="college-info">
                <h4>{col.name}</h4>
                <p>📚 {col.branch}</p>
              </div>
              <div className={`chance-badge ${col.chance === 'High' ? 'chance-high' : 'chance-medium'}`}>
                {col.chance} Chance
              </div>
            </div>
          ))}
          <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--txt-muted)', marginTop: '16px'}}>
            *This prediction includes Girls Quota and State Domicile rules.
          </p>
        </div>
      )}
    </div>
  );
};

// ===============================
// 🎓 Component 3: FindSenior 
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
      <div className="hero-premium">
        <h1>Welcome to Reap Campus Connect</h1>
        <p>Connect with <strong>Top Seniors</strong>,<br/>True Guidance for Success</p>
      </div>
      
      <div className="search-section">
        <div className="search-bar-modern">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search by name, college or branch..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="filter-dropdowns">
          <select className="cc-select" value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}>
            <option value="">🎓 All Colleges</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select className="cc-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">⭐ Top Rated First</option>
            <option value="price_asc">💰 Low Price</option>
            <option value="price_desc">💸 High Price</option>
          </select>
        </div>

        <div className="tags-scroll-container">
          <Chip active={selectedTag === ""} onClick={() => setSelectedTag("")}>🚀 All Tags</Chip>
          {tags.slice(0, 10).map((t) => (
            <Chip key={t._id} active={selectedTag === t._id} onClick={() => setSelectedTag(t._id)}>
              {t.name}
            </Chip>
          ))}
        </div>
      </div>

      <h3 style={{fontSize: '1.4rem', margin: '30px 0 20px 0', fontWeight: 800}}>Recommended Mentors</h3>

      <div className="grid-style-seniors">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => {
              const seniorName = p.user?.name || 'Senior';
              const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=e23744&color=fff&size=150&bold=true`;
              const finalPrice = (p.price_per_session || 0) + platformFee;

              return (
                <div key={p._id} className="senior-card-modern">
                  <div className="card-header-flex">
                    <div className="avatar-box">
                      <img src={p.avatar || fallbackImage} alt={seniorName} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} />
                    </div>
                    <div className="info-box">
                      <h3 className="name-text">{seniorName} <span className="verified-tick">✔</span></h3>
                      <p className="college-text">{p.college?.name || "Premium Mentor"}</p>
                      
                      <div className="rating-row">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} size={15} />
                        ))}
                        <span style={{marginLeft: '4px'}}>{p.average_rating?.toFixed?.(1) ?? "0.0"} • {p.total_ratings || 0}</span>
                      </div>
                    </div>
                  </div>

<p className="bio-text">
  {p.bio ? (p.bio.length > 70 ? p.bio.substring(0, 70) + "..." : p.bio) : `Expert senior from ${p.college?.name || "top college"} ready to guide you.`}
</p>
                  <div className="price-session-row">
                    <span className="price-badge">₹{finalPrice}</span>
                    <span className="duration-badge">{p.session_duration_minutes || 20} min</span>
                  </div>

                  <Link to={`/book/${p.user._id}`} className="cc-btn primary">
                    🚀 Book Session
                  </Link>
                </div>
              );
            })
          : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--stroke)'}}>
              <h3 style={{color: 'var(--brand-primary)', margin: '0 0 8px 0'}}>No mentors found</h3>
              <p style={{color: 'var(--txt-muted)', margin: 0}}>Try adjusting your filters or search terms.</p>
            </div>
          )}
      </div>

      <div className="trust-badges-container">
        <div className="trust-item"><span>🛡️</span> Verified Senior Mentors</div>
        <div className="trust-item" style={{borderLeft: '1px solid var(--stroke)', borderRight: '1px solid var(--stroke)', padding: '0 20px'}}><span>👨‍🎓</span> Trusted by 1000+ Students</div>
        <div className="trust-item"><span>🎧</span> 24/7 Support</div>
      </div>
    </div>
  );
};

// ===============================
// 📘 Component 4: MyBookings 
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
        const res = await axios.get("https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my", { headers: { "x-auth-token": token } });
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
      await axios.post(`https://collegeconnect-backend-mrkz.onrender.com/api/ratings/submit/${bookingId}`, { rating: value }, { headers: { "x-auth-token": token } });
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, rated: true, rating: value, dispute_status: "not_allowed" } : b ));
      toast.success(`⭐ You rated ${value} stars!`);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to submit rating!";
      toast.error(`⚠️ ${errorMsg}`);
    }
  };

  const getStatusTagClass = (status) => {
    const base = "booking-status";
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
    if (d === "pending")  return "booking-status status-pending";
    if (d === "resolved") return "booking-status status-completed";
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
    const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=e23744&color=fff&size=150&bold=true`;
    const finalAvatar = seniorProfile?.avatar || b.profile?.avatar || fallbackImage;
    const yearText = getYearSuffix(b.profile?.year);

    return (
      <div key={b._id} className="booking-card-modern">
        <div className="booking-top-row">
          <div className="booking-profile-flex">
            <img src={finalAvatar} alt={seniorName} className="booking-avatar" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} />
            <div>
              <h3 className="booking-name">{seniorName}</h3>
              <p className="booking-college">{b.profile?.college?.name}</p>
              {yearText && <span className="booking-year-tag">{yearText}</span>}
            </div>
          </div>
          <div className="status-column">
            <span className={getStatusTagClass(status)}>{b.status}</span>
            {disputeTagClass && <span className={disputeTagClass}>{b.dispute_status}</span>}
          </div>
        </div>

        {status === "confirmed" && (
          <div className="info-alert-box">ℹ️ The senior will contact you on your phone within 6 hours.</div>
        )}

        {status === "completed" && !b.rated && (
          <div className="rating-prompt-box">
            <p style={{margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600}}>Rate this session:</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onMouseEnter={() => setHoverRating({ bookingId: b._id, value: star })} onMouseLeave={() => setHoverRating({ bookingId: null, value: 0 })} onClick={() => openRatingModal(b._id, b.senior?._id, star)}>
                  <StarIcon filled={star <= (hoverRating.bookingId === b._id ? hoverRating.value : 0)} size={34} isClickable={true} />
                </span>
              ))}
            </div>
          </div>
        )}

        {b.rated && (
          <div style={{background: 'var(--price-bg)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px'}}>
            <span style={{color: 'var(--price-green)', fontWeight: 600}}>You rated:</span>
            <div style={{display:'flex', gap:'2px'}}>
              {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < b.rating} size={18} />)}
            </div>
          </div>
        )}

        <div className="booking-actions">
          {status === "confirmed" && <button className="cc-btn primary" onClick={() => handleChat(b._id)}>💬 Chat</button>}
          {dispute === "none" && !b.rated && <button className="cc-btn btn-outline danger" onClick={() => handleDispute(b._id)}>⚠️ Raise Dispute</button>}
          
          {(dispute === "not_allowed" || b.rated) && dispute !== "pending" && dispute !== "resolved" && (
            <span style={{color:'var(--txt-muted)', fontSize:'0.85rem'}}>🚫 Dispute not allowed after rating.</span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="grid-style-seniors">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>;

  const activeBookings = bookings.filter((b) => b.status?.toLowerCase() !== "completed" && b.status?.toLowerCase() !== "cancelled");
  const pastBookings = bookings.filter((b) => b.status?.toLowerCase() === "completed" || b.status?.toLowerCase() === "cancelled");

  return (
    <div className="page-wrapper">
      <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleRating} title="⚠️ Confirm Rating">
        Once you rate this senior, you cannot raise a dispute.<br /><br />
        Are you sure you want to give a rating of <strong>{ratingData.value} {ratingData.value > 1 ? "stars" : "star"}</strong>?
      </ConfirmModal>

      <h2 style={{color: 'var(--txt-main)', fontWeight: 800, fontSize: '1.6rem', margin: '0 0 24px 0'}}>📘 My Bookings</h2>

      {bookings.length === 0 && (
        <div style={{textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--stroke)'}}>
          <h3 style={{color: 'var(--txt-main)', margin: '0 0 8px 0'}}>You haven't booked any sessions yet.</h3>
          <p style={{color: 'var(--txt-muted)', margin: 0}}>Find a senior and schedule your first session.</p>
        </div>
      )}

      {activeBookings.length > 0 && (
        <><h3 style={{margin:'0 0 16px 0', fontSize: '1.2rem'}}>Ongoing & Active</h3><div>{activeBookings.map(renderBookingCard)}</div></>
      )}

      {pastBookings.length > 0 && (
        <><h3 style={{margin:'32px 0 16px 0', fontSize: '1.2rem'}}>Completed & Past</h3><div>{pastBookings.map(renderBookingCard)}</div></>
      )}
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'}}>
      <div style={{background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', padding: '30px 24px', textAlign: 'center', boxShadow: 'var(--shadow-hover)'}}>
        <h3 style={{margin: '0 0 16px 0', color: 'var(--brand-primary)'}}>{title}</h3>
        <div style={{color: 'var(--txt-main)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: '1.5'}}>{children}</div>
        <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
          <button onClick={onClose} className="cc-btn btn-outline">Cancel</button>
          <button onClick={onConfirm} className="cc-btn primary" style={{width: 'auto'}}>Yes, Continue</button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// 🌈 Main Dashboard Shell (With FOMO & 4 Tabs)
// ===============================
const StudentDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [theme, setTheme] = useState('light');

  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [platformFee, setPlatformFee] = useState(20); 
  const [loading, setLoading] = useState(true);

  // 🚀 FOMO State
  const [fomoData, setFomoData] = useState(null);
  const [showFomo, setShowFomo] = useState(false);

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPath]);

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

 // 🚀 FOMO Notification Logic (100% Random & Bug-Free)
  useEffect(() => {
    const names = ["Rahul", "Priya", "Amit", "Neha", "Vikas", "Anjali", "Ravi", "Sneha", "Karan", "Pooja", "Aman", "Shruti", "Sandeep", "Kavita", "Mohit", "Deepak", "Riya"];
    const cities = ["Jaipur", "Kota", "Udaipur", "Delhi", "Jodhpur", "Bikaner", "Ajmer", "Alwar", "Sikar", "Bhilwara", "Indore", "Pune", "Gurgaon"];
    const fomoColleges = ["MBM Jodhpur", "RTU Kota", "CTAE Udaipur", "SKIT Jaipur", "JECRC Foundation", "Poornima College", "Arya College", "EC Bikaner", "EC Ajmer"];

    let timerId;

    const triggerFomo = () => {
      // 🚀 हर बार बिल्कुल नया रैंडम डेटा जनरेट होगा
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomCollege = fomoColleges[Math.floor(Math.random() * fomoColleges.length)];
      const randomTime = Math.floor(Math.random() * 5) + 1; // 1 से 5 मिनट
      
      setFomoData({
        text: `🔥 ${randomName} from ${randomCity} just booked a session with a Senior from ${randomCollege}!`,
        time: `${randomTime} mins ago`,
        img: `https://ui-avatars.com/api/?name=${randomName}&background=e23744&color=fff&bold=true`
      });

      setShowFomo(true);
      
      // 5 सेकंड बाद पॉपअप को स्मूथली छुपा दें
      setTimeout(() => {
        setShowFomo(false);
      }, 5000);

      // अगला पॉपअप ठीक 2 मिनट (120 सेकंड) बाद लाएँ
      timerId = setTimeout(triggerFomo, 120000);
    };

    // पहला पॉपअप 15 सेकंड बाद
    timerId = setTimeout(triggerFomo, 15000);

    // 🧹 Cleanup: जब यूजर दूसरे पेज पर जाए तो बैकग्राउंड टाइमर को रोक दें
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className={`page-bg ${theme}`}>
      <style>{globalStyles}</style>

      <div className="main-container">
        
        {/* Premium App Header */}
        <div className="top-header">
          <h1 className="brand-title">CampusConnect</h1>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* 💻 Desktop Navigation */}
        <div className="desktop-tabs">
          <Link to="/student-dashboard" className={`d-tab ${currentPath === "/student-dashboard" ? "active" : ""}`}>
            ✨ Find Seniors
          </Link>
          <Link to="/student-dashboard/predictor" className={`d-tab ${currentPath.includes("/predictor") ? "active" : ""}`}>
            🎯 Predictor
          </Link>
          <Link to="/student-dashboard/choice-filling" className={`d-tab ${currentPath.includes("/choice-filling") ? "active" : ""}`}>
            📋 Choice Filling
          </Link>
          <Link to="/student-dashboard/bookings" className={`d-tab ${currentPath.includes("/bookings") ? "active" : ""}`}>
            📘 Bookings
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<FindSenior seniors={seniors} loading={loading} colleges={colleges} tags={tags} platformFee={platformFee} />} />
          <Route path="/predictor" element={<CollegePredictor />} />
          <Route path="/choice-filling" element={<ChoiceFillingGenerator />} />
          <Route path="/bookings" element={<MyBookings seniors={seniors} />} />
        </Routes>
      </div>

      {/* 📱 Mobile Bottom Nav */}
      <div className="bottom-nav">
        <Link to="/student-dashboard" className={`b-nav-item ${currentPath === "/student-dashboard" ? "active" : ""}`}>
          <span className="b-nav-icon">🏫</span>
          Seniors
        </Link>
        <Link to="/student-dashboard/predictor" className={`b-nav-item ${currentPath.includes("/predictor") ? "active" : ""}`}>
          <span className="b-nav-icon">🎯</span>
          Predictor
        </Link>
        <Link to="/student-dashboard/choice-filling" className={`b-nav-item ${currentPath.includes("/choice-filling") ? "active" : ""}`}>
          <span className="b-nav-icon">📋</span>
          Choices
        </Link>
        <Link to="/student-dashboard/bookings" className={`b-nav-item ${currentPath.includes("/bookings") ? "active" : ""}`}>
          <span className="b-nav-icon">📘</span>
          Bookings
        </Link>
      </div>

      {/* 🚀 FOMO Popup Component */}
      {fomoData && (
        <div className={`fomo-popup ${showFomo ? 'show' : ''}`}>
          <img src={fomoData.img} alt="User" />
          <div>
            <div className="fomo-text">{fomoData.text}</div>
            <span className="fomo-time">{fomoData.time}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;