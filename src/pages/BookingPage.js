import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";

// ======================================
// 🚀 Premium Booking Page CSS (Enhanced with Coupon UI)
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

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  background-color: #fef5f5;
  animation: fadeIn 0.4s ease-out forwards;
  padding-bottom: 40px;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.layout-container {
  display: flex;
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
  flex: 1;
  width: 100%;
}

.main-content { flex: 1; display: flex; flex-direction: column; gap: 24px; min-width: 0; }

.sidebar {
  width: 360px;
  flex-shrink: 0;
  position: sticky;
  top: 30px;
  height: max-content;
}

.premium-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.premium-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

.profile-header {
  text-align: center;
  position: relative;
  overflow: hidden;
  padding-top: 60px;
}
.profile-header::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 90px;
  background: var(--primary-gradient);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.avatar {
  width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
  border: 4px solid var(--bg-card); box-shadow: var(--shadow-md);
  position: relative; z-index: 2; margin-top: -40px; background: #fff;
}
.profile-name { font-size: 1.6rem; font-weight: 800; margin: 16px 0 4px; color: var(--text-dark); display: flex; align-items: center; justify-content: center; gap: 8px; }
.profile-college { font-size: 1rem; font-weight: 600; color: var(--text-muted); margin: 0 0 8px; }
.profile-branch { font-size: 0.9rem; color: var(--primary-color); font-weight: 600; background: var(--primary-light); display: inline-block; padding: 6px 16px; border-radius: 50px; margin-top: 4px;}

.card-heading { font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; color: var(--text-dark); border-bottom: 1px dashed var(--border-color); padding-bottom: 12px; }
.card-bio { font-size: 1rem; line-height: 1.7; color: var(--text-muted); }

.tags-container { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: var(--bg-main); border: 1px solid var(--border-color); color: var(--text-dark); padding: 8px 16px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
.tag:hover { border-color: var(--primary-color); color: var(--primary-color); background: var(--primary-light); }

.verified-icon { color: #1da1f2; font-size: 1.3rem; }
.id-card-image { width: 100%; max-height: 350px; object-fit: contain; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-main); padding: 12px; }

.booking-card { text-align: center; border: 2px solid var(--primary-light); position: relative; overflow: hidden; }
.booking-card::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: var(--primary-gradient); }
.booking-title { font-size: 1.5rem; font-weight: 800; color: var(--text-dark); margin-bottom: 10px; margin-top: 10px; }
.booking-subtitle { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px; padding: 0 10px; }

.price-box { background: var(--bg-main); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px; border: 1px dashed var(--border-color); }
.price-text { display: block; font-size: 2.4rem; font-weight: 800; color: var(--text-dark); margin-bottom: 4px; }
.duration-text { display: inline-block; font-size: 0.9rem; font-weight: 700; color: var(--success-color); background: var(--success-bg); padding: 6px 14px; border-radius: 50px; }

.book-button {
  width: 100%; padding: 18px; font-size: 1.15rem; font-weight: 700; font-family: inherit;
  background: var(--primary-gradient); color: white; border: none; border-radius: var(--radius-md);
  cursor: pointer; transition: all 0.3s; box-shadow: var(--shadow-lg);
  display: flex; justify-content: center; align-items: center; gap: 10px;
}
.book-button:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(226, 55, 68, 0.3); }
.book-button:active { transform: translateY(1px); }

/* --- 🎟️ Coupon UI Specific CSS --- */
.coupon-wrapper {
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  text-align: left;
}
.coupon-label { font-size: 0.85rem; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; display: block; }
.coupon-input-group { display: flex; gap: 8px; }
.coupon-input { 
  flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color); 
  font-family: inherit; font-weight: 600; text-transform: uppercase;
}
.coupon-input:disabled { background: #e5f6e8; border-color: #25a541; color: #166534; }
.apply-btn { 
  padding: 10px 16px; border-radius: 8px; border: none; background: var(--text-dark); 
  color: white; font-weight: 700; cursor: pointer; transition: 0.2s;
}
.apply-btn:hover { background: #000; }
.apply-btn:disabled { background: #ccc; cursor: not-allowed; }
.free-text { color: var(--success-color) !important; animation: pulse 1s infinite alternate; }
@keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }

.status-container { flex: 1; display: flex; justify-content: center; align-items: center; min-height: 60vh; }
.error-text { color: var(--primary-color); font-weight: 600; font-size: 1.2rem; }

@media (max-width: 900px) {
  .layout-container { flex-direction: column; padding: 20px 16px; gap: 24px; }
  .sidebar { width: 100%; position: relative; top: 0; }
}
`;

function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ⭐ Auth State (Real or Mock)
  const auth = { user: JSON.parse(localStorage.getItem("user") || "{}") };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🎟️ Coupon States
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
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/all`, { headers: { "x-auth-token": token } }),
        ]);

        const singleProfileData = res.data;
        const allProfilesData = allProfilesRes.data;
        const matchingProfileFromAll = allProfilesData.find((p) => p.user?._id === userId);

        const combinedProfile = {
          ...singleProfileData,
          ...matchingProfileFromAll,
          user: singleProfileData.user || matchingProfileFromAll.user,
          college: singleProfileData.college || matchingProfileFromAll.college,
        };

        setProfile(combinedProfile);
        const fee = combinedProfile.price_per_session + (settingsRes.data.platformFee || 0);
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response?.data?.msg || err.message));
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  // 🎟️ 1. Apply Coupon Logic
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

  // 🚀 2. Final Booking (Decides between Free or Razorpay)
  const handleFinalAction = () => {
    if (isFree) {
      handleFreeBooking();
    } else {
      displayRazorpay();
    }
  };

  // 🎉 3. Free Booking Logic
  const handleFreeBooking = async () => {
    const toastId = toast.loading("Confirming your free session...");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/create-free-booking",
        { 
          seniorId: profile.user._id, 
          profileId: profile._id, 
          couponCode: coupon.toUpperCase(),
          slot_time: new Date() // Sending default slot time
        },
        { headers: { "x-auth-token": token } }
      );
      toast.success("Booking Confirmed for FREE! 🚀", { id: toastId });
      navigate("/student-dashboard/bookings");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Free booking failed", { id: toastId });
    }
  };

  // 💳 4. Razorpay Logic (Your original logic intact)
  const displayRazorpay = async () => {
    if (!auth.user.name) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }
    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      slot_time: new Date(),
      duration: profile.session_duration_minutes,
      amount: totalAmount, 
    };
    
    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { seniorId: profile.user._id, amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );
      
      const order = orderRes.data;
      toast.dismiss(toastId);
      
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "CampusConnect",
        description: `Booking with ${profile.user?.name || "Senior"}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying payment...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed!");
            navigate("/student-dashboard/bookings");
          } catch {
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#e23744" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error creating order.");
    }
  };

  if (loading) return <div className="status-container"><h2>⏳ Loading...</h2></div>;
  if (error) return <div className="status-container"><h2 className="error-text">❌ {error}</h2></div>;

  return (
    <div className="page-container">
      <style>{bookingStyles}</style>
      
      <div className="layout-container">
        <div className="main-content">
          <div className="premium-card profile-header">
            <img src={profile.avatar || "https://ui-avatars.com/api/?name=Senior&background=e23744&color=fff&size=150&bold=true"} className="avatar" />
            <h2 className="profile-name">{profile.user?.name} <span className="verified-icon">✔</span></h2>
            <p className="profile-college">{profile.college?.name}</p>
            <p className="profile-branch">{profile.branch} ({profile.year})</p>
          </div>

          <div className="premium-card">
            <h3 className="card-heading"><span>👤</span> About Me</h3>
            <p className="card-bio">{profile.bio || "No description provided."}</p>
          </div>

          <div className="premium-card">
            <h3 className="card-heading"><span>🎯</span> Specializations</h3>
            <div className="tags-container">
              {profile.tags?.length ? profile.tags.map((tag) => <span key={tag._id} className="tag">{tag.name}</span>) : <p>No specializations.</p>}
            </div>
          </div>

          {profile.id_card_url && (
            <div className="premium-card">
              <h3 className="card-heading"><span>🎓</span> College Verified ID</h3>
              <img src={profile.id_card_url} className="id-card-image" />
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="premium-card booking-card">
            <h3 className="booking-title">Book Session</h3>
            <p className="booking-subtitle">The senior will contact you within 6 hours to schedule the best time.</p>

            {/* 🎟️ Coupon Section Added */}
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
              {couponApplied && <p style={{color: '#25a541', fontSize: '0.75rem', marginTop: '8px', fontWeight: 700}}>✓ FREE15 Discount Applied!</p>}
            </div>

            <div className="price-box">
              <span className={`price-text ${isFree ? 'free-text' : ''}`}>
                {isFree ? "₹0" : `₹${totalAmount}`}
              </span>
              {isFree && <p style={{textDecoration: 'line-through', color: '#999', fontSize: '1rem', marginTop: '-10px'}}>₹{totalAmount}</p>}
              <span className="duration-text">{profile.session_duration_minutes} Min + Chat</span>
            </div>

            <button onClick={handleFinalAction} className="book-button">
              {isFree ? "Confirm FREE Session 🚀" : `Pay ₹${totalAmount} & Book`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;