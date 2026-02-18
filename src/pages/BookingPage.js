import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, BrowserRouter } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// 🛠️ MOCK AUTH HOOK (Preview ke liye)
// Real project me: import { useAuth } from "../context/AuthContext";
const useAuth = () => {
  const [user] = useState({
    id: "student_123",
    name: "Rahul Verma",
    email: "rahul@example.com",
    mobileNumber: "9998887776",
    isSenior: false
  });
  return { auth: { user } };
};

// 🎨 CSS STYLES (Injected for Preview)
const styles = `
  .booking-container {
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background: #f3f4f6;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }
  .layout {
    display: flex;
    gap: 20px;
    max-width: 1000px;
    width: 100%;
  }
  @media (max-width: 768px) {
    .layout { flex-direction: column; }
  }
  
  /* Left Column */
  .profile-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .card {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid #e5e7eb;
  }
  
  /* Profile Header */
  .profile-header {
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  .name { margin: 10px 0 5px; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
  .college { color: #6b7280; font-weight: 500; }
  
  /* Right Column (Booking Box) */
  .booking-sidebar {
    flex: 1;
  }
  .booking-box {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: 1px solid #e5e7eb;
    position: sticky;
    top: 20px;
  }
  .price-tag {
    font-size: 2rem;
    font-weight: 800;
    color: #1f2937;
    text-align: center;
    display: block;
    margin: 15px 0;
  }
  .info-note {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
    padding: 15px;
    border-radius: 10px;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  
  .pay-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .pay-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }

  /* Utility */
  .tag { background: #f3f4f6; padding: 5px 12px; borderRadius: 20px; font-size: 0.85rem; display: inline-block; margin-right: 8px; margin-bottom: 8px; color: #374151; }
  .loading { display: flex; justify-content: center; alignItems: center; height: 100vh; color: #6b7280; }
`;

// 🧩 Main Component Logic
function BookingContent() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth(); 

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 🟡 REAL API CALLS (Commented out for Preview Stability)
        // Uncomment in your real project
        /*
        const [res, settings] = await Promise.all([
           axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { "x-auth-token": token } }),
           axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`)
        ]);
        setProfile(res.data);
        setTotalAmount(res.data.price_per_session + settings.data.platformFee);
        */

        // 🟢 MOCK DATA (For Preview)
        // Remove this block in real project
        setTimeout(() => {
            setProfile({
                user: { _id: userId || "mock_id", name: "Aryan Sharma" },
                college: { name: "IIT Bombay" },
                branch: "Computer Science",
                year: "4th Year",
                bio: "Expert in JEE preparation. I can guide you on how to crack exams and manage stress.",
                price_per_session: 200,
                session_duration_minutes: 30,
                tags: [{_id:1, name:"JEE"}, {_id:2, name:"Mentorship"}],
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan",
                id_card_url: null
            });
            setTotalAmount(250); // 200 + 50 fee
            setLoading(false);
        }, 1000);

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handlePayment = () => {
    if (!auth.user) return toast.error("Please login first");

    const toastId = toast.loading("Processing Request...");

    // 1. Booking Data (Slot Time is NULL for Request)
    const bookingData = {
       senior: profile.user._id,
       slot_time: null, // 🚀 Important: Request Mode
       amount: totalAmount
    };

    // 2. Simulate Razorpay (Replace with Real Razorpay Code)
    setTimeout(() => {
        toast.dismiss(toastId);
        toast.success("Request Sent Successfully!");
        // navigate("/student-dashboard"); // Redirect in real app
    }, 2000);

    /* REAL RAZORPAY CODE:
    try {
       const order = await axios.post(".../api/payment/order", ...);
       const options = {
          key: "YOUR_KEY",
          amount: order.data.amount,
          handler: async (response) => {
             await axios.post(".../api/payment/verify", { ...response, bookingData });
             navigate("/student-dashboard");
          }
       };
       new window.Razorpay(options).open();
    } catch(e) { toast.error("Payment Failed"); }
    */
  };

  if (loading) return <div className="loading">⏳ Loading Profile...</div>;
  if (!profile) return <div className="loading">❌ Profile not found</div>;

  return (
    <div className="booking-container">
      <style>{styles}</style>
      
      <div className="layout">
        {/* Left Column */}
        <div className="profile-section">
           {/* Header Card */}
           <div className="card profile-header">
              <img src={profile.avatar} alt="Profile" className="avatar" />
              <h2 className="name">{profile.user.name}</h2>
              <p className="college">{profile.college.name} • {profile.branch}</p>
           </div>

           {/* About Card */}
           <div className="card">
              <h3>👤 About Me</h3>
              <p style={{color: '#4b5563', lineHeight: 1.6}}>{profile.bio}</p>
           </div>

           {/* Tags Card */}
           <div className="card">
              <h3>🏷️ Expertise</h3>
              <div style={{marginTop: '10px'}}>
                 {profile.tags.map(tag => (
                    <span key={tag._id} className="tag">{tag.name}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Column (Action) */}
        <div className="booking-sidebar">
           <div className="booking-box">
              <h3 style={{textAlign:'center', color:'#1e3a8a', margin:'0 0 15px'}}>Request Session</h3>
              
              <div className="info-note">
                 <strong>How it works:</strong><br/>
                 1. You pay & send a request.<br/>
                 2. Senior accepts & schedules a time.<br/>
                 3. You join the call when scheduled.
              </div>

              <div style={{textAlign:'center', background:'#f9fafb', padding:'10px', borderRadius:'10px', marginBottom:'20px'}}>
                  <span style={{display:'block', fontSize:'0.9rem', color:'#6b7280'}}>Total to pay</span>
                  <span className="price-tag">₹{totalAmount}</span>
                  <span style={{color:'#10b981', fontSize:'0.85rem', fontWeight:'bold'}}>+ Free Chat Access</span>
              </div>

              <button className="pay-btn" onClick={handlePayment}>
                 🔒 Pay & Send Request
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// 🚀 Wrapper for Preview (Remove BrowserRouter if copying to existing project)
export default function BookingPage() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <BookingContent />
    </BrowserRouter>
  );
}