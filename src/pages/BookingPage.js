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

  useEffect(() => {
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
  }, [userId]);

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

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#007BFF" }}>
        <h2>⏳ Loading Profile...</h2>
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
        <h2>{error}</h2>
      </div>
    );

  if (!profile)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Profile not found.</h2>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "90vh",
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* HEADER SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #007BFF, #0056b3)",
          color: "#fff",
          borderRadius: "12px",
          padding: "25px 20px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          transition: "0.3s ease",
        }}
      >
        <img
          src={profile.avatar || "https://via.placeholder.com/120"}
          alt={profile.user?.name || "Senior"}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "3px solid #fff",
            marginBottom: "10px",
            objectFit: "cover",
          }}
        />
        <h2 style={{ fontSize: "1.8rem", fontWeight: "600" }}>
          {profile.user?.name}
        </h2>
        <p style={{ fontSize: "1rem", margin: "5px 0", opacity: 0.9 }}>
          {profile.college?.name || "N/A"} • {profile.branch} ({profile.year})
        </p>
      </div>

      {/* ABOUT ME */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ color: "#007BFF" }}>About Me</h3>
        <p style={{ color: "#555", lineHeight: "1.6" }}>{profile.bio}</p>
      </div>

      {/* TAGS */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#007BFF" }}>Specializations</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {profile.tags?.length ? (
            profile.tags.map((tag) => (
              <span
                key={tag._id}
                style={{
                  background: "#e9f2ff",
                  color: "#007BFF",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "0.3s",
                }}
              >
                #{tag.name}
              </span>
            ))
          ) : (
            <p style={{ color: "#555" }}>No tags listed.</p>
          )}
        </div>
      </div>

      {/* VERIFIED ID */}
      {profile.id_card_url && (
        <div
          style={{
            margin: "40px auto",
            textAlign: "center",
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#007BFF", marginBottom: "15px" }}>
            🎓 College Verified ID
          </h3>
          <img
            src={profile.id_card_url}
            alt="College ID Card"
            style={{
              width: "100%",
              maxWidth: "54mm",
              aspectRatio: "54 / 86",
              height: "auto",
              border: "2px solid #007BFF",
              borderRadius: "10px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
      )}

      {/* BOOKING DETAILS */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          padding: "20px",
          background: "#f1f7ff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ color: "#007BFF" }}>Booking Details</h3>
        <p style={{ color: "#555", marginTop: "10px", lineHeight: "1.5" }}>
          After payment, the senior will contact you within the next 6 hours.
        </p>

        <div
          style={{
            fontSize: "1.6rem",
            color: "#000",
            fontWeight: "600",
            margin: "20px 0",
          }}
        >
          ₹{totalAmount}{" "}
          <span style={{ fontSize: "1rem", color: "#666" }}>
            / {profile.session_duration_minutes} min
          </span>
        </div>

        <button
          onClick={displayRazorpay}
          style={{
            background: "#007BFF",
            color: "#fff",
            fontWeight: "600",
            padding: "12px 35px",
            borderRadius: "8px",
            fontSize: "1.1rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,123,255,0.3)",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.background = "#007BFF")}
        >
          💳 Pay ₹{totalAmount} & Book Now
        </button>
      </div>
    </div>
  );
}

export default BookingPage;
