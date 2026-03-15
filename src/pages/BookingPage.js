import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";

// ======================================
// 🚀 Premium Booking Page CSS (Modal CSS hata diya gaya hai, baki sab same hai)
// ======================================
const bookingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

:root {
  --bg-main: #f8f9fa;
  --bg-card: #ffffff;
  --primary-color: #e23744; 
  --primary-hover: #cb202d;
  --primary-light: #fcebed;
  --primary-gradient: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  --text-dark: #1c1c1c;
  --text-muted: #696969;
  --border-color: #e8e8e8;
  --success-color: #25a541;
  --success-bg: #e5f6e8;
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 32px rgba(226, 55, 68, 0.15);
  --radius-lg: 20px;
  --radius-md: 14px;
}

* { box-sizing: border-box; outline: none; margin: 0; padding: 0; }
body { font-family: 'Poppins', sans-serif; background-color: var(--bg-main); color: var(--text-dark); }

.page-container { display: flex; flex-direction: column; min-height: 100vh; background-color: #fef5f5; animation: fadeIn 0.4s ease-out forwards; padding-bottom: 40px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.layout-container { display: flex; gap: 30px; max-width: 1100px; margin: 0 auto; padding: 40px 20px; flex: 1; width: 100%; }
.main-content { flex: 1; display: flex; flex-direction: column; gap: 24px; min-width: 0; }
.sidebar { width: 360px; flex-shrink: 0; position: sticky; top: 30px; height: max-content; }

.premium-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); padding: 24px; transition: transform 0.3s, box-shadow 0.3s; }
.premium-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.profile-header { text-align: center; position: relative; overflow: hidden; padding-top: 60px; }
.profile-header::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 90px; background: var(--primary-gradient); border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
.avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg-card); box-shadow: var(--shadow-md); position: relative; z-index: 2; margin-top: -40px; background: #fff; }
.profile-name { font-size: 1.6rem; font-weight: 800; margin: 16px 0 4px; color: var(--text-dark); display: flex; align-items: center; justify-content: center; gap: 8px; }
.profile-college { font-size: 1rem; font-weight: 600; color: var(--text-muted); margin: 0 0 8px; }
.profile-branch { font-size: 0.9rem; color: var(--primary-color); font-weight: 600; background: var(--primary-light); display: inline-block; padding: 6px 16px; border-radius: 50px; margin-top: 4px;}

.card-heading { font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; color: var(--text-dark); border-bottom: 1px dashed var(--border-color); padding-bottom: 12px; }
.card-bio { font-size: 1rem; line-height: 1.7; color: var(--text-muted); }

.tags-container { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-dark); padding: 8px 16px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
.tag:hover { border-color: var(--primary-color); color: var(--primary-color); background: var(--primary-light); }
.no-tags-text { font-size: 0.95rem; color: var(--text-muted); font-style: italic; }

.verified-icon { color: #1da1f2; font-size: 1.3rem; }
.id-card-image { width: 100%; max-height: 350px; object-fit: contain; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-main); padding: 12px; }

.booking-card { text-align: center; border: 2px solid var(--primary-light); position: relative; overflow: hidden; }
.booking-card::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: var(--primary-gradient); }
.booking-title { font-size: 1.5rem; font-weight: 800; color: var(--text-dark); margin-bottom: 10px; margin-top: 10px; }
.booking-subtitle { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px; padding: 0 10px; }

.price-box { background: var(--bg-main); border-radius: var(--radius-md); padding: 24px; margin-bottom: 24px; border: 1px dashed var(--border-color); }
.price-text { display: block; font-size: 2.4rem; font-weight: 800; color: var(--text-dark); margin-bottom: 4px; }
.duration-text { display: inline-block; font-size: 0.9rem; font-weight: 700; color: var(--success-color); background: var(--success-bg); padding: 6px 14px; border-radius: 50px; }

.book-button { width: 100%; padding: 18px; font-size: 1.15rem; font-weight: 700; font-family: inherit; background: var(--primary-gradient); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s; box-shadow: var(--shadow-lg); display: flex; justify-content: center; align-items: center; gap: 10px; }
.book-button:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(226, 55, 68, 0.3); }
.book-button:active { transform: translateY(1px); }

.coupon-wrapper { margin-bottom: 24px; background: #f8fafc; padding: 16px; border-radius: var(--radius-md); border: 1px dashed var(--border-color); text-align: left; }
.coupon-label { font-size: 0.85rem; font-weight: 800; color: var(--text-dark); margin-bottom: 10px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
.coupon-input-group { display: flex; align-items: center; background: white; border: 1.5px solid var(--border-color); border-radius: 12px; padding: 4px; transition: border-color 0.2s; }
.coupon-input-group:focus-within { border-color: var(--primary-color); }
.coupon-input { flex: 1; padding: 10px 12px; border: none; font-family: inherit; font-weight: 700; font-size: 0.95rem; text-transform: uppercase; min-width: 0; }
.coupon-input:disabled { background: transparent; color: var(--success-color); }

.apply-btn { padding: 10px 20px; border-radius: 10px; border: none; background: var(--text-dark); color: white; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.apply-btn:hover { background: #000; }
.apply-btn:disabled { background: var(--success-color); cursor: default; }
.free-text { color: var(--success-color) !important; animation: pulse 1s infinite alternate; }
@keyframes pulse { from { opacity: 0.8; } to { opacity: 1; } }

.status-container { flex: 1; display: flex; justify-content: center; align-items: center; min-height: 60vh; }
.error-text { color: var(--primary-color); font-weight: 600; font-size: 1.2rem; }

@media (max-width: 900px) {
  .layout-container { flex-direction: column; padding: 20px 16px; gap: 24px; }
  .sidebar { width: 100%; position: relative; top: 0; }
  .profile-header { padding-top: 50px; }
  .avatar { width: 100px; height: 100px; margin-top: -35px; }
  .profile-name { font-size: 1.4rem; }
  .coupon-input { font-size: 0.9rem; padding: 8px 10px; }
  .apply-btn { padding: 8px 15px; font-size: 0.85rem; }
}
`;

// --- मुख्य बुकिंग पेज कंपोनेंट ---
function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetCollegeId = queryParams.get("college");

  // ⭐ Mock AuthContext
  const { auth } = {
    auth: {
      user: {
        name: "Mock User",
        email: "mock.user@example.com",
        _id: "student123"
      },
    },
  };
  // const { auth } = useAuth(); // Asal app mein ise uncomment karein

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const [coupon, setCoupon] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        const [res, settingsRes, allProfilesRes] = await Promise.all([
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}${targetCollegeId ? `?college=${targetCollegeId}` : ''}`, 
            { headers: { "x-auth-token": token } }
          ),
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/settings`
          ),
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/all`,
            { headers: { "x-auth-token": token } }
          ),
        ]);

        const singleProfileData = res.data;
        const allProfilesData = allProfilesRes.data;

        const matchingProfileFromAll = allProfilesData.find(
          (p) => p.user?._id === userId && (!targetCollegeId || p.college?._id === targetCollegeId)
        ) || allProfilesData.find((p) => p.user?._id === userId); 

        const combinedProfile = {
          ...singleProfileData,
          ...matchingProfileFromAll,
          user: singleProfileData.user || matchingProfileFromAll.user,
          college: singleProfileData.college || matchingProfileFromAll.college,
          display_name: singleProfileData.display_name || matchingProfileFromAll.display_name,
        };

        setProfile(combinedProfile);

        const fee = (combinedProfile.price_per_session || 0) + (settingsRes.data.platformFee || 20);
        setTotalAmount(fee);

        setLoading(false);
      } catch (err) {
        let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
        setError("Error: " + errorMsg);
        setLoading(false);
      }
    };

    loadPageData();
  }, [userId, targetCollegeId]);

  const handleApplyCoupon = async () => {
    if (!coupon) return toast.error("Please enter a code");
    const toastId = toast.loading("Verifying coupon...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/apply-coupon",
        { couponCode: coupon.toUpperCase() },
        { headers: { "x-auth-token": token } }
      );

      if (res.data.success) {
        setIsFree(true);
        setCouponApplied(true);
        toast.success(res.data.msg, { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid Coupon", { id: toastId });
    }
  };

  const handleFreeBooking = async () => {
    const toastId = toast.loading("Confirming your free session...");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/create-free-booking",
        { 
          seniorId: profile.user._id, 
          profileId: profile._id, 
          couponCode: coupon.toUpperCase()
        },
        { headers: { "x-auth-token": token } }
      );
      toast.success("Booking Confirmed for FREE! 🚀", { id: toastId });
      navigate("/booking-success");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Free booking failed", { id: toastId });
    }
  };

  // 🚀 UPDATE: Modal open karne ki jagah ab Naye Checkout Page par bhej rahe hain
  const handleFinalAction = () => {
    if (!auth.user) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    if (isFree) {
      handleFreeBooking(); // Agar coupon se free ho gaya, toh direct free book karo
    } else {
      // 🔥 State (Data) ke saath Checkout page par redirect
      navigate("/checkout", {
        state: {
          amount: totalAmount,
          seniorId: profile.user._id,
          profileId: profile._id,
          seniorName: profile.display_name || profile.user?.name || "Senior"
        }
      });
    }
  };

  // --- PREMIUM LOADING / ERROR STATES ---
  if (loading) {
    const skeletonCss = `
      .skeleton-card-modern { background: #fff; border-radius: 24px; padding: 40px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 420px; margin: 40px auto; }
      .shimmer { background: #f6f7f8; background-image: linear-gradient(90deg, #f6f7f8 0px, #edeef1 40px, #f6f7f8 80px); background-size: 600px; animation: shimmer 1.5s infinite linear; }
      @keyframes shimmer { 0% { background-position: -300px; } 100% { background-position: 300px; } }
      .skel-avatar { width: 110px; height: 110px; border-radius: 50%; margin-bottom: 20px; }
      .skel-title { width: 60%; height: 24px; border-radius: 8px; margin-bottom: 12px; }
      .skel-subtitle { width: 40%; height: 16px; border-radius: 8px; margin-bottom: 30px; }
      .skel-box { width: 100%; height: 70px; border-radius: 16px; margin-bottom: 15px; }
      .skel-btn { width: 100%; height: 55px; border-radius: 16px; margin-top: 15px; }
      .loading-glow { margin-top: 20px; font-size: 1rem; font-weight: 700; color: #e23744; text-align: center; animation: pulseText 1.5s infinite; }
      @keyframes pulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    `;

    return (
      <div className="page-container">
        <style>{bookingStyles}</style>
        <style>{skeletonCss}</style>
        <div className="skeleton-card-modern">
          <div className="shimmer skel-avatar"></div>
          <div className="shimmer skel-title"></div>
          <div className="shimmer skel-subtitle"></div>
          <div className="shimmer skel-box" style={{ height: '90px' }}></div>
          <div className="shimmer skel-box"></div>
          <div className="shimmer skel-btn"></div>
          <div className="loading-glow">✨ Fetching Mentor Details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <style>{bookingStyles}</style>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
          <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', maxWidth: '400px', width: '100%', border: '1px solid #ffebee' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>⚠️</div>
            <h2 style={{ color: '#e23744', margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 800 }}>Oops! Error Occurred</h2>
            <p style={{ color: '#696969', margin: 0, fontSize: '0.95rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <style>{bookingStyles}</style>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '20px' }}>
          <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🕵️‍♂️</div>
            <h2 style={{ color: '#1c1c1c', margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 800 }}>Profile Not Found</h2>
            <p style={{ color: '#696969', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>The mentor you are looking for might have updated their profile or doesn't exist anymore.</p>
          </div>
        </div>
      </div>
    );
  }

  const displayNameToShow = profile.display_name || profile.user?.name || "Senior";

  return (
    <div className="page-container">
      <style>{bookingStyles}</style>
      
      <div className="layout-container">
        <div className="main-content">
          <div className="premium-card profile-header">
            <img src={profile.avatar || "https://ui-avatars.com/api/?name=Senior&background=e23744&color=fff&size=150&bold=true"} alt={displayNameToShow} className="avatar" />
            <h2 className="profile-name">{displayNameToShow} <span className="verified-icon">✔</span></h2>
            <p className="profile-college">{profile.college?.name || "Premium Mentor"}</p>
            <p className="profile-branch">{profile.branch} ({profile.year})</p>
          </div>

          <div className="premium-card">
            <h3 className="card-heading"><span>👤</span> About Me</h3>
            <p className="card-bio">{profile.bio || "No description provided."}</p>
          </div>

          <div className="premium-card">
            <h3 className="card-heading"><span>🎯</span> Specializations</h3>
            <div className="tags-container">
              {profile.tags?.length ? (
                profile.tags.map((tag) => (
                  <span key={tag._id} className="tag">{tag.name}</span>
                ))
              ) : (
                <p className="no-tags-text">No specializations listed.</p>
              )}
            </div>
          </div>

          {profile.id_card_url && (
            <div className="premium-card">
              <h3 className="card-heading">
                <span>🎓</span> College Verified ID <span className="verified-icon" style={{marginLeft: 'auto'}}>✓</span>
              </h3>
              <img src={profile.id_card_url} alt="College ID Card" className="id-card-image" />
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="premium-card booking-card">
            <h3 className="booking-title">Book this Session</h3>
            <p className="booking-subtitle">After payment, the senior will contact you within 6 hours to schedule the best time.</p>

            <div className="coupon-wrapper">
              <span className="coupon-label">Have a Promo Code?</span>
              <div className="coupon-input-group">
                <input 
                  className="coupon-input" 
                  placeholder="e.g. FREE15"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  disabled={couponApplied}
                />
                <button className="apply-btn" onClick={handleApplyCoupon} disabled={couponApplied}>
                  {couponApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {couponApplied && <p style={{color: '#25a541', fontSize: '0.8rem', marginTop: '10px', fontWeight: 700, textAlign: 'center'}}>✓ Promotional Discount Applied!</p>}
            </div>

            <div className="price-box">
              <span className={`price-text ${isFree ? 'free-text' : ''}`}>
                 {isFree ? "₹0" : `₹${totalAmount}`}
              </span>
              {isFree && <p style={{textDecoration: 'line-through', color: '#999', fontSize: '1.1rem', marginTop: '-5px', fontWeight: 600}}>₹{totalAmount}</p>}
              <span className="duration-text">+ Chat Free</span>
            </div>

            <button onClick={handleFinalAction} className="book-button">
              {isFree ? "Confirm FREE Session 🚀" : <span>🔒 Pay ₹{totalAmount} & Book</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;