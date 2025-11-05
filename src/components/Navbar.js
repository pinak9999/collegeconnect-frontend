import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. 'Context' (कॉन्टेक्स्ट) (बक्सा) 'इम्पोर्ट' (import) करें
import toast from 'react-hot-toast'; // 2. 'Toasts' (टोस्ट) 'इम्पोर्ट' (import) करें

function Navbar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth(); // 3. 'Context' (कॉन्टेक्स्ट) (बक्से) से 'auth' (ऑथ) 'स्टेट' (state) (स्थिति) *और* 'logout' (लॉगआउट) 'फंक्शन' (function) 'लें' (Get)

  const logoutHandler = () => {
    logout(); // 4. (यह 'Context' (कॉन्टेक्स्ट) (बक्से) का 'फंक्शन' (function) 'कॉल' (call) (call) करेगा)
    toast.success('Logged out successfully.'); // (नया 'Toast' (टोस्ट) 'मैसेज' (message) (संदेश))
    navigate('/');
    // (window.location.reload() 'हटा' (remove) दिया गया है!)
  };

  const getDashboardLink = () => {
    if (auth.user.role === 'Admin') return '/admin-dashboard';
    if (auth.user.isSenior) return '/senior-dashboard';
    return '/student-dashboard';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">CollegeConnect</Link> 
        <ul className="nav-links">
          {/* 5. (यह 'Context' (कॉन्टेक्स्ट) (बक्से) से 'डेटा' (data) 'पढ़' (read) 'रहा' (reading) 'है' (है)) */}
          {auth.isAuthenticated && auth.user ? (
            <>
              {auth.user.role === 'Student' && auth.user.wallet_balance > 0 && (
                <li style={{fontWeight: 600, color: '#2ecc71'}}>
                  Wallet: ₹{auth.user.wallet_balance}
                </li>
              )}
              <li><Link to={getDashboardLink()} className="btn btn-secondary">Dashboard</Link></li>
              <li><button onClick={logoutHandler} className="btn btn-primary">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/register" className="btn btn-secondary">Register</Link></li>
              <li><Link to="/login" className="btn btn-primary">Login</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;