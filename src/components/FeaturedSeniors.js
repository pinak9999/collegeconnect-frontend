import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FeaturedSeniors.css';

const StarIcon = ({ filled }) => (
    <svg fill={filled ? '#FBBF24' : '#E2E8F0'} width="18px" height="18px" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

// चित्र जैसा वेरिफाइड ग्रीन टिकमार्क
const VerifiedBadge = () => (
    <svg className="premium-verified-badge" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#2ECC71"/>
        <path d="M7 12.5L10 15.5L17 8.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function FeaturedSeniors() {
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [platformFee, setPlatformFee] = useState(20);

    useEffect(() => {
        const loadData = async () => {
            try {
                const seniorsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/public/top-rated');
                // टेस्टिंग के लिए हम सिर्फ टॉप 2-3 सीनियर्स ही दिखाएंगे ताकि डिज़ाइन चित्र जैसा दिखे
                setSeniors(seniorsRes.data.slice(0, 3));

                const settingsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/settings');
                setPlatformFee(settingsRes.data.platformFee);

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
            <div className="premium-loading">
                <div className="loading-spinner"></div>
                <p>✨ Loading top experts...</p>
            </div>
        );
    }

    if (seniors.length === 0) return null;

    return (
        <section className="premium-seniors-section">
            {/* Animated Background Elements (चित्र जैसे जादुई इफ़ेक्ट के लिए) */}
            <div className="animated-bg-shape shape-1"></div>
            <div className="animated-bg-shape shape-2"></div>
            
            {/* Floating Sparkles (चमकते सितारे) */}
            <div className="floating-sparkle sparkle-1">✦</div>
            <div className="floating-sparkle sparkle-2">✦</div>
            <div className="floating-sparkle sparkle-3">✦</div>
            <div className="floating-sparkle sparkle-4">✦</div>

            <div className="premium-container">
                {/* Header */}
                <div className="premium-header">
                    <h2><span className="header-star">⭐</span> Featured Seniors</h2>
                    <p>Get insights from real students who've experienced your dream college.</p>
                </div>

                {/* Outer Glass Container (चित्र में कार्ड्स के पीछे वाला ट्रांसपेरेंट बॉक्स) */}
                <div className="glass-container">
                    <div className="premium-grid">
                        {seniors.map(profile => (
                            <div key={profile._id} className="premium-card">
                                {/* Avatar Section */}
                                <div className="avatar-section">
                                    <div className="avatar-ring">
                                        <img
                                            src={profile.avatar || 'https://via.placeholder.com/150'}
                                            alt={profile.user ? profile.user.name : 'Senior'}
                                            className="profile-img"
                                        />
                                    </div>
                                    <VerifiedBadge />
                                </div>

                                {/* Info Section */}
                                <h4 className="profile-name">
                                    {profile.user ? profile.user.name : 'Senior'}
                                </h4>
                                <p className="profile-branch">
                                    {profile.branch || 'Branch N/A'} • {profile.year ? `${profile.year}th Year` : 'N/A'}
                                </p>

                                {/* Ratings */}
                                <div className="profile-rating">
                                    <div className="stars-container">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} filled={i < Math.round(profile.average_rating || 5)} />
                                        ))}
                                    </div>
                                    <span className="rating-number">
                                        ({profile.average_rating ? profile.average_rating.toFixed(1) : '4.9'})
                                    </span>
                                </div>

                                {/* Price Pill (चित्र जैसा ग्रीन टैग) */}
                                <div className="price-pill">
                                    <span className="price-amt">₹{(profile.price_per_session || 0) + platformFee}</span>
                                    <span className="price-dur"> / {profile.session_duration_minutes} min</span>
                                </div>

                                {/* Booking Button */}
                                <Link to="/login" className="premium-book-btn">
                                    Book Session
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedSeniors;