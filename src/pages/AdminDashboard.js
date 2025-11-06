import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import Pagination from '../components/Pagination'; // 1. (नया (New) 'Pagination' (पेजिनेशन) (पृष्ठांकन) 'कॉम्पोनेंट' (component) (घटक) 'इम्पोर्ट' (import) (आयात) करें)

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. --- (यह 'नया' (New) 'अपडेट' (Update) है: 'Pagination' (पेजिनेशन) (पृष्ठांकन) 'State' (स्टेट) (स्थिति)) ---
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('users'); // ('Users' (यूज़र्स) 'या' (or) 'Bookings' (बुकिंग्स))
  // --- (अपडेट (Update) खत्म) ---

  // 3. (यह 'सिर्फ' (only) 'Users' (यूज़र्स) 'को' (to) 'लोड' (load) 'करेगा' (will do))
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); setError("No token found."); return; }
        
        // ('अब' (Now) 'यह' (this) 'Page' (पेज) (page) 'नंबर' (number) (संख्या) 'भेजता' (sends) 'है' (है))
        const usersRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`, { 
            headers: { 'x-auth-token': token } 
        });
        
        setUsers(usersRes.data.users);
        setUserPageData({
            currentPage: usersRes.data.currentPage,
            totalPages: usersRes.data.totalPages
        });
        
        setLoading(false);
    } catch (err) {
        let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
        setError('Error: ' + errorMsg); setLoading(false);
    }
  };

  // 4. (यह 'सिर्फ' (only) 'Bookings' (बुकिंग्स) (बुकिंग्स) 'को' (to) 'लोड' (load) 'करेगा' (will do))
  const loadBookings = async (page = 1) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); setError("No token found."); return; }
        
        const bookingsRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`, { 
            headers: { 'x-auth-token': token } 
        });
        
        setBookings(bookingsRes.data.bookings);
        setBookingPageData({
            currentPage: bookingsRes.data.currentPage,
            totalPages: bookingsRes.data.totalPages
        });
        
        setLoading(false);
    } catch (err) {
        let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
        setError('Error: ' + errorMsg); setLoading(false);
    }
  };

  // (पेज (page) 'लोड' (load) 'होते' (on) 'ही' (as soon as), 'पहला' (first) 'टैब' (tab) (टैब) 'लोड' (load) (लोड) 'करें' (do))
  useEffect(() => {
    if (activeTab === 'users') loadUsers(1);
    else loadBookings(1);
  }, [activeTab]); // (जब 'टैब' (tab) (टैब) 'बदले' (changes), 'यह' (this) 'फिर' (again) 'चलेगा' (will run))

  // ('Page' (पेज) (page) 'बदलने' (change) 'के' (of) 'Handlers' (हैंडलर्स) (संभालक))
  const handleUserPageChange = (page) => loadUsers(page);
  const handleBookingPageChange = (page) => loadBookings(page);

  // (makeSeniorHandler (वही है))
  const makeSeniorHandler = async (userId) => {
    if (!window.confirm('Make this user a Senior?')) return;
    const toastId = toast.loading('Updating user...');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put( `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}/make-senior`, null, { headers: { 'x-auth-token': token } });
      // ('UI' (यूआई) (UI (यूआई)) 'को' (to) 'अपडेट' (update) 'करें' (do))
      setUsers(prevUsers => prevUsers.map(user => user._id === userId ? res.data : user));
      toast.dismiss(toastId);
      toast.success('User updated to Senior!');
    } catch (err) { toast.dismiss(toastId); toast.error('Error: ' + (err.response ? err.response.data.msg : err.message)); }
  };
  
  // (deleteUserHandler (वही है))
  const deleteUserHandler = async (userId, userName) => {
    if (!window.confirm(`WARNING: Delete ${userName}?`)) return;
    const toastId = toast.loading(`Deleting ${userName}...`);
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`, { headers: { 'x-auth-token': token } });
        toast.dismiss(toastId);
        toast.success(`${userName} deleted successfully.`);
        loadUsers(userPageData.currentPage); // 'करंट' (Current) (वर्तमान) 'पेज' (page) (page) 'री-लोड' (re-load) (पुनः लोड) 'करें' (do)
    } catch (err) {
        toast.dismiss(toastId);
        toast.error('Delete Failed: ' + (err.response ? (err.response.data.msg || 'Server Error') : 'Server Error.'));
    }
  };

  // (resolveDisputeHandler (वही है))
  const resolveDisputeHandler = async (bookingId) => {
      if (!window.confirm('Mark this dispute as "Resolved"? (No refund).')) return;
      const toastId = toast.loading('Resolving dispute...');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.put( `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${bookingId}`, null, { headers: { 'x-auth-token': token } });
        setBookings(prevBookings => prevBookings.map(b => b._id === bookingId ? res.data.booking : b));
        toast.dismiss(toastId);
        toast.success(res.data.msg);
      } catch (err) { toast.dismiss(toastId); toast.error('Error: ' + (err.response ? err.response.data.msg : err.message)); }
  };


  if (error) return <div className="container" style={{padding: '40px 0'}}><h2 style={{color: 'red'}}>{error}</h2></div>;

  return (
    <div className="container page-container" style={{ minHeight: '60vh' }}>
      
      {/* ('Admin' (एडमिन) 'Management' (प्रबंधन) 'Links' (लिंक्स) (links)) */}
      <div style={{marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
        <Link to="/admin-payouts" className="btn btn-primary">Manage Payouts</Link>
        <Link to="/admin-settings" className="btn btn-secondary">Manage Settings</Link>
        <Link to="/admin-manage-tags" className="btn btn-secondary">Manage Tags</Link>
        <Link to="/admin-manage-colleges" className="btn btn-secondary">Manage Colleges</Link>
        <Link to="/admin-manage-dispute-reasons" className="btn btn-secondary">Manage Dispute Reasons</Link>
      </div>
      
      {/* --- (5. 'यह' (This) 'रहा' (is) 'नया' (new) 'Admin' (एडमिन) 'Tab' (टैब) (टैब) 'Navigation' (नेविगेशन)) --- */}
      <div className="dashboard-nav">
          <button 
            onClick={() => setActiveTab('users')}
            className={`dashboard-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          >
            All Users ({userPageData.totalUsers || 0})
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            All Bookings ({bookingPageData.totalBookings || 0})
          </button>
      </div>
      {/* --- (अपडेट (Update) खत्म) --- */}

      {loading ? <h2>Loading...</h2> : (
        <>
          {/* 6. (यह 'सिर्फ' (only) 'तब' (then) 'दिखेगा' (will show) 'जब' (when) 'Users' (यूज़र्स) 'टैब' (tab) (टैब) 'एक्टिव' (active) (सक्रिय) 'होगा' (will be)) */}
          {activeTab === 'users' && (
            <div>
              <h2>All Users</h2>
              <div className="table-container">
                <table className="user-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Role</th><th className="col-action">Action</th></tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobileNumber}</td>
                        <td>{user.isSenior ? <span className="status-completed">Senior</span> : <span>Student</span>}</td>
                        <td>{user.role}</td>
                        <td className="col-action">
                          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            {!user.isSenior && user.role !== 'Admin' && (
                              <button onClick={() => makeSeniorHandler(user._id)} className="btn btn-primary" style={{padding: '5px 10px'}}>Make Senior</button>
                            )}
                            {user.isSenior && (
                              <Link to={`/admin-edit-profile/${user._id}`} className="btn btn-secondary" style={{padding: '5px 10px'}}>Edit</Link>
                            )}
                            {user.role === 'Student' && ( <button onClick={() => deleteUserHandler(user._id, user.name)} className="btn" style={{padding: '5px 10px', background: '#e74c3c', color: 'white'}}>Delete</button> )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 7. ('Users' (यूज़र्स) 'टेबल' (table) (table) 'के लिए' (for) 'Pagination' (पेजिनेशन) (पृष्ठांकन)) */}
              <Pagination 
                currentPage={userPageData.currentPage} 
                totalPages={userPageData.totalPages} 
                onPageChange={handleUserPageChange}
              />
            </div>
          )}

          {/* 8. (यह 'सिर्फ' (only) 'तब' (then) 'दिखेगा' (will show) 'जब' (when) 'Bookings' (बुकिंग्स) (बुकिंग्स) 'टैब' (tab) (टैब) 'एक्टिव' (active) (सक्रिय) 'होगा' (will be)) */}
          {activeTab === 'bookings' && (
            <div>
              <h2>All Platform Bookings</h2>
              <div className="table-container">
                <table className="user-table">
                  <thead>
                    <tr><th>Student</th><th>Senior</th><th>Amount</th><th>Status</th><th className="col-reason">Dispute Reason</th><th className="col-action">Action</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking._id} style={{background: booking.dispute_status === 'Pending' ? '#fff0f0' : ''}}>
                        <td>{booking.student ? booking.student.name : '...'}</td>
                        <td>{booking.senior ? booking.senior.name : '...'}</td>
                        <td>₹{booking.amount_paid}</td>
                        <td className={booking.status === 'Completed' ? 'status-completed' : ''}>{booking.status}</td>
                        <td className="col-reason">
                          {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                        </td>
                        <td className="col-action">
                          {booking.dispute_status === 'Pending' && (
                            <button onClick={() => resolveDisputeHandler(booking._id)} className="btn btn-primary" style={{padding: '5px 10px', background: 'green'}}>
                              Mark as Resolved
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 9. ('Bookings' (बुकिंग्स) (बुकिंग्स) 'टेबल' (table) (table) 'के लिए' (for) 'Pagination' (पेजिनेशन) (पृष्ठांकन)) */}
              <Pagination 
                currentPage={bookingPageData.currentPage} 
                totalPages={bookingPageData.totalPages} 
                onPageChange={handleBookingPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default AdminDashboard;