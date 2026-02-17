import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import toast from "react-hot-toast";
import './BookingPage.css';

// 🌐 Production Backend URL
const API_BASE_URL = "https://collegeconnect-backend-mrkz.onrender.com";

// --- Footer Component ---
function Footer() {
  const companyLinks = [{ name: "About Us", href: "#" }, { name: "Careers", href: "#" }, { name: "Press Release", href: "#" }, { name: "Blog", href: "#" }];
  const supportLinks = [{ name: "Let Us Help You", href: "#" }, { name: "Help Center", href: "#" }, { name: "Your Account", href: "#" }, { name: "Report Issue", href: "#" }, { name: "Contact Us", href: "#" }];
  const studentLinks = [{ name: "Find Mentors", href: "#" }, { name: "Book a Session", href: "#" }, { name: "REAP Guide", href: "#" }, { name: "Learning Hub", href: "#" }];

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">Connecting students with amazing mentors.</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          {companyLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link" target="_blank" rel="noreferrer">{link.name}</a>))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          {supportLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link" target="_blank" rel="noreferrer">{link.name}</a>))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">For Students</h4>
          {studentLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link" target="_blank" rel="noreferrer">{link.name}</a>))}
        </div>
      </div>
      <div className="footer-copyright">© {new Date().getFullYear()} CollegeConnect. All Rights Reserved.</div>
    </footer>
  );
}

// --- Main Booking Page ---
function BookingPage() {
  const { userId } = useParams(); // This is the Mentor ID
  const navigate = useNavigate();
  const { auth } = useAuth(); 

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🟢 Simple Mode: Date/Time state ki zaroorat nahi hai

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        const [res, settingsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
          axios.get(`${API_BASE_URL}/api/settings`)
        ]);

        setProfile(res.data);
        const fee = (res.data.price_per_session || 0) + (settingsRes.data.platformFee || 0);
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response?.data?.msg || err.message));
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  const displayRazorpay = async () => {
    if (!auth.isAuthenticated) {
      toast.error("Please login to book.");
      navigate("/login");
      return;
    }

    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      
      // 1. Order Create karein
      const orderRes = await axios.post(
        `${API_BASE_URL}/api/payment/order`,
        { amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );

      const order = orderRes.data;
      toast.dismiss(toastId);

      // 2. Razorpay Options
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF", 
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user?.name}`,
        order_id: order.id,
        
        // 🟢 MAIN FIX IS HERE (Handler Function)
        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying & Saving Booking...");
          try {
            
            // ✅ FIX: Data object yahan banaya hai (Pehle ye missing tha)
            const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mentorId: userId,  // Senior ID
                amount: totalAmount,
                topic: "Mentorship Session"
            };

            // 3. Verify Payment & Save to DB
            await axios.post(
              `${API_BASE_URL}/api/payment/verify`,
              verificationData, // ✅ Correct Data Variable passed
              { headers: { "x-auth-token": token } }
            );

            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed! 🎉");
            navigate("/student-dashboard/bookings");
            
          } catch (err) {
            console.error(err);
            toast.dismiss(verifyToastId);
            toast.error("Payment successful but booking save failed.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#7c3aed" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.dismiss(toastId);
      console.error(err);
      toast.error("Error creating order.");
    }
  };

  if (loading) return <div className="page-container loading-container"><h2>⏳ Loading Profile...</h2></div>;
  if (error) return <div className="page-container loading-container"><h2 className="error-text">❌ {error}</h2></div>;

  return (
    <div className="page-container">
      <div className="layout-container">
        <div className="main-content">
          
          {/* Profile Header */}
          <div className="card profile-header">
            <img src={profile.avatar || "https://via.placeholder.com/120"} alt="avatar" className="avatar" />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="profile-college">{profile.college?.name}</p>
            <p className="profile-branch">{profile.branch} ({profile.year})</p>
          </div>

          {/* 🟢 Simple Mode: Date/Time removed, direct info shown */}
          <div className="card">
            <h3 className="card-heading">📅 Session Details</h3>
            <p style={{color: 'var(--muted)', fontSize: '1rem'}}>
               This is a <strong>Direct Booking</strong>. 
               Once payment is done, you can chat with the senior to decide a mutual time.
            </p>
            <div className="cc-chip active" style={{marginTop: '10px', display: 'inline-block'}}>
               ✅ Flexible Timing
            </div>
          </div>

          <div className="card">
            <h3 className="card-heading">👤 About Me</h3>
            <p className="card-bio">{profile.bio || "No bio available."}</p>
          </div>
        </div>

        {/* Payment Sidebar */}
        <div className="sidebar">
          <div className="card booking-card">
            <h3>Booking Summary</h3>
            <div className="price-box">
              <span className="price-text">₹{totalAmount}</span>
              <span className="duration-text">/ Session</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px'}}>
              *Platform fee included. Senior will be notified instantly.
            </p>
            <button onClick={displayRazorpay} className="cc-btn primary" style={{width: "100%", marginTop: "20px"}}>
              🔒 Pay ₹{totalAmount} & Book
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;