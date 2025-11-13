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

  // 🔹 Loader UI
  if (loading)
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg,#e0f2fe,#eff6ff)',
          fontFamily: 'Poppins, sans-serif',
          color: '#2563eb',
          fontSize: '1.2rem',
          fontWeight: '600',
        }}
      >
        ⏳ Loading College Connect...
      </div>
    );

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