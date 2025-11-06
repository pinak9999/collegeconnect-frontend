import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
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
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        padding: '10px 16px',
        transition: '0.3s ease',
      }}
    >
      {/* Container */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* LOGO */}
        <Link
          to="/"
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            textDecoration: 'none',
            color: '#fff',
            letterSpacing: '0.5px',
          }}
        >
          College<span style={{ color: '#bfdbfe' }}>Connect</span>
        </Link>

        {/* HAMBURGER ICON (Visible only in mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1.8rem',
            cursor: 'pointer',
            display: 'block',
          }}
        >
          {menuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* NAV LINKS (Below in mobile view) */}
      <div
        style={{
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          marginTop: '10px',
          borderRadius: '12px',
          padding: '15px 0',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {auth.isAuthenticated && auth.user ? (
          <>
            <Link
              to={getDashboardLink()}
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#fff',
                background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                width: '85%',
                textAlign: 'center',
                marginBottom: '10px',
                boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
              }}
            >
              📊 Dashboard
            </Link>
            <button
              onClick={() => {
                logoutHandler();
                setMenuOpen(false);
              }}
              style={{
                background: 'linear-gradient(45deg,#ef4444,#dc2626)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                width: '85%',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(239,68,68,0.3)',
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'linear-gradient(45deg,#6366f1,#4f46e5)',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                width: '85%',
                textAlign: 'center',
                marginBottom: '10px',
                boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
              }}
            >
              📝 Register
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                background: 'linear-gradient(45deg,#10b981,#059669)',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                width: '85%',
                textAlign: 'center',
                boxShadow: '0 3px 10px rgba(16,185,129,0.3)',
              }}
            >
              🔐 Login
            </Link>
          </>
        )}
      </div>

      {/* DESKTOP LINKS (Always visible in large screens) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '20px',
          marginTop: '10px',
        }}
        className="desktop-nav"
      >
        {!menuOpen && (
          <>
            {auth.isAuthenticated && auth.user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  style={{
                    background: 'linear-gradient(45deg,#3b82f6,#2563eb)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(37,99,235,0.3)',
                  }}
                >
                  📊 Dashboard
                </Link>
                <button
                  onClick={logoutHandler}
                  style={{
                    background: 'linear-gradient(45deg,#ef4444,#dc2626)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(239,68,68,0.3)',
                  }}
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  style={{
                    background: 'linear-gradient(45deg,#6366f1,#4f46e5)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                  }}
                >
                  📝 Register
                </Link>

                <Link
                  to="/login"
                  style={{
                    background: 'linear-gradient(45deg,#10b981,#059669)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(16,185,129,0.3)',
                  }}
                >
                  🔐 Login
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
