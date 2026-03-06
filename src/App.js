import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// 🔹 Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNumberModal from './components/MobileNumberModal';
import ProtectedRoute from './components/ProtectedRoute';

// 🔹 Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import SeniorDashboard from './pages/SeniorDashboard';
import SeniorAvailabilityPage from './pages/SeniorAvailabilityPage';
import SeniorEarningsPage from './pages/SeniorEarningsPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import RateBookingPage from './pages/RateBookingPage';
import RaiseDisputePage from './pages/RaiseDisputePage';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminEditProfilePage from './pages/AdminEditProfilePage';
import AdminPayoutsPage from './pages/AdminPayoutsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminManageTags from './pages/AdminManageTags';
import AdminManageColleges from './pages/AdminManageColleges';
import AdminManageDisputes from './pages/AdminManageDisputes';

// 🔹 ❗ सिर्फ VideoCallPage (Analytics हटा दिया गया है)
import VideoCallPage from './pages/VideoCallPage';

// 🧩 Layout Component
function AppLayout() {
  const { auth } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // 💡 Simulated app load (you can replace it with your API check)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Hide Navbar & Footer on Auth pages (login/register/forgot/reset)
  const hideLayout =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password');

  // 🔹 Mobile Number Modal
  const showMobileModal =
    auth.isAuthenticated && auth.user && !auth.user.mobileNumber;

  // 🔹 Premium Loader UI
  if (loading) {
    const loaderCss = `
    .premium-loader-wrapper {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fdfdfd; /* क्लीन बैकग्राउंड */
      font-family: 'Poppins', sans-serif;
    }
    
    /* 🚀 3D Spinner Animation */
    .spinner-container {
      position: relative;
      width: 65px;
      height: 65px;
      margin-bottom: 24px;
    }
    
    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid transparent;
    }
    
    /* 3 अलग-अलग रंग और स्पीड वाले रिंग्स */
    .ring-1 { 
      border-top-color: #e23744; /* Zomato Red */
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; 
    }
    .ring-2 { 
      border-right-color: #ec4899; /* Pink */
      animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite; 
    }
    .ring-3 { 
      border-bottom-color: #8b5cf6; /* Purple */
      animation: spin 1.8s cubic-bezier(0.5, 0, 0.5, 1) infinite; 
    }
    
    /* ✨ Shining Text Animation */
    .loader-text-premium {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(90deg, #e23744, #ec4899, #8b5cf6, #e23744);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shineText 2s linear infinite;
      letter-spacing: 0.5px;
    }
    
    /* Keyframes for Animations */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes shineText {
      to { background-position: 200% center; }
    }
    `;

    return (
      <>
        <style>{loaderCss}</style>
        <div className="premium-loader-wrapper">
          <div className="spinner-container">
            <div className="spinner-ring ring-1"></div>
            <div className="spinner-ring ring-2"></div>
            <div className="spinner-ring ring-3"></div>
          </div>
          <div className="loader-text-premium">🚀 Loading CampusConnect...</div>
        </div>
      </>
    );
  }

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 🧩 Mobile number modal */}
      {showMobileModal && <MobileNumberModal />}

      {/* 🧩 Navbar (hidden on auth pages) */}
      {!hideLayout && <Navbar />}

      {/* 🧩 Page Content */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* STUDENT ROUTES */}
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* SENIOR ROUTES */}
          <Route
            path="/senior-dashboard/*"
            element={
              <ProtectedRoute>
                <SeniorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/senior-availability"
            element={
              <ProtectedRoute>
                <SeniorAvailabilityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/senior-earnings"
            element={
              <ProtectedRoute>
                <SeniorEarningsPage />
              </ProtectedRoute>
            }
          />

          {/* BOOKING ROUTES */}
          <Route
            path="/book/:userId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rate-booking/:bookingId"
            element={
              <ProtectedRoute>
                <RateBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/raise-dispute/:bookingId"
            element={
              <ProtectedRoute>
                <RaiseDisputePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:bookingId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-edit-profile/:userId"
            element={
              <ProtectedRoute>
                <AdminEditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-payouts"
            element={
              <ProtectedRoute>
                <AdminPayoutsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-settings"
            element={
              <ProtectedRoute>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-manage-tags"
            element={
              <ProtectedRoute>
                <AdminManageTags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-manage-colleges"
            element={
              <ProtectedRoute>
                <AdminManageColleges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-manage-dispute-reasons"
            element={
              <ProtectedRoute>
                <AdminManageDisputes />
              </ProtectedRoute>
            }
          />

          {/* ❗ सिर्फ Video Call Route (Analytics हटा दिया गया है) */}
          <Route
            path="/session/:sessionId"
            element={
              <ProtectedRoute>
                <VideoCallPage />
              </ProtectedRoute>
            }
          />

          {/* 404 PAGE */}
          <Route
            path="*"
            element={
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '50px',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for doesn’t exist.</p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* 🧩 Footer (Hidden on auth pages + hidden during loading) */}
      {!hideLayout && <Footer loading={loading} />}
    </div>
  );
}

// ---------------------------------------------------------
// 🧩 Main App Wrapper
// ---------------------------------------------------------
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;