import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    toast.success('Logged out successfully 🎉');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (auth.user?.role === 'Admin') return '/admin-dashboard';
    if (auth.user?.isSenior) return '/senior-dashboard';
    return '/student-dashboard';
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'linear-gradient(90deg,#2563eb,#1e40af)',
        color: 'white',
        padding: '12px 20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Navbar Container */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* 🎓 Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '1px',
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          College<span style={{ color: '#bfdbfe' }}>Connect</span>
        </Link>

        {/* 📱 Hamburger for Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.8rem',
            cursor: 'pointer',
            display: 'block',
          }}
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* 🌐 Navigation Links */}
        <ul
          style={{
            listStyle: 'none',
            display: menuOpen ? 'block' : 'flex',
            flexDirection: menuOpen ? 'column' : 'row',
            gap: menuOpen ? '15px' : '25px',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            position: menuOpen ? 'absolute' : 'static',
            top: menuOpen ? '60px' : 'auto',
            right: menuOpen ? '10px' : '0',
            background: menuOpen ? 'rgba(255,255,255,0.95)' : 'transparent',
            borderRadius: menuOpen ? '12px' : '0',
            boxShadow: menuOpen ? '0 6px 20px rgba(0,0,0,0.15)' : 'none',
            padding: menuOpen ? '15px 20px' : '0',
            transition: 'all 0.4s ease',
          }}
        >
          {auth.isAuthenticated && auth.user ? (
            <>
              {/* Dashboard Link */}
              <li>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
                    transition: 'all 0.3s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  📊 Dashboard
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={() => {
                    logoutHandler();
                    setMenuOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(45deg,#ef4444,#dc2626)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(239,68,68,0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Register */}
              <li>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'linear-gradient(45deg,#6366f1,#4f46e5)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                    transition: '0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  📝 Register
                </Link>
              </li>

              {/* Login */}
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'linear-gradient(45deg,#10b981,#059669)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(16,185,129,0.3)',
                    transition: '0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  🔐 Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
