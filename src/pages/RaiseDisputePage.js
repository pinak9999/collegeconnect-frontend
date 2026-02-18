import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RaiseDisputePage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [reasonId, setReasonId] = useState("");
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  // 🔹 Fetch Dispute Reasons
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons",
          { headers: { "x-auth-token": token } }
        );
        setReasons(res.data);
      } catch {
        toast.error("⚠️ Failed to load dispute reasons.");
      } finally {
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonId) return toast.error("Please select a reason.");

    const toastId = toast.loading("Submitting dispute...");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/raise/${bookingId}`,
        { reasonId },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("✅ Dispute raised successfully!");
      navigate("/student-dashboard/bookings");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  // 🎨 Modern Inline Styles
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
      fontFamily: "'Poppins', sans-serif",
      color: "#fff",
    },
    card: {
      width: "100%",
      maxWidth: "430px",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.15))",
      backdropFilter: "blur(12px)",
      borderRadius: "20px",
      padding: "2rem",
      boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: hover ? "scale(1.02)" : "scale(1)",
    },
    heading: {
      fontSize: "1.9rem",
      fontWeight: 700,
      textAlign: "center",
      background: "linear-gradient(45deg,#f43f5e,#f97316)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textShadow: "0 2px 10px rgba(255, 100, 100, 0.4)",
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      color: "#e2e8f0",
      fontWeight: 500,
      fontSize: "1rem",
      marginBottom: "8px",
    },
    select: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.15)",
      color: "#fff",
      fontSize: "1rem",
      border: focus ? "2px solid #f43f5e" : "1.5px solid rgba(255,255,255,0.2)",
      outline: "none",
      marginBottom: "1.2rem",
      transition: "all 0.3s ease",
    },
    option: {
      backgroundColor: "#1e293b",
      color: "#fff",
    },
    button: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      fontWeight: "600",
      background: hover
        ? "linear-gradient(45deg,#ef4444,#f97316)"
        : "linear-gradient(45deg,#f43f5e,#b91c1c)",
      color: "#fff",
      cursor: "pointer",
      boxShadow: hover
        ? "0 8px 20px rgba(244,63,94,0.4)"
        : "0 4px 10px rgba(0,0,0,0.25)",
      transform: hover ? "translateY(-2px)" : "translateY(0)",
      transition: "all 0.3s ease",
    },
    footer: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "0.9rem",
      color: "#94a3b8",
    },
  };

  if (loading)
    return (
      <div style={styles.container}>
        <h2>⏳ Loading Dispute Reasons...</h2>
      </div>
    );

  return (
    <div style={styles.container}>
      <div
        style={styles.card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h2 style={styles.heading}>⚠️ Raise a Dispute</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Select Reason</label>
          <select
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={styles.select}
            required
          >
            <option value="" disabled>
              Choose a reason
            </option>
            {reasons.map((r) => (
              <option key={r._id} value={r._id} style={styles.option}>
                {r.reason}
              </option>
            ))}
          </select>

          <button type="submit" style={styles.button}>
            🚀 Submit Dispute
          </button>
        </form>

        <p style={styles.footer}>
          Once submitted, our team will review your issue within 48 hours.
        </p>
      </div>
    </div>
  );
}

export default RaiseDisputePage;
