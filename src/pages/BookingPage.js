import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";
import './BookingPage.css';

// --- फूटर कंपोनेंट ---
function Footer() {
  const companyLinks = [
    { name: "About Us", href: "#" }, { name: "Careers", href: "#" }, { name: "Press Release", href: "#" }, { name: "Blog", href: "#" },
  ];
  const supportLinks = [
    { name: "Let Us Help You", href: "#" }, { name: "Help Center", href: "#" }, { name: "Your Account", href: "#" }, { name: "Report Issue", href: "#" }, { name: "Contact Us", href: "#" },
  ];
  const studentLinks = [
    { name: "Find Mentors", href: "#" }, { name: "Book a Session", href: "#" }, { name: "REAP Guide", href: "#" }, { name: "Learning Hub", href: "#" },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">Connecting students with amazing mentors.</p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          {companyLinks.map((link) => <a key={link.name} href={link.href} className="footer-link">{link.name}</a>)}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          {supportLinks.map((link) => <a key={link.name} href={link.href} className="footer-link">{link.name}</a>)}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">For Students</h4>
          {studentLinks.map((link) => <a key={link.name} href={link.href} className="footer-link">{link.name}</a>)}
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

  // ⭐ Mock AuthContext
  const { auth } = {
    auth: { user: { name: "Mock User", email: "mock.user@example.com" } },
  };
  // const { auth } = useAuth(); // Asal app mein ise uncomment karein

  // --- States ---
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🚀 NEW: Date & Slot States
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- 1. Load Profile Data ---
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        // NOTE: Agar bina login ke access allow karna hai, to token check hata sakte ho
        // if (!token) { setLoading(false); setError("Error: You are not logged in."); return; }

        const baseUrl = "https://collegeconnect-backend-mrkz.onrender.com";

        const [res, settingsRes, allProfilesRes] = await Promise.all([
          axios.get(`${baseUrl}/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
          axios.get(`${baseUrl}/api/settings`),
          axios.get(`${baseUrl}/api/profile/all`, { headers: { "x-auth-token": token } }),
        ]);

        const singleProfileData = res.data;
        const allProfilesData = allProfilesRes.data;
        const matchingProfileFromAll = allProfilesData.find((p) => p.user?._id === userId);

        const combinedProfile = {
          ...singleProfileData,
          ...matchingProfileFromAll,
          user: singleProfileData.user || matchingProfileFromAll.user,
          college: singleProfileData.college || matchingProfileFromAll.college,
        };

        setProfile(combinedProfile);
        const fee = combinedProfile.price_per_session + settingsRes.data.platformFee;
        setTotalAmount(fee);
        setLoading(false);
      } catch (err) {
        let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
        setError("Error: " + errorMsg);
        setLoading(false);
      }
    };
    loadPageData();
  }, [userId]);

  // --- 2. 🚀 NEW: Fetch Slots when Date Changes ---
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !profile) return;
      
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);

      try {
        const token = localStorage.getItem("token");
        const baseUrl = "https://collegeconnect-backend-mrkz.onrender.com";
        
        // 🔥 Yahan hum naye backend route ko call kar rahe hain
        const res = await axios.get(
          `${baseUrl}/api/bookings/available-slots/${profile.user._id}/${selectedDate}`,
          { headers: { "x-auth-token": token } }
        );

        if (res.data.slots) {
          setAvailableSlots(res.data.slots);
          if (res.data.slots.length === 0) {
             // Agar array khali hai matlab ya to chutti hai ya slot nahi hai
             toast("No slots available on this date.", { icon: "📅" });
          }
        }
      } catch (err) {
        console.error("Slot fetch error", err);
        toast.error("Could not fetch slots.");
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, profile]);


  // --- 3. Payment Handler (Updated) ---
  const displayRazorpay = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to book.");
      navigate("/login");
      return;
    }

    // 🚀 Check: Date & Time selected?
    if (!selectedDate || !selectedSlot) {
        toast.error("Please select a Date and Time first! 🗓️");
        return;
    }

    // 🚀 Updated Booking Details with Date & Time
    const bookingDetails = {
      senior: profile.user._id,
      profileId: profile._id,
      meetingDate: selectedDate, // New
      meetingTime: selectedSlot, // New
      slot_time: new Date(), // (Legacy field, ignore)
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
        description: `Session with ${profile.user ? profile.user.name : "Senior"}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyToastId = toast.loading("Verifying payment...");
          try {
            await axios.post(
              "https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify",
              { ...response, bookingDetails }, // Pass updated details here
              { headers: { "x-auth-token": token } }
            );
            toast.dismiss(verifyToastId);
            toast.success("Booking Confirmed! 🎉");
            navigate("/booking-success");
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
      let errorMsg = err.response ? err.response.data.msg || err.response.data : err.message;
      toast.error("Error creating order. " + errorMsg);
    }
  };

  // --- Render Handling ---
  if (loading) return <div className="page-container loading-container"><h2>⏳ Loading Profile...</h2></div>;
  if (error) return <div className="page-container loading-container"><h2 className="error-text">❌ {error}</h2></div>;
  if (!profile) return <div className="page-container loading-container"><h2>Profile not found.</h2></div>;

  return (
    <div className="page-container">
      <div className="layout-container">
        
        {/* LEFT COLUMN (Info) */}
        <div className="main-content">
          <div className="card profile-header">
            <img src={profile.avatar || "https://via.placeholder.com/120"} alt="Avatar" className="avatar" />
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
              {profile.tags?.length ? profile.tags.map((tag) => <span key={tag._id} className="tag">{tag.name}</span>) : <p className="no-tags-text">No tags listed.</p>}
            </div>
          </div>
          
          {profile.id_card_url && (
            <div className="card">
              <h3 className="card-heading verified-heading"><span className="heading-icon">🎓</span> Verified ID <span className="verified-icon">✓</span></h3>
              <img src={profile.id_card_url} alt="College ID" className="id-card-image" />
            </div>
          )}
        </div>

        {/* ------------------- 
            RIGHT COLUMN (Booking Interface) 
           ------------------- */}
        <div className="sidebar">
          <div className="card booking-card">
            <h3 className="booking-title">Book a Session</h3>
            <p className="booking-subtitle">Select a date and time to meet.</p>

            {/* 1. Date Picker */}
            <div style={{ marginBottom: 15 }}>
                <label style={{display:'block', fontSize:14, fontWeight:600, marginBottom:5, color:'#475569'}}>Select Date</label>
                <input 
                    type="date" 
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                        width: '100%', padding: '10px', borderRadius: '8px', 
                        border: '1px solid #cbd5e1', fontSize: '14px'
                    }}
                />
            </div>

            {/* 2. Slots Grid */}
            <div style={{ marginBottom: 20 }}>
                <label style={{display:'block', fontSize:14, fontWeight:600, marginBottom:8, color:'#475569'}}>Available Slots</label>
                
                {loadingSlots ? (
                    <div style={{fontSize:13, color:'#64748B'}}>Checking availability...</div>
                ) : !selectedDate ? (
                    <div style={{fontSize:13, color:'#94a3b8'}}>Please pick a date first.</div>
                ) : availableSlots.length === 0 ? (
                    <div style={{padding:10, background:'#fef2f2', color:'#ef4444', borderRadius:8, fontSize:13}}>
                        🚫 Not Available / Holiday
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {availableSlots.map((slot, idx) => (
                            <button
                                key={idx}
                                disabled={slot.isBooked}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={selectedSlot === slot.time ? "slot-btn active" : "slot-btn"}
                                style={{
                                    padding: '8px 4px', fontSize: '12px', fontWeight: '600',
                                    borderRadius: '6px', cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                                    border: selectedSlot === slot.time ? '1px solid #2563EB' : '1px solid #e2e8f0',
                                    backgroundColor: slot.isBooked ? '#f1f5f9' : (selectedSlot === slot.time ? '#eff6ff' : '#fff'),
                                    color: slot.isBooked ? '#cbd5e1' : (selectedSlot === slot.time ? '#2563EB' : '#334155')
                                }}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Info */}
            <div className="price-box">
              <span className="price-text">₹{totalAmount}</span>
              <span className="duration-text">/ {profile.session_duration_minutes} mins</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={displayRazorpay}
              disabled={!selectedSlot}
              className="book-button"
              style={{ opacity: !selectedSlot ? 0.6 : 1, cursor: !selectedSlot ? 'not-allowed' : 'pointer' }}
            >
              <span className="button-icon">🔒</span> 
              {selectedSlot ? "Pay & Book" : "Select Time First"}
            </button>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingPage;