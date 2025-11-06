import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// 🌟 Modern Booking Cards
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const buttonBase = {
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
  };

  const btnPrimary = {
    ...buttonBase,
    background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
    color: '#fff',
    boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
  };

  const btnSecondary = {
    ...buttonBase,
    background: 'transparent',
    color: '#6366F1',
    border: '1px solid #6366F1',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  const renderActions = (b) => {
    if (b.dispute_status === 'Pending')
      return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#F59E0B', fontWeight: '600' }}>⚠ Under Review</span>
          <button style={btnSecondary} onClick={() => onStartChat(b._id)}>
            Chat
          </button>
        </div>
      );
    if (b.status === 'Completed')
      return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#10B981', fontWeight: '600' }}>✅ Completed</span>
          <button style={btnSecondary} onClick={() => onStartChat(b._id)}>
            Chat History
          </button>
        </div>
      );
    if (b.status === 'Confirmed')
      return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button style={btnPrimary} onClick={() => onStartChat(b._id)}>
            💬 Start Chat
          </button>
          <button style={btnSecondary} onClick={() => onMarkComplete(b._id)}>
            ✔ Mark Done
          </button>
        </div>
      );
    return null;
  };

  if (loading)
    return <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>⏳ Loading bookings...</p>;
  if (bookings.length === 0)
    return <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '20px' }}>No bookings found.</p>;

  return (
    <div style={{ padding: '10px 20px' }}>
      <h3
        style={{
          textAlign: 'center',
          background: 'linear-gradient(90deg,#4F46E5,#9333EA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: '25px',
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '22px',
        }}
      >
        {bookings.map((b) => (
          <div
            key={b._id}
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              borderRadius: '18px',
              padding: '18px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            }}
          >
            <h4 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: 600 }}>
              👨‍🎓 {b.student?.name || 'Student'}
            </h4>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>📞 {b.student?.mobileNumber || 'N/A'}</p>
            <p style={{ color: '#4F46E5', fontWeight: 600 }}>Status: {b.status}</p>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>
              {b.dispute_status === 'Pending'
                ? b.dispute_reason?.reason || 'Under Review'
                : b.dispute_status}
            </p>
            <div style={{ marginTop: '10px' }}>{renderActions(b)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🌈 Senior Dashboard (Modern UI)
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my', {
        headers: { 'x-auth-token': token },
      });
      setMyBookings(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const markAsCompletedHandler = async (bookingId) => {
    if (!window.confirm('Mark this booking as completed?')) return;
    const toastId = toast.loading('Updating...');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${bookingId}`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      toast.dismiss(toastId);
      toast.success('Marked as Completed!');
      loadBookings();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  const handleStartChat = (bookingId) => navigate(`/chat/${bookingId}`);

  const tasksToComplete = myBookings.filter((b) => b.status === 'Confirmed' && b.dispute_status !== 'Pending');
  const disputedBookings = myBookings.filter((b) => b.dispute_status === 'Pending');
  const completedHistory = myBookings.filter((b) => b.status === 'Completed' || b.dispute_status === 'Resolved');
  const activeTab = location.pathname;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)',
        padding: '25px 15px 40px 15px',
        animation: 'fadeIn 0.6s ease-in-out',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2
          style={{
            background: 'linear-gradient(90deg,#4F46E5,#7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.8rem',
            fontWeight: 700,
          }}
        >
          Welcome, {auth.user?.name || 'Senior'} 👋
        </h2>
        <p style={{ color: '#6B7280', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
          Manage your sessions, chat with students, and view your booking history.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(255,255,255,0.9)',
          padding: '12px 15px',
          borderRadius: '25px',
          width: '95%',
          margin: '0 auto 25px auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 10,
          zIndex: 10,
        }}
      >
        {[
          { path: '/senior-dashboard', label: '🆕 New', count: tasksToComplete.length },
          { path: '/senior-dashboard/disputes', label: '⚠️ Disputes', count: disputedBookings.length },
          { path: '/senior-dashboard/history', label: '✅ History', count: completedHistory.length },
        ].map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: '25px',
              fontWeight: 600,
              background:
                activeTab === tab.path || activeTab.includes(tab.path)
                  ? 'linear-gradient(45deg,#6366F1,#7C3AED)'
                  : '#F3F4F6',
              color:
                activeTab === tab.path || activeTab.includes(tab.path)
                  ? '#fff'
                  : '#4F46E5',
              boxShadow:
                activeTab === tab.path
                  ? '0 4px 12px rgba(99,102,241,0.3)'
                  : 'none',
              transition: '0.3s',
            }}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
        <Link
          to="/senior-earnings"
          style={{
            background: 'linear-gradient(45deg,#10B981,#059669)',
            color: '#fff',
            textDecoration: 'none',
            padding: '9px 16px',
            borderRadius: '25px',
            fontWeight: 600,
            boxShadow: '0 3px 12px rgba(16,185,129,0.3)',
          }}
        >
          💰 My Earnings
        </Link>
      </div>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <BookingsTable
              title="New Bookings"
              bookings={tasksToComplete}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }
        />
        <Route
          path="/disputes"
          element={
            <BookingsTable
              title="Active Disputes"
              bookings={disputedBookings}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }
        />
        <Route
          path="/history"
          element={
            <BookingsTable
              title="Completed History"
              bookings={completedHistory}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default SeniorDashboard;
