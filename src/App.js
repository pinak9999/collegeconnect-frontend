import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// (सभी 'पेज' (page) 'इम्पोर्ट' (import) करें)
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import SeniorDashboard from './pages/SeniorDashboard';
import AdminEditProfilePage from './pages/AdminEditProfilePage';
import SeniorAvailabilityPage from './pages/SeniorAvailabilityPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import RateBookingPage from './pages/RateBookingPage';
import RaiseDisputePage from './pages/RaiseDisputePage';
import AdminPayoutsPage from './pages/AdminPayoutsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminManageTags from './pages/AdminManageTags';
import AdminManageColleges from './pages/AdminManageColleges';
import AdminManageDisputes from './pages/AdminManageDisputes';
import ChatPage from './pages/ChatPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- (1. 'यह' (This) 'रहा' (is) 'आपका' (your) 'नया' (new) 'पेज' (page) (page) 'इम्पोर्ट' (import) (आयात)) ---
import SeniorEarningsPage from './pages/SeniorEarningsPage';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* (Public Routes (पब्लिक राउट)) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* (Protected Routes (सुरक्षित राउट)) */}
              <Route path="/student-dashboard/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/senior-dashboard/*" element={<ProtectedRoute><SeniorDashboard /></ProtectedRoute>} />
              <Route path="/senior-availability" element={<ProtectedRoute><SeniorAvailabilityPage /></ProtectedRoute>} />
              <Route path="/book/:userId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/booking-success" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
              <Route path="/rate-booking/:bookingId" element={<ProtectedRoute><RateBookingPage /></ProtectedRoute>} />
              <Route path="/raise-dispute/:bookingId" element={<ProtectedRoute><RaiseDisputePage /></ProtectedRoute>} />
              <Route path="/chat/:bookingId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              
              {/* (Admin (एडमिन) राउट) */}
              <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-edit-profile/:userId" element={<ProtectedRoute><AdminEditProfilePage /></ProtectedRoute>} />
              <Route path="/admin-payouts" element={<ProtectedRoute><AdminPayoutsPage /></ProtectedRoute>} />
              <Route path="/admin-settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
              <Route path="/admin-manage-tags" element={<ProtectedRoute><AdminManageTags /></ProtectedRoute>} />
              <Route path="/admin-manage-colleges" element={<ProtectedRoute><AdminManageColleges /></ProtectedRoute>} />
              <Route path="/admin-manage-dispute-reasons" element={<ProtectedRoute><AdminManageDisputes /></ProtectedRoute>} />
              
              {/* --- (2. 'यह' (This) 'रहा' (is) 'आपका' (your) 'नया' (new) 'राउट' (route) (मार्ग)) --- */}
              <Route path="/senior-earnings" element={<ProtectedRoute><SeniorEarningsPage /></ProtectedRoute>} />
            
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;