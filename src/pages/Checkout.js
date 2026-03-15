import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ======================================
// 🚀 Premium Checkout Page CSS (Center Aligned + Animations)
// ======================================
const checkoutStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.checkout-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.checkout-card {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  padding: 40px 30px;
  text-align: center;
  border: 1px solid #e2e8f0;
  /* 🔥 पेज खुलते ही एक स्मूथ स्लाइड एनीमेशन */
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpFade {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.checkout-header h2 {
  color: #1c1c1c;
  font-weight: 800;
  font-size: 1.6rem;
  margin-bottom: 5px;
}

.checkout-header p {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 25px;
}

.amount-badge {
  background: #fcebed;
  color: #e23744;
  font-size: 2rem;
  font-weight: 800;
  padding: 10px 20px;
  border-radius: 16px;
  display: inline-block;
  margin-bottom: 25px;
  border: 2px dashed #fca5a5;
}

.qr-box {
  background: #ffffff;
  padding: 15px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  display: inline-block;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.qr-box img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.upi-id-text {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 25px;
  background: #f1f5f9;
  padding: 8px 15px;
  border-radius: 50px;
  display: inline-block;
}

.upi-id-text span {
  color: #e23744;
}

.utr-section {
  text-align: left;
}

.utr-section label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1c1c1c;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.utr-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 2px;
  text-align: center;
  transition: all 0.3s;
  outline: none;
  margin-bottom: 20px;
}

.utr-input:focus {
  border-color: #e23744;
  box-shadow: 0 0 0 4px #fcebed;
}

.submit-btn {
  width: 100%;
  padding: 18px;
  background: #1c1c1c;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  font-family: inherit;
}

.submit-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 20px;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  width: 100%;
}

.back-btn:hover {
  color: #1c1c1c;
}
`;

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);

  const bookingData = location.state;

  // 🚀 मैजिक यहाँ है: पेज खुलते ही एक स्मूथ स्क्रॉल के साथ टॉप पर ले जाएगा
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // एकदम मक्खन की तरह ऊपर जाएगा
    });
  }, []);

  // सिक्योरिटी चेक
  useEffect(() => {
    if (!bookingData || !bookingData.amount) {
      toast.error("Invalid Payment Session!");
      navigate(-1);
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const { amount, seniorId, profileId, seniorName } = bookingData;

  // 🎯 DYNAMIC QR CODE LOGIC (Apni UPI ID yahan dalein)
  const MY_UPI_ID = "davepinak0@okicici"; 
  const upiLink = `upi://pay?pa=${MY_UPI_ID}&pn=ReapCampusConnect&am=${amount}&cu=INR&tn=Booking_${seniorName.replace(/\s+/g, '')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  const handleUPISubmit = async () => {
    if (utr.trim().length < 12) {
      return toast.error("Please enter a valid 12-digit UTR/Ref Number.");
    }

    setLoading(true);
    const toastId = toast.loading("Verifying your payment...");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/upi-submit", 
        {
          seniorId: seniorId,
          profileId: profileId,
          amount: amount,
          utrNumber: utr,
          slot_time: new Date()
        },
        { headers: { "x-auth-token": token } }
      );

      toast.success("Payment Submitted! Awaiting Admin Verification.", { id: toastId });
      navigate("/booking-success"); 

    } catch (err) {
      toast.error(err.response?.data?.msg || "Submission failed. Try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <style>{checkoutStyles}</style>
      
      <div className="checkout-card">
        <div className="checkout-header">
          <h2>Complete Payment</h2>
          <p>Scan with any UPI App (GPay, PhonePe, Paytm)</p>
        </div>

        <div className="amount-badge">
          ₹{amount}
        </div>

        <div className="qr-box">
          <img src={qrCodeUrl} alt="UPI QR Code" />
        </div>

        <div className="upi-id-text">
          Paying to: <span>{MY_UPI_ID}</span>
        </div>

        <div className="utr-section">
          <label>Enter 12-Digit UTR Number</label>
          <input 
            type="text" 
            className="utr-input" 
            placeholder="e.g. 312345678901" 
            value={utr}
            onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
            maxLength={12}
          />
          
          <button 
            className="submit-btn" 
            onClick={handleUPISubmit}
            disabled={loading || utr.length < 12}
          >
            {loading ? "Verifying..." : "Submit UTR & Confirm"}
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Cancel & Go Back
        </button>
      </div>
    </div>
  );
}

export default Checkout;