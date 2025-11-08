import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

<Route path="/student-dashboard/*" element={<StudentDashboard />} />
// body, html { margin: 0; padding: 0; box-sizing: border-box; }

// 🧩 AppLayout Component — simplified version
// ---------------------------------------------------------
function AppLayout() {
  const { auth } = useAuth();

  // 🔹 Show mobile verification modal only if user is logged in but hasn’t added number
  const showMobileModal =
    auth.isAuthenticated && auth.user && !auth.user.mobileNumber;

  return (
    <div className="App">
      {/* Mobile Number Modal */}
      {showMobileModal && <MobileNumberModal />}

      {/* Navbar (automatically hidden on login/register pages) */}
      <Navbar />

      {/* Page Content */}
      <main>
        <Routes>
          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* ---------------- STUDENT ROUTES ---------------- */}
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------------- SENIOR ROUTES ---------------- */}
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

          {/* ---------------- BOOKING ROUTES ---------------- */}
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

          {/* ---------------- ADMIN ROUTES ---------------- */}
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

          {/* ---------------- 404 PAGE ---------------- */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for doesn’t exist.</p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer visible on all pages */}
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------
// 🧩 Main App Function — wraps everything in Router
// ---------------------------------------------------------
function App() {
  return (
    // (AuthProvider & Toaster are already wrapped in index.js)
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;