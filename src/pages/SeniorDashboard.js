import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ('StarIcon' (स्टारआइकन) 'डेफिनिशन' (Definition) (परिभाषा))
const StarIcon = ({ filled }) => ( <svg fill={filled ? '#f39c12' : '#e0e0e0'} width="20px" height="20px" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> );

// ---------------------------------------------
// ('FindSenior' (सीनियर खोजें) 'कॉम्पोनेंट' (component) (घटक))
// ---------------------------------------------
const FindSenior = () => {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [platformFee, setPlatformFee] = useState(20); 
    const [colleges, setColleges] = useState([]);
    const [tags, setTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('rating'); 

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const API_URL = 'https://collegeconnect-backend-mrkz.onrender.com';
                
                const [seniorsRes, collegesRes, tagsRes, settingsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/profile/all`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_URL}/api/colleges`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_URL}/api/tags`, { headers: { 'x-auth-token': token } }),
                    axios.get(`${API_URL}/api/settings`)
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

    // ('Filter/Sort' (फ़िल्टर/सॉर्ट) (Filter/Sort (फ़िल्टर/क्रमबद्ध)) 'लॉजिक' (logic) (तर्क))
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
            <div className="search-container">
                <input type="text" placeholder="Search by College, Branch, or Tag..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <button 
                className="btn btn-secondary filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
            >
                {showFilters ? 'Hide Filters' : 'Show Filters & Sort'}
            </button>
            
            <div 
                className="filters-container" 
                style={{display: showFilters ? 'grid' : ''}} 
            >
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
                const bookingsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my', { headers: { 'x-auth-token': token } });
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

    const renderBookingContext = (booking) => {
        if (!booking.profile) return <span>...</span>;
        return ( <div>
            <strong>{booking.profile.college ? booking.profile.college.name : 'N/A'}</strong>
            <span style={{display: 'block', fontSize: '0.9rem', color: '#555'}}>({booking.profile.year || 'Year N/A'})</span>
        </div> );
    };

    const renderStudentAction = (booking) => {
        if (booking.rating) {
            return <span style={{color: '#f39c12', fontWeight: 'bold'}}>{booking.rating} ★ Rated</span>;
        }
        if (booking.dispute_status === 'Pending') {
            return <span className="status-pending">Dispute Pending</span>;
        }
        if (booking.status === 'Completed') {
            return ( <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => handleRate(booking._id)} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '12px'}}>Rate</button>
                <button onClick={() => handleDispute(booking._id)} className="btn" style={{padding: '5px 10px', background: '#e74c3c', color: 'white', fontSize: '12px'}}>Dispute</button>
            </div> );
        }
        if (booking.status === 'Confirmed') {
            return ( <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => handleStartChat(booking._id)} className="btn btn-primary" style={{padding: '5px 10px', fontSize: '12px'}}>Start Chat</button>
                <button onClick={() => handleDispute(booking._id)} className="btn" style={{padding: '5px 10px', background: '#e74c3c', color: 'white', fontSize: '12px'}}>Dispute</button>
            </div> );
        }
        return null; 
    };

    const upcomingBookings = myBookings.filter(b => b.status === 'Confirmed');
    const historyBookings = myBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled (Refunded)');
    
    if (loading) return <h2>Loading My Bookings...</h2>;
    if (error) return <h2 style={{color: 'red'}}>{error}</h2>;

    return (
        <div>
            {/* --- 'MOBILE' (मोबाइल) (MOBILE (मोबाइल)) '`Card`' (कार्ड) (Card (कार्ड)) 'UI' (यूआई) (UI (यूआई)) --- */}
            <div className="mobile-only">
                <h2>My Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="booking-card-list">
                        {upcomingBookings.map(booking => (
                            <div key={booking._id} className="booking-card" style={{background: booking.dispute_status === 'Pending' ? '#fff0f0' : '#fff'}}>
                                <h3>{booking.senior ? booking.senior.name : '...'}</h3>
                                <div className="details">
                                    <strong>College:</strong> {booking.profile && booking.profile.college ? booking.profile.college.name : 'N/A'} ({booking.profile ? booking.profile.year : 'N/A'}) <br/>
                                    <strong>Booked On:</strong> {new Date(booking.slot_time).toLocaleString()} <br/>
                                    <strong>Status:</strong> {booking.status}
                                </div>
                                <div className="actions">
                                    {renderStudentAction(booking)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : ( <p>You have no upcoming bookings.</p> )}
                
                <h2 style={{marginTop: '40px'}}>Booking History</h2>
                {historyBookings.length > 0 ? (
                     <div className="booking-card-list">
                        {historyBookings.map(booking => (
                            <div key={booking._id} className="booking-card" style={{background: booking.status === 'Completed' ? '#f0fff0' : '#fff'}}>
                                <h3>{booking.senior ? booking.senior.name : '...'}</h3>
                                <div className="details">
                                    <strong>College:</strong> {booking.profile && booking.profile.college ? booking.profile.college.name : 'N/A'} ({booking.profile ? booking.profile.year : 'N/A'}) <br/>
                                    <strong>Status:</strong> {booking.status} <br/>
                                    <strong>Dispute:</strong> {booking.dispute_status}
                                </div>
                                <div className="actions">
                                    {renderStudentAction(booking)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : ( <p>You have no completed bookings.</p> )}
            </div>
            
            {/* --- 'DESKTOP' (डेस्कटॉप) (DESKTOP (डेस्कटॉप)) '`Table`' (टेबल) (Table (टेबल)) UI (यूआई) (UI (यूआई)) --- */}
            <div className="desktop-only">
                <h2>My Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="table-container">
                        <table className="user-table">
                        <thead><tr><th>Senior</th><th>Booking Details</th><th>Status</th><th>Dispute</th><th>Action</th></tr></thead>
                        <tbody>{upcomingBookings.map(booking => (
                            <tr key={booking._id} style={{background: booking.dispute_status === 'Pending' ? '#fff0f0' : ''}}>
                                <td>{booking.senior ? booking.senior.name : '...'}</td>
                                <td>{renderBookingContext(booking)}</td>
                                <td>{booking.status}</td>
                                <td className="col-reason" style={{fontWeight: 'normal'}}>
                                    {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                                </td>
                                <td className="col-action">{renderStudentAction(booking)}</td>
                            </tr>
                        ))}</tbody>
                        </table>
                    </div>
                ) : ( <p>You have no upcoming bookings.</p> )}
                
                <h2 style={{marginTop: '40px'}}>Booking History</h2>
                {historyBookings.length > 0 ? (
                    <div className="table-container">
                        <table className="user-table">
                        <thead><tr><th>Senior</th><th>Booking Details</th><th>Status</th><th>Dispute</th><th>Action</th></tr></thead>
                        <tbody>{historyBookings.map(booking => (
                            <tr key={booking._id} style={{background: booking.status === 'Completed' ? '#f0fff0' : ''}}>
                                <td>{booking.senior ? booking.senior.name : '...'}</td>
                                <td>{renderBookingContext(booking)}</td>
                                <td className={booking.status === 'Completed' ? 'status-completed' : ''}>{booking.status}</td>
                                <td className="col-reason" style={{fontWeight: 'normal'}}>
                                    {booking.dispute_status === 'Pending' ? (booking.dispute_reason ? booking.dispute_reason.reason : 'Pending') : booking.dispute_status}
                                </td>
                                <td className="col-action">{renderStudentAction(booking)}</td>
                            </tr>
                        ))}</tbody>
                        </table>
                    </div>
                ) : ( <p>You have no completed bookings.</p> )}
            </div>
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
        <div className="container page-container" style={{ minHeight: '60vh' }}>
            {/* ('Tab' (टैब) (Tab (टैब)) 'Navigation' (नेविगेशन)) */}
            <div className="dashboard-nav">
                <Link to="/student-dashboard" className={`dashboard-nav-item ${!onBookingsTab ? 'active' : ''}`}>
                    Find a Senior
                </Link>
                <Link to="/student-dashboard/bookings" className={`dashboard-nav-item ${onBookingsTab ? 'active' : ''}`}>
                    My Bookings
                </Link>
            </div>
            
            {/* ('Routing' (रूटिंग) (Routing (रूटिंग))) */}
            <div style={{marginTop: '30px'}}>
                <Routes>
                    <Route path="/" element={<FindSenior />} />
                    <Route path="/bookings" element={<MyBookings />} />
                </Routes>
            </div>
        </div>
    );
}
export default StudentDashboard;