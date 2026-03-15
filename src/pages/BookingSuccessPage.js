import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function BookingSuccessPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [hover, setHover] = useState(false);
  
  // 🚀 NEW: Payment Verification States
  const [verifying, setVerifying] = useState(true);
  const [verifyError, setVerifyError] = useState("");
  const location = useLocation();

  // 🔝 सबसे ऊपर स्क्रोल करने वाला कोड (Scroll to Top)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); 
  }, []);

  // ✅ Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==========================================
  // 🚀 INSTAMOJO PAYMENT VERIFICATION LOGIC
  // ==========================================
  useEffect(() => {
    const verifyPayment = async () => {
      // 1. URL से Instamojo के पैरामीटर्स निकालें
      const queryParams = new URLSearchParams(location.search);
      const payment_id = queryParams.get("payment_id");
      const payment_status = queryParams.get("payment_status");
      const payment_request_id = queryParams.get("payment_request_id");

      // अगर URL में payment_id नहीं है, मतलब यह 'फ्री बुकिंग' है या सीधा पेज खोला गया है
      if (!payment_id) {
        setVerifying(false);
        return;
      }

      // अगर पेमेंट फेल हो गया हो
      if (payment_status && payment_status !== "Credit") {
        setVerifyError("Payment was not successful. Status: " + payment_status);
        setVerifying(false);
        return;
      }

      try {
        // 2. LocalStorage से बुकिंग डिटेल्स निकालें जो हमने BookingPage पर सेव की थी
        const bookingString = localStorage.getItem("pendingBookingDetails");
        const bookingDetails = bookingString ? JSON.parse(bookingString) : null;
        const token = localStorage.getItem("token");

        // 3. Backend को वेरीफाई करने और डेटाबेस में सेव करने के लिए भेजें
        await axios.post(
          "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
          { payment_id, payment_request_id, bookingDetails },
          { headers: { "x-auth-token": token } }
        );

        // 4. सक्सेस होने पर LocalStorage साफ़ कर दें
        localStorage.removeItem("pendingBookingDetails");
        setVerifying(false);

      } catch (err) {
        console.error("Verification Error:", err);
        setVerifyError(err.response?.data?.msg || "Payment verification failed!");
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location.search]);


  // 🎊 Confetti Animation using Canvas (सिर्फ तब चलेगा जब वेरीफाई हो जाए)
  useEffect(() => {
    if (verifying || verifyError) return; // जब तक लोडिंग या एरर है, कनफेटी मत चलाओ

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let confetti = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      r: Math.random() * 6 + 2,
      d: Math.random() * 1 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
      });
      update();
    }

    function update() {
      confetti.forEach((c) => {
        c.y += c.d;
        if (c.y > window.innerHeight) {
          c.y = -10;
          c.x = Math.random() * window.innerWidth;
        }
      });
    }

    const animation = setInterval(draw, 20);
    return () => {
      clearInterval(animation);
      if(document.body.contains(canvas)) document.body.removeChild(canvas);
    };
  }, [verifying, verifyError]);

  // 🎨 Inline Styles
  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #3b82f6, #2563eb, #1e3a8a)",
      fontFamily: "'Poppins', sans-serif",
      padding: isMobile ? "1.5rem" : "3rem",
      textAlign: "center",
      color: "#333",
      animation: "fadeIn 1s ease",
    },
    card: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "20px",
      padding: isMobile ? "2rem 1rem" : "3rem 2.5rem",
      width: isMobile ? "90%" : "480px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      transform: "scale(1)",
      animation: "popIn 0.8s ease",
    },
    successCircle: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      margin: "0 auto 1.5rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 6px 20px rgba(34,197,94,0.4)",
      animation: "pulse 2s infinite ease-in-out",
    },
    errorCircle: {
      width: "90px",
      height: "90px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #ef4444, #dc2626)",
      margin: "0 auto 1.5rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 6px 20px rgba(239,68,68,0.4)",
    },
    checkmark: {
      fontSize: "2.5rem",
      color: "white",
    },
    heading: {
      fontSize: isMobile ? "1.9rem" : "2.4rem",
      color: "#16a34a",
      fontWeight: "700",
      marginBottom: "0.5rem",
      animation: "fadeIn 1.2s ease",
    },
    headingError: {
      fontSize: isMobile ? "1.9rem" : "2.2rem",
      color: "#dc2626",
      fontWeight: "700",
      marginBottom: "0.5rem",
    },
    message: {
      fontSize: isMobile ? "1.1rem" : "1.3rem",
      color: "#111827",
      fontWeight: "600",
      marginBottom: "0.8rem",
      lineHeight: "1.6",
    },
    note: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      color: "#555",
      marginTop: "0.5rem",
      fontWeight: "400",
    },
    button: {
      display: "inline-block",
      marginTop: "1.8rem",
      padding: "0.9rem 1.8rem",
      background: "linear-gradient(45deg, #2563eb, #1d4ed8)",
      color: "white",
      fontWeight: "600",
      border: "none",
      borderRadius: "10px",
      fontSize: isMobile ? "0.95rem" : "1rem",
      textDecoration: "none",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
    },
    buttonHover: {
      transform: "translateY(-2px) scale(1.05)",
      boxShadow: "0 8px 15px rgba(37,99,235,0.3)",
    },
  };

  // 🎬 Add animations globally
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.7); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(34,197,94,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
      }
      .loader {
        border: 6px solid #f3f3f3; border-top: 6px solid #3b82f6; border-radius: 50%;
        width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
    return () => { if(document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  // ⏳ 1. Loading State UI
  if (verifying) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div className="loader"></div>
          <h2 style={{...styles.heading, color: "#2563eb"}}>Verifying...</h2>
          <p style={styles.message}>Please wait while we confirm your payment securely.</p>
        </div>
      </div>
    );
  }

  // ❌ 2. Error State UI
  if (verifyError) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.errorCircle}>
            <span style={styles.checkmark}>✖</span>
          </div>
          <h2 style={styles.headingError}>Payment Failed</h2>
          <p style={styles.message}>{verifyError}</p>
          <p style={styles.note}>If amount was deducted, it will be refunded automatically.</p>
          <Link to="/student-dashboard" style={styles.button}>🔙 Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  // ✅ 3. Success State UI (Original)
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Success Circle */}
        <div style={styles.successCircle}>
          <span style={styles.checkmark}>✔</span>
        </div>

        {/* 🥳 Message Section */}
        <h2 style={styles.heading}>Booking Confirmed!</h2>
        <p style={styles.message}>
          The Senior will contact you within <b>12 hours</b>.
        </p>
        <p style={styles.note}>
          कृपया अपनी <b>My Bookings</b> सेक्शन (जो <b>Student Dashboard</b> में है)
          को समय-समय पर चेक करते रहें।
        </p>

        {/* 🔗 Return Button */}
        <Link
          to="/student-dashboard"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
        >
          🔙 Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default BookingSuccessPage;