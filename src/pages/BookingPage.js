import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Real Auth use kar rahe hain
import toast from "react-hot-toast";
import './BookingPage.css'; 

// --- Footer Component ---
function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">Connecting students with amazing mentors.</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Careers</a>
          <a href="#" className="footer-link">Press Release</a>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <a href="#" className="footer-link">Help Center</a>
          <a href="#" className="footer-link">Your Account</a>
          <a href="#" className="footer-link">Contact Us</a>
        </div>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} CollegeConnect. All Rights Reserved.
      </div>
    </footer>
  );
}

function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth(); // Context se real data utha rahe hain

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

        const [res, settingsRes] = await Promise.all([
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, {
            headers: { "x-auth-token": token }
          }),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`)
        ]);

        setProfile(res.data);
        const fee = res.data.price_per_session + settingsRes.data.platformFee;
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        setError("Error: Profile not found or server issue.");
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  const displayRazorpay = async () => {
    if (!auth?.user) {
      toast.error("Please login to book a session.");
      navigate("/login");
      return;
    }

    // 🟢 IMPORTANT: Backend fields ke sath sync kiya gaya hai
    const bookingDetails = {
      senior: profile.user._id,        // Backend expects 'senior'
      profileId: profile._id,          // Backend expects 'profile'
      amount: totalAmount,             // Total fee
      slot_time: new Date(),           // Default current date
    };

    const toastId = toast.loading("Processing order...");

    try {
      const token = localStorage.getItem("token");
      
      // 1. Create Order
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );

      const order = orderRes.data;
      toast.dismiss(toastId);

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user.name}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyId = toast.loading("Confirming your slot...");
          try {
            // 🟢 Backend Verify Call: Response + BookingDetails dono bhej rahe hain
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { 
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails 
              },
              { headers: { "x-auth-token": token } }
            );
            
            toast.dismiss(verifyId);
            toast.success("Payment Successful!");
            navigate("/booking-success");
          } catch (err) {
            toast.dismiss(verifyId);
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: auth.user.name,
          email: auth.user.email,
        },
        theme: { color: "#2563EB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to initiate payment.");
    }
  };

  if (loading) return <div className="loading-container"><h2>⏳ Loading Profile...</h2></div>;
  if (error) return <div className="loading-container"><h2 className="error-text">❌ {error}</h2></div>;

  return (
    <div className="page-container">
      <div className="layout-container">
        {/* Left Column */}
        <div className="main-content">
          <div className="card profile-header">
            <img src={profile.avatar || "https://via.placeholder.com/120"} alt="Senior" className="avatar" />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="profile-college">{profile.college?.name}</p>
            <p className="profile-branch">{profile.branch} ({profile.year} Year)</p>
          </div>

          <div className="card">
            <h3 className="card-heading">👤 About Me</h3>
            <p className="card-bio">{profile.bio || "No bio available."}</p>
          </div>

          <div className="card">
            <h3 className="card-heading">🏷️ Specializations</h3>
            <div className="tags-container">
              {profile.tags?.map(tag => <span key={tag._id} className="tag">{tag.name}</span>)}
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="sidebar">
          <div className="card booking-card">
            <h3 className="booking-title">Book Session</h3>
            <p className="booking-subtitle">The senior will contact you within 6 hours to schedule the call.</p>
            <div className="price-box">
              <span className="price-text">₹{totalAmount}</span>
              <span className="duration-text">Full Support</span>
            </div>
            <button onClick={displayRazorpay} className="book-button">
              🔒 Pay & Confirm Booking
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;