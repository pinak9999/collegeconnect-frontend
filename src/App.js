import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- (बदलाव 1: AuthProvider और Toaster को यहाँ से हटाएँ) ---
// --- (बदलाव 2: useAuth को इम्पोर्ट करें) ---
import { useAuth } from './context/AuthContext'; 

// --- (बदलाव 3: Modal को इम्पोर्ट करें) ---
import MobileNumberModal from './components/MobileNumberModal';

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
  
  // --- (बदलाव 4: AuthContext से यूज़र की जानकारी लें) ---
  const { auth } = useAuth();

  // यह फ़ैसला करेगा कि Modal दिखाना है या नहीं:
  const showMobileModal = 
    auth.isAuthenticated &&  // 1. यूज़र Logged in है
    auth.user &&             // 2. यूज़र का डेटा लोड हो चुका है
    !auth.user.mobileNumber; // 3. यूज़र का मोबाइल नंबर नहीं है

  return (
    // --- (बदलाव 5: AuthProvider और Toaster यहाँ से हटा दिए गए हैं) ---
    <Router>
      
      {/* --- (बदलाव 6: अगर showMobileModal 'true' है, तो Modal को दिखाएँ) --- */}
      {showMobileModal && <MobileNumberModal />}
      
      {/* (Modal खुद ही बैकग्राउंड को blur कर देगा, 
        इसलिए हमें यहाँ 'filter: blur()' लगाने की ज़रूरत नहीं है)
      */}
      <div className="App">
        <Navbar />

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

            {/* ---------------- 404 Route ---------------- */}
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

        <Footer />
      </div>
    </Router>
  );
}

export default App;