import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminApprovals = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Pending Bookings Fetch Karein
  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://collegeconnect-backend-mrkz.onrender.com/api/payment/pending-bookings", {
        headers: { "x-auth-token": token },
      });
      setPendingBookings(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load pending bookings");
      setLoading(false);
    }
  };

  // 2. Approve Button ka Function (Ye aapke naye route ko hit karega)
  const handleApprove = async (bookingId) => {
    const confirmApprove = window.confirm("Are you sure you have received the payment for this UTR?");
    if (!confirmApprove) return;

    const toastId = toast.loading("Approving and Sending Emails...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://collegeconnect-backend-mrkz.onrender.com/api/payment/approve/${bookingId}`, {}, {
        headers: { "x-auth-token": token },
      });

      toast.success("Booking Approved Successfully! 🎉", { id: toastId });
      
      // List ko update karein (jo approve ho gaya use screen se hata dein)
      setPendingBookings(pendingBookings.filter(b => b._id !== bookingId));

    } catch (err) {
      toast.error(err.response?.data?.msg || "Approval failed", { id: toastId });
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Pending Approvals... ⏳</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ color: "#1c1c1c", marginBottom: "20px", fontWeight: 800 }}>
        🛡️ Admin UTR Approvals
      </h2>

      {pendingBookings.length === 0 ? (
        <div style={{ background: "#e5f6e8", color: "#25a541", padding: "20px", borderRadius: "12px", textAlign: "center", fontWeight: "bold" }}>
          🎉 All caught up! No pending payments to verify.
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#f8f9fa", borderBottom: "2px solid #e8e8e8" }}>
              <tr>
                <th style={{ padding: "16px", color: "#696969" }}>Student</th>
                <th style={{ padding: "16px", color: "#696969" }}>Senior</th>
                <th style={{ padding: "16px", color: "#696969" }}>Amount</th>
                <th style={{ padding: "16px", color: "#696969" }}>UTR Number</th>
                <th style={{ padding: "16px", color: "#696969", textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{booking.student?.name}</td>
                  <td style={{ padding: "16px" }}>{booking.senior?.name}</td>
                  <td style={{ padding: "16px", fontWeight: "bold", color: "#25a541" }}>₹{booking.amount_paid}</td>
                  
                  {/* UTR Highlighted */}
                  <td style={{ padding: "16px" }}>
                    <span style={{ background: "#fcebed", color: "#e23744", padding: "6px 10px", borderRadius: "6px", fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>
                      {booking.utr_number}
                    </span>
                  </td>
                  
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button 
                      onClick={() => handleApprove(booking._id)}
                      style={{ background: "#1c1c1c", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}
                      onMouseOver={(e) => e.target.style.background = "#25a541"}
                      onMouseOut={(e) => e.target.style.background = "#1c1c1c"}
                    >
                      Verify & Approve ✓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;