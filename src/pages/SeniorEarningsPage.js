import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// ('Stats' (स्टेट्स) (आँकड़े) 'ग्रिड' (Grid) (ग्रिड) 'कॉम्पोनेंट' (component) (घटक) (वही है))
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

function SeniorEarningsPage() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({ totalCompleted: 0, totalPending: 0, unpaidAmount: 0 });
  const [allBookings, setAllBookings] = useState([]);

  // --- (1. 'यह' (This) 'रहा' (is) 'नया' (new) '100% Accurate' (सही) 'फिक्स' (Fix) (ठीक)) ---
  // (हम 'Platform Fee' (प्लेटफार्म फीस) (platformFee) 'को' (to) 'अलग' (separately) 'से' (from) 'स्टोर' (store) (संग्रहीत) 'करेंगे' (will do))
  const [platformFee, setPlatformFee] = useState(20); // (डिफ़ॉल्ट' (Default) (डिफ़ॉल्ट) 20)
  // --- (फिक्स' (Fix) (ठीक) 'खत्म' (End)) ---

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // (हम 'अब' (now) 3 'API' (एपीआई) 'कॉल्स' (calls) (calls) 'कर' (doing) 'रहे' (are) 'हैं' (हैं))
        const [statsRes, bookingsRes, settingsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/profile/senior/stats', { headers: { 'x-auth-token': token } }),
            axios.get('http://localhost:5000/api/bookings/senior/my', { headers: { 'x-auth-token': token } }),
            axios.get('http://localhost:5000/api/settings') // ('Platform Fee' (प्लेटफार्म फीस) 'लाएँ' (Fetch))
        ]);
        
        setStats(statsRes.data);
        setAllBookings(bookingsRes.data);
        setPlatformFee(settingsRes.data.platformFee); // ('Fee' (फीस) (फीस) 'को' (to) 'State' (स्टेट) (स्थिति) 'में' (in) 'सेट' (set) (सेट) 'करें' (do))
        setLoading(false);
      } catch (err) { 
          toast.error("Failed to load earnings data.");
          setLoading(false);
      }
    };
    loadData();
  }, []); 

  // ('History' (इतिहास) (History) 'टेबल' (table) (table) 'को' (to) 'फिल्टर' (filter) (फ़िल्टर) 'करें' (do))
  const earningHistory = allBookings.filter(b => b.status === 'Completed');

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      
      <Link to="/senior-dashboard" className="btn btn-secondary" style={{marginBottom: '20px'}}>
          &larr; Back to Dashboard
      </Link>

      <h2>My Earnings & Stats</h2>
      <p>Track your performance and payments here.</p>
      
      {/* ('Stats' (स्टेट्स) (आँकड़े) 'ग्रिड' (Grid) (ग्रिड)) */}
      <StatsGrid stats={stats} loading={loading} />

      <hr style={{margin: '40px 0'}} />

      {/* ('Earning' (कमाई) (कमाई) 'History' (इतिहास) (History) 'टेबल' (table) (table)) */}
      <h2>Earnings History (Completed Calls)</h2>
      {loading ? (<p>Loading history...</p>) :
      earningHistory.length > 0 ? (
          <div className="table-container">
             <table className="user-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Completed On</th>
                  <th>Payout Status</th>
                  <th style={{color: '#1abc9c'}}>Your Earning</th>
                </tr>
              </thead>
              <tbody>
                {earningHistory.map(booking => (
                  <tr key={booking._id} style={{ background: booking.payout_status === 'Paid' ? '#f0fff0' : '#fff' }}>
                    <td>{booking.student ? booking.student.name : '...'}</td>
                    {/* (यह 'booking.date' (बुकिंग.डेट) 'होना' (should be) 'चाहिए' (should) 'जो' (which) 'बुकिंग' (booking) 'बनने' (created) 'का' (of) 'टाइम' (time) (समय) 'है' (is)) */}
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td style={{color: booking.payout_status === 'Paid' ? 'green' : 'gray', fontWeight: 'bold'}}>
                        {booking.payout_status}
                    </td>
                    
                    {/* --- (2. 'यह' (This) 'रहा' (is) 'नया' (new) '100% Accurate' (सही) 'फिक्स' (Fix) (ठीक)) --- */}
                    {/* ('अब' (Now) 'यह' (it) '`stats.platformFee`' (स्टेट्स.प्लेटफार्मफीस) (stats.platformFee) 'की' (of) 'जगह' (place) '`platformFee`' (प्लेटफार्म फीस) (platformFee) 'State' (स्टेट) (स्थिति) 'का' (of) 'इस्तेमाल' (use) 'करेगा' (will do)) */}
                    <td style={{color: '#1abc9c', fontWeight: 'bold'}}>
                        ₹{booking.amount_paid - platformFee}
                    </td>
                    {/* --- (फिक्स' (Fix) (ठीक) 'खत्म' (End)) --- */}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      ) : ( <p>You have no completed bookings yet.</p> )}
    </div>
  );
}
export default SeniorEarningsPage;