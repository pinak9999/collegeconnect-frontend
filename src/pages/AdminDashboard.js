import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`, {
        headers: { 'x-auth-token': token },
      });
      setUsers(res.data.users);
      setUserPageData({ currentPage: res.data.currentPage, totalPages: res.data.totalPages });
      setLoading(false);
    } catch (err) {
      setError('Error loading users.');
      setLoading(false);
    }
  };

  const loadBookings = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`, {
        headers: { 'x-auth-token': token },
      });
      setBookings(res.data.bookings);
      setBookingPageData({ currentPage: res.data.currentPage, totalPages: res.data.totalPages });
      setLoading(false);
    } catch (err) {
      setError('Error loading bookings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    else loadBookings();
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
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error updating user');
    }
  };

  const deleteUserHandler = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}?`)) return;
    const toastId = toast.loading('Deleting user...');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`, {
        headers: { 'x-auth-token': token },
      });
      toast.dismiss(toastId);
      toast.success(`${userName} deleted.`);
      loadUsers(userPageData.currentPage);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Delete failed.');
    }
  };

  const resolveDisputeHandler = async (bookingId) => {
    if (!window.confirm('Mark this dispute as Resolved?')) return;
    const toastId = toast.loading('Resolving dispute...');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${bookingId}`,
        null,
        { headers: { 'x-auth-token': token } }
      );
      toast.dismiss(toastId);
      toast.success('Dispute resolved.');
      loadBookings(bookingPageData.currentPage);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error resolving dispute.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#e0f2ff,#f9faff)',
        padding: '20px',
        animation: 'fadeIn 0.4s ease-in-out',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#1e3a8a',
          fontWeight: '700',
          marginBottom: '20px',
        }}
      >
        🛠 Admin Dashboard
      </h2>

      {/* Admin Control Links */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '25px',
        }}
      >
        {[
          { to: '/admin-payouts', text: '💰 Manage Payouts' },
          { to: '/admin-settings', text: '⚙ Manage Settings' },
          { to: '/admin-manage-tags', text: '🏷 Manage Tags' },
          { to: '/admin-manage-colleges', text: '🎓 Manage Colleges' },
          { to: '/admin-manage-dispute-reasons', text: '❗ Dispute Reasons' },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              textDecoration: 'none',
              background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 600,
              transition: 'all 0.3s',
              boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {link.text}
          </Link>
        ))}
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
        {[
          { id: 'users', label: '👥 All Users' },
          { id: 'bookings', label: '📖 All Bookings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '25px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(45deg,#2563eb,#1e3a8a)'
                  : '#e5e7eb',
              color: activeTab === tab.id ? '#fff' : '#1e3a8a',
              transition: 'all 0.3s',
              boxShadow:
                activeTab === tab.id
                  ? '0 4px 12px rgba(37,99,235,0.3)'
                  : '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <h3 style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</h3>
      ) : (
        <>
          {/* Users Table */}
          {activeTab === 'users' && (
            <div style={{ overflowX: 'auto' }}>
              <h3 style={{ textAlign: 'center', color: '#2563eb' }}>All Users</h3>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '15px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <thead style={{ background: '#eff6ff' }}>
                  <tr>
                    {['Name', 'Email', 'Mobile', 'Status', 'Role', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1e3a8a',
                            fontSize: '14px',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ padding: '8px' }}>{user.name}</td>
                      <td style={{ padding: '8px' }}>{user.email}</td>
                      <td style={{ padding: '8px' }}>{user.mobileNumber}</td>
                      <td style={{ padding: '8px' }}>
                        {user.isSenior ? 'Senior' : 'Student'}
                      </td>
                      <td style={{ padding: '8px' }}>{user.role}</td>
                      <td style={{ padding: '8px' }}>
                        {!user.isSenior && user.role !== 'Admin' && (
                          <button
                            onClick={() => makeSeniorHandler(user._id)}
                            style={{
                              background: '#2563eb',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            Make Senior
                          </button>
                        )}
                        {user.role === 'Student' && (
                          <button
                            onClick={() => deleteUserHandler(user._id, user.name)}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              marginLeft: '5px',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={userPageData.currentPage}
                totalPages={userPageData.totalPages}
                onPageChange={(p) => loadUsers(p)}
              />
            </div>
          )}

          {/* Bookings Table */}
          {activeTab === 'bookings' && (
            <div style={{ overflowX: 'auto' }}>
              <h3 style={{ textAlign: 'center', color: '#2563eb' }}>All Bookings</h3>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '15px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <thead style={{ background: '#eff6ff' }}>
                  <tr>
                    {['Student', 'Senior', 'Amount', 'Status', 'Dispute', 'Action'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px',
                            textAlign: 'left',
                            fontWeight: 600,
                            color: '#1e3a8a',
                            fontSize: '14px',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      style={{
                        background:
                          b.dispute_status === 'Pending' ? '#fff0f0' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '8px' }}>{b.student?.name || '...'}</td>
                      <td style={{ padding: '8px' }}>{b.senior?.name || '...'}</td>
                      <td style={{ padding: '8px' }}>₹{b.amount_paid}</td>
                      <td style={{ padding: '8px' }}>{b.status}</td>
                      <td style={{ padding: '8px' }}>
                        {b.dispute_status === 'Pending'
                          ? b.dispute_reason?.reason || 'Pending'
                          : b.dispute_status}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {b.dispute_status === 'Pending' && (
                          <button
                            onClick={() => resolveDisputeHandler(b._id)}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={bookingPageData.currentPage}
                totalPages={bookingPageData.totalPages}
                onPageChange={(p) => loadBookings(p)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
