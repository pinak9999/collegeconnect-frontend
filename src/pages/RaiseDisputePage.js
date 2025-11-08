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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  // 🧩 Responsive Check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        toast.error("Failed to load dispute reasons.");
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
      toast.success("Dispute raised successfully!");
      navigate("/student-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        "Error: " + (err.response ? err.response.data.msg : err.message)
      );
    }
  };

  // 💎 Inline Styles (Vercel Safe)
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1a1a1a, #520000, #ff0000)",
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
      padding: "1rem",
    },
    card: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: isMobile ? "1.5rem" : "2.5rem",
      width: isMobile ? "90%" : "420px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      transform: hover ? "scale(1.02)" : "scale(1)",
    },
    heading: {
      fontSize: isMobile ? "1.8rem" : "2rem",
      fontWeight: 700,
      textAlign: "center",
      color: "#fff",
      textShadow: "0 0 8px rgba(255, 50, 50, 0.6)",
      marginBottom: "1.2rem",
    },
    label: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#ddd",
      marginBottom: "0.5rem",
      display: "block",
    },
    select: {
      width: "100%",
      padding: "0.9rem",
      borderRadius: "12px",
      border: focus
        ? "2px solid #ff4d4d"
        : "2px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.12)",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    button: {
      width: "100%",
      marginTop: "1.5rem",
      padding: "0.9rem",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      background: hover
        ? "linear-gradient(45deg,#ff4d4d,#ff9999)"
        : "linear-gradient(45deg,#ff1e1e,#c0392b)",
      color: "#fff",
      boxShadow: hover
        ? "0 8px 20px rgba(255,77,77,0.4)"
        : "0 4px 12px rgba(0,0,0,0.3)",
      transform: hover ? "translateY(-3px)" : "translateY(0)",
      transition: "all 0.3s ease",
    },
  };

  // ⏳ Loader
  if (loading)
    return (
      <div style={styles.container}>
        <h2>Loading Dispute Reasons...</h2>
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
              Choose a Reason
            </option>
            {reasons.map((r) => (
              <option key={r._id} value={r._id}>
                {r.reason}
              </option>
            ))}
          </select>

          <button type="submit" style={styles.button}>
            Submit Dispute
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseDisputePage;
