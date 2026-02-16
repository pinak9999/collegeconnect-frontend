import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./BookingPage.css"; 

function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Auth Context (Mock or Real)
  const authUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest", email: "guest@example.com" };

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // 🚀 NEW STATE: Date aur Time ke liye
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          // Agar login nahi hai to login par bhejo (Optional)
          // navigate("/login"); 
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
        const fee = combinedProfile.price_per_session + settingsRes.data.platformFee;
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
    return () => window.removeEventListener("resize", handleResize);
  }, [userId]);

  const displayRazorpay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    // 🚀 VALIDATION: Date aur Time check karo
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a Date and Time for the session!");
      return;
    }

    // 🚀 UPDATED: Ab hum Date aur Time bhej rahe hain
    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      date: selectedDate,  // "2025-02-18"
      time: selectedTime,  // "14:00"
      slot_time: new Date(`${selectedDate}T${selectedTime}`), // Backup ke liye
      duration: profile.session_duration_minutes,
      amount: totalAmount,
    };

    const toastId = toast.loading("Creating your order...");
    try {
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { seniorId: profile.user._id },
        { headers: { "x-auth-token": token } }
      );
      const order = orderRes.data;
      toast.dismiss(toastId);

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF", // Apna key verify karein
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
              { ...response, bookingDetails }, // Yahan 'bookingDetails' backend jayega
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed! Check 'My Bookings'.");
            navigate("/student/bookings"); // ✅ Correct Redirect
          } catch (error) {
            console.error(error);
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed.");
          }
        },
        prefill: { name: authUser.name, email: authUser.email },
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

  if (loading) return <div className="booking-page center"><h2 className="loading-text">⏳ Loading...</h2></div>;
  if (error) return <div className="booking-page center"><h2 className="error-text">❌ {error}</h2></div>;
  if (!profile) return <div className="booking-page center"><h2>Profile not found.</h2></div>;

  return (
    <div className="booking-page">
      <div className={`layout ${isMobile ? "mobile" : ""}`}>
        
        {/* LEFT SIDE: PROFILE INFO */}
        <div className="main-content">
          <div className="profile-card">
            <img
              src={profile.avatar || "https://via.placeholder.com/120"}
              alt={profile.user?.name}
              className="avatar"
            />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="college">{profile.college?.name || "N/A"}</p>
            <p className="branch">{profile.branch} ({profile.year})</p>
          </div>

          <div className="card">
            <h3 className="heading">👤 About Me</h3>
            <p className="bio">{profile.bio || "No bio added."}</p>
          </div>

          <div className="card">
            <h3 className="heading">🏷️ Specializations</h3>
            <div className="tags">
              {profile.tags?.length ? (
                profile.tags.map((tag) => <span key={tag._id} className="tag">{tag.name}</span>)
              ) : (
                <p className="no-tags">No tags listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: BOOKING BOX */}
        <div className="sidebar">
          <div className="card booking-box">
            <h3 className="heading center">Schedule Session</h3>
            
            {/* 🚀 NEW INPUTS: DATE & TIME */}
            <div style={{ margin: "15px 0" }}>
              <label style={{display:"block", fontWeight:"bold", marginBottom:"5px"}}>Select Date:</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded"
                style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                min={new Date().toISOString().split("T")[0]} // Disable past dates
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <label style={{display:"block", fontWeight:"bold", marginBottom:"5px"}}>Select Time:</label>
              <input 
                type="time" 
                className="w-full border p-2 rounded"
                style={{ width: "100%", padding: "8px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            <div className="price-box">
              <span className="price">₹{totalAmount}</span>
              <span className="chat-free">+ Chat Free</span>
            </div>

            <button className="book-btn" onClick={displayRazorpay}>
              🔒 Pay ₹{totalAmount} & Book
            </button>
            
            <p className="note" style={{marginTop:"10px", fontSize:"12px", color:"#666"}}>
              *Session link will activate at your selected time.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;