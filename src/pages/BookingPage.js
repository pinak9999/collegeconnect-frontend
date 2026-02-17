import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./BookingPage.css"; 

function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  // 1. Data Load Karna
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Agar login nahi hai to error mat dikhao, bas loading band kar do (redirect payment pe hoga)
        if (!token) {
           // Optional: You can redirect here if you want strict protection
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
        const fee = combinedProfile.price_per_session + settingsRes.data.platformFee;
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        let errorMsg = err.response
          ? err.response.data.msg || err.response.data
          : err.message;
        setError("Unable to load profile. Please try again.");
        setLoading(false);
      }
    };

    loadPageData();
    return () => window.removeEventListener("resize", handleResize);
  }, [userId]);

  // 2. Payment Handle Karna
  const displayRazorpay = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    // 🚀 Time Logic Removed: Current time bhej rahe hain
    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      slot_time: new Date(), // Abhi ka time
      duration: profile.session_duration_minutes,
      amount: totalAmount,
    };

    const toastId = toast.loading("Creating your order...");
    try {
      // Step A: Order Create
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { seniorId: profile.user._id, amount: totalAmount }, 
        { headers: { "x-auth-token": token } }
      );
      const order = orderRes.data;
      toast.dismiss(toastId);

      // Step B: Razorpay Options
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF", // Apni Live Key yahan daal sakte hain
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user ? profile.user.name : "Senior"}`,
        order_id: order.id,
        
        // Step C: Payment Success Handler
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
            
            // 🚀 REDIRECT TO MY BOOKINGS
            navigate("/student-dashboard/bookings"); 
            
          } catch {
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed. Please contact support.");
          }
        },
        prefill: { name: user?.name || "User", email: user?.email || "user@example.com" },
        theme: { color: "#10B981" },
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

  if (loading)
    return (
      <div className="booking-page center">
        <h2 className="loading-text">⏳ Loading Booking Page...</h2>
      </div>
    );

  if (error)
    return (
      <div className="booking-page center">
        <h2 className="error-text">❌ {error}</h2>
      </div>
    );

  if (!profile)
    return (
      <div className="booking-page center">
        <h2>Profile not found.</h2>
      </div>
    );

  return (
    <div className="booking-page">
      <div className={`layout ${isMobile ? "mobile" : ""}`}>
        
        {/* Left Side: Senior Profile */}
        <div className="main-content">
          <div className="profile-card">
            <img
              src={profile.avatar || "https://via.placeholder.com/120"}
              alt={profile.user?.name || "Senior"}
              className="avatar"
            />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="college">{profile.college?.name || "N/A"}</p>
            <p className="branch">
              {profile.branch} ({profile.year})
            </p>
          </div>

          <div className="card">
            <h3 className="heading">👤 About Me</h3>
            <p className="bio">{profile.bio}</p>
          </div>

          <div className="card">
            <h3 className="heading">🏷️ Specializations</h3>
            <div className="tags">
              {profile.tags?.length ? (
                profile.tags.map((tag) => (
                  <span key={tag._id} className="tag">
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="no-tags">No tags listed.</p>
              )}
            </div>
          </div>

          {profile.id_card_url && (
            <div className="card verified">
              <h3 className="heading center">🎓 College Verified ID ✓</h3>
              <img
                src={profile.id_card_url}
                alt="College ID Card"
                className="id-card"
              />
            </div>
          )}
        </div>

        {/* Right Side: Payment Box */}
        <div className="sidebar">
          <div className="card booking-box">
            <h3 className="heading center">Book this Session</h3>
            <p className="note">
              After payment, the senior will contact you within 6 hours to
              schedule the best time.
            </p>

            <div className="price-box">
              <span className="price">₹{totalAmount}</span>
              <span className="chat-free">+ Chat Free</span>
            </div>

            <button
              className="book-btn"
              onClick={displayRazorpay}
            >
              🔒 Pay ₹{totalAmount} & Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;