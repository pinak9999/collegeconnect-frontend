import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 1. Price Breakdown (platformFee) state हटा दिया गया है
  
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        const res = await axios.get(
          `https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`,
          { headers: { "x-auth-token": token } }
        );
        const settingsRes = await axios.get(
          `https://collegeconnect-backend-mrkz.onrender.com/api/settings`
        );

        setProfile(res.data);
        
        // 2. Sirf Total Amount set kiya gaya hai
        const fee = res.data.price_per_session + settingsRes.data.platformFee;
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

  // --- Payment Handler (No changes) ---
  const displayRazorpay = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }
    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      slot_time: new Date(),
      duration: profile.session_duration_minutes,
      amount: totalAmount,
    };
    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { seniorId: profile.user._id },
        { headers: { "x-auth-token": token } }
      );
      const order = orderRes.data;
      toast.dismiss(toastId);
      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
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
              { ...response, bookingDetails },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed!");
            navigate("/booking-success");
          } catch {
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed. Please contact support.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#007BFF" },
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

  // --- 🎨 STYLE OBJECTS (Attractive Inline CSS) 🎨 ---

  const pageStyle = {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "0 20px",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "30px",
  };

  const mainContentStyle = {
    flex: isMobile ? "1" : "2",
  };

  const sidebarStyle = {
    flex: "1",
    position: isMobile ? "relative" : "sticky",
    top: isMobile ? "0" : "80px",
    height: "fit-content",
  };

  const cardBaseStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
    padding: "24px",
    marginBottom: "24px",
  };

  const profileHeaderStyle = {
    ...cardBaseStyle,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const avatarStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid #007BFF",
    marginBottom: "15px",
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };

  const tagStyle = {
    background: "#e9f2ff",
    color: "#007BFF",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
  };

  // 3. Price Breakdown styles (priceItemStyle, totalPriceStyle) हटा दिए गए हैं

  const bookButtonStyle = {
    background: "linear-gradient(135deg, #007BFF, #0056b3)",
    color: "#fff",
    fontWeight: "600",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "1.1rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
    transition: "all 0.3s ease",
    width: "100%",
    marginTop: "20px",
  };

  // --- LOADING / ERROR / NOT FOUND STATES ---

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.5rem", color: "#007BFF" }}>
        <h2>⏳ Loading Booking Page...</h2>
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "100px" }}>
        <h2>❌ {error}</h2>
      </div>
    );

  if (!profile)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Profile not found.</h2>
      </div>
    );

  // --- 🚀 FINAL JSX (New Layout) 🚀 ---

  return (
    <div style={pageStyle}>
      {/* ------------------- 
          LEFT COLUMN (Info) 
         ------------------- */}
      <div style={mainContentStyle}>
        {/* Profile Header Card */}
        <div style={profileHeaderStyle}>
          <img
            src={profile.avatar || "https://via.placeholder.com/120"}
            alt={profile.user?.name || "Senior"}
            style={avatarStyle}
          />
          <h2 style={{ fontSize: "2rem", fontWeight: "600", margin: "0 0 5px 0" }}>
            {profile.user?.name}
          </h2>
          <p style={{ fontSize: "1.1rem", margin: "0", color: "#444" }}>
            {profile.college?.name || "N/A"}
          </p>
          <p style={{ fontSize: "1rem", margin: "5px 0 0 0", color: "#666" }}>
            {profile.branch} ({profile.year})
          </p>
        </div>

        {/* About Me Card */}
        <div style={cardBaseStyle}>
          <h3 style={{ color: "#007BFF", margin: "0 0 15px 0" }}>👤 About Me</h3>
          <p style={{ color: "#555", lineHeight: "1.7", margin: "0" }}>
            {profile.bio}
          </p>
        </div>

        {/* Specializations Card */}
        <div style={cardBaseStyle}>
          <h3 style={{ color: "#007BFF", margin: "0 0 15px 0" }}>🏷️ Specializations</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {profile.tags?.length ? (
              profile.tags.map((tag) => (
                <span key={tag._id} style={tagStyle}>
                  #{tag.name}
                </span>
              ))
            ) : (
              <p style={{ color: "#555", margin: "0" }}>No tags listed.</p>
            )}
          </div>
        </div>
        
        {/* Verified ID Card */}
        {profile.id_card_url && (
          <div style={cardBaseStyle}>
             <h3 style={{ color: "#007BFF", margin: "0 0 15px 0", textAlign: "center" }}>
               🎓 College Verified ID
             </h3>
             <img
               src={profile.id_card_url}
               alt="College ID Card"
               style={{
                 width: "100%",
                 // ⭐ 4. ID Card ko Vertical kar diya gaya hai
                 maxWidth: "250px", // Vertical card ke liye max-width set ki
                 aspectRatio: "54 / 86", // Standard Vertical ID Card ratio
                 height: "auto",
                 border: "2px solid #007BFF",
                 borderRadius: "10px",
                 boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                 objectFit: "cover",
                 display: "block",
                 margin: "0 auto",
               }}
             />
           </div>
        )}
      </div>

      {/* ------------------- 
          RIGHT COLUMN (Booking) 
         ------------------- */}
      <div style={sidebarStyle}>
        <div style={cardBaseStyle}>
          <h3 style={{ color: "#007BFF", margin: "0 0 15px 0", fontSize: "1.5rem" }}>
            Book this Session
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.5", margin: "0 0 20px 0" }}>
            After payment, the senior will contact you within 6 hours to schedule the best time.
          </p>

          {/* ⭐ 5. Price Breakdown ko hata kar Total Price dikhaya gaya hai */}
          <div style={{ 
              textAlign: "center", 
              margin: "25px 0", 
              fontSize: "2.5rem", 
              color: "#000", 
              fontWeight: "600" 
          }}>
            ₹{totalAmount}
            <span style={{ 
                fontSize: "1rem", 
                color: "#666", 
                fontWeight: "400", 
                marginLeft: "8px" 
            }}>
              / {profile.session_duration_minutes} min
            </span>
          </div>

          <button
            onClick={displayRazorpay}
            style={bookButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = "#0056b3";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #007BFF, #0056b3)";
              e.target.style.transform = "scale(1)";
            }}
          >
            💳 Pay ₹{totalAmount} & Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;