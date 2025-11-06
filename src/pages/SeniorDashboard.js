import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

// ---------------------------------------------
// ('Helper' (हेल्पर) (helper) 'कॉम्पोनेंट' (component) (घटक) 1: 'Stats' (स्टेट्स) (आँकड़े) 'ग्रिड' (Grid) (ग्रिड))
// ---------------------------------------------
const StatsGrid = ({ stats, loading }) => (
    <div className="stats-grid" style={{marginTop: '30px'}}>
        <div className="stat-card">
            <h4>Pending Bookings (New)</h4>
            <p>{loading ? '...' : stats.totalPending}</p>
        </div>
        <div className="stat-card">
            <h4>Total Completed Calls</h4>
            <p>{loading ? '...' : stats.totalCompleted}</p>
        </div>
        <div className="stat-card earning">
            <h4>Your Next Payout (Unpaid)</h4>
            <p>₹{loading ? '...' : stats.unpaidAmount}</p>
        </div>
    </div>
);

// ---------------------------------------------
// ('Helper' (हेल्पर) (helper) 'कॉम्पोनेंट' (component) (घटक) 2: 'Bookings' (बुकिंग्स) (बुकिंग्स) 'टेबल' (Table) (table) / 'कार्ड्स' (Cards) (कार्ड))
// ---------------------------------------------
const BookingsDisplay = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
    
    // ('Action' (एक्शन) (कार्रवाई) 'कॉलम' (column) (स्तंभ) 'को' (to) 'हैंडल' (handle) (संभाल) 'करेगा' (will do))
    const renderActionColumn = (booking) => {
        if (booking.dispute_status === 'Pending') {
          return ( <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <span className="status-pending">Under Review</span>
                <button onClick={() => onStartChat(booking._id)} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}}>Chat</button>
            </div> );
        }
        if (booking.status === 'Completed') {
          return ( <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <span className="status-completed">Done</span>
                <button onClick={() => onStartChat(booking._id)} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}}>Chat History</button>
            </div> );
        }
        if (booking.status === 'Confirmed') {
          return ( <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <button onClick={() => onStartChat(booking._id)} className="btn btn-primary" style={{padding: '5px 10px', fontSize: '12px'}}>Start Chat</button>
                <button onClick={() => onMarkComplete(booking._id)} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}}>Mark as Completed</button>
            </div> );
        }
        return null;
    };
    
    if (loading) return <p>Loading bookings...</p>;
    if (bookings.length === 0) return <p>No bookings found in this category.</p>;

    // --- (1. 'यह' (This) 'रहा' (is) 'नया' (new) '100% Accurate' (सही) 'फिक्स' (Fix) (ठीक)) ---
    // (हम 'Desktop' (डेस्कटॉप) (डेस्कटॉप) 'और' (and) 'Mobile' (मोबाइल) (मोबाइल) 'दोनों' (both) 'के लिए' (for) 'UI' (यूआई) (UI (यूआई)) 'दिखा' (showing) 'रहे' (are) 'हैं' (हैं))
    return (
      <>
        {/* --- (A) 'DESKTOP' (डेस्कटॉप) (DESKTOP (डेस्कटॉप)) 'UI' (यूआई) (UI (यूआई)): (Table (टेबल) (टेबल)) --- */}
        <div className="desktop-only table-container">
            <table className="user-table">
                <thead>
                <tr>
                    <th>Student</th><th>Student's Mobile</th><th>Status</th>
                    <th className="col-reason">Dispute Reason</th>
                    <th className="col-action">Action</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(booking => (
                    <tr key={booking._id} style={{ background: booking.dispute_status === 'Pending' ? '#fff0f0' : (booking.status === 'Completed' ? '#f0fff0' : '') }}>
                    <td>{booking.student ? booking.student.name : '...'}</td>
                    <td>{booking.student ? booking.student.mobileNumber : '...'}</td> 
                    <td className={booking.status === 'Completed' ? 'status-completed' : ''}>{booking.status}</td>
                    <td className="col-reason" style={{fontWeight: 'normal'}}>
                        {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                    </td>
                    <td className="col-action">
                        {renderActionColumn(booking)}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        {/* --- (B) 'MOBILE' (मोबाइल) (MOBILE (मोबाइल)) 'UI' (यूआई) (UI (यूआई)): (Cards (कार्ड्स) (Cards (कार्ड))) --- */}
        <div className="mobile-only booking-card-list">
            {bookings.map(booking => (
                <div key={booking._id} className="booking-card" style={{ background: booking.dispute_status === 'Pending' ? '#fff0f0' : (booking.status === 'Completed' ? '#f0fff0' : '') }}>
                    <h3>{booking.student ? booking.student.name : '...'}</h3>
                    <div className="details">
                        <strong>Mobile:</strong> {booking.student ? booking.student.mobileNumber : '...'} <br/>
                        <strong>Status:</strong> {booking.status} <br/>
                        <strong>Dispute:</strong> {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                    </div>
                    <div className="actions">
                        {renderActionColumn(booking)}
                    </div>
                </div>
            ))}
        </div>
      </>
    );
};


// ---------------------------------------------
// ('मुख्य' (Main) 'Senior Dashboard' (सीनियर डैशबोर्ड) 'कॉम्पोनेंट' (component) (घटक))
// ---------------------------------------------
function SeniorDashboard() {
  const { auth } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation(); 
  
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, totalPending: 0, unpaidAmount: 0 });

  // (डेटा' (Data) (डेटा) 'लोड' (load) (लोड) 'करने' (to do) 'का' (of) 'फंक्शन' (function) (Function (फंक्शन)))
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [bookingsRes, statsRes] = await Promise.all([
          axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my', { headers: { 'x-auth-token': token } }),
          axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/stats', { headers: { 'x-auth-token': token } })
      ]);
      setMyBookings(bookingsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) { 
        console.error('Error fetching dashboard data:', err.response ? err.response.data.msg : err.message); 
        setLoading(false);
        toast.error("Failed to load dashboard data.");
    }
  }, []); 
  useEffect(() => { loadData(); }, [loadData]); 

  // ('Action' (एक्शन) (कार्रवाई) 'Handlers' (हैंडलर्स) (संभालक))
  const markAsCompletedHandler = async (bookingId) => {
    if (!window.confirm('Are you sure you have completed this call?')) return;
    const toastId = toast.loading('Updating...');
    try {
        const token = localStorage.getItem('token');
        await axios.put(
            `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/mark-complete/${bookingId}`, null, { headers: { 'x-auth-token': token } }
        );
        toast.dismiss(toastId);
        toast.success('Booking marked as Completed!');
        loadData(); 
    } catch (err) {
        toast.dismiss(toastId);
        toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
    }
  };
  const handleStartChat = (bookingId) => { navigate(`/chat/${bookingId}`); };

  // ('Tab' (टैब) (टैब) 'लॉजिक' (logic) (तर्क))
  const tasksToComplete = myBookings.filter(b => b.status === 'Confirmed' && b.dispute_status !== 'Pending');
  const disputedBookings = myBookings.filter(b => b.dispute_status === 'Pending');
  const completedHistory = myBookings.filter(b => b.status === 'Completed' || b.dispute_status === 'Resolved');
  
  const activeTab = location.pathname;

  return (
    <div className="container page-container" style={{ minHeight: '60vh' }}>
      <h2>Welcome, Senior {auth.user ? auth.user.name : ''}!</h2>
      <p>आपका काम 'नई' (new) 'बुकिंग्स' (bookings) को 'चेक' (check) करना और 'स्टूडेंट' (student) 'से' (from) 'चैट' (chat) (चैट) 'के' (of) 'ज़रिए' (via) 'बात' (talk) 'करना' (do) 'है' (is)।</p>
      
      <StatsGrid stats={stats} loading={loading} />

      <hr style={{margin: '40px 0'}} />

      {/* ('Tab' (टैब) (Tab (टैब)) 'Navigation' (नेविगेशन)) */}
      <div className="dashboard-nav">
          <Link to="/senior-dashboard" className={`dashboard-nav-item ${activeTab === '/senior-dashboard' ? 'active' : ''}`}>
            New Bookings ({tasksToComplete.length})
          </Link>
          <Link to="/senior-dashboard/disputes" className={`dashboard-nav-item ${activeTab.includes('/disputes') ? 'active' : ''}`}>
            Active Disputes ({disputedBookings.length})
          </Link>
          <Link to="/senior-dashboard/history" className={`dashboard-nav-item ${activeTab.includes('/history') ? 'active' : ''}`}>
            Completed History ({completedHistory.length})
          </Link>
          <Link to="/senior-earnings" className="btn btn-primary" style={{marginLeft: 'auto'}}>
            View My Earnings
          </Link>
      </div>
      
      {/* ('Nested' (नेस्टेड) (नेस्टेड) 'Routing' (रूटिंग) (रूटिंग) 'कंटेनर' (Container) (कंटेनर)) */}
      <div style={{marginTop: '30px'}}>
        <Routes>
            <Route path="/" element={
                <BookingsDisplay 
                    title="New Bookings" 
                    bookings={tasksToComplete} 
                    loading={loading}
                    onMarkComplete={markAsCompletedHandler}
                    onStartChat={handleStartChat}
                />
            } />
            <Route path="/disputes" element={
                <BookingsDisplay 
                    title="Active Disputes" 
                    bookings={disputedBookings} 
                    loading={loading}
                    onMarkComplete={markAsCompletedHandler}
                    onStartChat={handleStartChat}
                />
            } />
            <Route path="/history" element={
                <BookingsDisplay 
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
export default SeniorDashboard;git add .
