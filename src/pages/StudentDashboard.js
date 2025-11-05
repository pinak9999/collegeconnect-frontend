import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // (हम 'toasts' (टोस्ट) (टोस्ट) 'इस्तेमाल' (use) 'करेंगे' (will do), 'इसलिए' (so) 'इम्पोर्ट' (import) (आयात) 'रखें' (keep))

// ('StarIcon' (स्टारआइकन) 'डेफिनिशन' (Definition) (परिभाषा))
const StarIcon = ({ filled }) => ( <svg fill={filled ? '#f39c12' : '#e0e0e0'} width="20px" height="20px" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> );

// ---------------------------------------------
// ('FindSenior' (सीनियर खोजें) 'कॉम्पोनेंट' (component) (घटक) (यह 'वही' (same) 'है' (is)))
// ---------------------------------------------
const FindSenior = () => {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [platformFee, setPlatformFee] = useState(20); 
    const [colleges, setColleges] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('rating'); 

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const [seniorsRes, collegesRes, tagsRes, settingsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/profile/all', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/colleges', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/tags', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/settings')
                ]);
                setSeniors(seniorsRes.data);
                setColleges(collegesRes.data);
                setTags(tagsRes.data);
                setPlatformFee(settingsRes.data.platformFee);
                setLoading(false);
            } catch (err) {
                let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
                setError('Error: ' + errorMsg); setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredAndSortedSeniors = seniors
        .filter(senior => { 
            const query = searchQuery.toLowerCase();
            const matchesCollege = !selectedCollege || (senior.college && senior.college._id === selectedCollege);
            const matchesTag = !selectedTag || (senior.tags && senior.tags.some(tag => tag._id === selectedTag));
            const matchesSearch = !query || 
                (senior.college && senior.college.name.toLowerCase().includes(query)) ||
                (senior.branch && senior.branch.toLowerCase().includes(query)) ||
                (senior.user.name && senior.user.name.toLowerCase().includes(query));
            return matchesCollege && matchesTag && matchesSearch;
        })
        .sort((a, b) => { 
            if (sortBy === 'price_asc') return (a.price_per_session + platformFee) - (b.price_per_session + platformFee);
            if (sortBy === 'price_desc') return (b.price_per_session + platformFee) - (a.price_per_session + platformFee);
            return (b.average_rating || 0) - (a.average_rating || 0);
        });

    if (loading) return <h2>Loading Seniors...</h2>;
    if (error) return <h2 style={{color: 'red'}}>{error}</h2>;

    return (
        <>
            <div className="search-container"><input type="text" placeholder="Search by College, Branch, or Tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="filters-container">
                <div className="form-group"><label>Filter by College</label><select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)}><option value="">All Colleges</option>{colleges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Filter by Tag</label><select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}><option value="">All Tags</option>{tags.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</select></div>
                <div className="form-group"><label>Sort By</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="rating">Rating: High to Low</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select></div>
            </div>
            <div className="container senior-grid-container">
                {filteredAndSortedSeniors.length > 0 ? (
                    <div className="senior-grid">
                        {filteredAndSortedSeniors.map(profile => (
                            <div key={profile._id} className="senior-card">
                                <img src={profile.avatar || 'https://via.placeholder.com/100'} alt={profile.user ? profile.user.name : 'Senior'} />
                                <h4>{profile.user ? profile.user.name : 'Senior'}</h4>
                                <div className="rating" style={{display: 'flex', justifyContent: 'center', gap: '2px'}}>
                                    {[...Array(5)].map((_, i) => ( <StarIcon key={i} filled={i < Math.round(profile.average_rating)} /> ))}
                                    <span style={{marginLeft: '5px'}}>({profile.total_ratings} reviews)</span>
                                </div>
                                <p className="college">
                                    {(profile.college ? profile.college.name : 'N/A')}
                                    <span style={{display: 'block', color: '#555', fontWeight: 500}}>{profile.branch || 'N/A'} ({profile.year || 'N/A'})</span>
                                </p>
                                <div className="tags-container">{profile.tags && profile.tags.map(tag => (<span key={tag._id} className="tag-pill">{tag.name}</span>))}</div>
                                <p className="bio">{(profile.bio || '').substring(0, 100)}...</p>
                                <div className="price">₹{(profile.price_per_session || 0) + platformFee} <span style={{fontSize: '0.9rem', color: '#555'}}> / {profile.session_duration_minutes} min</span></div>
                                <Link to={`/book/${profile.user._id}`} className="btn btn-primary">View Profile & Book</Link>
                            </div>
                        ))}
                    </div>
                ) : ( <p style={{textAlign: 'center', fontSize: '1.2rem'}}>No seniors found matching your criteria.</p> )}
            </div>
        </>
    );
};

// ---------------------------------------------
// ('MyBookings' (मेरी बुकिंग्स) 'कॉम्पोनेंट' (component) (घटक))
// ---------------------------------------------
const MyBookings = () => {
    const navigate = useNavigate(); 
    const [myBookings, setMyBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const bookingsRes = await axios.get('http://localhost:5000/api/bookings/student/my', { headers: { 'x-auth-token': token } });
                setMyBookings(bookingsRes.data);
                setLoading(false);
            } catch (err) {
                let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
                setError('Error: ' + errorMsg); setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleRate = (bookingId) => navigate(`/rate-booking/${bookingId}`);
    const handleDispute = (bookingId) => navigate(`/raise-dispute/${bookingId}`);
    const handleStartChat = (bookingId) => navigate(`/chat/${bookingId}`);

    // --- (यह 'Helper' (हेल्पर) (helper) 'फंक्शन' (function) 'Context' (कॉन्टेक्स्ट) (संदर्भ) 'दिखाएगा' (will show)) ---
    const renderBookingContext = (booking) => {
        if (!booking.profile) return <span>...</span>;
        return (
            <div>
                <strong>{booking.profile.college ? booking.profile.college.name : 'N/A'}</strong>
                <span style={{display: 'block', fontSize: '0.9rem', color: '#555'}}>
                    ({booking.profile.year || 'Year N/A'})
                </span>
            </div>
        );
    };

    // --- (1. 'यह' (This) 'रहा' (is) 'नया' (new) '100% Accurate' (सही) 'लॉजिक' (Logic) (तर्क)) ---
    // (यह 'Action' (एक्शन) 'कॉलम' (column) (स्तंभ) 'को' (to) 'रेंडर' (render) (प्रस्तुत) 'करेगा' (will do))
    const renderStudentAction = (booking) => {
        
        // 'केस' (Case) (मामला) 1: 'Student' (छात्र) 'ने' (did) 'Rate' (रेट) (मूल्यांकन) 'कर' (done) 'दिया' (did) 'है' (है) (Game Over (खेल खत्म))
        if (booking.rating) {
            return <span style={{color: '#f39c12', fontWeight: 'bold'}}>{booking.rating} ★ Rated</span>;
        }

        // 'केस' (Case) (मामला) 2: 'Dispute' (विवाद) 'अभी' (currently) 'Pending' (पेंडिंग) (लंबित) 'है' (is) (Wait for Admin (एडमिन का इंतज़ार करें))
        if (booking.dispute_status === 'Pending') {
            return <span className="status-pending">Dispute Pending</span>;
        }

        // 'केस' (Case) (मामला) 3: 'Booking' (बुकिंग) 'Completed' (कंप्लीटेड) (पूरी) 'हो' (has) 'गई' (gone) 'है' (है) (लेकिन (but) 'Rate' (रेट) (मूल्यांकन) 'नहीं' (not) 'की' (done) 'गई' (was))
        if (booking.status === 'Completed') {
            // (यह 'आपकी' (your) 'रिक्वेस्ट' (request) (अनुरोध) 'है' (is): 'Rate' (रेट) (मूल्यांकन) 'और' (and) 'Dispute' (विवाद) 'दोनों' (both) 'दिखाओ' (Show))
            return (
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => handleRate(booking._id)} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}}>
                        Rate
                    </button>
                    <button onClick={() => handleDispute(booking._id)} className="btn" style={{padding: '5px 10px', background: '#e74c3c', color: 'white', fontSize: '12px'}}>
                        Dispute
                    </button>
                </div>
            );
        }
        
        // 'केस' (Case) (मामला) 4: 'Booking' (बुकिंग) 'Confirmed' (कन्फर्म) (पुष्ट) 'है' (is) (यानी (i.e.) 'Upcoming' (आगामी))
        if (booking.status === 'Confirmed') {
            // (सिर्फ 'Chat' (चैट) (चैट) 'और' (and) 'Dispute' (विवाद) 'दिखाओ' (Show))
            return (
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => handleStartChat(booking._id)} className="btn btn-primary" style={{padding: '5px 10px', fontSize: '12px'}}>
                        Start Chat
                    </button>
                    <button onClick={() => handleDispute(booking._id)} className="btn" style={{padding: '5px 10px', background: '#e74c3c', color: 'white', fontSize: '12px'}}>
                        Dispute
                    </button>
                </div>
            );
        }

        return null; // (जैसे 'Cancelled' (कैंसल्ड) (रद्द) 'के लिए' (for) 'कुछ' (nothing) 'नहीं' (not))
    };
    // --- ('लॉजिक' (Logic) (तर्क) 'फिक्स' (fix) (ठीक) 'खत्म' (End)) ---

    // ('Smart Booking' (स्मार्ट बुकिंग) 'Tabs' (टैब) (टैब) 'लॉजिक' (logic) (तर्क))
    const upcomingBookings = myBookings.filter(b => b.status === 'Confirmed');
    const historyBookings = myBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled (Refunded)');
    
    if (loading) return <h2>Loading My Bookings...</h2>;
    if (error) return <h2 style={{color: 'red'}}>{error}</h2>;

    return (
        <div>
            <h2>My Upcoming Bookings</h2>
            {upcomingBookings.length > 0 ? (
                <div className="table-container">
                    <table className="user-table">
                    <thead><tr><th>Senior</th><th>Booking Details</th><th>Status</th><th>Dispute</th><th>Action</th></tr></thead>
                    <tbody>
                        {upcomingBookings.map(booking => (
                        <tr key={booking._id} style={{background: booking.dispute_status === 'Pending' ? '#fff0f0' : ''}}>
                            <td>{booking.senior ? booking.senior.name : '...'}</td>
                            <td>{renderBookingContext(booking)}</td>
                            <td className={booking.status === 'Completed' ? 'status-completed' : ''}>{booking.status}</td>
                            <td className="col-reason" style={{fontWeight: 'normal'}}>
                                {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                            </td>
                            {/* 2. (यह 'नए' (new) 'लॉजिक' (logic) (तर्क) 'फंक्शन' (function) 'को' (to) 'कॉल' (call) (call) 'करेगा' (will do)) */}
                            <td className="col-action">
                                {renderStudentAction(booking)}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            ) : ( <p>You have no upcoming bookings.</p> )}
            
            <h2 style={{marginTop: '40px'}}>Booking History</h2>
            {historyBookings.length > 0 ? (
                <div className="table-container">
                    <table className="user-table">
                    <thead><tr><th>Senior</th><th>Booking Details</th><th>Status</th><th>Dispute</th><th>Action</th></tr></thead>
                    <tbody>
                        {historyBookings.map(booking => (
                        <tr key={booking._id} style={{background: booking.status === 'Completed' ? '#f0fff0' : ''}}>
                            <td>{booking.senior ? booking.senior.name : '...'}</td>
                            <td>{renderBookingContext(booking)}</td>
                            <td className={booking.status === 'Completed' ? 'status-completed' : ''}>{booking.status}</td>
                            <td className="col-reason" style={{fontWeight: 'normal'}}>
                                {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                            </td>
                            {/* 3. (यह 'नए' (new) 'लॉजिक' (logic) (तर्क) 'फंक्शन' (function) 'को' (to) 'कॉल' (call) (call) 'करेगा' (will do)) */}
                            <td className="col-action">
                                {renderStudentAction(booking)}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            ) : ( <p>You have no completed bookings.</p> )}
        </div>
    );
};

// ---------------------------------------------
// ('मुख्य' (Main) 'Student Dashboard' (छात्र डैशबोर्ड) 'कॉम्पोनेंट' (component) (घटक))
// ---------------------------------------------
function StudentDashboard() {
    const location = useLocation(); 
    const onBookingsTab = location.pathname.includes('/bookings');

    return (
        <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
            <div className="dashboard-nav">
                <Link to="/student-dashboard" className={`dashboard-nav-item ${!onBookingsTab ? 'active' : ''}`}>
                    Find a Senior
                </Link>
                <Link to="/student-dashboard/bookings" className={`dashboard-nav-item ${onBookingsTab ? 'active' : ''}`}>
                    My Bookings
                </Link>
            </div>
            <Routes>
                <Route path="/" element={<FindSenior />} />
                <Route path="/bookings" element={<MyBookings />} />
            </Routes>
        </div>
    );
}
export default StudentDashboard;