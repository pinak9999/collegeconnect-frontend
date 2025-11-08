import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // ✅ properly used below
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('users');

  // 🔹 Load Users
  const loadUsers = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`,
        { headers: { 'x-auth-token': token } }
      );
      setUsers(res.data.users);
      setUserPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.msg || 'Failed to load users'); // ✅ fixed
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  // 🔹 Load Bookings
  const loadBookings = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`,
        { headers: { 'x-auth-token': token } }
      );
      setBookings(res.data.bookings);
      setBookingPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.response?.data?.msg || 'Failed to load bookings'); // ✅ fixed
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers(1);
    else loadBookings(1);
  }, [activeTab]);

  // 🔹 Make Senior
  const makeSeniorHandler = async (userId) => {
    if (!window.confirm('Make this user a Senior?')) return;
    const toastId = toast.loading('Updating...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}/make-senior`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
      toast.dismiss(toastId);
      toast.success('User updated!');
      navigate(`/admin-edit-profile/${userId}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update user'); // ✅ fixed
      toast.dismiss(toastId);
      toast.error('Update failed');
    }
  };

  // 🔹 Delete User
  const deleteUserHandler = async (userId, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    const toastId = toast.loading('Deleting...');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`,
        { headers: { 'x-auth-token': token } }
      );
      toast.dismiss(toastId);
      toast.success('Deleted successfully');
      loadUsers(userPageData.currentPage);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete user'); // ✅ fixed
      toast.dismiss(toastId);
      toast.error('Delete failed');
    }
  };

  // 🔹 Resolve Dispute
  const resolveDisputeHandler = async (id) => {
    if (!window.confirm('Mark this dispute resolved?')) return;
    const toastId = toast.loading('Resolving...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${id}`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data.booking : b)));
      toast.dismiss(toastId);
      toast.success('Resolved!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resolve dispute'); // ✅ fixed
      toast.dismiss(toastId);
      toast.error('Error resolving');
    }
  };

  // 🔹 Small Reusable Button
  const button = (bg, text, action) => (
    <button
      onClick={action}
      style={{
        background: bg,
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '6px 10px',
        margin: '2px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {text}
    </button>
  );

  // 🔹 Error UI
  if (error)
    return (
      <div style={{ textAlign: 'center', color: 'red', padding: '40px' }}>
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
        >
          🔄 Reload
        </button>
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#e0f2ff,#f9faff)',
        padding: '15px 10px 40px',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          background: 'linear-gradient(90deg,#2563eb,#1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          marginBottom: '20px',
        }}
      >
        🛠 Admin Dashboard
      </h2>

      {/* 🔹 Top Management Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '25px',
        }}
      >
        <Link to="/admin-payouts" style={adminBtn('#22c55e')}>💰 Manage Payouts</Link>
        <Link to="/admin-settings" style={adminBtn('#2563eb')}>⚙️ Manage Settings</Link>
        <Link to="/admin-manage-tags" style={adminBtn('#6366f1')}>🏷 Manage Tags</Link>
        <Link to="/admin-manage-colleges" style={adminBtn('#0891b2')}>🎓 Manage Colleges</Link>
        <Link to="/admin-manage-dispute-reasons" style={adminBtn('#f97316')}>⚠️ Manage Dispute Reasons</Link>
      </div>

      {/* Tabs */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>
          👥 Users
        </button>
        <button onClick={() => setActiveTab('bookings')} style={tabStyle(activeTab === 'bookings')}>
          📖 Bookings
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <h3 style={{ textAlign: 'center', color: '#2563eb' }}>Loading...</h3>
      ) : activeTab === 'users' ? (
        <>
          <h3 style={{ textAlign: 'center', color: '#1e40af' }}>All Users</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '15px',
              marginTop: '20px',
              padding: '0 10px',
            }}
          >
            {users.map((u) => (
              <div
                key={u._id}
                style={{
                  background: '#fff',
                  borderRadius: '15px',
                  padding: '15px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <h4 style={{ margin: '0', color: '#111827' }}>{u.name}</h4>
                <p style={{ color: '#6b7280', margin: '4px 0' }}>{u.email}</p>
                <p style={{ color: '#2563eb', margin: '2px 0' }}>📞 {u.mobileNumber}</p>
                <p style={{ fontWeight: 600, color: u.isSenior ? '#16a34a' : '#ef4444' }}>
                  {u.isSenior ? 'Senior' : 'Student'}
                </p>
                <div style={{ marginTop: '10px' }}>
                  {!u.isSenior && u.role !== 'Admin' &&
                    button('#2563eb', 'Make Senior', () => makeSeniorHandler(u._id))}
                  {u.isSenior && (
                    <Link
                      to={`/admin-edit-profile/${u._id}`}
                      style={{
                        ...btnLink,
                        background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
                      }}
                    >
                      ✏ Edit Profile
                    </Link>
                  )}
                  {u.role === 'Student' &&
                    button('#ef4444', 'Delete', () => deleteUserHandler(u._id, u.name))}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={userPageData.currentPage}
            totalPages={userPageData.totalPages}
            onPageChange={(page) => loadUsers(page)}
          />
        </>
      ) : (
        <>
          <h3 style={{ textAlign: 'center', color: '#1e40af' }}>All Bookings</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '15px',
              marginTop: '20px',
              padding: '0 10px',
            }}
          >
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  background: b.dispute_status === 'Pending' ? '#fff7ed' : '#fff',
                  borderRadius: '15px',
                  padding: '15px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                }}
              >
                <h4 style={{ margin: 0 }}>{b.student?.name || 'Student'}</h4>
                <p style={{ margin: '4px 0', color: '#555' }}>
                  Senior: {b.senior?.name || '...'}
                </p>
                <p style={{ color: '#2563eb', fontWeight: 600 }}>
                  ₹{b.amount_paid} — {b.status}
                </p>
                <p style={{ color: '#ef4444' }}>
                  {b.dispute_status === 'Pending' ? '⚠ Dispute Pending' : b.dispute_status}
                </p>
                {b.dispute_status === 'Pending' &&
                  button('#16a34a', 'Resolve', () => resolveDisputeHandler(b._id))}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={bookingPageData.currentPage}
            totalPages={bookingPageData.totalPages}
            onPageChange={(page) => loadBookings(page)}
          />
        </>
      )}
    </div>
  );
}

/* === Reusable Styles === */
const tabStyle = (active) => ({
  padding: '8px 15px',
  margin: '0 5px',
  borderRadius: '20px',
  fontWeight: 600,
  border: 'none',
  color: active ? '#fff' : '#2563eb',
  background: active
    ? 'linear-gradient(45deg,#2563eb,#1e40af)'
    : '#f3f4f6',
  boxShadow: active ? '0 3px 10px rgba(37,99,235,0.3)' : 'none',
});

const btnLink = {
  display: 'inline-block',
  textDecoration: 'none',
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '8px',
  fontWeight: 600,
  marginRight: '4px',
};

const adminBtn = (color) => ({
  background: color,
  color: '#fff',
  padding: '8px 14px',
  borderRadius: '8px',
  fontWeight: 600,
  textDecoration: 'none',
  transition: '0.3s',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
});

export default AdminDashboard;
