import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// --- (सभी पेज इम्पोर्ट करें) ---
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import SeniorDashboard from './pages/SeniorDashboard';
import SeniorAvailabilityPage from './pages/SeniorAvailabilityPage';
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
import SeniorEarningsPage from './pages/SeniorEarningsPage';

// --- (मुख्य App Function) ---
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <div className="App">
          {/* 🔹 Navbar हर पेज पर दिखेगा */}
          <Navbar />

          <main>
            <Routes>

              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* ✅ यह सबसे जरूरी Route है (Reset Password के लिए) */}
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

              {/* 🚨 404 Route (Optional - अगर कोई गलत URL खोले तो) */}
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

          {/* 🔹 Footer हर पेज पर दिखेगा */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
