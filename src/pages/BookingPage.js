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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to continue.");
          setLoading(false);
          return;
        }

        const [res, settingsRes] = await Promise.all([
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, {
            headers: { "x-auth-token": token },
          }),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`),
        ]);

        const total = res.data.price_per_session + settingsRes.data.platformFee;
        setProfile(res.data);
        setTotalAmount(total);
      } catch (err) {
        const msg = err.response ? err.response.data.msg || err.response.data : err.message;
        setError("Error: " + msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => window.removeEventListener("resize", handleResize);
  }, [userId]);

  const displayRazorpay = async () => {
    if (!auth.user) {
      toast.error("Please login to book this session!");
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
        description: `Booking with ${profile.user.name}`,
        order_id: order.id,
        handler: async (response) => {
          const verifyToast = toast.loading("Verifying payment...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails: { senior: profile.user._id, amount: totalAmount } },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToast);
            toast.success("Booking Confirmed 🎉");
            navigate("/booking-success");
          } catch {
            toast.dismiss(verifyToast);
            toast.error("Payment verification failed!");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#007BFF" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error creating order. " + (err.response?.data?.msg || err.message));
    }
  };

  // ---------- 🎨 INLINE STYLES (Adaptive) ------------
  const layout = {
    maxWidth: 1200,
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "20px" : "40px",
  };
  const card = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    padding: isMobile ? "20px" : "28px",
    marginBottom: "24px",
    transition: "transform .25s ease, box-shadow .25s ease",
  };
  const avatar = {
    width: isMobile ? 100 : 120,
    height: isMobile ? 100 : 120,
    borderRadius: "50%",
    border: "4px solid #007BFF",
    marginBottom: 15,
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };
  const name = { fontSize: isMobile ? "1.6rem" : "2rem", margin: "0 0 6px 0", fontWeight: 600 };
  const info = { color: "#555", fontSize: "1rem", margin: "2px 0" };
  const tag = {
    background: "#e9f2ff",
    color: "#007BFF",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: "0.9rem",
    fontWeight: 500,
  };
  const payBtn = {
    background: "linear-gradient(135deg,#007BFF,#0056b3)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    padding: "14px 20px",
    borderRadius: 12,
    width: "100%",
    fontSize: "1.1rem",
    boxShadow: "0 6px 15px rgba(0,123,255,0.3)",
    cursor: "pointer",
    transition: "transform .25s ease, background .25s ease",
  };

  // ---------- 🧭 STATES ----------
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#007BFF" }}>
        <h2>⏳ Loading booking details...</h2>
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "100px" }}>
        <h3>{error}</h3>
      </div>
    );

  if (!profile)
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>Profile not found.</h3>
      </div>
    );

  // ---------- 🚀 RENDER ----------
  return (
    <div style={layout}>
      {/* LEFT SECTION */}
      <div style={{ flex: isMobile ? "1" : "2" }}>
        {/* Profile Card */}
        <div style={{ ...card, textAlign: "center" }}>
          <img
            src={profile.avatar || "https://via.placeholder.com/120"}
            alt={profile.user?.name || "Senior"}
            style={avatar}
          />
          <h2 style={name}>{profile.user?.name}</h2>
          <p style={info}>{profile.college?.name || "N/A"}</p>
          <p style={info}>
            {profile.branch} ({profile.year})
          </p>
        </div>

        {/* About */}
        <div style={card}>
          <h3 style={{ color: "#007BFF", marginBottom: 10 }}>👤 About Me</h3>
          <p style={{ color: "#555", lineHeight: 1.7 }}>{profile.bio || "No bio provided."}</p>
        </div>

        {/* Specializations */}
        <div style={card}>
          <h3 style={{ color: "#007BFF", marginBottom: 12 }}>🏷️ Specializations</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {profile.tags?.length ? (
              profile.tags.map((t) => (
                <span key={t._id} style={tag}>
                  #{t.name}
                </span>
              ))
            ) : (
              <p style={{ color: "#555" }}>No tags listed.</p>
            )}
          </div>
        </div>

        {/* College ID */}
        {profile.id_card_url && (
          <div style={{ ...card, textAlign: "center" }}>
            <h3 style={{ color: "#007BFF", marginBottom: 14 }}>🎓 College Verified ID</h3>
            <img
              src={profile.id_card_url}
              alt="College ID Card"
              style={{
                maxWidth: 250,
                width: "100%",
                borderRadius: 12,
                border: "2px solid #007BFF",
                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div style={{ flex: 1, position: isMobile ? "relative" : "sticky", top: isMobile ? 0 : 80 }}>
        <div style={card}>
          <h3 style={{ color: "#007BFF", fontSize: "1.5rem", marginBottom: 12 }}>
            Book This Session
          </h3>
          <p style={{ color: "#555", fontSize: "0.95rem", marginBottom: 18 }}>
            After payment, the senior will contact you within 6 hours to schedule the time.
          </p>
          <div style={{ textAlign: "center", margin: "25px 0" }}>
            <span style={{ fontSize: "2.2rem", fontWeight: 700 }}>₹{totalAmount}</span>
            <span style={{ color: "#666", fontSize: "1rem", marginLeft: 6 }}>
              / {profile.session_duration_minutes} min
            </span>
          </div>
          <button
            onClick={displayRazorpay}
            style={payBtn}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            💳 Pay ₹{totalAmount} & Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
