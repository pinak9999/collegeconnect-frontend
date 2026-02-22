import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";
import './BookingPage.css';

// --- फूटर कंपोनेंट ---
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

// 📅 Helper: Get Today's Date in YYYY-MM-DD format
const getFormattedDate = (dateObj) => {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// --- मुख्य बुकिंग पेज कंपोनेंट ---
function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ⭐ Mock AuthContext
  const { auth } = { auth: { user: { name: "Mock User", email: "mock.user@example.com" } } };
  // const { auth } = useAuth(); // Asal app mein ise uncomment karein

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🚀 NEW STATES: Calendar and Slots ke liye
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        const [res, settingsRes, allProfilesRes] = await Promise.all([
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`),
          axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/all`, { headers: { "x-auth-token": token } }),
        ]);

        const singleProfileData = res.data;
        const matchingProfileFromAll = allProfilesRes.data.find((p) => p.user?._id === userId);
        const combinedProfile = { ...singleProfileData, ...matchingProfileFromAll, user: singleProfileData.user || matchingProfileFromAll.user, college: singleProfileData.college || matchingProfileFromAll.college };

        setProfile(combinedProfile);
        setTotalAmount(combinedProfile.price_per_session + settingsRes.data.platformFee);
        setLoading(false);
      } catch (err) {
        setError("Error: " + (err.response ? err.response.data.msg || err.response.data : err.message));
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  // 🚀 NEW EFFECT: Fetch Slots whenever Date changes
  useEffect(() => {
    if (!profile?.user?._id || !selectedDate) return;

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setAvailabilityMsg("");
      setSlots([]);
      setSelectedTime(""); // Nayi date par select kiya hua time reset karo

      try {
        const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/bookings/available-slots/${profile.user._id}/${selectedDate}`);
        if (res.data.msg) setAvailabilityMsg(res.data.msg);
        if (res.data.slots) setSlots(res.data.slots);
      } catch (err) {
        console.error("Failed to fetch slots", err);
        setAvailabilityMsg("Failed to load time slots.");
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, profile]);

  // --- Payment Handler ---
  const displayRazorpay = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    // 🚀 NEW VALIDATION: Time slot select kiya hai ya nahi?
    if (!selectedDate || !selectedTime) {
      return toast.error("Please select a date and time slot first! ⏰");
    }

    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      amount: totalAmount,
      duration: profile.session_duration_minutes,
      // 🚀 Nayi Data Send kar rahe hain:
      meetingDate: selectedDate,
      meetingTime: selectedTime,
      slot_time: new Date(`${selectedDate} ${selectedTime}`) // Fallback Date object
    };

    const toastId = toast.loading("Creating your order...");
    try {
      const token = localStorage.getItem("token");
      const orderRes = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/payment/order",
        { amount: totalAmount }, // Make sure to send amount here
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
          const verifyToastId = toast.loading("Verifying payment & securing your slot...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails },
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed! 🎉");
            navigate("/booking-success"); // Ya student dashboard
          } catch {
            toast.dismiss(verifyToastId);
            toast.error("Payment Verification Failed.");
          }
        },
        prefill: { name: auth.user.name, email: auth.user.email },
        theme: { color: "#10B981" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error creating order.");
    }
  };

  if (loading) return <div className="page-container loading-container"><h2>⏳ Loading Booking Page...</h2></div>;
  if (error) return <div className="page-container loading-container"><h2 className="error-text">❌ {error}</h2></div>;
  if (!profile) return <div className="page-container loading-container"><h2>Profile not found.</h2></div>;

  return (
    <div className="page-container">
      <div className="layout-container">
        
        {/* LEFT COLUMN (Info) */}
        <div className="main-content">
          <div className="card profile-header">
            <img src={profile.avatar || "https://via.placeholder.com/120"} alt={profile.user?.name || "Senior"} className="avatar" />
            <h2 className="profile-name">{profile.user?.name}</h2>
            <p className="profile-college">{profile.college?.name || "N/A"}</p>
            <p className="profile-branch">{profile.branch} ({profile.year})</p>
          </div>

          <div className="card">
            <h3 className="card-heading"><span className="heading-icon">👤</span> About Me</h3>
            <p className="card-bio">{profile.bio}</p>
          </div>

          <div className="card">
            <h3 className="card-heading"><span className="heading-icon">🏷️</span> Specializations</h3>
            <div className="tags-container">
              {profile.tags?.length ? profile.tags.map((tag) => (<span key={tag._id} className="tag">{tag.name}</span>)) : <p className="no-tags-text">No tags listed.</p>}
            </div>
          </div>

          {profile.id_card_url && (
            <div className="card">
              <h3 className="card-heading verified-heading"><span className="heading-icon">🎓</span> College Verified ID<span className="verified-icon">✓</span></h3>
              <img src={profile.id_card_url} alt="College ID" className="id-card-image" />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Booking - 🚀 MAGIC HAPPENS HERE) */}
        <div className="sidebar">
          <div className="card booking-card" style={{ padding: "20px" }}>
            <h3 className="booking-title" style={{ marginBottom: "15px" }}>Book a Session</h3>
            
            {/* 📅 Date Picker */}
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
               <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>1. Select Date</label>
               <input 
                  type="date" 
                  min={getFormattedDate(new Date())} // Aaj se pehle ka din select nahi kar sakte
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", cursor: "pointer" }}
               />
            </div>

            {/* ⏰ Time Slots Grid */}
            <div style={{ marginBottom: "25px", textAlign: "left" }}>
               <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>2. Select Time Slot</label>
               
               {slotsLoading ? (
                  <div style={{ padding: "15px", textAlign: "center", color: "#6b7280", background: "#f3f4f6", borderRadius: "10px" }}>Loading slots... ⏳</div>
               ) : slots.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                     {slots.map((slot, idx) => (
                        <button 
                           key={idx}
                           disabled={slot.isBooked}
                           onClick={() => setSelectedTime(slot.time)}
                           style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: selectedTime === slot.time ? "2px solid #2563EB" : "1px solid #e5e7eb",
                              background: slot.isBooked ? "#f3f4f6" : (selectedTime === slot.time ? "#eff6ff" : "#fff"),
                              color: slot.isBooked ? "#9ca3af" : (selectedTime === slot.time ? "#1e40af" : "#374151"),
                              fontWeight: "600",
                              cursor: slot.isBooked ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                           }}
                        >
                           {slot.time} {slot.isBooked && "🔒"}
                        </button>
                     ))}
                  </div>
               ) : (
                  <div style={{ padding: "15px", textAlign: "center", color: "#dc2626", background: "#fef2f2", borderRadius: "10px", fontSize: "14px", fontWeight: "500" }}>
                     {availabilityMsg || "Senior is not available on this day."}
                  </div>
               )}
            </div>

            <div className="price-box" style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
              <span className="price-text" style={{ fontSize: "24px", color: "#10B981" }}>₹{totalAmount}</span>
              <span className="duration-text" style={{ display: "block", color: "#64748b", fontSize: "13px", marginTop: "4px" }}>For {profile.session_duration_minutes} mins 1-on-1 Session</span>
            </div>

            <button 
               onClick={displayRazorpay} 
               className="book-button"
               disabled={!selectedTime} // Bina time select kiye pay nahi kar sakta
               style={{ opacity: !selectedTime ? 0.6 : 1, cursor: !selectedTime ? "not-allowed" : "pointer", padding: "14px", fontSize: "16px", borderRadius: "10px" }}
            >
              <span className="button-icon">🔒</span> {selectedTime ? `Pay ₹${totalAmount} & Book` : "Select a time slot"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;