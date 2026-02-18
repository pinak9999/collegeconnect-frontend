import React from 'react';
// 1. 'useLocation' को 'import' (आयात) करने की अब ज़रूरत नहीं है
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

// 3. 'AppLayout' 'function' (फ़ंक्शन) को 'simple' (सरल) कर दिया गया है
function AppLayout() {
  const { auth } = useAuth();

  // 4. 'check' (जाँच) करें कि क्या 'Mobile Modal' (मोबाइल मोडल) दिखाना है
  const showMobileModal = 
    auth.isAuthenticated &&
    auth.user &&
    !auth.user.mobileNumber;

  // 5. 'Navbar' (नेवबार) को छिपाने का 'logic' (तर्क) यहाँ से हटा दिया गया है 
  // (क्योंकि वह 'Navbar.js' खुद 'handle' (संभाल) कर रहा है)
  // (और 'padding-top' 'logic' (तर्क) 'index.css' से हटा दिया गया है)

  return (
    <div className="App">
      {/* 'Modal' (मोडल) को सबसे ऊपर दिखाएँ */}
      {showMobileModal && <MobileNumberModal />}

      {/* 'Navbar' (नेवबार) यहाँ है (यह 'login' (लॉगिन) पेज पर खुद `null` (शून्य) 'return' (रिटर्न) कर देगा) */}
      <Navbar />

      {/* 6. "Main" (मुख्य) 'content' (सामग्री) (बिना 'extra padding' (अतिरिक्त पैडिंग) 'class' (क्लास) के) */}
      <main>
        <Routes>
              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* ---------------- (बाकी सभी 'Routes' (रूट) वैसे ही रहेंगे) ---------------- */}
              <Route
                path="/student-dashboard/*"
                element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
              />
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
              />
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