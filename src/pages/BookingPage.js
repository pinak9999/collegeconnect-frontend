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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  // 🧩 Handle Resize & Load Profile
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("⚠️ Please log in to continue.");

        const [profileRes, settingsRes] = await Promise.all([
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`,
            { headers: { "x-auth-token": token } }
          ),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`),
        ]);

        setProfile(profileRes.data);
        setTotalAmount(
          profileRes.data.price_per_session + settingsRes.data.platformFee
        );
      } catch (err) {
        setError("❌ " + (err.response?.data?.msg || err.message));
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
    return () => window.removeEventListener("resize", handleResize);
  }, [userId]);

  // 💳 Payment Function
  const displayRazorpay = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to book!");
      navigate("/login");
      return;
    }
    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { seniorId: profile.user._id },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      const order = orderRes.data;

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user?.name || "Senior"}`,
        order_id: order.id,
        theme: { color: "#2563eb" },
        handler: async (response) => {
          const verifyToast = toast.loading("Verifying payment...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails: { amount: totalAmount } },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToast);
            toast.success("✅ Booking Confirmed!");
            navigate("/booking-success");
          } catch {
            toast.dismiss(verifyToast);
            toast.error("Verification Failed. Try again!");
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("❌ Error creating order");
    }
  };

  // 🌀 Loading and Error States
  if (loading)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "#2563eb" }}>⏳ Loading your booking...</h2>
      </div>
    );

  if (error)
    return (
      <div style={centerBox}>
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );

  if (!profile)
    return (
      <div style={centerBox}>
        <h2>No profile found.</h2>
      </div>
    );

  // 🧠 UI Style Objects
  const container = {
    maxWidth: "1200px",
    margin: "auto",
    padding: "30px 20px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "25px",
    fontFamily: "Poppins, sans-serif",
  };

  const leftColumn = {
    flex: "2",
    animation: "fadeIn 0.7s ease",
  };

  const rightColumn = {
    flex: "1",
    position: isMobile ? "relative" : "sticky",
    top: "100px",
    height: "fit-content",
    animation: "fadeIn 1s ease",
  };

  const card = {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  };

  const avatar = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #2563eb",
    boxShadow: "0 6px 15px rgba(37,99,235,0.3)",
    marginBottom: "15px",
  };

  const nameStyle = {
    fontSize: "1.8rem",
    color: "#1e3a8a",
    fontWeight: "700",
  };

  const tag = {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "500",
  };

  const priceBox = {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "2.2rem",
    color: "#111827",
    fontWeight: "700",
  };

  const payButton = {
    background: "linear-gradient(45deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "600",
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    width: "100%",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37,99,235,0.4)",
    transition: "0.3s ease",
    marginTop: "20px",
  };

  const idCardImg = {
    width: "100%",
    maxWidth: "260px",
    borderRadius: "10px",
    border: "2px solid #2563eb",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    display: "block",
    margin: "auto",
  };

  const centerBox = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    flexDirection: "column",
    fontFamily: "Poppins, sans-serif",
  };

  // ✨ Animation Style (inserted dynamically)
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ✅ Return Final UI
  return (
    <div style={container}>
      {/* LEFT SIDE */}
      <div style={leftColumn}>
        <div style={{ ...card, textAlign: "center" }}>
          <img
            src={profile.avatar || "https://via.placeholder.com/120"}
            alt={profile.user?.name}
            style={avatar}
          />
          <h2 style={nameStyle}>{profile.user?.name}</h2>
          <p style={{ color: "#555" }}>{profile.college?.name}</p>
          <p style={{ color: "#666" }}>
            {profile.branch} ({profile.year})
          </p>
        </div>

        <div style={card}>
          <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>👤 About Me</h3>
          <p style={{ color: "#444", lineHeight: "1.7" }}>
            {profile.bio || "No bio available."}
          </p>
        </div>

        <div style={card}>
          <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>
            🏷️ Specializations
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {profile.tags?.length ? (
              profile.tags.map((t) => (
                <span key={t._id} style={tag}>
                  #{t.name}
                </span>
              ))
            ) : (
              <p style={{ color: "#666" }}>No tags listed.</p>
            )}
          </div>
        </div>

        {profile.id_card_url && (
          <div style={card}>
            <h3
              style={{ color: "#2563eb", textAlign: "center", marginBottom: "10px" }}
            >
              🎓 Verified College ID
            </h3>
            <img src={profile.id_card_url} alt="ID" style={idCardImg} />
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={rightColumn}>
        <div style={card}>
          <h3 style={{ color: "#2563eb", marginBottom: "10px" }}>💬 Book a Session</h3>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            Once booked, the senior will reach out within <b>6 hours</b> to
            confirm the meeting.
          </p>
          <div style={priceBox}>
            ₹{totalAmount}
            <span style={{ fontSize: "1rem", color: "#555", fontWeight: "400" }}>
              {" "}
              / {profile.session_duration_minutes} min
            </span>
          </div>
          <button
            onClick={displayRazorpay}
            style={payButton}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            💳 Pay ₹{totalAmount} & Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
