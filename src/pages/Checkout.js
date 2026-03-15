import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ======================================
// 🚀 Ultra-Premium Checkout Page CSS 
// ======================================
const checkoutStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.checkout-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f4f8; /* Soft premium background */
  font-family: 'Poppins', sans-serif;
  padding: 15px;
}

.checkout-card {
  background: #ffffff;
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  padding: 35px 25px;
  display: flex;
  flex-direction: column; /* Everything strictly stacked */
  align-items: center;
  border: 1px solid #ffffff;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.secure-badge {
  background: #ecfdf5;
  color: #059669;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.amount-display {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 5px;
  letter-spacing: -1px;
}

.instruction-text {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 25px;
  font-weight: 500;
  text-align: center;
}

.qr-frame {
  background: #ffffff;
  padding: 12px;
  border-radius: 18px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 15px;
}

.qr-frame img {
  width: 180px;
  height: 180px;
  display: block;
}

.upi-info {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  width: 100%;
  text-align: center;
}

.upi-info span {
  color: #e23744;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.divider {
  width: 100%;
  height: 1px;
  background: #e2e8f0;
  margin: 10px 0 25px 0;
}

.input-wrapper {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.input-wrapper label {
  display: block;
  font-size: 0.8rem;
  color: #334155;
  font-weight: 700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.utr-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.utr-input:focus {
  outline: none;
  border-color: #e23744;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(226, 55, 68, 0.1);
}

.utr-input::placeholder {
  color: #94a3b8;
  letter-spacing: normal;
  font-weight: 500;
  font-size: 0.95rem;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #e23744 0%, #ff5e6b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(226, 55, 68, 0.25);
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(226, 55, 68, 0.35);
}

.submit-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.cancel-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 15px;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: underline;
}

.cancel-btn:hover {
  color: #1e293b;
}
`;

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);

  const bookingData = location.state;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!bookingData || !bookingData.amount) {
      toast.error("Invalid Payment Session!");
      navigate(-1);
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const { amount, seniorId, profileId, seniorName } = bookingData;

  // 🎯 DYNAMIC QR CODE
  const MY_UPI_ID = "davepinak0@okicici"; 
  const upiLink = `upi://pay?pa=${MY_UPI_ID}&pn=ReapCampusConnect&am=${amount}&cu=INR&tn=Booking_${seniorName.replace(/\s+/g, '')}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

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
        
        {/* 🔒 Top Security Badge */}
        <div className="secure-badge">
          <span>🔒</span> 100% Secure Payment
        </div>

        {/* 💰 Hero Amount */}
        <div className="amount-display">
          ₹{amount}
        </div>
        <div className="instruction-text">
          Scan via Any UPI App (GPay, PhonePe, Paytm)
        </div>

        {/* 🔲 Beautiful QR Frame */}
        <div className="qr-frame">
          <img src={qrCodeUrl} alt="UPI QR Code" />
        </div>

        {/* 🏦 UPI Info Box */}
        <div className="upi-info">
          Paying to: <span>{MY_UPI_ID}</span>
        </div>

        <div className="divider"></div>

        {/* ⌨️ UTR Input Section */}
        <div className="input-wrapper">
          <label>Enter 12-Digit UTR/Ref. Number</label>
          <input 
            type="text" 
            className="utr-input" 
            placeholder="e.g. 312345678901" 
            value={utr}
            onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
            maxLength={12}
          />
        </div>
        
        {/* 🚀 Action Button (Disabled state is neat grey, Active state is glowing red) */}
        <button 
          className="submit-btn" 
          onClick={handleUPISubmit}
          disabled={loading || utr.length < 12}
        >
          {loading ? "Verifying..." : "Confirm Payment ✓"}
        </button>

        {/* 🔙 Cancel Link */}
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          Cancel Transaction
        </button>

      </div>
    </div>
  );
}

export default Checkout;