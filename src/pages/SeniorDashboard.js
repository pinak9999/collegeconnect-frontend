import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

// 🌟 Bookings Section (Card View)
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
  const renderActionColumn = (booking) => {
    const btnBase = {
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: '0.3s',
      border: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    };
    const primaryBtn = { ...btnBase, background: 'linear-gradient(45deg,#3b82f6,#2563eb)', color: '#fff' };
    const secondaryBtn = { ...btnBase, background: '#fff', color: '#2563eb', border: '1px solid #2563eb' };

    if (booking.dispute_status === 'Pending') {
      return (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚠ Under Review</span>
          <button onClick={() => onStartChat(booking._id)} style={secondaryBtn}>Chat</button>
        </div>
      );
    }
    if (booking.status === 'Completed') {
      return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Done</span>
          <button onClick={() => onStartChat(booking._id)} style={secondaryBtn}>Chat History</button>
        </div>
      );
    }
    if (booking.status === 'Confirmed') {
      return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => onStartChat(booking._id)} style={primaryBtn}>💬 Start Chat</button>
          <button onClick={() => onMarkComplete(booking._id)} style={secondaryBtn}>✔ Mark Done</button>
        </div>
      );
    }
    return null;
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#888' }}>⏳ Loading bookings...</p>;
  if (bookings.length === 0) return <p style={{ textAlign: 'center', color: '#999' }}>No bookings found.</p>;

  return (
    <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s ease-in-out' }}>
      <h3 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '15px', fontWeight: 700 }}>{title}</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        justifyItems: 'center',
        padding: '0 20px'
      }}>
        {bookings.map((b) => (
          <div
            key={b._id}
            style={{
              width: '100%',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              padding: '18px',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            }}
          >
            <h4 style={{ margin: 0, color: '#111827', fontSize: '1.05rem' }}>{b.student?.name || 'Student'}</h4>
            <p style={{ color: '#6b7280', margin: '5px 0' }}>📞 {b.student?.mobileNumber || 'N/A'}</p>
            <p style={{ color: '#2563eb', fontWeight: 600 }}>Status: {b.status}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              {b.dispute_status === 'Pending'
                ? (b.dispute_reason?.reason || 'Under Review')
                : b.dispute_status}
            </p>
            <div style={{ marginTop: '10px' }}>{renderActionColumn(b)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🌟 Senior Dashboard
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ auth used properly here
  useEffect(() => {
    if (auth?.user) {
      toast.success(`Welcome ${auth.user.name}! 👋`);
    }
  }, [auth?.user]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = auth?.token || localStorage.getItem('token'); // ✅ use auth
      const res = await axios.get(
        'https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my',
        { headers: { 'x-auth-token': token } }
      );
      setMyBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [auth?.token]); // ✅ dependency added

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const markAsCompletedHandler = async (bookingId) => {
    if (!window.confirm('Mark this booking as completed?')) return;
    const toastId = toast.loading('Updating...');
    try {
      const token = auth?.token || localStorage.getItem('token'); // ✅ use auth
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

  const tasksToComplete = myBookings.filter(b => b.status === 'Confirmed' && b.dispute_status !== 'Pending');
  const disputedBookings = myBookings.filter(b => b.dispute_status === 'Pending');
  const completedHistory = myBookings.filter(b => b.status === 'Completed' || b.dispute_status === 'Resolved');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg,#e0f2ff,#f9faff)',
      padding: '20px 15px 40px 15px',
      animation: 'fadeIn 0.5s ease-in'
    }}>
      <div style={{ textAlign: 'center', padding: '10px 10px 25px' }}>
        <h2 style={{
          background: 'linear-gradient(90deg,#2563eb,#1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.7rem',
          fontWeight: 700,
          marginBottom: '5px'
        }}>
          Welcome, {auth.user?.name || 'Senior'} 👋
        </h2>
        <p style={{ color: '#4b5563', fontSize: '14px', margin: '0 auto', maxWidth: '400px' }}>
          Manage your sessions, chat with students and track your completed bookings easily.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(255,255,255,0.95)',
        padding: '12px 15px',
        borderRadius: '20px',
        width: '95%',
        margin: '0 auto 25px auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 10,
        zIndex: 10
      }}>
        {[
          { path: '/senior-dashboard', label: '🆕 New', count: tasksToComplete.length },
          { path: '/senior-dashboard/disputes', label: '⚠️ Disputes', count: disputedBookings.length },
          { path: '/senior-dashboard/history', label: '✅ History', count: completedHistory.length },
        ].map(tab => {
          const isActive =
            (tab.path === '/senior-dashboard' && location.pathname === '/senior-dashboard') ||
            (tab.path !== '/senior-dashboard' && location.pathname.startsWith(tab.path));

          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: '25px',
                fontWeight: 600,
                transition: '0.3s',
                background: isActive
                  ? 'linear-gradient(45deg,#3b82f6,#2563eb)'
                  : '#f3f4f6',
                color: isActive ? '#fff' : '#2563eb',
                boxShadow: isActive
                  ? '0 2px 10px rgba(37,99,235,0.3)'
                  : 'none'
              }}
            >
              {tab.label} ({tab.count})
            </Link>
          );
        })}
        <Link to="/senior-earnings" style={{
          background: 'linear-gradient(45deg,#22c55e,#16a34a)',
          color: '#fff',
          textDecoration: 'none',
          padding: '8px 16px',
          borderRadius: '25px',
          fontWeight: 600,
          transition: '0.3s'
        }}>
          💰 My Earnings
        </Link>
      </div>

      {/* Routes */}
      <div>
        <Routes>
          <Route path="/" element={
            <BookingsTable
              title="New Bookings"
              bookings={tasksToComplete}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          } />
          <Route path="/disputes" element={
            <BookingsTable
              title="Active Disputes"
              bookings={disputedBookings}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          } />
          <Route path="/history" element={
            <BookingsTable
              title="Completed History"
              bookings={completedHistory}
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default SeniorDashboard;
