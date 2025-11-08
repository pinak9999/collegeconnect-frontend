import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RaiseDisputePage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [reasonId, setReasonId] = useState("");
  const [allReasons, setAllReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusInput, setFocusInput] = useState(null);
  const [cardHover, setCardHover] = useState(false);

  // ✅ Responsive Handling
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ✅ Fetch Dispute Reasons
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons",
          {
            headers: { "x-auth-token": token },
          }
        );
        setAllReasons(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load reasons.");
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!reasonId) return toast.error("Please select a reason for the dispute.");

    const toastId = toast.loading("Submitting dispute...");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/raise/${bookingId}`,
        { reasonId },
        { headers: { "x-auth-token": token } }
      );

      toast.dismiss(toastId);
      toast.success("Dispute raised. Admin will review it shortly.");
      navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        "Error: " + (err.response ? err.response.data.msg : err.message)
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.5rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // 🎨 Inline Styles
  const styles = {
    page: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #023e8a 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1rem" : "2rem",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      padding: isMobile ? "1.5rem" : "2.5rem",
      borderRadius: "1.5rem",
      width: isMobile ? "90%" : "420px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    cardHover: {
      transform: "translateY(-6px)",
      boxShadow: "0 25px 45px rgba(0,0,0,0.25)",
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2rem",
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "1.2rem",
    },
    formGroup: {
      textAlign: "left",
      marginBottom: "1.2rem",
    },
    label: {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#333",
      marginBottom: "0.4rem",
      display: "block",
    },
    select: {
      width: "100%",
      padding: "0.8rem",
      border: "1.8px solid #ddd",
      borderRadius: "12px",
      fontSize: "0.95rem",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    selectFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 8px rgba(37,99,235,0.4)",
    },
    button: {
      width: "100%",
      padding: "0.9rem",
      background: "linear-gradient(45deg, #e74c3c, #c0392b)",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "0.8rem",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(231, 76, 60, 0.4)",
    },
  };

  return (
    <div style={styles.page}>
      <div
        style={{ ...styles.card, ...(cardHover ? styles.cardHover : {}) }}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <h2 style={styles.title}>Raise a Dispute ⚠️</h2>
        <form onSubmit={onSubmitHandler}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason for Dispute</label>
            <select
              value={reasonId}
              onChange={(e) => setReasonId(e.target.value)}
              required
              style={{
                ...styles.select,
                ...(focusInput === "reason" ? styles.selectFocus : {}),
              }}
              onFocus={() => setFocusInput("reason")}
              onBlur={() => setFocusInput(null)}
            >
              <option value="" disabled>
                Select a Reason
              </option>
              {allReasons.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.reason}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
          >
            Submit Dispute
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseDisputePage;
