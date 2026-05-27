import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminVerification = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. पेंडिंग बुकिंग्स को बैकएंड से मंगाना
  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://collegeconnect-backend-mrkz.onrender.com/api/payment/pending-bookings", {
        headers: { "x-auth-token": token },
      });
      setPendingBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // 2. पेमेंट को Approve (वेरीफाई) करना
  const handleApprove = async (bookingId) => {
    const confirmApprove = window.confirm("Are you sure you received the payment? This will confirm the booking.");
    if (!confirmApprove) return;

    const toastId = toast.loading("Approving booking...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://collegeconnect-backend-mrkz.onrender.com/api/payment/approve/${bookingId}`, {}, {
        headers: { "x-auth-token": token },
      });

      toast.success("Booking Approved & Email Sent! ✅", { id: toastId });
      
      // लिस्ट को रिफ्रेश करें (अप्रूव हो चुकी बुकिंग को लिस्ट से हटाएं)
      setPendingBookings(pendingBookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error(err);
      toast.error("Approval failed!", { id: toastId });
    }
  };

  // 3. पेमेंट को Reject (कैंसल) करना
  const handleReject = async (bookingId) => {
    const confirmReject = window.confirm("Are you sure this is a FAKE payment? This will reject the booking.");
    if (!confirmReject) return;

    // (नोट: इसके लिए हम बैकएंड में एक छोटा सा /reject राउट बाद में जोड़ लेंगे)
    toast.error("Reject feature will be activated soon. For now, just ignore it.");
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Pending Verifications... ⏳</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
        🛡️ Admin Panel: Payment Verifications
      </h2>

      {pendingBookings.length === 0 ? (
        <p style={{ marginTop: "20px", color: "#64748b" }}>No pending bookings for verification. 🎉</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
          
          {pendingBookings.map((booking) => (
            <div key={booking._id} style={{ 
              border: "1px solid #e2e8f0", 
              borderRadius: "12px", 
              padding: "20px", 
              background: "#fff",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
            }}>
              
              <h3 style={{ margin: "0 0 10px 0", color: "#0f172a" }}>Student: {booking.student?.name}</h3>
              <p style={{ margin: "5px 0", color: "#475569" }}><strong>Amount:</strong> ₹{booking.amount_paid}</p>
              <p style={{ margin: "5px 0", color: "#475569" }}>
                <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
              </p>

              {/* 📸 फोटो दिखाने वाला सेक्शन */}
              <div style={{ margin: "15px 0", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>Payment Screenshot:</p>
                <a href={booking.payment_screenshot} target="_blank" rel="noreferrer">
                  <img 
                    src={booking.payment_screenshot} 
                    alt="Payment Proof" 
                    style={{ width: "100%", maxHeight: "200px", objectFit: "contain", border: "1px dashed #cbd5e1", borderRadius: "8px", cursor: "pointer" }} 
                  />
                </a>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "5px" }}>(Click image to view full size)</p>
              </div>

              {/* 🚀 एक्शन बटन्स */}
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button 
                  onClick={() => handleApprove(booking._id)}
                  style={{ flex: 1, padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                  ✅ Approve
                </button>
                <button 
                  onClick={() => handleReject(booking._id)}
                  style={{ flex: 1, padding: "10px", background: "#ef4444", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                  ❌ Reject
                </button>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminVerification;