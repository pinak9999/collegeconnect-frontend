import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// 🚀 BOLD: Pagination import hata diya gaya, kyunki component ab isi file mein hai

// 🚀 BOLD: Pagination component ab isi file mein bana diya gaya hai
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Agar ek hi page hai to kuch na dikhayein

  return (
    <div style={paginationContainer}>
      <button
        style={{
          ...paginationButton,
          ...(currentPage === 1 ? paginationDisabled : {}),
        }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo; Prev
      </button>
      <span style={paginationInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        style={{
          ...paginationButton,
          ...(currentPage === totalPages ? paginationDisabled : {}),
        }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &raquo;
      </button>
    </div>
  );
};


// 🚀 BOLD: नया कस्टम पॉप-अप (Modal) कॉम्पोनेंट
// (window.confirm की जगह)
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={modalBackdrop} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeader}>
          <h3 style={modalTitle}>{title}</h3>
          <button onClick={onClose} style={modalCloseBtn}>&times;</button>
        </div>
        <div style={modalBody}>{children}</div>
        <div style={modalFooter}>
          <button onClick={onClose} style={{ ...btnPrimary, ...btnGray }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={btnRed}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Students और Seniors दोनों
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPageData, setUserPageData] = useState({ currentPage: 1, totalPages: 1 });
  const [bookingPageData, setBookingPageData] = useState({ currentPage: 1, totalPages: 1 });
  
  // 🚀 BOLD: टैब मैनेजमेंट
  const [activeTab, setActiveTab] = useState("users"); // Main tab: 'users' or 'bookings'
  const [userView, setUserView] = useState("students"); // Sub-tab: 'students' or 'seniors'
  const [bookingView, setBookingView] = useState("all"); // 🚀 BOLD: Naya state bookings ke liye

  // 🚀 BOLD: सीनियर्स को फ़िल्टर करने के लिए नया स्टेट
  const [allProfiles, setAllProfiles] = useState([]); // सभी सीनियर प्रोफ़ाइल्स
  const [colleges, setColleges] = useState([]); // सभी कॉलेज
  const [selectedCollege, setSelectedCollege] = useState(""); // फ़िल्टर वैल्यू

  // 🚀 BOLD: पॉप-अप (Modal) के लिए स्टेट
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // 🔹 Load Users (यह स्टूडेंट्स और सीनियर्स, दोनों को लाता है)
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/users?page=${page}&limit=10`,
        { headers: { "x-auth-token": token } }
      );
      setUsers(res.data.users);
      setUserPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load Bookings
  const loadBookings = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://collegeconnect-backend-mrkz.onrender.com/api/bookings/admin/all?page=${page}&limit=10`,
        { headers: { "x-auth-token": token } }
      );
      setBookings(res.data.bookings);
      setBookingPageData({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      setError("Failed to load bookings");
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 BOLD: सीनियर्स और कॉलेज की जानकारी लोड करने के लिए नया फ़ंक्शन
  const loadSeniorData = async () => {
    try {
      const token = localStorage.getItem("token");
      // एक साथ दोनों API को कॉल करें
      const [profileRes, collegeRes] = await Promise.all([
        axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/all`, {
          headers: { "x-auth-token": token },
        }),
        axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/colleges`, {
          headers: { "x-auth-token": token },
        }),
      ]);
      setAllProfiles(profileRes.data);
      setColleges(collegeRes.data);
    } catch (err) {
      toast.error("Failed to load senior or college data");
    }
  };

  // 🔹 useEffect (डेटा लोड करने के लिए)
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
      // 🚀 BOLD: अगर 'users' टैब पर हैं, तो सीनियर और कॉलेज डेटा भी लोड करें
      loadSeniorData();
    } else {
      loadBookings();
    }
  }, [activeTab]);

  // 🔹 Make Senior
  const makeSeniorHandler = (userId) => {
    setModalState({
      isOpen: true,
      title: "Confirm Promotion",
      message: "Are you sure you want to make this user a Senior?",
      onConfirm: async () => {
        setModalState({ ...modalState, isOpen: false }); // Modal बंद करें
        const toastId = toast.loading("Updating...");
        try {
          const token = localStorage.getItem("token");
          const res = await axios.put(
            `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}/make-senior`,
            null,
            { headers: { "x-auth-token": token } }
          );
          setUsers((prev) => prev.map((u) => (u._id === userId ? res.data : u)));
          toast.dismiss(toastId);
          toast.success("User promoted to Senior!");
          navigate(`/admin-edit-profile/${userId}`);
        } catch {
          toast.dismiss(toastId);
          toast.error("Update failed");
        }
      },
    });
  };

  // 🔹 Delete User
  const deleteUserHandler = (userId, name) => {
    setModalState({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      onConfirm: async () => {
        setModalState({ ...modalState, isOpen: false });
        const toastId = toast.loading("Deleting...");
        try {
          const token = localStorage.getItem("token");
          await axios.delete(
            `https://collegeconnect-backend-mrkz.onrender.com/api/users/${userId}`,
            { headers: { "x-auth-token": token } }
          );
          toast.dismiss(toastId);
          toast.success("Deleted successfully");
          loadUsers(userPageData.currentPage);
        } catch {
          toast.dismiss(toastId);
          toast.error("Delete failed");
        }
      },
    });
  };

  // 🔹 Resolve Dispute
  const resolveDisputeHandler = (id) => {
    setModalState({
      isOpen: true,
      title: "Confirm Resolution",
      message: "Are you sure you want to mark this dispute as resolved?",
      onConfirm: async () => {
        setModalState({ ...modalState, isOpen: false });
        const toastId = toast.loading("Resolving...");
        try {
          const token = localStorage.getItem("token");
          const res = await axios.put(
            `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/resolve/${id}`,
            null,
            { headers: { "x-auth-token": token } }
          );
          setBookings((prev) => prev.map((b) => (b._id === id ? res.data.booking : b)));
          toast.dismiss(toastId);
          toast.success("Resolved!");
        } catch {
          toast.dismiss(toastId);
          toast.error("Error resolving dispute");
        }
      },
    });
  };

  // 🚀 BOLD: फ़िल्टर किया हुआ यूज़र डेटा
  // 1. स्टूडेंट्स (Students)
  const students = users.filter((u) => !u.isSenior && u.role !== "Admin");
  
  // 2. सीनियर्स (Seniors) - पहले यूज़र्स को प्रोफ़ाइल के साथ मिलाएँ
  const seniorsWithProfile = users
    .filter((u) => u.isSenior)
    .map((senior) => {
      // यूज़र लिस्ट (senior) को प्रोफ़ाइल लिस्ट (allProfiles) से मिलाएँ
      const profile = allProfiles.find((p) => p.user._id === senior._id);
      return { ...senior, profile: profile || {} }; // प्रोफ़ाइल को मर्ज करें
    });

  // 3. फ़िल्टर किए गए सीनियर्स (Filtered Seniors)
  const filteredSeniors = seniorsWithProfile.filter(s => 
    !selectedCollege || s.profile?.college?._id === selectedCollege
  );

  // 🚀 BOLD: बुकिंग्स को फ़िल्टर करें
  const disputedBookings = bookings.filter(b => b.dispute_status === "Pending");


  // 🔹 Error State
  if (error)
    return (
      <div style={errorBox}>
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={btnPrimary}>
          🔄 Reload
        </button>
      </div>
    );

  // 🔹 Main Render
  return (
    <div style={mainWrapper}>
      {/* 🚀 BOLD: नया पॉप-अप (Modal) */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
      >
        <p>{modalState.message}</p>
      </ConfirmModal>

      <h1 style={headerTitle}>🛠 Admin Dashboard</h1>

      {/* 🔹 Top Management Buttons */}
      <div style={adminBtnWrapper}>
        {topButtons.map((btn, i) => (
          <Link key={i} to={btn.link} style={adminButton(btn.color)}>
            {btn.icon} {btn.text}
          </Link>
        ))}
      </div>

      {/* 🔹 Main Tabs */}
      <div style={tabWrapper}>
        <button onClick={() => setActiveTab("users")} style={tab(activeTab === "users")}>
          👥 Users
        </button>
        <button onClick={() => setActiveTab("bookings")} style={tab(activeTab === "bookings")}>
          📖 Bookings
        </button>
      </div>

      {/* ======================= */}
      {/* 🔹 Main Data Section 🔹 */}
      {/* ======================= */}
      {loading ? (
        <h3 style={{ textAlign: "center", color: "#2563eb" }}>⏳ Loading...</h3>
      ) : activeTab === "users" ? (
        
        // 🚀 BOLD: यूज़र्स (Users) टैब का नया लेआउट
        <div>
          {/* 🚀 BOLD: Sub-tabs (स्टूडेंट / सीनियर) */}
          <div style={subTabWrapper}>
            <button
              onClick={() => setUserView("students")}
              style={subTab(userView === "students")}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setUserView("seniors")}
              style={subTab(userView === "seniors")}
            >
              Seniors ({seniorsWithProfile.length})
            </button>
          </div>

          {/* 🚀 BOLD: स्टूडेंट लिस्ट (Student List) */}
          {userView === "students" && (
            <>
              <h3 style={sectionTitle}>All Students</h3>
              <div style={gridContainer}>
                {students.map((u) => (
                  <div key={u._id} style={userCard}>
                    <h4 style={userName}>{u.name}</h4>
                    <p style={userEmail}>{u.email}</p>
                    <p style={userPhone}>📞 {u.mobileNumber}</p>
                    <p style={{ fontWeight: 600, color: "#ef4444" }}>Student</p>
                    <div style={btnRow}>
                      <button style={btnBlue} onClick={() => makeSeniorHandler(u._id)}>
                        🎓 Make Senior
                      </button>
                      <button style={btnRed} onClick={() => deleteUserHandler(u._id, u.name)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🚀 BOLD: सीनियर लिस्ट (Senior List) */}
          {userView === "seniors" && (
            <>
              <h3 style={sectionTitle}>All Seniors</h3>
              
              {/* 🚀 BOLD: कॉलेज फ़िल्टर ड्रॉपडाउन */}
              <div style={filterWrapper}>
                <select 
                  style={adminSelect}
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                >
                  <option value="">🎓 Filter by College (All)</option>
                  {colleges.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={gridContainer}>
                {filteredSeniors.map((u) => (
                  <div key={u._id} style={userCard}>
                    <h4 style={userName}>{u.name}</h4>
                    <p style={userEmail}>{u.email}</p>
                    <p style={userPhone}>📞 {u.mobileNumber}</p>
                    {/* 🚀 BOLD: कॉलेज का नाम दिखाना */}
                    <p style={collegeNameStyle}>
                      {u.profile?.college?.name || "No College Info"}
                    </p>
                    <div style={btnRow}>
                      <Link to={`/admin-edit-profile/${u._id}`} style={btnGradient}>
                        ✏ Edit Profile
                      </Link>
                      <button style={btnRed} onClick={() => deleteUserHandler(u._id, u.name)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* 🚀 BOLD: यूज़र लिस्ट के लिए Pagination */}
          <Pagination
            currentPage={userPageData.currentPage}
            totalPages={userPageData.totalPages}
            onPageChange={(page) => loadUsers(page)}
          />
        </div>
      ) : (
        
        // 🚀 BOLD: बुकिंग्स (Bookings) टैब (पूरा ब्लॉक अपडेट किया गया)
        <div>
          {/* 🚀 BOLD: Naye Sub-tabs (All / Disputed) */}
          <div style={subTabWrapper}>
            <button
              onClick={() => setBookingView("all")}
              style={subTab(bookingView === "all")}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setBookingView("disputed")}
              style={{
                ...subTab(bookingView === "disputed"),
                // Agar active nahi hai, lekin disputes hain, tab bhi highlight karein
                ...(bookingView !== 'disputed' && disputedBookings.length > 0 ? disputeTabAlert : {}),
                // Agar active hai aur disputes hain
                ...(bookingView === 'disputed' && disputedBookings.length > 0 ? disputeTabActive : {})
              }}
            >
              Disputes ({disputedBookings.length}) ⚠
            </button>
          </div>

          {/* 🚀 BOLD: 'All Bookings' List */}
          {bookingView === "all" && (
            <>
              <h3 style={sectionTitle}>All Bookings</h3>
              {bookings.length === 0 && (
                <p style={emptyListMessage}>No bookings found.</p>
              )}
              <div style={gridContainer}>
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      ...userCard,
                      background: b.dispute_status === "Pending" ? "#fff7ed" : "white",
                      borderLeft:
                        b.dispute_status === "Pending"
                          ? "5px solid #f97316"
                          : "5px solid #22c55e",
                    }}
                  >
                    <h4 style={userName}>{b.student?.name}</h4>
                    
                    {b.student?.mobileNumber && (
                      <p style={userPhone}>📞 {b.student.mobileNumber}</p>
                    )}
                    
                    <p style={userEmail}>Senior: {b.senior?.name}</p>
                    <p style={{ color: "#2563eb", fontWeight: 600 }}>
                      ₹{b.amount_paid} — {b.status}
                    </p>
                    <p style={{ color: "#ef4444", fontWeight: 700, minHeight: '1.2em' }}>
                      {b.dispute_status === "Pending"
                        ? "⚠ Dispute Pending"
                        : b.dispute_status === "Resolved" 
                        ? "✅ Dispute Resolved" 
                        : ""}
                    </p>
                    {b.dispute_status === "Pending" && (
                      <button style={btnGreen} onClick={() => resolveDisputeHandler(b._id)}>
                        ✅ Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🚀 BOLD: 'Disputed Bookings' List */}
          {bookingView === "disputed" && (
            <>
              <h3 style={sectionTitle}>Disputed Bookings</h3>
              {disputedBookings.length === 0 && (
                <p style={emptyListMessage}>No pending disputes. All good!</p>
              )}
              <div style={gridContainer}>
                {disputedBookings.map((b) => (
                  <div
                    key={b._id}
                    style={{
                      ...userCard,
                      background: "#fff7ed",
                      borderLeft: "5px solid #f97316",
                    }}
                  >
                    <h4 style={userName}>{b.student?.name}</h4>
                    
                    {b.student?.mobileNumber && (
                      <p style={userPhone}>📞 {b.student.mobileNumber}</p>
                    )}
                    
                    <p style={userEmail}>Senior: {b.senior?.name}</p>
                    <p style={{ color: "#2563eb", fontWeight: 600 }}>
                      ₹{b.amount_paid} — {b.status}
                    </p>
                    <p style={{ color: "#ef4444", fontWeight: 700, minHeight: '1.2em' }}>
                      ⚠ Dispute Pending
                    </p>
                    <button style={btnGreen} onClick={() => resolveDisputeHandler(b._id)}>
                      ✅ Resolve
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <Pagination
            currentPage={bookingPageData.currentPage}
            totalPages={bookingPageData.totalPages}
            onPageChange={(page) => loadBookings(page)}
          />
        </div>
      )}
    </div>
  );
}

/* 🎨 === Styles === */
// (पहले के सभी स्टाइल्स वही हैं)
const mainWrapper = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#eef2ff,#f9fafb)",
  padding: "40px 20px",
  fontFamily: "Poppins, sans-serif",
};

const headerTitle = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "2rem",
  background: "linear-gradient(90deg,#2563eb,#6366f1)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "25px",
};

const adminBtnWrapper = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "30px",
};

const adminButton = (color) => ({
  background: `linear-gradient(45deg,${color},#2563eb)`,
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
  transition: "0.3s",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
});

const topButtons = [
  { text: "Manage Payouts", icon: "💰", color: "#16a34a", link: "/admin-payouts" },
  { text: "Settings", icon: "⚙️", color: "#2563eb", link: "/admin-settings" },
  { text: "Tags", icon: "🏷", color: "#6366f1", link: "/admin-manage-tags" },
  { text: "Colleges", icon: "🎓", color: "#0891b2", link: "/admin-manage-colleges" },
  { text: "Dispute Reasons", icon: "⚠️", color: "#f97316", link: "/admin-manage-dispute-reasons" },
];

const tabWrapper = { textAlign: "center", marginBottom: "20px" };

const tab = (active) => ({
  padding: "10px 18px",
  borderRadius: "30px",
  border: "none",
  margin: "0 5px",
  background: active
    ? "linear-gradient(45deg,#2563eb,#1e40af)"
    : "#f3f4f6",
  color: active ? "#fff" : "#2563eb",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: active ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
});

// 🚀 BOLD: नए सब-टैब के लिए स्टाइल
const subTabWrapper = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px',
};

const subTab = (active) => ({
  padding: "8px 16px",
  borderRadius: "10px",
  border: active ? "2px solid #6366f1" : "2px solid #e5e7eb",
  background: active ? "#eef2ff" : "#ffffff",
  color: active ? "#6366f1" : "#6b7280",
  fontWeight: 700,
  cursor: "pointer",
  transition: "0.3s",
});

// 🚀 BOLD: Dispute tab highlight styles
const disputeTabAlert = {
  borderColor: '#f97316',
  color: '#f97316',
  background: '#fff7ed',
};
const disputeTabActive = {
  borderColor: '#ef4444',
  color: '#ef4444',
  background: '#fee2e2',
};
const emptyListMessage = {
  textAlign: 'center',
  color: '#555',
  fontSize: '1.1rem',
  fontWeight: 500,
  padding: '20px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
};

// 🚀 BOLD: नए कॉलेज फ़िल्टर के लिए स्टाइल
const filterWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
};

const adminSelect = {
  padding: "10px 15px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  fontWeight: 500,
  fontFamily: "Poppins, sans-serif",
  minWidth: "300px",
  maxWidth: "100%",
  background: "#fff",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "15px",
  padding: "10px",
};

const userCard = {
  background: "rgba(255,255,255,0.9)",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  padding: "15px",
  textAlign: "center",
  transition: "0.3s",
  backdropFilter: "blur(6px)",
  border: "1px solid #fff", // 🚀 BOLD: सफ़ेद बॉर्डर जोड़ा गया
};

const userName = { margin: 0, color: "#111827", fontWeight: 600, fontSize: '1.1rem' };
const userEmail = { color: "#6b7280", margin: "4px 0", fontSize: '0.9rem' };
const userPhone = { color: "#2563eb", fontWeight: 500, margin: '4px 0' };
const collegeNameStyle = { // 🚀 BOLD: सीनियर के कॉलेज के लिए नया स्टाइल
  color: "#6366f1", 
  fontWeight: 600, 
  margin: '4px 0',
  fontSize: '0.9rem',
  minHeight: '1.2em'
};
const btnRow = { marginTop: "10px", display: "flex", justifyContent: "center", gap: "8px", flexWrap: 'wrap' };

const btnPrimary = {
  background: "linear-gradient(45deg,#2563eb,#1e40af)",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: '0.9rem', // 🚀 BOLD: एक जैसा फ़ॉन्ट साइज़
  transition: "0.3s",
};
const btnBlue = { ...btnPrimary, background: "linear-gradient(45deg,#3b82f6,#2563eb)" };
const btnRed = { ...btnPrimary, background: "linear-gradient(45deg,#ef4444,#b91c1c)" };
const btnGreen = { ...btnPrimary, background: "linear-gradient(45deg,#22c55e,#16a34a)" };
const btnGray = { ...btnPrimary, background: "#6b7280" }; // 🚀 BOLD: Modal के लिए
const btnGradient = {
  ...btnPrimary,
  background: "linear-gradient(45deg,#6366f1,#2563eb)",
  textDecoration: "none",
  display: "inline-block",
};

const errorBox = {
  textAlign: "center",
  color: "red",
  padding: "40px",
  fontFamily: "Poppins",
};

const sectionTitle = {
  textAlign: "center",
  color: "#1e40af",
  marginBottom: "10px",
  fontSize: "1.5rem", // 🚀 BOLD: साइज़ बढ़ाया
};

// 🚀 BOLD: नए कस्टम Modal (पॉप-अप) के लिए स्टाइल्स
const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContent = {
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  width: '90%',
  maxWidth: '450px',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid #e5e7eb',
};

const modalTitle = {
  color: '#1e40af',
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 700,
};

const modalCloseBtn = {
  background: 'none',
  border: 'none',
  fontSize: '2rem',
  color: '#9ca3af',
  cursor: 'pointer',
  lineHeight: 1,
  padding: 0,
};

const modalBody = {
  padding: '20px',
  color: '#374151',
  fontSize: '1rem',
  lineHeight: 1.6,
};

const modalFooter = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  padding: '16px 20px',
  background: '#f9fafb',
  borderTop: '1px solid #e5e7eb',
};

// 🚀 BOLD: Pagination styles
const paginationContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginTop: '30px',
  padding: '10px',
};
const paginationButton = {
  ...btnPrimary,
  background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
  fontSize: '0.9rem',
  padding: '8px 14px',
};
const paginationDisabled = {
  background: '#d1d5db',
  cursor: 'not-allowed',
  opacity: 0.7,
};
const paginationInfo = {
  fontWeight: 600,
  color: '#1e40af',
  fontSize: '1rem',
  margin: '0 10px',
};


export default AdminDashboard;