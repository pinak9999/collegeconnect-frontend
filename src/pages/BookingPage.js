import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BookingPage.css"; // CSS फाइल नीचे दी गई है

const BookingPage = () => {
  const { userId } = useParams(); // URL से सीनियर की ID (userId)
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [senior, setSenior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  // 🔹 1. सीनियर की डिटेल्स लोड करें (API Call)
  useEffect(() => {
    const fetchSenior = async () => {
      try {
        const res = await axios.get(
          `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`
        );
        setSenior(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching senior:", err);
        setLoading(false);
      }
    };
    fetchSenior();
  }, [userId]);

  // 🔹 2. रेज़रपे (Razorpay) लोड करने का फंक्शन
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔹 3. बुकिंग हैंडलर (पेमेंट + बुकिंग)
  const handleBookSession = async () => {
    if (!auth.isAuthenticated) {
      alert("Please login to book a session.");
      navigate("/login");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      alert("Please select a Date and Time Slot.");
      return;
    }

    setProcessing(true);

    try {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // A. ऑर्डर क्रिएट करें (Backend API)
      const orderUrl = "https://collegeconnect-backend-mrkz.onrender.com/api/payment/create-order";
      const amount = senior.pricePerSession || 100; // अगर प्राइस नहीं है तो 100 डिफ़ॉल्ट

      const { data: orderData } = await axios.post(
        orderUrl,
        { amount: amount },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // B. रेज़रपे का ऑप्शन सेट करें
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", // अपनी Test Key यहाँ डालें
        amount: orderData.order.amount,
        currency: "INR",
        name: "CollegeConnect",
        description: `Session with ${senior.name}`,
        image: "https://via.placeholder.com/150",
        order_id: orderData.order.id,
        handler: async function (response) {
          // C. पेमेंट सफल होने पर बुकिंग सेव करें (Backend API)
          try {
            const verifyUrl = "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify-payment";
            const bookingData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              seniorId: userId,
              studentId: auth.user._id,
              date: selectedDate,
              timeSlot: selectedSlot,
              note: note,
              amount: amount,
            };

            const verifyRes = await axios.post(verifyUrl, bookingData, {
              headers: { Authorization: `Bearer ${auth.token}` },
            });

            if (verifyRes.data.success) {
              // सफलता पेज पर भेजें
              navigate("/booking-success", { state: { booking: verifyRes.data.booking } });
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Booking Save Error:", error);
            alert("Payment successful but booking failed. Contact support.");
          }
        },
        prefill: {
          name: auth.user.name,
          email: auth.user.email,
          contact: auth.user.mobileNumber || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setProcessing(false);

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong with payment initiation.");
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Senior Details...</div>;
  if (!senior) return <div className="error-screen">Senior not found!</div>;

  return (
    <div className="booking-page-container">
      <div className="booking-card-wrapper">
        {/* Left Side: Senior Details */}
        <div className="senior-summary-section">
          <img
            src={senior.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt={senior.name}
            className="senior-avatar-large"
          />
          <h2>{senior.name}</h2>
          <p className="college-text">{senior.college || "College info unavailable"}</p>
          <div className="pricing-tag">
            ₹ {senior.pricePerSession || 100} <span>/ 30 min session</span>
          </div>
          <div className="tags-container">
            {senior.tags && senior.tags.map((tag, index) => (
              <span key={index} className="skill-tag">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="booking-form-section">
          <h3>Select Schedule</h3>
          
          <div className="input-group">
            <label>Pick a Date</label>
            <input
              type="date"
              className="custom-date-input"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Available Time Slots</label>
            <div className="slots-grid">
              {["10:00 AM", "12:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"].map((slot) => (
                <button
                  key={slot}
                  className={`slot-box ${selectedSlot === slot ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Note for Senior (Optional)</label>
            <textarea
              placeholder="E.g., I want to discuss about placement..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
            ></textarea>
          </div>

          <button 
            className="pay-btn" 
            onClick={handleBookSession} 
            disabled={processing}
          >
            {processing ? "Processing..." : `Pay ₹${senior.pricePerSession || 100} & Book`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;