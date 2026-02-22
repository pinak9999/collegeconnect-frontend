import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StarIcon = ({ filled }) => (
    <svg fill={filled ? '#FBBF24' : '#E2E8F0'} width="18px" height="18px" viewBox="0 0 24 24">
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
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B', fontSize: '1.2rem', fontWeight: 500 }}>
            ✨ Loading top experts...
        </div>
    );
    
    if (seniors.length === 0) return null;

    // --- Premium Styles ---
    const styles = {
        section: {
            padding: '80px 20px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', // Subtle premium gradient
            fontFamily: "'Poppins', sans-serif"
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
        },
        heading: {
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '50px',
            background: 'linear-gradient(90deg, #1E293B, #3B82F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            padding: '10px'
        },
        card: {
            background: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(226, 232, 240, 0.8)'
        },
        avatar: {
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #EFF6FF',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)',
            marginBottom: '16px'
        },
        name: {
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 6px 0',
            textAlign: 'center'
        },
        ratingWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px'
        },
        reviews: {
            fontSize: '0.85rem',
            color: '#64748B',
            fontWeight: 500
        },
        collegeInfo: {
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#475569',
            marginBottom: '20px',
            lineHeight: 1.5,
            padding: '0 10px'
        },
        branch: {
            display: 'block',
            fontSize: '0.85rem',
            color: '#94A3B8',
            fontWeight: 500,
            marginTop: '4px'
        },
        priceTag: {
            background: '#F0FDF4',
            color: '#16A34A',
            padding: '6px 14px',
            borderRadius: '99px',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid #DCFCE7'
        },
        duration: {
            fontSize: '0.8rem',
            color: '#15803D',
            fontWeight: 500
        },
        btn: {
            width: '100%',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#ffffff',
            padding: '12px 0',
            borderRadius: '14px',
            textAlign: 'center',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer'
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <h2 style={styles.heading}>
                    Meet Our Top Seniors
                </h2>
                
                <div style={styles.grid}>
                    {seniors.map(profile => (
                        <div 
                            key={profile._id} 
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.05)';
                            }}
                        >
                            <img 
                                src={profile.avatar || 'https://via.placeholder.com/150'} 
                                alt={profile.user ? profile.user.name : 'Senior'} 
                                style={styles.avatar}
                            />
                            
                            <h4 style={styles.name}>{profile.user ? profile.user.name : 'Senior'}</h4>
                            
                            <div style={styles.ratingWrapper}>
                                {[...Array(5)].map((_, i) => ( 
                                    <StarIcon key={i} filled={i < Math.round(profile.average_rating)} /> 
                                ))}
                                <span style={styles.reviews}>({profile.total_ratings})</span>
                            </div>
                            
                            <div style={styles.collegeInfo}>
                                <strong>{(profile.college ? profile.college.name : 'College N/A')}</strong>
                                <span style={styles.branch}>{profile.branch || 'Branch N/A'} • Year {profile.year || 'N/A'}</span>
                            </div>
                            
                            <div style={styles.priceTag}>
                                ₹{(profile.price_per_session || 0) + platformFee} 
                                <span style={styles.duration}> / {profile.session_duration_minutes} min</span>
                            </div>
                            
                            <Link 
                                to="/login" 
                                style={styles.btn}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                Login to Book
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturedSeniors;