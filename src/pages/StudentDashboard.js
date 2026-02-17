import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ===============================
// 🔮 Global CSS (Mobile App + Glassmorphism)
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
  --bg: #f4fcf6ff;                
  --card: #ffffff;                
  --panel: #ffffffdd;             
  --stroke: #e5e7eb;              
  --txt: #111827;                
  --muted: #6b7280;              
  --brand1: #7c3aed;              
  --brand2: #06b6d4;              
  --ok: #16a34a;                  
  --warn: #f59e0b;                
  --danger: #ef4444;              
  
  --bg-gradient: radial-gradient(circle at top, #e0f2fe 0, #f4f7fc 35%, #f9fafb 70%, #eef2ff 100%);
  --panel-bg: rgba(255,255,255,0.92);
  --input-bg: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  --tab-bg: #f3f4f6;
  --tab-hover-bg: #e5e7eb;
  --info-bg: #eff6ff;
  --info-color: #3b82f6;
  --rating-bg: #f9fafb;
  --rating-prompt-color: var(--brand1);
  --rated-bg: #f0fdf4;
  --rated-color: #166534;
  --dispute-color: #b91c1c;
  --modal-bg: #ffffff;
}

/* =================================
  2. DARK THEME VARIABLES
================================= */
.dark {
  --bg: #020617;
  --card: #020617cc;
  --panel: #020617ee;
  --stroke: #1f2937;
  --txt: #e5e7eb;
  --muted: #9ca3af;
  --brand1: #7c3aed;
  --brand2: #06b6d4;
  --ok: #22c55e;
  --warn: #facc15;
  --danger: #ef4444;

  --bg-gradient: radial-gradient(circle at top, #0f172a 0, #020617 55%, #020617 100%);
  --panel-bg: rgba(15,23,42,0.92);
  --input-bg: linear-gradient(180deg, #020617 0%, #020617 70%, #020617 100%);
  --tab-bg: linear-gradient(180deg,#020617,#020617);
  --tab-hover-bg: linear-gradient(180deg,#020617,#020617);
  --info-bg: linear-gradient(180deg, #020617, #020617);
  --info-color: #c7d2fe;
  --rating-bg: linear-gradient(180deg, #020617, #020617);
  --rating-prompt-color: #c7d2fe;
  --rated-bg: linear-gradient(180deg, #022c22, #022c22);
  --rated-color: #bbf7d0;
  --dispute-color: #fca5a5;
  --modal-bg: radial-gradient(circle at top,#020617,#020617);
}

* { outline: none; box-sizing: border-box; }

/* =================================
  3. Page Layout (Theme-Aware)
================================= */
.page-bg {
  min-height: 100vh;
  background:
    radial-gradient(900px 400px at -10% -10%, rgba(124,58,237,.28), transparent 60%),
    radial-gradient(800px 350px at 110% 0%, rgba(6,182,212,.25), transparent 60%),
    var(--bg-gradient);
  background-color: var(--bg);
  font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 14px 10px 24px;
}
.main-container {
  width: 100%;
  max-width: 480px; /* 📱 Mobile App Width */
  margin: 0 auto;
}
.page-wrapper {
  padding: 8px 4px 18px;
  color: var(--txt);
}

/* App Shell (like mobile screen) */
.app-shell {
  background: var(--panel-bg);
  border-radius: 26px;
  border: 1px solid rgba(148,163,184,0.45);
  box-shadow:
    0 24px 60px rgba(15,23,42,0.40),
    0 0 0 1px rgba(15,23,42,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
}

/* Top App Header */
.app-header {
  padding: 14px 18px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: radial-gradient(circle at top left, rgba(124,58,237,0.2), transparent 50%), radial-gradient(circle at top right, rgba(6,182,212,0.18), transparent 52%), transparent;
  border-bottom: 1px solid rgba(148,163,184,0.35);
}
.app-header-left {
  display: flex;
  flex-direction: column;
}
.app-logo-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15,23,42,0.9);
  color: white;
  font-size: .7rem;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.app-logo-dot {
  height: 8px;
  width: 8px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 10%, #f97316 0, #ef4444 40%, #b91c1c 100%);
}
.app-title {
  margin-top: 8px;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: .02em;
  color: var(--txt);
}
.app-subtitle {
  margin-top: 2px;
  font-size: .8rem;
  color: var(--muted);
}
.app-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 600;
  background: rgba(15,23,42,0.9);
  color: #e5e7eb;
}

/* theme button */
.theme-toggle-btn {
  height: 34px;
  width: 34px;
  min-width: 34px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(148,163,184,0.5);
  background: radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(15,23,42,0.92));
  color: #e5e7eb;
  font-size: 1.25rem;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  transition: all 0.22s ease;
}
.theme-toggle-btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 10px 24px rgba(15,23,42,0.65);
}

/* =================================
  4. Reusable Components
================================= */
.small-muted {
  color: var(--muted);
  font-size: .9rem;
}
.rating-row svg {
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.25));
}
.light .rating-row svg { filter: none; }

.cc-input, .cc-select {
  border:1px solid rgba(148,163,184,0.6);
  background: var(--input-bg);
  color:var(--txt);
  border-radius:14px;
  padding:11px 14px;
  width:100%;
  transition:.25s border-color, .25s box-shadow, .25s transform, .25s background;
  font-family: "Poppins", system-ui, sans-serif;
  font-size: .9rem;
}
.cc-input::placeholder {
  color: rgba(148,163,184,0.8);
}
.cc-input:focus, .cc-select:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56,189,248,.25);
  transform: translateY(-1px);
  background: radial-gradient(circle at top, rgba(248,250,252,1), rgba(241,245,249,1));
}

.cc-tab {
  border-radius:999px;
  padding:8px 14px;
  font-weight:700;
  text-decoration:none;
  color:var(--muted);
  background: transparent;
  border:none;
  font-size:.82rem;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  cursor:pointer;
  transition:all .22s ease;
  white-space: nowrap;
}
.cc-tab.active {
  background: radial-gradient(circle at top left, var(--brand2), var(--brand1));
  color:white;
  box-shadow: 0 8px 20px rgba(79,70,229,0.4);
}
.cc-tab:not(.active):hover { 
  color: var(--txt);
  transform: translateY(-1px);
}

.cc-btn {
  border:none; cursor:pointer; border-radius:999px; padding:10px 16px; font-weight:700;
  color:white; text-decoration:none; display:inline-flex; align-items:center; gap:8px;
  transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
  justify-content: center;
  font-size:.9rem;
}
.cc-btn:active { transform: translateY(1px) scale(.985) }
.cc-btn.primary {
  background: linear-gradient(120deg, var(--brand2), var(--brand1));
  box-shadow: 0 10px 26px rgba(79,70,229,.5);
}
.cc-btn.danger {
  background: linear-gradient(120deg, #fb7185, var(--danger));
  box-shadow: 0 10px 26px rgba(239,68,68,.5);
}
.cc-chip {
  border:1px solid rgba(148,163,184,0.5);
  color:var(--muted);
  background: radial-gradient(circle at top left, rgba(248,250,252,0.9), rgba(241,245,249,0.95));
  border-radius:999px;
  padding:7px 12px;
  font-weight:600;
  cursor:pointer;
  transition:.2s transform,.2s box-shadow,.2s color,.2s background,.2s border-color;
  margin: 2px;
  font-size:.8rem;
}
.cc-chip:hover { 
  transform: translateY(-1px); 
  box-shadow: 0 8px 20px rgba(15,23,42,0.15);
}
.cc-chip.active {
  color:white;
  border-color: transparent;
  background: linear-gradient(120deg,var(--brand1),var(--brand2));
  box-shadow: 0 10px 26px rgba(79,70,229,.5);
}

.card {
  background: var(--card);
  backdrop-filter: blur(14px);
  border:1px solid rgba(148,163,184,0.45);
  border-radius:20px;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.dark .card {
  box-shadow: 0 22px 50px rgba(2,6,23,.75);
}
.light .card {
  box-shadow: 0 18px 38px rgba(15,23,42,0.16);
}
.card:hover { 
  transform: translateY(-1px); 
  border-color: rgba(129,140,248,0.9); 
}

/* =================================
  5. Tabs Bar (Top) + Bottom Nav
================================= */
.tab-bar-wrapper {
  padding: 8px 14px 12px;
}
.tab-bar {
  display: flex;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: radial-gradient(circle at top left, rgba(15,23,42,0.92), rgba(15,23,42,0.98));
  border: 1px solid rgba(148,163,184,0.7);
  align-items: center;
  position: relative;
}

/* Bottom nav (mobile-style) */
.bottom-nav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 12px 14px;
  background: linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.96) 40%, rgba(15,23,42,0.98) 100%);
  border-top: 1px solid rgba(148,163,184,0.4);
  display: none;
  z-index: 10;
}
.bottom-nav-inner {
  background: rgba(15,23,42,0.98);
  border-radius: 999px;
  border: 1px solid rgba(148,163,184,0.6);
  padding: 6px;
  display: flex;
  gap: 6px;
}
.bottom-nav-btn {
  flex:1;
  border-radius: 999px;
  border:none;
  padding:8px 10px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  font-size:.78rem;
  font-weight:600;
  background: transparent;
  color:#9ca3af;
  cursor:pointer;
  transition:all .18s ease;
}
.bottom-nav-btn.active {
  background: linear-gradient(120deg,#4f46e5,#06b6d4);
  color:white;
  box-shadow: 0 10px 26px rgba(79,70,229,.7);
}

/* =================================
  6. FindSenior Component
================================= */
.panel-wrap {
  border: 1px solid rgba(148,163,184,0.6);
  background: radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,0.96));
  backdrop-filter: blur(16px);
  border-radius: 18px;
  padding: 12px 12px 12px;
  margin-bottom: 14px;
  box-shadow: 0 18px 40px rgba(15,23,42,0.75);
}
.light .panel-wrap {
  background: radial-gradient(circle at top left, rgba(255,255,255,0.92), rgba(248,250,252,0.96));
  box-shadow: 0 16px 36px rgba(15,23,42,0.18);
}
.filter-row {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  margin-top: 8px;
}
.tag-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.grid-style-seniors {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 480px) {
  .grid-style-seniors {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
.senior-card {
  padding: 16px 14px 16px;
  text-align: center;
}
.senior-card .image-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}
.senior-card .avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(124,58,237,.75);
  box-shadow: 0 16px 40px rgba(15,23,42,.85);
}
.light .senior-card .avatar {
  border-color: #6366f1;
  box-shadow: 0 14px 32px rgba(79,70,229,0.45);
}

.senior-card .name-style {
  color: var(--txt);
  font-weight: 800;
  font-size: 1.02rem;
  margin: 10px 0 4px;
}
.light .senior-card .name-style {
  color: #111827;
}
.senior-card .college-style {
  color: var(--muted);
  font-size: .85rem;
  margin: 0 0 4px;
}
.senior-card .bio-style {
  color: var(--txt);
  font-size: .88rem;
  margin: 6px 0 12px;
  min-height: 40px;
}
.light .senior-card .bio-style {
  color: #6b7280;
}
.senior-card .rating-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}
.senior-card .rating-count {
  margin-left: 6px;
  color: #9ca3af;
  font-weight: 600;
  font-size:.8rem;
}
.senior-card .price-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}
.senior-card .small-chip {
  border: 1px solid rgba(148,163,184,0.7);
  color: var(--txt);
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: .78rem;
  background: radial-gradient(circle at top left, rgba(15,23,42,0.98), rgba(15,23,42,0.96));
  color:#e5e7eb;
}
.light .senior-card .small-chip {
  background: rgba(248,250,252,0.98);
  color:#111827;
}
.senior-card .price-text {
  color: #4ade80;
  font-weight: 800;
  font-size: 1.02rem;
}
.light .senior-card .price-text {
  color: var(--ok);
}

/* =================================
  7. MyBookings Component
================================= */
.grid-style-bookings {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
.booking-card {
  padding: 16px 14px 14px;
}
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed rgba(148,163,184,0.6);
  padding-bottom: 11px;
  gap: 12px;
}
.booking-card .booking-name {
  color: var(--txt);
  font-weight: 800;
  font-size: 1.02rem;
  margin: 0;
}
.booking-card .booking-college {
  color: var(--muted);
  font-size: .86rem;
  margin: 6px 0 0 0;
}
.booking-card .booking-year-style {
  color: #a5b4fc;
  font-size: .82rem;
  font-weight: 700;
  margin: 4px 0 0 0;
}
.light .booking-card .booking-year-style {
  color: #4f46e5;
}
.booking-card .booking-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(129,140,248,.75);
  box-shadow: 0 12px 30px rgba(15,23,42,.8);
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
  padding: 4px 11px;
  border-radius: 999px;
  font-weight: 700;
  font-size: .78rem;
  text-transform: capitalize;
  border: 1px solid transparent;
}

/* Status Tag Colors */
.status-tag.status-confirmed { background: rgba(99,102,241,.16); color: #c7d2fe; }
.status-tag.status-completed { background: rgba(34,197,94,.16); color: #bbf7d0; }
.status-tag.status-pending { background: rgba(245,158,11,.15); color: #fde68a; }
.status-tag.status-cancelled { background: rgba(239,68,68,.16); color: #fecaca; }
.light .status-tag.status-confirmed { background: #e0e7ff; color: #4f46e5; }
.light .status-tag.status-completed { background: #dcfce7; color: #166534; }
.light .status-tag.status-pending { background: #fef9c3; color: #92400e; }
.light .status-tag.status-cancelled { background: #fee2e2; color: #b91c1c; }

.booking-card .info-message {
  background: var(--info-bg);
  color: var(--info-color);
  padding: 11px;
  border-radius: 12px;
  font-size: .88rem;
  font-weight: 500;
  text-align: left;
  line-height: 1.5;
  border: 1px solid rgba(148,163,184,0.65);
  margin-top: 10px;
}
.booking-card .rating-section {
  background: var(--rating-bg);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  border: 1px solid rgba(148,163,184,0.6);
  margin-top: 9px;
}
.booking-card .rating-prompt {
  font-weight: 800;
  color: var(--rating-prompt-color);
  margin: 0 0 8px 0;
  font-size: .9rem;
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
  border-radius: 12px;
  color: var(--rated-color);
  font-weight: 800;
  border: 1px solid rgba(148,163,184,0.6);
  margin-top: 8px;
}
.booking-card .rated-stars {
  display: flex;
  gap: 2px;
}
.booking-card .button-row {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(148,163,184,0.6);
}
.booking-card .btn-compact {
  font-size: .82rem;
  padding: 7px 12px;
}
.booking-card .dispute-not-allowed {
  color: var(--dispute-color);
  font-weight: 700;
  font-size: .8rem;
  padding: 6px 0;
}

/* =================================
  8. Modal
================================= */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top,rgba(15,23,42,0.85),rgba(2,6,23,0.96));
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease;
  padding: 14px;
}
.modal-content {
  background: var(--modal-bg);
  border: 1px solid rgba(148,163,184,0.6);
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  animation: slideIn 0.25s ease;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(148,163,184,0.6);
}
.modal-title {
  color: var(--brand1);
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}
.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.9rem;
  color: var(--muted);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.18s;
}
.modal-close-btn:hover {
  color: var(--txt);
}
.modal-body {
  padding: 16px 18px 14px;
  color: var(--txt);
  font-size: .95rem;
  line-height: 1.6;
}
.modal-body strong {
  color: var(--brand1);
  font-weight: 700;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 18px 14px;
  background: rgba(15,23,42,0.9);
  border-top: 1px solid rgba(148,163,184,0.6);
}
.light .modal-footer {
  background: #f9fafb;
}

/* =================================
  9. Titles
================================= */
.title-style {
  text-align: left;
  color: var(--txt);
  margin-bottom: 12px;
  font-weight: 800;
  letter-spacing: .02em;
  font-size: 1.1rem;
}
.section-title-style {
  color: var(--txt);
  font-weight: 700;
  font-size: .96rem;
  margin: 12px 0 8px 2px;
  border-left: 3px solid var(--brand1);
  padding-left: 8px;
}

/* =================================
  10. Skeletons
================================= */
.skeleton {
  background: linear-gradient(90deg, #0f172a 25%, #1e293b 50%, #0f172a 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 12px;
}
.light .skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 800px 100%;
}

/* =================================
  11. MOBILE RESPONSIVE
================================= */
@media (max-width: 640px) {
  .app-shell {
    border-radius: 26px;
  }
  .booking-header {
    align-items: flex-start;
  }
  .bottom-nav {
    display: block;
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

// Small UI atom
const Chip = ({ active, onClick, children }) => (
  <button className={`cc-chip ${active ? "active" : ""}`} onClick={onClick}>
    {children}
  </button>
);

// Skeleton
const SkeletonCard = () => (
  <div className="card" style={{ padding: 16 }}>
    <div className="skeleton" style={{ width: 86, height: 86, borderRadius: 999, margin: "6px auto" }} />
    <div className="skeleton" style={{ width: "60%", height: 12, margin: "12px auto" }} />
    <div className="skeleton" style={{ width: "40%", height: 10, margin: "8px auto" }} />
    <div className="skeleton" style={{ width: "80%", height: 10, margin: "12px auto" }} />
    <div className="skeleton" style={{ width: "50%", height: 12, margin: "14px auto" }} />
    <div className="skeleton" style={{ width: "70%", height: 32, margin: "14px auto", borderRadius: 999 }} />
  </div>
);

// ===============================
// 🎓 FindSenior
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
        <div style={{ display: "grid", gap: 8 }}>
          <input
            className="cc-input"
            type="text"
            placeholder="🔎 Search by name, college or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-row">
            <select
              className="cc-select"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
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
              <div key={p._id} className="card senior-card">
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
                    <StarIcon key={i} filled={i < Math.round(p.average_rating || 0)} size={18} />
                  ))}
                  <span className="rating-count">
                    {p.average_rating?.toFixed?.(1) ?? "0.0"} • {p.total_ratings || 0}
                  </span>
                </div>

                <p className="college-style">{p.college?.name}</p>
                <p className="bio-style">
                  {(p.bio || "—").substring(0, 90)}
                  {(p.bio?.length ?? 0) > 90 ? "…" : ""}
                </p>

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
            <div className="card" style={{ padding: 22, gridColumn: "1 / -1", textAlign: "center" }}>
              <div style={{ fontSize: 16, color: "var(--txt)", fontWeight: 700 }}>No seniors found</div>
              <div className="small-muted" style={{ marginTop: 6 }}>
                Try adjusting filters or search keywords.
              </div>
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
  };

  const handleRating = async () => {
    const { bookingId, value } = ratingData;
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
      case "confirmed":
        return `${base} status-confirmed`;
      case "completed":
        return `${base} status-completed`;
      case "pending":
        return `${base} status-pending`;
      case "cancelled":
        return `${base} status-cancelled`;
      default:
        return base;
    }
  };

  const getDisputeTagClass = (dispute) => {
    const d = (dispute || "").toLowerCase();
    if (d === "pending") return "status-tag status-pending";
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
    const correctAvatar = seniorProfile ? seniorProfile.avatar : null;
    const yearText = getYearSuffix(b.profile?.year);

    return (
      <div key={b._id} className="card booking-card">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{b.senior?.name}</h3>
            <p className="booking-college">{b.profile?.college?.name}</p>
            {yearText && <p className="booking-year-style">{yearText}</p>}
          </div>
          <img
            src={correctAvatar || b.profile?.avatar || "https://via.placeholder.com/60"}
            alt={b.senior?.name}
            className="booking-avatar"
            loading="lazy"
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
          <div className="rated-section">
            <span>You rated:</span>
            <div className="rated-stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < b.rating} size={18} />
              ))}
            </div>
          </div>
        )}

        <div className="button-row">
          {status === "confirmed" && (
            <button className="cc-btn primary btn-compact" onClick={() => handleChat(b._id)}>
              💬 Chat
            </button>
          )}
          {dispute === "none" && !b.rated && (
            <button className="cc-btn danger btn-compact" onClick={() => handleDispute(b._id)}>
              ⚠️ Raise Dispute
            </button>
          )}
          {(dispute === "not_allowed" || b.rated) &&
            dispute !== "pending" &&
            dispute !== "resolved" && (
              <span className="dispute-not-allowed">🚫 Dispute not allowed after rating.</span>
            )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid-style-bookings page-wrapper">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
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
          <br />
          Are you sure you want to give a rating of
          <strong>
            {" "}
            {ratingData.value} {ratingData.value > 1 ? "stars" : "star"}
          </strong>
          ?
        </p>
      </ConfirmModal>

      <h2 className="title-style">📘 My Bookings</h2>

      {bookings.length === 0 && (
        <div className="card" style={{ padding: 22, textAlign: "center" }}>
          <div style={{ color: "var(--txt)", fontWeight: 700 }}>You haven't booked any sessions yet.</div>
          <div className="small-muted" style={{ marginTop: 6 }}>
            Find a senior and schedule your first session.
          </div>
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
          <h3 className="section-title-style" style={{ marginTop: 22 }}>
            Completed & Past
          </h3>
          <div className="grid-style-bookings">{pastBookings.map(renderBookingCard)}</div>
        </>
      )}
    </div>
  );
};

// ===============================
// 🚀 Confirm Modal
// ===============================
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="cc-btn"
            style={{ background: "var(--stroke)", color: "var(--muted)" }}
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
// 🌈 Main Dashboard Shell
// ===============================
const StudentDashboard = () => {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes("/bookings");

  const [theme, setTheme] = useState("light");

  const [seniors, setSeniors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Load Poppins
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
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

  const goHome = () => navigate("/student-dashboard");
  const goBookings = () => navigate("/student-dashboard/bookings");

  return (
    <div className={`page-bg ${theme}`}>
      <style>{globalStyles}</style>

      <div className="main-container">
        <div className="app-shell">
          {/* Top Header */}
          <header className="app-header">
            <div className="app-header-left">
              <div className="app-logo-pill">
                <span className="app-logo-dot" />
                <span>CollegeConnect</span>
              </div>
              <div className="app-title">Hi Student 👋</div>
              <div className="app-subtitle">
                Find mentors & track your booked sessions in one place.
              </div>
            </div>
            <div className="app-header-right">
              <div className="app-badge">Student</div>
              <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </header>

          {/* Top Tabs (like segmented control) */}
          <div className="tab-bar-wrapper">
            <div className="tab-bar">
              <button
                onClick={goHome}
                className={`cc-tab ${!onBookingsTab ? "active" : ""}`}
              >
                🎓 Seniors
              </button>
              <button
                onClick={goBookings}
                className={`cc-tab ${onBookingsTab ? "active" : ""}`}
              >
                📘 Bookings
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
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

          {/* Bottom Nav – mobile app feel */}
          <nav className="bottom-nav">
            <div className="bottom-nav-inner">
              <button
                className={`bottom-nav-btn ${!onBookingsTab ? "active" : ""}`}
                onClick={goHome}
              >
                <span>🎓</span>
                <span>Seniors</span>
              </button>
              <button
                className={`bottom-nav-btn ${onBookingsTab ? "active" : ""}`}
                onClick={goBookings}
              >
                <span>📘</span>
                <span>Bookings</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
