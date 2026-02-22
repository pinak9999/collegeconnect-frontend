import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Asal code mein ise uncomment karein
import toast from "react-hot-toast";
import './BookingPage.css'; // ⭐ CSS फाइल को यहाँ इम्पोर्ट किया गया है

// --- फूटर कंपोनेंट ---
function Footer() {
  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Release", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const supportLinks = [
    { name: "Let Us Help You", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Your Account", href: "#" },
    { name: "Report Issue", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  const studentLinks = [
    { name: "Find Mentors", href: "#" },
    { name: "Book a Session", href: "#" },
    { name: "REAP Guide", href: "#" },
    { name: "Learning Hub", href: "#" },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3 className="footer-logo">CollegeConnect</h3>
          <p className="footer-tagline">
            Connecting students with amazing mentors.
          </p>
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Company</h4>
          {companyLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          {supportLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
        <div className="footer-column">
          <h4 className="footer-heading">For Students</h4>
          {studentLinks.map((link) => (
            <a key={link.name} href={link.href} className="footer-link">
              {link.name}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} CollegeConnect. All Rights Reserved.
      </div>
    </footer>
  );
}

// --- मुख्य बुकिंग पेज कंपोनेंट ---
function BookingPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ⭐ Mock AuthContext (Compile error se bachne ke liye)
  const { auth } = {
    auth: {
      user: {
        name: "Mock User",
        email: "mock.user@example.com",
      },
    },
  };
  // const { auth } = useAuth(); // Asal app mein ise uncomment karein

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // ⭐ isMobile state ki ab style ke liye zaroorat nahi hai.
  // CSS media queries ise handle kar rahe hain.

  useEffect(() => {
    // window resize listener ki ab zaroorat nahi hai.
    const loadPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          setError("Error: You are not logged in.");
          return;
        }

        // --- ID CARD FIX (Aapka original logic) ---
        const [res, settingsRes, allProfilesRes] = await Promise.all([
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`,
            { headers: { "x-auth-token": token } }
          ),
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/settings`
          ),
          axios.get(
            `https://collegeconnect-backend-mrkz.onrender.com/api/profile/all`,
            { headers: { "x-auth-token": token } }
          ),
        ]);

        const singleProfileData = res.data;
        const allProfilesData = allProfilesRes.data;

        const matchingProfileFromAll = allProfilesData.find(
          (p) => p.user?._id === userId
        );

        const combinedProfile = {
          ...singleProfileData,
          ...matchingProfileFromAll,
          user: singleProfileData.user || matchingProfileFromAll.user,
          college: singleProfileData.college || matchingProfileFromAll.college,
        };

        setProfile(combinedProfile);

        const fee =
          combinedProfile.price_per_session + settingsRes.data.platformFee;
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
    // useEffect se resize listener hata diya gaya hai
  }, [userId]);

  // --- Payment Handler (Aapka original logic) ---
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
        theme: { color: "#10B981" }, // Mint theme color
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

  // --- LOADING / ERROR / NOT FOUND STATES ---

  if (loading)
    return (
      <div className="page-container loading-container">
        <h2>⏳ Loading Booking Page...</h2>
      </div>
    );

  if (error)
    return (
      <div className="page-container loading-container">
        <h2 className="error-text">❌ {error}</h2>
      </div>
    );

  if (!profile)
    return (
      <div className="page-container loading-container">
        <h2>Profile not found.</h2>
      </div>
    );

  // --- FINAL JSX (Ab yahan classNames ka istemal hai) ---

  return (
    <div className="page-container">
      <div className="layout-container">
        {/* ------------------- 
            LEFT COLUMN (Info) 
             ------------------- */}
        <div className="main-content">
          {/* Profile Header Card */}
          <div className="card profile-header">
            <img
              src={profile.avatar || "https://via.placeholder.com/120"}
              alt={profile.user?.name || "Senior"}
              className="avatar"
            />
            <h2 className="profile-name">
              {profile.user?.name}
            </h2>
            <p className="profile-college">
              {profile.college?.name || "N/A"}
            </p>
            <p className="profile-branch">
              {profile.branch} ({profile.year})
            </p>
          </div>

          {/* About Me Card */}
          <div className="card">
            <h3 className="card-heading">
              <span className="heading-icon">👤</span> About Me
            </h3>
            <p className="card-bio">
              {profile.bio}
            </p>
          </div>

          {/* Specializations Card */}
          <div className="card">
            <h3 className="card-heading">
              <span className="heading-icon">🏷️</span> Specializations
            </h3>
            <div className="tags-container">
              {profile.tags?.length ? (
                profile.tags.map((tag) => (
                  <span key={tag._id} className="tag">
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="no-tags-text">
                  No tags listed.
                </p>
              )}
            </div>
          </div>

          {/* Verified ID Card */}
          {profile.id_card_url && (
            <div className="card">
              <h3 className="card-heading verified-heading">
                <span className="heading-icon">🎓</span> College Verified ID
                <span className="verified-icon">✓</span>
              </h3>
              <img
                src={profile.id_card_url}
                alt="College ID Card"
                className="id-card-image"
              />
            </div>
          )}
        </div>

        {/* ------------------- 
            RIGHT COLUMN (Booking) 
             ------------------- */}
        <div className="sidebar">
          <div className="card booking-card">
            <h3 className="booking-title">
              Book this Session
            </h3>
            <p className="booking-subtitle">
              After payment, the senior will contact you within 6 hours to
              schedule the best time.
            </p>

            <div className="price-box">
              <span className="price-text">₹{totalAmount}</span>
              <span className="duration-text">+ Chat Free</span>
            </div>

            <button
              onClick={displayRazorpay}
              className="book-button"
            >
              <span className="button-icon">🔒</span> Pay ₹{totalAmount} & Book
            </button>
          </div>
        </div>
      </div>

      {/* फूटर को यहाँ जोड़ा गया है */}
      <Footer />
    </div>
  );
}

export default BookingPage;