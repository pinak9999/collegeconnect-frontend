import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

// 🌟 Reusable Bookings Component
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
    const renderActionColumn = (booking) => {
        if (booking.dispute_status === 'Pending') {
          return (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                <span style={{ color: '#E67E22', fontWeight: 'bold' }}>Under Review</span>
                <button 
                  onClick={() => onStartChat(booking._id)} 
                  style={buttonStyleSecondary}
                >Chat</button>
            </div>
          );
        }
        if (booking.status === 'Completed') {
          return (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                <span style={{ color: '#2ECC71', fontWeight: 'bold' }}>Done</span>
                <button 
                  onClick={() => onStartChat(booking._id)} 
                  style={buttonStyleSecondary}
                >Chat History</button>
            </div>
          );
        }
        if (booking.status === 'Confirmed') {
          return (
            <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                <button 
                  onClick={() => onStartChat(booking._id)} 
                  style={buttonStylePrimary}
                >Start Chat</button>
                <button 
                  onClick={() => onMarkComplete(booking._id)} 
                  style={buttonStyleSecondary}
                >Mark Completed</button>
            </div>
          );
        }
        return null;
    };

    if (loading) return <p style={{ textAlign: 'center', color: '#666' }}>Loading bookings...</p>;
    if (bookings.length === 0) return <p style={{ textAlign: 'center', color: '#999' }}>No bookings found.</p>;

    return (
      <div style={{ marginTop: '15px' }}>
        {/* 🧾 Title */}
        <h3 style={{ textAlign: 'center', color: '#007BFF', marginBottom: '10px' }}>{title}</h3>

        {/* 📱 Mobile View */}
        <div style={{ display: 'none' }} className="mobile-only"></div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '15px'
        }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
              }}
            >
              <h4 style={{ color: '#333' }}>{booking.student?.name || 'Student'}</h4>
              <p style={{ color: '#777', fontSize: '14px' }}>
                📞 {booking.student?.mobileNumber || 'N/A'}
              </p>
              <p style={{ color: '#007BFF', fontWeight: 'bold' }}>
                Status: {booking.status}
              </p>
              <p style={{ fontSize: '13px', color: '#999' }}>
                {booking.dispute_status === 'Pending'
                  ? (booking.dispute_reason?.reason || 'Pending...')
                  : booking.dispute_status}
              </p>
              <div style={{ marginTop: '10px' }}>
                {renderActionColumn(booking)}
              </div>
            </div>
          ))}
        </div>

        {/* 💻 Desktop Table */}
        <div style={{ display: 'none' }} className="desktop-only">
          <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <thead style={{ background: '#007BFF', color: '#fff' }}>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Mobile</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Dispute</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr 
                    key={booking._id}
                    style={{
                      background: booking.dispute_status === 'Pending'
                        ? '#FFF5F5'
                        : booking.status === 'Completed'
                        ? '#F4FFF4'
                        : 'white'
                    }}
                  >
                    <td style={tdStyle}>{booking.student?.name || '...'}</td>
                    <td style={tdStyle}>{booking.student?.mobileNumber || '...'}</td>
                    <td style={tdStyle}>{booking.status}</td>
                    <td style={tdStyle}>
                      {booking.dispute_status === 'Pending'
                        ? (booking.dispute_reason?.reason || 'Pending')
                        : booking.dispute_status}
                    </td>
                    <td style={tdStyle}>{renderActionColumn(booking)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

// ---------------------------------------------
// 🌟 Senior Dashboard (Main Component)
// ---------------------------------------------
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
      const res = await axios.get(
        'https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my',
        { headers: { 'x-auth-token': token } }
      );
      setMyBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err.message);
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  }, []);
  
  useEffect(() => { loadBookings(); }, [loadBookings]);

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
  
  const tasksToComplete = myBookings.filter(b => b.status === 'Confirmed' && b.dispute_status !== 'Pending');
  const disputedBookings = myBookings.filter(b => b.dispute_status === 'Pending');
  const completedHistory = myBookings.filter(b => b.status === 'Completed' || b.dispute_status === 'Resolved');
  
  const activeTab = location.pathname;

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', paddingBottom: '30px', paddingTop: '10px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#007BFF', marginBottom: '5px' }}>Welcome, {auth.user?.name || 'Senior'} 👋</h2>
        <p style={{ color: '#666', fontSize: '14px', padding: '0 20px' }}>
          Manage your bookings, chat with students, and mark sessions as complete.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        background: '#fff',
        padding: '10px 15px',
        borderRadius: '12px',
        width: '90%',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Link to="/senior-dashboard"
          style={activeTab === '/senior-dashboard' ? activeTabStyle : inactiveTabStyle}>
          🆕 New ({tasksToComplete.length})
        </Link>
        <Link to="/senior-dashboard/disputes"
          style={activeTab.includes('/disputes') ? activeTabStyle : inactiveTabStyle}>
          ⚠️ Disputes ({disputedBookings.length})
        </Link>
        <Link to="/senior-dashboard/history"
          style={activeTab.includes('/history') ? activeTabStyle : inactiveTabStyle}>
          ✅ History ({completedHistory.length})
        </Link>
        <Link to="/senior-earnings"
          style={{
            ...buttonStylePrimary,
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '13px'
          }}>
          💰 My Earnings
        </Link>
      </div>

      {/* Bookings Routes */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <BookingsTable 
              title="New Bookings" 
              bookings={tasksToComplete} 
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }/>
          <Route path="/disputes" element={
            <BookingsTable 
              title="Active Disputes" 
              bookings={disputedBookings} 
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }/>
          <Route path="/history" element={
            <BookingsTable 
              title="Completed History" 
              bookings={completedHistory} 
              loading={loading}
              onMarkComplete={markAsCompletedHandler}
              onStartChat={handleStartChat}
            />
          }/>
        </Routes>
      </div>
    </div>
  );
}

// 🌈 Inline Styles
const buttonStylePrimary = {
  background: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: '0.3s'
};
const buttonStyleSecondary = {
  background: '#e0e0e0',
  color: '#333',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: '0.3s'
};
const thStyle = {
  padding: '10px',
  fontSize: '14px',
  textAlign: 'left'
};
const tdStyle = {
  padding: '8px',
  fontSize: '13px',
  borderBottom: '1px solid #eee'
};
const activeTabStyle = {
  background: '#007BFF',
  color: 'white',
  padding: '8px 15px',
  borderRadius: '20px',
  textDecoration: 'none',
  transition: '0.3s'
};
const inactiveTabStyle = {
  background: '#f0f0f0',
  color: '#007BFF',
  padding: '8px 15px',
  borderRadius: '20px',
  textDecoration: 'none',
  transition: '0.3s'
};

export default SeniorDashboard;
