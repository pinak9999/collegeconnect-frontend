import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RateBookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review_text, setReviewText] = useState("");
  const [hover, setHover] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  // ✅ Responsive setup
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.error("Please select a star rating (1–5).");
    }

    const isConfirmed = window.confirm(
      "⚠️ WARNING: After giving a rating, you CANNOT raise a dispute for this booking.\n" +
        "(चेतावनी: रेटिंग देने के बाद, आप इस बुकिंग के लिए फिर कभी विवाद नहीं कर पाएंगे।)"
    );

    if (!isConfirmed) return;

    const toastId = toast.loading("Submitting rating...");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/ratings/submit/${bookingId}`,
        { rating, review_text },
        { headers: { "x-auth-token": token } }
      );

      toast.dismiss(toastId);
      toast.success("⭐ Rating submitted! Thank you.");
      navigate("/student-dashboard/bookings");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        "Error: " + (err.response ? err.response.data.msg : err.message)
      );
    }
  };

  // 🎨 Inline Styles
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #007bff 0%, #00b4d8 50%, #023e8a 100%)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1rem" : "2rem",
      transition: "all 0.3s ease",
    },
    card: {
      background: "rgba(255,255,255,0.95)",
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
    textarea: {
      width: "100%",
      padding: "0.8rem",
      border: "1.8px solid #ddd",
      borderRadius: "12px",
      fontSize: "0.95rem",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      resize: "none",
    },
    textareaFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 8px rgba(37,99,235,0.4)",
    },
    starsContainer: {
      display: "flex",
      justifyContent: "center",
      fontSize: isMobile ? "35px" : "45px",
      cursor: "pointer",
      margin: "10px 0 20px 0",
      transition: "all 0.2s ease",
    },
    star: {
      transition: "transform 0.2s ease",
      margin: "0 4px",
    },
    starHover: {
      transform: "scale(1.3)",
    },
    button: {
      width: "100%",
      padding: "0.9rem",
      background: "linear-gradient(45deg, #2563eb, #1e40af)",
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
      boxShadow: "0 8px 15px rgba(37,99,235,0.4)",
    },
  };

  return (
    <div style={styles.page}>
      <div
        style={{ ...styles.card, ...(cardHover ? styles.cardHover : {}) }}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
      >
        <h2 style={styles.title}>Rate Your Session ⭐</h2>
        <form onSubmit={onSubmitHandler}>
          <div style={styles.formGroup}>
            <label style={{ ...styles.label, textAlign: "center" }}>
              Rating (1–5 Stars)
            </label>
            <div style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={starValue}
                    style={{
                      ...styles.star,
                      color:
                        starValue <= (hover || rating)
                          ? "#f39c12"
                          : "#e0e0e0",
                      ...(hover === starValue ? styles.starHover : {}),
                    }}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(null)}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Review (Optional)</label>
            <textarea
              name="review_text"
              value={review_text}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              placeholder="Write your feedback..."
              style={{
                ...styles.textarea,
                ...(hover === "textarea" ? styles.textareaFocus : {}),
              }}
              onFocus={() => setHover("textarea")}
              onBlur={() => setHover(null)}
            ></textarea>
          </div>

          <button
            type="submit"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{ ...styles.button, ...(btnHover ? styles.buttonHover : {}) }}
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
}

export default RateBookingPage;
