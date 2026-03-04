import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ======================================
// 🚀 Premium Featured Seniors CSS
// ======================================
const featuredStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.featured-section-wrapper {
    padding: 80px 20px;
    background-color: #e7ffd6 ; /* Clean off-white background */
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
}

/* Background Subtle Glows */
.featured-section-wrapper::before {
    content: '';
    position: absolute;
    top: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(226,55,68,0.06) 0%, transparent 70%);
    z-index: 0;
}
.featured-section-wrapper::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(37,165,65,0.06) 0%, transparent 70%);
    z-index: 0;
}

.featured-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

/* Section Header */
.featured-header {
    text-align: center;
    margin-bottom: 50px;
}
.featured-header h2 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1c1c1c;
    margin: 0 0 12px 0;
    display: inline-flex;
    align-items: center;
    gap: 10px;
}
.featured-header h2 span {
    color: #f5a623; /* Star color */
}
.featured-header p {
    font-size: 1.1rem;
    color: #696969;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

/* Grid Layout */
.featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    justify-content: center;
}

/* Individual Card */
.expert-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 30px 24px;
    border: 1px solid #e8e8e8;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
}
.expert-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(226, 55, 68, 0.08);
    border-color: rgba(226, 55, 68, 0.2);
}

/* Avatar Setup */
.expert-avatar-wrap {
    position: relative;
    margin-bottom: 20px;
}
.expert-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fcebed;
    padding: 3px;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.badge-verified {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: #25a541;
    border: 2px solid #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}
.badge-verified svg {
    width: 14px;
    height: 14px;
}

/* Info */
.expert-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1c1c1c;
    margin: 0 0 6px 0;
}
.expert-branch {
    font-size: 0.9rem;
    color: #696969;
    font-weight: 500;
    margin: 0 0 16px 0;
    background: #f8f9fa;
    padding: 6px 14px;
    border-radius: 50px;
    border: 1px solid #e8e8e8;
}

/* Rating */
.expert-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
}
.stars {
    display: flex;
    gap: 2px;
}
.rating-val {
    font-size: 0.9rem;
    font-weight: 600;
    color: #696969;
}

/* Price & Button Container */
.expert-footer {
    width: 100%;
    margin-top: auto;
}
.expert-price {
    font-size: 1.4rem;
    font-weight: 800;
    color: #e23744; /* Zomato/Brand Red */
    margin-bottom: 16px;
    display: block;
}
.expert-price span {
    font-size: 0.85rem;
    color: #696969;
    font-weight: 500;
}
.btn-book {
    display: block;
    width: 89%;
    padding: 14px;
    border-radius: 12px;
    background: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(226, 55, 68, 0.2);
}
.btn-book:hover {
    box-shadow: 0 8px 25px rgba(226, 55, 68, 0.3);
    transform: scale(1.02);
}

/* Loading State */
.loading-box {
    text-align: center;
    padding: 60px 20px;
    color: #696969;
    font-size: 1.1rem;
    font-weight: 500;
}

/* --- Mobile Responsiveness --- */
@media (max-width: 768px) {
    .featured-section-wrapper {
        padding: 50px 16px;
    }
    .featured-header h2 {
        font-size: 1.8rem;
    }
    .featured-header p {
        font-size: 0.95rem;
    }
    .featured-grid {
        gap: 20px;
    }
    .expert-card {
        padding: 24px 20px;
        background-color:  #fef4f4 ;
    }
    .expert-avatar {
        width: 90px;
        height: 90px;
    }
    .expert-name {
        font-size: 1.2rem;
    }
}
`;

const StarIcon = ({ filled }) => (
    <svg fill={filled ? '#f5a623' : '#e8e8e8'} width="16px" height="16px" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const VerifiedBadge = () => (
    <div className="badge-verified">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

function FeaturedSeniors() {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformFee, setPlatformFee] = useState(20);

    useEffect(() => {
        const loadData = async () => {
            try {
                const seniorsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/public/top-rated');
                setSeniors(seniorsRes.data.slice(0, 3)); // Showing top 3

                const settingsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/settings');
                if (settingsRes.data && settingsRes.data.platformFee !== undefined) {
                    setPlatformFee(settingsRes.data.platformFee);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching featured seniors:", err);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <>
                <style>{featuredStyles}</style>
                <div className="featured-section-wrapper loading-box">
                    <p>⏳ Loading Top Experts...</p>
                </div>
            </>
        );
    }

    if (seniors.length === 0) return null;

    return (
        <>
            <style>{featuredStyles}</style>
            
            <section className="featured-section-wrapper">
                <div className="featured-container">
                    
                  
                    <div className="featured-header">
                        <h2><span>⭐</span> Featured Seniors</h2>
                        <p>Get insights from real students who have experienced your dream college and cracked top placements.</p>
                    </div>

                    {/* Cards Grid */}
                    <div className="featured-grid">
                        {seniors.map(profile => {
                            const seniorName = profile.user ? profile.user.name : 'Senior';
                            const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(seniorName)}&background=e23744&color=fff&size=150&bold=true`;
                            const finalPrice = (profile.price_per_session || 0) + platformFee;

                            return (
                                <div key={profile._id} className="expert-card">
                                    
                                    {/* Avatar & Badge */}
                                    <div className="expert-avatar-wrap">
                                        <img
                                            src={profile.avatar || fallbackImage}
                                            alt={seniorName}
                                            className="expert-avatar"
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                                        />
                                        <VerifiedBadge />
                                    </div>

                                    {/* Info */}
                                    <h4 className="expert-name">{seniorName}</h4>
                                    <p className="expert-branch">
                                        {profile.branch || 'General'} • {profile.year || 'N/A'}
                                    </p>

                                    {/* Rating */}
                                    <div className="expert-rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} filled={i < Math.round(profile.average_rating || 5)} />
                                            ))}
                                        </div>
                                        <span className="rating-val">
                                            ({profile.average_rating ? profile.average_rating.toFixed(1) : '5.0'})
                                        </span>
                                    </div>

                                    {/* Footer (Price & Button) */}
                                    <div className="expert-footer">
                                        <span className="expert-price">
                                            ₹{finalPrice} <span>/ {profile.session_duration_minutes || 20} min</span>
                                        </span>
                                        <Link to="/login" className="btn-book">
                                            Book Session
                                        </Link>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                    
                </div>
            </section>
        </>
    );
}

export default FeaturedSeniors;