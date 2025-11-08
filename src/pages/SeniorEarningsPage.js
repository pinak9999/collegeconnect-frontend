import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StatsGrid = ({ stats, loading }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '30px',
      padding: '0 10px'
    }}
  >
    {[
      { title: 'Pending Bookings (New)', value: stats.totalPending, color: '#3B82F6' },
      { title: 'Total Completed Calls', value: stats.totalCompleted, color: '#10B981' },
      { title: 'Your Next Payout (Unpaid)', value: `₹${stats.unpaidAmount}`, color: '#F59E0B' }
    ].map((item, i) => (
      <div
        key={i}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          padding: '20px',
          textAlign: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
        }}
      >
        <h4 style={{ color: '#374151', fontWeight: 600, marginBottom: '10px' }}>{item.title}</h4>
        <p
          style={{
            color: item.color,
            fontSize: '1.8rem',
            fontWeight: 700,
            letterSpacing: '1px'
          }}
        >
          {loading ? '...' : item.value}
        </p>
      </div>
    ))}
  </div>
);

function SeniorEarningsPage() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, totalPending: 0, unpaidAmount: 0 });
  const [allBookings, setAllBookings] = useState([]);
  const [platformFee, setPlatformFee] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [statsRes, bookingsRes, settingsRes] = await Promise.all([
          axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/stats', { headers: { 'x-auth-token': token } }),
          axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my', { headers: { 'x-auth-token': token } }),
          axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/settings')
        ]);
        setStats(statsRes.data);
        setAllBookings(bookingsRes.data);
        setPlatformFee(settingsRes.data.platformFee);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load earnings data.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const earningHistory = allBookings.filter((b) => b.status === 'Completed');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #EFF6FF, #F9FAFB)',
        padding: '25px 15px 60px',
        animation: 'fadeIn 0.6s ease-in-out'
      }}
    >
      {/* 🔙 Back Button */}
      <Link
        to="/senior-dashboard"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 18px',
          borderRadius: '10px',
          boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
          marginBottom: '20px'
        }}
      >
        ← Back to Dashboard
      </Link>

      {/* 🧾 Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2
          style={{
            background: 'linear-gradient(90deg,#2563EB,#1E40AF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '1.7rem'
          }}
        >
          Earnings & Stats 💰
        </h2>
        <p style={{ color: '#4B5563', fontSize: '14px' }}>
          Track your performance, calls & next payout amount.
        </p>
      </div>

      {/* 📊 Stats */}
      <StatsGrid stats={stats} loading={loading} />

      <hr style={{ margin: '40px 0', borderColor: '#e5e7eb' }} />

      {/* 🪙 Earnings History */}
      <div style={{ padding: '0 10px' }}>
        <h2 style={{ color: '#2563EB', textAlign: 'center', marginBottom: '15px' }}>
          Completed Calls & Payouts
        </h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280' }}>Loading history...</p>
        ) : earningHistory.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '15px',
              marginTop: '15px'
            }}
          >
            {earningHistory.map((booking) => (
              <div
                key={booking._id}
                style={{
                  background:
                    booking.payout_status === 'Paid'
                      ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
                      : 'linear-gradient(135deg, #FFFFFF, #F9FAFB)',
                  borderRadius: '14px',
                  padding: '15px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                }}
              >
                <h4 style={{ marginBottom: '6px', color: '#111827', fontWeight: 600 }}>
                  👨‍🎓 {booking.student ? booking.student.name : 'Unknown Student'}
                </h4>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '4px' }}>
                  📅 {new Date(booking.date).toLocaleDateString()}
                </p>
                <p
                  style={{
                    color: booking.payout_status === 'Paid' ? '#10B981' : '#6B7280',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}
                >
                  💸 {booking.payout_status}
                </p>
                <p
                  style={{
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  Earnings: ₹{booking.amount_paid - platformFee}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#6B7280' }}>
            You have no completed bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SeniorEarningsPage;
