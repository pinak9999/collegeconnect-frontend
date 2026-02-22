import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StarIcon = ({ filled }) => (
    <svg fill={filled ? '#FBBF24' : '#4b5563'} width="14px" height="14px" viewBox="0 0 24 24" style={{ filter: filled ? 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.5))' : 'none' }}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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

    if (loading) return (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: '1.2rem', fontWeight: 500 }}>
            ✨ Loading top experts...
        </div>
    );
    
    if (seniors.length === 0) return null;

    // --- Premium Dark Space Styles ---
    const styles = {
        section: {
            padding: '10px', // HomePage से पैडिंग मिल रही है इसलिए इसे कम रखा है
            fontFamily: "'Poppins', sans-serif"
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px',
        },
        card: {
            background: 'rgba(17, 24, 39, 0.4)', // ट्रांसपेरेंट डार्क ग्लास
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        },
        topRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        avatar: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(139, 92, 246, 0.6)', // पर्पल ग्लोइंग बॉर्डर
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)'
        },
        infoCol: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            flex: 1
        },
        name: {
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#ffffff',
            margin: 0,
            textShadow: '0 0 10px rgba(255,255,255,0.2)'
        },
        branch: {
            fontSize: '0.85rem',
            color: '#d1d5db',
            margin: 0
        },
        collegeInfo: {
            fontSize: '0.8rem',
            color: '#9ca3af',
            margin: 0
        },
        ratingWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px'
        },
        reviews: {
            fontSize: '0.75rem',
            color: '#9ca3af',
        },
        bottomRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', // हल्का सा डिवाइडर
            paddingTop: '15px'
        },
        priceTag: {
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#2dd4bf', // Teal Cyan कलर बिल्कुल इमेज जैसा
            display: 'flex',
            alignItems: 'baseline',
            gap: '4px',
            textShadow: '0 0 10px rgba(45, 212, 191, 0.3)'
        },
        duration: {
            fontSize: '0.85rem',
            color: '#9ca3af',
            fontWeight: 400,
            textShadow: 'none'
        },
        btn: {
            background: 'linear-gradient(90deg, #312e81, #4338ca)',
            color: '#ffffff',
            padding: '10px 22px',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 8px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.grid}>
                {seniors.map(profile => (
                    <div 
                        key={profile._id} 
                        style={styles.card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = styles.card.boxShadow;
                            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        }}
                    >
                        {/* ऊपरी हिस्सा: फोटो और डिटेल्स */}
                        <div style={styles.topRow}>
                            <img 
                                src={profile.avatar || 'https://via.placeholder.com/150'} 
                                alt={profile.user ? profile.user.name : 'Senior'} 
                                style={styles.avatar}
                            />
                            
                            <div style={styles.infoCol}>
                                <h4 style={styles.name}>{profile.user ? profile.user.name : 'Senior'}</h4>
                                <p style={styles.branch}>{profile.branch || 'Branch N/A'}</p>
                                <p style={styles.collegeInfo}>
                                    {(profile.college ? profile.college.name : 'College N/A')} | Year {profile.year || 'N/A'}
                                </p>
                                
                                <div style={styles.ratingWrapper}>
                                    {[...Array(5)].map((_, i) => ( 
                                        <StarIcon key={i} filled={i < Math.round(profile.average_rating)} /> 
                                    ))}
                                    <span style={styles.reviews}>({profile.total_ratings})</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* निचला हिस्सा: प्राइस और बटन */}
                        <div style={styles.bottomRow}>
                            <div style={styles.priceTag}>
                                ₹{(profile.price_per_session || 0) + platformFee} 
                                <span style={styles.duration}> / {profile.session_duration_minutes} min</span>
                            </div>
                            
                            <Link 
                                to="/login" 
                                style={styles.btn}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0 25px rgba(139, 92, 246, 0.8), inset 0 0 10px rgba(139, 92, 246, 0.6)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = styles.btn.boxShadow;
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Login to Book
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedSeniors;