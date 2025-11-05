import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ('StarIcon' (स्टारआइकन) 'को' (to) 'यहाँ' (here) 'भी' (also) 'कॉपी' (copy) (प्रतिलिपि) 'करें' (do))
const StarIcon = ({ filled }) => ( <svg fill={filled ? '#f39c12' : '#e0e0e0'} width="20px" height="20px" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> );

function FeaturedSeniors() {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformFee, setPlatformFee] = useState(20); 

    useEffect(() => {
        const loadData = async () => {
            try {
                // ('Public' (पब्लिक) (सार्वजनिक) 'API' (एपीआई) 'कॉल' (call) (call) 'करें' (do))
                const seniorsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/public/top-rated');
                setSeniors(seniorsRes.data);
                
                const settingsRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`);
                setPlatformFee(settingsRes.data.platformFee);
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching featured seniors:", err);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="container" style={{padding: '20px'}}>Loading top seniors...</div>;
    if (seniors.length === 0) return null; // (अगर 'कोई' (no) 'सीनियर' (Senior) (सीनियर) 'नहीं' (not) 'है' (is), 'तो' (then) 'कुछ' (nothing) 'मत' (don't) 'दिखाओ' (show))

    return (
        <section className="featured-seniors" style={{padding: '60px 0', background: '#f4f7f6'}}>
            <div className="container">
                <h2 style={{textAlign: 'center', fontSize: '32px', marginBottom: '50px', color: '#34495e'}}>
                    Meet Our Top Seniors
                </h2>
                <div className="senior-grid">
                    {seniors.map(profile => (
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
                            <div className="price">
                              ₹{(profile.price_per_session || 0) + platformFee} 
                              <span style={{fontSize: '0.9rem', color: '#555'}}> / {profile.session_duration_minutes} min</span>
                            </div>
                            
                            {/* --- (यह रहा 'नया' (New) 'फिक्स' (Fix) (ठीक)) --- */}
                            {/* ('यह' (This) 'बटन' (button) (बटन) 'अब' (now) 'लॉगिन' (login) 'पेज' (page) (page) 'पर' (on) 'भेजेगा' (will send)) */}
                            <Link to="/login" className="btn btn-primary">
                              Login to Book
                            </Link>
                            {/* --- (अपडेट (Update) खत्म) --- */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default FeaturedSeniors;