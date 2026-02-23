import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";

// ==========================================
// 🔮 Dreamy Booking UI CSS (Exact Premium Look)
// ==========================================
const dreamyStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

@keyframes floatRocket {
  0% { transform: translate(0, 0) rotate(15deg); }
  50% { transform: translate(15px, -20px) rotate(25deg); }
  100% { transform: translate(0, 0) rotate(15deg); }
}

@keyframes cloudsMove {
  0% { transform: translateX(-2%); }
  50% { transform: translateX(2%); }
  100% { transform: translateX(-2%); }
}

@keyframes pulseRing {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #0f0c29;
}

/* 🌌 Starry Magical Background */
.page-wrapper-dreamy {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #15103a 0%, #3a1e6d 40%, #76459c 70%, #d8a7c8 100%);
  overflow-x: hidden;
  color: #1e293b;
  padding-bottom: 40px;
}

.stars-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
  background-image: 
    radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 80px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2.5px 2.5px at 150px 120px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 250px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 350px 200px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 500px 350px, #ffffff, rgba(0,0,0,0));
  background-size: 600px 600px;
  opacity: 0.7;
}

.clouds-bg {
  position: absolute; bottom: 0; left: -10%; right: -10%; height: 500px; z-index: 1; pointer-events: none;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 40%),
    radial-gradient(circle at 50% 100%, rgba(255,255,255,0.6) 0%, transparent 50%),
    radial-gradient(circle at 80% 90%, rgba(255,255,255,0.5) 0%, transparent 45%),
    radial-gradient(circle at 10% 100%, rgba(255,255,255,0.8) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(255,255,255,0.3) 0%, transparent 40%);
  filter: blur(25px);
  animation: cloudsMove 25s ease-in-out infinite;
}

.rocket-float {
  position: absolute; top: 40px; right: 5%; font-size: 4rem; z-index: 2;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
  animation: floatRocket 6s ease-in-out infinite;
}

.page-container {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 16px;
}

.layout-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

/* 🧊 Ultimate Frosted Glass Cards */
.card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  padding: 30px;
  margin-bottom: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

/* --- Profile Header --- */
.profile-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.65);
}
.avatar-ring {
  width: 110px; height: 110px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  margin-bottom: 16px;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  animation: pulseRing 3s infinite;
}
.avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  background: #fff;
}
.profile-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}
.profile-college {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  margin: 0 0 4px 0;
}
.profile-branch {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6d28d9;
  margin: 0;
}

/* --- Card Content Sections --- */
.card-heading {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-bio {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tag {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #c4b5fd;
  color: #5b21b6;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.no-tags-text { color: #64748b; font-size: 0.9rem; font-style: italic; }

.id-card-image {
  width: 100%;
  max-width: 280px;
  display: block;
  margin: 0 auto;
  border-radius: 16px;
  border: 4px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* --- Sidebar Booking Card --- */
.sidebar {
  position: sticky;
  top: 24px;
}
.booking-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
}
.booking-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e1b4b;
  margin: 0 0 12px 0;
}
.booking-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.price-box {
  background: rgba(255, 255, 255, 0.9);
  border: 1px dashed #94a3b8;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.price-text {
  font-size: 2.8rem;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 6px;
  letter-spacing: -1px;
}
.duration-text {
  color: #10b981;
  font-weight: 700;
  font-size: 0.95rem;
}

.book-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.book-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5);
}

/* --- Trust Badges (Like Image) --- */
.trust-badges-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}
.trust-badge {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

/* --- Footer Overrides --- */
.footer-container {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 60px 20px 20px;
  color: white;
  margin-top: 40px;
  position: relative;
  z-index: 10;
}
.footer-grid {
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
}
.footer-logo { font-size: 1.5rem; font-weight: 800; margin: 0 0 12px 0; background: linear-gradient(90deg, #fff, #c4b5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.footer-tagline { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
.footer-heading { font-size: 1rem; font-weight: 700; margin: 0 0 16px 0; color: #fff; }
.footer-link { display: block; color: #cbd5e1; text-decoration: none; margin-bottom: 12px; font-size: 0.9rem; transition: color 0.2s; }
.footer-link:hover { color: #10b981; }
.footer-copyright { text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }

/* --- Loaders --- */
.loading-container { display: flex; justify-content: center; align-items: center; min-height: 60vh; color: white; font-size: 1.5rem; font-weight: 700; z-index: 10; position: relative; }
.error-text { color: #fca5a5; background: rgba(220, 38, 38, 0.2); padding: 20px; border-radius: 16px; border: 1px solid rgba(248, 113, 113, 0.4); }

@media (max-width: 850px) {
  .layout-container { grid-template-columns: 1fr; }
  .rocket-float { font-size: 3rem; right: 0; top: 10px; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 500px) {
  .footer-grid { grid-template-columns: 1fr; text-align: center; }
}
`;

// --- फूटर कंपोनेंट ---
function Footer() {
  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Release", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const supportLinks = [
    { name: "Let Us Help You", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Your Account", href: "#" },
    { name: "Report Issue", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  const studentLinks = [
    { name: "Find Mentors", href: "#" },
    { name: "Book a Session", href: "#" },
    { name: "REAP Guide", href: "#" },
    { name: "Learning Hub", href: "#" },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">
            Connecting students with amazing mentors.
          </p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          {companyLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          {supportLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">For Students</h4>
          {studentLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} CollegeConnect. All Rights Reserved.
      </div>
    </footer>
  );
}

// --- मुख्य बुकिंग पेज कंपोनेंट ---
function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ⭐ Mock AuthContext (Compile error se bachne ke liye)
  const { auth } = {
    auth: {
      user: {
        name: "Mock User",
        email: "mock.user@example.com",
      },
    },
  };
  // const { auth } = useAuth(); // Asal app mein ise uncomment karein

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

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
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`,
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
          (p) => p.user?._id === userId
        );

        const combinedProfile = {
          ...singleProfileData,
          ...matchingProfileFromAll,
          user: singleProfileData.user || matchingProfileFromAll.user,
          college: singleProfileData.college || matchingProfileFromAll.college,
        };

        setProfile(combinedProfile);

        const fee =
          combinedProfile.price_per_session + settingsRes.data.platformFee;
        setTotalAmount(fee);

        setLoading(false);
      } catch (err) {
        let errorMsg = err.response
          ? err.response.data.msg || err.response.data
          : err.message;
        setError("Error: " + errorMsg);
        setLoading(false);
      }
    };

    loadPageData();
  }, [userId]);

  const displayRazorpay = async () => {
    if (!auth.user) {
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
        { seniorId: profile.user._id },
        { headers: { "x-auth-token": token } }
      );
      const order = orderRes.data;
      toast.dismiss(toastId);
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user ? profile.user.name : "Senior"}`,
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
            navigate("/booking-success");
          } catch {
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed. Please contact support.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#10B981" }, // Mint theme color
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.dismiss(toastId);
      let errorMsg = err.response
        ? err.response.data.msg || err.response.data
        : err.message;
      toast.error("Error creating order. " + errorMsg);
    }
  };

  // --- Background Shell Wrappers ---
  const renderBackground = () => (
    <>
      <style>{dreamyStyles}</style>
      <div className="stars-bg"></div>
      <div className="clouds-bg"></div>
      <div className="rocket-float">🚀</div>
    </>
  );

  if (loading)
    return (
      <div className="page-wrapper-dreamy">
        {renderBackground()}
        <div className="page-container loading-container">
          <h2>⏳ Loading Booking Page...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="page-wrapper-dreamy">
        {renderBackground()}
        <div className="page-container loading-container">
          <h2 className="error-text">❌ {error}</h2>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="page-wrapper-dreamy">
        {renderBackground()}
        <div className="page-container loading-container">
          <h2>Profile not found.</h2>
        </div>
      </div>
    );

  return (
    <div className="page-wrapper-dreamy">
      {renderBackground()}
      
      <div className="page-container">
        <div className="layout-container">
          {/* ------------------- 
              LEFT COLUMN (Info) 
               ------------------- */}
          <div className="main-content">
            {/* Profile Header Card */}
            <div className="card profile-header">
              <div className="avatar-ring">
                <img
                  src={profile.avatar || "https://via.placeholder.com/150"}
                  alt={profile.user?.name || "Senior"}
                  className="avatar"
                />
              </div>
              <h2 className="profile-name">
                {profile.user?.name}
              </h2>
              <p className="profile-college">
                {profile.college?.name || "N/A"}
              </p>
              <p className="profile-branch">
                {profile.branch} ('{profile.year}')
              </p>
            </div>

            {/* About Me Card */}
            <div className="card">
              <h3 className="card-heading">
                <span className="heading-icon">👤</span> About Me
              </h3>
              <p className="card-bio">
                {profile.bio || "Please ask Admin to update this profile."}
              </p>
            </div>

            {/* Specializations Card */}
            <div className="card">
              <h3 className="card-heading">
                <span className="heading-icon">🏷️</span> Specializations
              </h3>
              <div className="tags-container">
                {profile.tags?.length ? (
                  profile.tags.map((tag) => (
                    <span key={tag._id} className="tag">
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <p className="no-tags-text">
                    No tags listed.
                  </p>
                )}
              </div>
            </div>

            {/* Premium Trust Badges Added Manually for Visual Consistency */}
            <div className="trust-badges-row">
              <div className="trust-badge"><span style={{color: '#10b981'}}>🛡️</span> Verified Senior Mentor</div>
              <div className="trust-badge"><span style={{color: '#f59e0b'}}>👍</span> Trusted by 1000+ Students</div>
              <div className="trust-badge"><span style={{color: '#3b82f6'}}>🫂</span> 24/7 Support</div>
            </div>

            {/* Verified ID Card */}
            {profile.id_card_url && (
              <div className="card" style={{marginTop: '24px'}}>
                <h3 className="card-heading" style={{justifyContent: 'center'}}>
                  <span className="heading-icon">🎓</span> College Verified ID
                  <span style={{color: '#10b981', marginLeft: '4px'}}>✓</span>
                </h3>
                <img
                  src={profile.id_card_url}
                  alt="College ID Card"
                  className="id-card-image"
                />
              </div>
            )}
          </div>

          {/* ------------------- 
              RIGHT COLUMN (Booking) 
               ------------------- */}
          <div className="sidebar">
            <div className="card booking-card">
              <h3 className="booking-title">
                Book this Session
              </h3>
              <p className="booking-subtitle">
                After payment, the senior will contact you within 6 hours to
                schedule the best time.
              </p>

              <div className="price-box">
                <span className="price-text">₹{totalAmount}</span>
                <span className="duration-text">+ Chat Free</span>
              </div>

              <button
                onClick={displayRazorpay}
                className="book-button"
              >
                <span className="button-icon">🔒</span> Pay ₹{totalAmount} & Book
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingPage;