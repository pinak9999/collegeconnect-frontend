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
  const [error, setError] = useState('');
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('users');

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const usersRes = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`,
        { headers: { 'x-auth-token': token } }
      );
      setUsers(usersRes.data.users);
      setUserPageData({
        currentPage: usersRes.data.currentPage,
        totalPages: usersRes.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load users.');
      setLoading(false);
    }
  };

  const loadBookings = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookingsRes = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`,
        { headers: { 'x-auth-token': token } }
      );
      setBookings(bookingsRes.data.bookings);
      setBookingPageData({
        currentPage: bookingsRes.data.currentPage,
        totalPages: bookingsRes.data.totalPages,
      });
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load bookings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers(1);
    else loadBookings(1);
  }, [activeTab]);

  const makeSeniorHandler = async (userId) => {
    if (!window.confirm('Make this user a Senior?')) return;
    const toastId = toast.loading('Updating user...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}/make-senior`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
      toast.dismiss(toastId);
      toast.success('User updated to Senior!');
      // 🔥 Redirect directly to edit profile
      navigate(`/admin-edit-profile/${userId}`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error updating user');
    }
  };

  const deleteUserHandler = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}?`)) return;
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
      toast.dismiss(toastId);
      toast.error('Delete failed');
    }
  };

  const resolveDisputeHandler = async (bookingId) => {
    if (!window.confirm('Mark this dispute as Resolved?')) return;
    const toastId = toast.loading('Resolving...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${bookingId}`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.data.booking : b)));
      toast.dismiss(toastId);
      toast.success('Dispute resolved!');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error resolving dispute');
    }
  };

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'red' }}>{error}</h2>
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#e0f2ff,#f9faff)',
        padding: '20px 10px 50px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2
          style={{
            background: 'linear-gradient(90deg,#2563eb,#1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: '1.8rem',
          }}
        >
          🛠 Admin Dashboard
        </h2>
        <p style={{ color: '#4b5563', fontSize: '14px' }}>
          Manage users, bookings, and disputes efficiently.
        </p>
      </div>

      {/* Quick Links */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Link to="/admin-payouts" style={linkBtnStyle('#22c55e')}>
          💰 Manage Payouts
        </Link>
        <Link to="/admin-settings" style={linkBtnStyle('#3b82f6')}>
          ⚙ Manage Settings
        </Link>
        <Link to="/admin-manage-tags" style={linkBtnStyle('#9333ea')}>
          🏷 Manage Tags
        </Link>
        <Link to="/admin-manage-colleges" style={linkBtnStyle('#0ea5e9')}>
          🏫 Manage Colleges
        </Link>
        <Link to="/admin-manage-dispute-reasons" style={linkBtnStyle('#f97316')}>
          ⚖ Manage Dispute Reasons
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTab('users')}
          style={activeTabStyle(activeTab === 'users')}
        >
          👥 All Users
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={activeTabStyle(activeTab === 'bookings')}
        >
          📖 All Bookings
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <h3 style={{ textAlign: 'center', color: '#2563eb' }}>Loading...</h3>
      ) : (
        <>
          {activeTab === 'users' && (
            <div style={cardStyle}>
              <h3 style={cardTitle}>All Users</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobileNumber}</td>
                        <td>{user.isSenior ? 'Senior' : 'Student'}</td>
                        <td>{user.role}</td>
                        <td>
                          {/* Actions */}
                          {!user.isSenior && user.role !== 'Admin' && (
                            <button
                              onClick={() => makeSeniorHandler(user._id)}
                              style={actionBtn('#2563eb')}
                            >
                              Make Senior
                            </button>
                          )}
                          {user.isSenior && (
                            <Link
                              to={`/admin-edit-profile/${user._id}`}
                              style={actionBtn('#3b82f6')}
                            >
                              ✏ Edit Profile
                            </Link>
                          )}
                          {user.role === 'Student' && (
                            <button
                              onClick={() => deleteUserHandler(user._id, user.name)}
                              style={actionBtn('#ef4444')}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={userPageData.currentPage}
                totalPages={userPageData.totalPages}
                onPageChange={(page) => loadUsers(page)}
              />
            </div>
          )}

          {activeTab === 'bookings' && (
            <div style={cardStyle}>
              <h3 style={cardTitle}>All Bookings</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Senior</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Dispute</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b._id}
                        style={{
                          background:
                            b.dispute_status === 'Pending' ? '#fff7ed' : 'transparent',
                        }}
                      >
                        <td>{b.student?.name || '...'}</td>
                        <td>{b.senior?.name || '...'}</td>
                        <td>₹{b.amount_paid}</td>
                        <td>{b.status}</td>
                        <td>{b.dispute_status}</td>
                        <td>
                          {b.dispute_status === 'Pending' && (
                            <button
                              onClick={() => resolveDisputeHandler(b._id)}
                              style={actionBtn('#16a34a')}
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={bookingPageData.currentPage}
                totalPages={bookingPageData.totalPages}
                onPageChange={(page) => loadBookings(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;

/* --- Inline Helper Styles --- */
const linkBtnStyle = (color) => ({
  background: color,
  color: '#fff',
  padding: '8px 14px',
  borderRadius: '10px',
  fontWeight: 600,
  textDecoration: 'none',
  boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
});

const activeTabStyle = (isActive) => ({
  padding: '8px 18px',
  borderRadius: '20px',
  border: 'none',
  fontWeight: 600,
  color: isActive ? '#fff' : '#2563eb',
  background: isActive
    ? 'linear-gradient(45deg,#2563eb,#1e40af)'
    : '#f3f4f6',
  boxShadow: isActive ? '0 4px 10px rgba(37,99,235,0.3)' : 'none',
});

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  margin: '0 10px',
};

const cardTitle = {
  color: '#1e40af',
  textAlign: 'center',
  marginBottom: '15px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
};

const actionBtn = (bg) => ({
  background: bg,
  color: '#fff',
  padding: '6px 10px',
  borderRadius: '8px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  marginRight: '5px',
});
