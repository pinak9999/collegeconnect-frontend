import React from 'react';
// 1. 'useLocation' को 'import' (आयात) करें
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// 2. 'AuthProvider' और 'Toaster' को यहाँ से हटा दें (वे 'index.js' में हैं)
import { useAuth } from './context/AuthContext';
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


// 3. एक नया 'Internal Layout Component' (आंतरिक लेआउट कॉम्पोनेंट) बनाएँ
// (यह 'useLocation' का इस्तेमाल कर सकता है क्योंकि यह <Router> के अंदर होगा)
function AppLayout() {
  const location = useLocation();
  const { auth } = useAuth();

  // 4. 'check' (जाँच) करें कि क्या 'Mobile Modal' (मोबाइल मोडल) दिखाना है
  const showMobileModal = 
    auth.isAuthenticated &&
    auth.user &&
    !auth.user.mobileNumber;

  // 5. 'check' (जाँच) करें कि क्या 'Navbar' (नेवबार) को छिपाना है 
  // (यह 'logic' (तर्क) 'Navbar.js' से 'match' (मेल) होना चाहिए)
  const hiddenRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const currentPath = location.pathname.toLowerCase();
  
  // 'startsWith' (से शुरू होता है) का इस्तेमाल करें ताकि '/reset-password/:token' (रीसेट-पासवर्ड/:टोकन) भी 'match' (मेल) हो
  const isNavbarHidden = hiddenRoutes.some((route) => currentPath.startsWith(route));

  return (
    <div className="App">
      {/* 'Modal' (मोडल) को सबसे ऊपर दिखाएँ */}
      {showMobileModal && <MobileNumberModal />}

      {/* 'Navbar' (नेवबार) यहाँ है (यह खुद 'null' (शून्य) 'return' (रिटर्न) कर देगा) */}
      <Navbar />

      {/* 6. "Smart" (स्मार्ट) <main> 
         यह 'class' (क्लास) (padding-top) सिर्फ तब 'add' (जोड़) करेगा जब 'Navbar' (नेवबार) छिपा हुआ नहीं है
         (यह 'Login' (लॉगिन) पेज के 'gap' (गैप) को 'fix' (ठीक) करेगा)
      */}
      <main className={isNavbarHidden ? "" : "content-with-navbar"}>
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
                element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
              />

              {/* ---------------- SENIOR ROUTES ---------------- */}
              <Route
                path="/senior-dashboard/*"
                element={<ProtectedRoute><SeniorDashboard /></ProtectedRoute>}
              />
              <Route
                path="/senior-availability"
                element={<ProtectedRoute><SeniorAvailabilityPage /></ProtectedRoute>}
              />
              <Route
                path="/senior-earnings"
                element={<ProtectedRoute><SeniorEarningsPage /></ProtectedRoute>}
              />

              {/* ---------------- BOOKING ROUTES ---------------- */}
              <Route
                path="/book/:userId"
                element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
              />
              <Route
                path="/booking-success"
                element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>}
              />
              <Route
                path="/rate-booking/:bookingId"
                element={<ProtectedRoute><RateBookingPage /></ProtectedRoute>}
              />
              <Route
                path="/raise-dispute/:bookingId"
                element={<ProtectedRoute><RaiseDisputePage /></ProtectedRoute>}
              />
              <Route
                path="/chat/:bookingId"
                element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
              />

              {/* ---------------- ADMIN ROUTES ---------------- */}
              <Route
                path="/admin-dashboard"
                element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin-edit-profile/:userId"
                element={<ProtectedRoute><AdminEditProfilePage /></ProtectedRoute>}
              />
              <Route
                path="/admin-payouts"
                element={<ProtectedRoute><AdminPayoutsPage /></ProtectedRoute>}
            । />
              <Route
                path="/admin-settings"
                element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>}
              />
              <Route
                path="/admin-manage-tags"
                element={<ProtectedRoute><AdminManageTags /></ProtectedRoute>}
              />
              <Route
                path="/admin-manage-colleges"
                element={<ProtectedRoute><AdminManageColleges /></ProtectedRoute>}
              />
              <Route
                path="/admin-manage-dispute-reasons"
                element={<ProtectedRoute><AdminManageDisputes /></ProtectedRoute>}
              />

              {/* ---------------- 404 Route ---------------- */}
              <Route
                path="*"
                element={
                  <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>404 - Page Not Found</h2>
                    <p>The page you are looking for doesn’t exist.</p>
        _profile-page
                  </div>
                }
              />
            </Routes>
          </main>

        <Footer />
      </div>
  );
}

// 7. 'main' (मुख्य) 'App' (ऐप) 'function' (फ़ंक्शन) अब 'Router' (राउटर) को 'render' (रेंडर) करेगा
function App() {
  return (
    // (AuthProvider और Toaster 'index.js' में हैं)
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;