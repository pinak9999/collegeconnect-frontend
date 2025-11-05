import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

// (BookingsTable 'हेल्पर' (helper) (helper) 'कॉम्पोनेंट' (component) (घटक) (वही है))
const BookingsTable = ({ title, bookings, loading, onMarkComplete, onStartChat }) => {
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
    return (
        <div className="table-container">
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
  // 1. ('Stats' (स्टेट्स) (आँकड़े) 'State' (स्टेट) (स्थिति) 'हटा' (remove) 'दिया' (did) 'गया' (was) 'है' (है)!)

  // 2. (यह 'सिर्फ' (only) 'Bookings' (बुकिंग्स) (बुकिंग्स) 'लोड' (load) (लोड) 'करेगा' (will do))
  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookingsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/bookings/senior/my', { headers: { 'x-auth-token': token } });
      setMyBookings(bookingsRes.data);
      setLoading(false);
    } catch (err) { 
        console.error('Error fetching bookings:', err.response ? err.response.data.msg : err.message); 
        setLoading(false);
        toast.error("Failed to load bookings.");
    }
  }, []); 
  useEffect(() => { loadBookings(); }, [loadBookings]); 

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
        loadBookings(); // ('डेटा' (Data) (डेटा) 'री-लोड' (re-load) (पुनः लोड) 'करें' (do))
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
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <h2>Welcome, Senior {auth.user ? auth.user.name : ''}!</h2>
      <p>आपका काम 'नई' (new) 'बुकिंग्स' (bookings) को 'चेक' (check) करना और 'स्टूडेंट' (student) 'से' (from) 'चैट' (chat) (चैट) 'के' (of) 'ज़रिए' (via) 'बात' (talk) 'करना' (do) 'है' (is)।</p>
      
      {/* 3. ('Stats' (स्टेट्स) (आँकड़े) 'ग्रिड' (Grid) (ग्रिड) 'हटा' (remove) 'दिया' (did) 'गया' (was) 'है' (है)) */}
      {/* <StatsGrid ... /> */}

      <hr style={{margin: '40px 0'}} />

      {/* 4. 'Tab' (टैब) (Tab (टैब)) 'Navigation' (नेविगेशन) 'को' (to) 'अपडेट' (update) (अद्यतन) 'किया' (did) 'गया' (was) 'है' (है) */}
      <div className="dashboard-nav">
          <Link 
            to="/senior-dashboard" 
            className={`dashboard-nav-item ${activeTab === '/senior-dashboard' ? 'active' : ''}`}
          >
            New Bookings ({tasksToComplete.length})
          </Link>
          <Link 
            to="/senior-dashboard/disputes" 
            className={`dashboard-nav-item ${activeTab.includes('/disputes') ? 'active' : ''}`}
          >
            Active Disputes ({disputedBookings.length})
          </Link>
          <Link 
            to="/senior-dashboard/history" 
            className={`dashboard-nav-item ${activeTab.includes('/history') ? 'active' : ''}`}
          >
            Completed History ({completedHistory.length})
          </Link>
          {/* --- (5. 'यह' (This) 'रहा' (is) 'नया' (new) 'Earning' (कमाई) (कमाई) 'लिंक' (Link) (लिंक)!) --- */}
          <Link 
            to="/senior-earnings" 
            className="btn btn-primary" 
            style={{marginLeft: 'auto'}}
          >
            View My Earnings & Stats
          </Link>
      </div>
      
      {/* ('Nested' (नेस्टेड) (नेस्टेड) 'Routing' (रूटिंग) (रूटिंग) 'कंटेनर' (Container) (कंटेनर)) */}
      <div style={{marginTop: '30px'}}>
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