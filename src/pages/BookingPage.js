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
  
  // 📅 Date & Time Inputs
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const isMobile = window.innerWidth <= 768;

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
    if (!selectedDate || !selectedTime) { toast.error("Please pick Date & Time!"); return; }

    const bookingPayload = {
      senior: profile.user._id,
      date: selectedDate,
      time: selectedTime,
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
            
            // 🚀 SUCCESS REDIRECT (Ye My Bookings tab pe le jayega)
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
    <div className="booking-page">
      <div className={`layout ${isMobile ? "mobile" : ""}`}>
        <div className="main-content">
          <div className="profile-card">
            <img src={profile.avatar || "https://via.placeholder.com/100"} alt="Senior" className="avatar"/>
            <h2>{profile.user?.name}</h2>
            <p>{profile.college?.name}</p>
          </div>
        </div>

        <div className="sidebar">
          <div className="card booking-box">
            <h3>Select Slot</h3>
            <input type="date" className="cc-input" min={new Date().toISOString().split("T")[0]} onChange={(e) => setSelectedDate(e.target.value)} style={{marginBottom:10, width:'100%', padding:10}} />
            <input type="time" className="cc-input" onChange={(e) => setSelectedTime(e.target.value)} style={{marginBottom:15, width:'100%', padding:10}} />
            
            <div className="price-box">
              <span className="price">Total: ₹{totalAmount}</span>
            </div>
            <button className="book-btn" onClick={handlePayment}>Pay & Book</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;