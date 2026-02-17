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
  const [totalAmount, setTotalAmount] = useState(0);
  
  // 📅 Date & Time State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        // API Calls - (Profile + Settings)
        const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } });
        const settingsRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`);
        
        setProfile(res.data);
        const fee = (res.data.price_per_session || 0) + (settingsRes.data.platformFee || 0);
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // Error handling but keep simple
      }
    };
    loadPageData();
  }, [userId]);

  const displayRazorpay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book.");
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select Date and Time!");
      return;
    }

    // Booking Details Object
    const bookingDetails = {
      senior: profile.user._id,
      date: selectedDate,
      time: selectedTime,
      amount: totalAmount,
    };

    try {
      // 1. Create Order
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );

      // 2. Open Razorpay
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "CollegeConnect",
        description: `Session with ${profile.user.name}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          const toastId = toast.loading("Verifying Payment...");
          try {
            // 3. Verify & Save
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(toastId);
            toast.success("Booking Successful!");
            
            // 🚀 REDIRECT TO MY BOOKINGS (Corrected Path)
            navigate("/student-dashboard/bookings"); 
            
          } catch (error) {
            toast.dismiss(toastId);
            toast.error("Payment Verification Failed.");
          }
        },
        theme: { color: "#10B981" },
        prefill: { name: "Student", email: "student@example.com" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.error("Could not initiate payment.");
    }
  };

  if (loading) return <div className="center">Loading Profile...</div>;
  if (!profile) return <div className="center">Profile not found.</div>;

  return (
    <div className="booking-page" style={{padding: '20px'}}>
      <div className={`layout ${isMobile ? "mobile" : ""}`} style={{maxWidth:'1000px', margin:'0 auto', display:'flex', gap:'20px'}}>
        
        {/* Left: Profile Details */}
        <div style={{flex:2}}>
          <div className="profile-card" style={{textAlign:'center', marginBottom:'20px'}}>
            <img src={profile.avatar || "https://via.placeholder.com/100"} alt="Avatar" style={{width:'100px', borderRadius:'50%'}} />
            <h2>{profile.user?.name}</h2>
            <p>{profile.college?.name}</p>
            <p>{profile.branch} ({profile.year})</p>
          </div>
          <div className="card">
            <h3>About</h3>
            <p>{profile.bio}</p>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div style={{flex:1}}>
          <div className="card booking-box" style={{border:'1px solid #ddd', padding:'20px', borderRadius:'12px'}}>
            <h3 style={{textAlign:'center'}}>Schedule Session</h3>
            
            <label style={{display:'block', marginTop:'10px'}}>Select Date:</label>
            <input 
              type="date" 
              className="cc-input"
              min={new Date().toISOString().split("T")[0]}
              style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'8px', border:'1px solid #ccc'}}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <label style={{display:'block'}}>Select Time:</label>
            <input 
              type="time" 
              className="cc-input"
              style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid #ccc'}}
              onChange={(e) => setSelectedTime(e.target.value)}
            />

            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'bold'}}>
              <span>Total Fee:</span>
              <span style={{color:'green'}}>₹{totalAmount}</span>
            </div>

            <button 
              onClick={displayRazorpay}
              style={{width:'100%', padding:'12px', background:'#2563eb', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}
            >
              Pay & Book
            </button>
            <p style={{fontSize:'12px', color:'#666', marginTop:'10px', textAlign:'center'}}>
              Secure payment via Razorpay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;