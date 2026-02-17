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

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } });
        const settings = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`);
        
        setProfile(res.data);
        setTotalAmount((res.data.price_per_session || 0) + (settings.data.platformFee || 0));
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    loadData();
  }, [userId]);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Login required!"); navigate("/login"); return; }

    // 🚀 AUTO-GENERATE DATE & TIME (No Input Needed)
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // "2023-10-25"
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`; // "14:30"

    const bookingPayload = {
      senior: profile.user._id,
      date: currentDate, // Auto-filled
      time: currentTime, // Auto-filled
      amount: totalAmount
    };

    try {
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "CollegeConnect",
        order_id: orderRes.data.id,
        handler: async function (response) {
          const toastId = toast.loading("Confirming...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails: bookingPayload },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(toastId);
            toast.success("Booking Confirmed!");
            navigate("/student-dashboard/bookings"); 
          } catch (error) {
            toast.dismiss(toastId);
            toast.error("Verification Failed");
          }
        },
        theme: { color: "#10B981" }
      };
      new window.Razorpay(options).open();
    } catch (err) { toast.error("Payment Error"); }
  };

  if (loading) return <div className="center">Loading...</div>;
  if (!profile) return <div className="center">Profile not found</div>;

  return (
    <div className="booking-page" style={{padding:20, maxWidth:600, margin:'0 auto'}}>
      <div className="card" style={{padding:20, border:'1px solid #ddd', borderRadius:10, textAlign:'center'}}>
        <img src={profile.avatar || "https://via.placeholder.com/100"} alt="Avatar" style={{width:100, height:100, borderRadius:'50%', objectFit:'cover'}}/>
        <h2>{profile.user?.name}</h2>
        <p style={{color:'#666'}}>{profile.college?.name}</p>
        
        <div style={{margin:'20px 0', padding:'15px', background:'#f0fdf4', borderRadius:8}}>
          <h3>Total Fee: ₹{totalAmount}</h3>
          <p style={{fontSize:'0.9rem', color:'#166534'}}>Instant Booking • Join Immediately</p>
        </div>

        <button 
          onClick={handlePayment}
          style={{width:'100%', padding:12, background:'#2563eb', color:'white', border:'none', borderRadius:8, fontSize:'1rem', cursor:'pointer'}}
        >
          Pay & Start Session
        </button>
      </div>
    </div>
  );
}

export default BookingPage;