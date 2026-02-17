import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 🟢 Auth use karein
import toast from "react-hot-toast";
import './BookingPage.css';

// --- फूटर कंपोनेंट (Same as before) ---
function Footer() {
  const companyLinks = [{ name: "About Us", href: "#" }, { name: "Careers", href: "#" }, { name: "Press Release", href: "#" }, { name: "Blog", href: "#" }];
  const supportLinks = [{ name: "Let Us Help You", href: "#" }, { name: "Help Center", href: "#" }, { name: "Your Account", href: "#" }, { name: "Report Issue", href: "#" }, { name: "Contact Us", href: "#" }];
  const studentLinks = [{ name: "Find Mentors", href: "#" }, { name: "Book a Session", href: "#" }, { name: "REAP Guide", href: "#" }, { name: "Learning Hub", href: "#" }];

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">Connecting students with amazing mentors.</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          {companyLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link">{link.name}</a>))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          {supportLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link">{link.name}</a>))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">For Students</h4>
          {studentLinks.map((link) => (<a key={link.name} href={link.href} className="footer-link">{link.name}</a>))}
        </div>
      </div>
      <div className="footer-copyright">© {new Date().getFullYear()} CollegeConnect. All Rights Reserved.</div>
    </footer>
  );
}

// --- मुख्य बुकिंग पेज कंपोनेंट ---
function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth(); // 🟢 Mock hata kar asli auth use karein

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🕒 Slot selection ke liye new states (Naya Backend logic)
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        // Backend Calls
        const [res, settingsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
          axios.get(`http://localhost:5000/api/settings`)
        ]);

        setProfile(res.data);
        const fee = res.data.price_per_session + (settingsRes.data.platformFee || 0);
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response?.data?.msg || err.message));
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  // 🔹 Time format converter (12h to 24h for backend)
  const convertTo24Hour = (time12h) => {
    if(!time12h) return "10:00";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = modifier === "PM" ? "12" : "00";
    else if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  };

  // --- Payment Handler ---
  const displayRazorpay = async () => {
    if (!auth.isAuthenticated) {
      toast.error("Please login to book.");
      navigate("/login");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a Date and Time Slot.");
      return;
    }

    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      
      // A. Create Order
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/order",
        { amount: totalAmount },
        { headers: { "x-auth-token": token } }
      );

      const order = orderRes.data;
      toast.dismiss(toastId);

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF",
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Booking with ${profile.user?.name}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying payment...");
          try {
            // 🟢 Naya Backend Format
            const bookingData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              mentorId: userId,
              date: selectedDate,
              time: convertTo24Hour(selectedSlot),
              amount: totalAmount,
              topic: "Mentorship Session"
            };

            await axios.post(
              "http://localhost:5000/api/payment/verify",
              bookingData,
              { headers: { "x-auth-token": token } }
            );

            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed!");
            navigate("/student-dashboard/bookings");
          } catch (err) {
            toast.dismiss(verifyToastId);
            toast.error("Verification failed. Contact support.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#7c3aed" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error creating order.");
    }
  };

  if (loading) return <div className="page-container loading-container"><h2>⏳ Loading...</h2></div>;
  if (error) return <div className="page-container loading-container"><h2 className="error-text">❌ {error}</h2></div>;

  return (
    <div className="page-container">
      <div className="layout-container">
        {/* LEFT COLUMN */}
        <div className="main-content">
          <div className="card profile-header">
            <img src={profile.avatar || "https://via.placeholder.com/120"} alt="avatar" className="avatar" />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="profile-college">{profile.college?.name}</p>
            <p className="profile-branch">{profile.branch} ({profile.year})</p>
          </div>

          {/* 🕒 NEW: Slot Selection UI */}
          <div className="card">
            <h3 className="card-heading">📅 Select Schedule</h3>
            <div className="input-group">
              <label>Pick a Date</label>
              <input 
                type="date" 
                className="cc-input" 
                min={new Date().toISOString().split("T")[0]} 
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="input-group" style={{marginTop: "15px"}}>
              <label>Pick a Time</label>
              <div className="slots-grid" style={{display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px"}}>
                {["10:00 AM", "12:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"].map(slot => (
                  <button 
                    key={slot} 
                    className={`cc-chip ${selectedSlot === slot ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-heading">👤 About Me</h3>
            <p className="card-bio">{profile.bio}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="sidebar">
          <div className="card booking-card">
            <h3>Book Session</h3>
            <div className="price-box">
              <span className="price-text">₹{totalAmount}</span>
              <span className="duration-text">/ 30 min</span>
            </div>
            <button onClick={displayRazorpay} className="cc-btn primary" style={{width: "100%", marginTop: "20px"}}>
              🔒 Pay & Book Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;