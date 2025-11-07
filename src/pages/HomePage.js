import React from 'react';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import FeaturedSeniors from '../components/FeaturedSeniors';

const Hero = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #007BFF, #00B4D8)',
        color: 'white',
        textAlign: 'center',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating animation circles */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float1 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '160px',
          height: '160px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float2 8s ease-in-out infinite',
        }}
      />

      <style>
        {`
          @keyframes float1 {
            0% { transform: translateY(0); }
            50% { transform: translateY(-25px); }
            100% { transform: translateY(0); }
          }
          @keyframes float2 {
            0% { transform: translateY(0); }
            50% { transform: translateY(25px); }
            100% { transform: translateY(0); }
          }
          @media (max-width: 768px) {
            h1.hero-title {
              font-size: 1.9rem !important;
              padding: 0 10px;
            }
            p.hero-subtitle {
              font-size: 1rem !important;
              line-height: 1.5 !important;
              margin-bottom: 25px !important;
            }
            a.hero-btn {
              padding: 12px 25px !important;
              font-size: 1rem !important;
            }
          }
        `}
      </style>

      {/* Main Content */}
      <div
        className="fade-in-up"
        style={{
          opacity: 0,
          transform: 'translateY(25px)',
          transition: 'all 1s ease',
          maxWidth: '700px',
          zIndex: 2,
        }}
      >
        <h1
          className="hero-title"
          style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            marginBottom: '20px',
            lineHeight: '1.3',
          }}
        >
          Discover Your Dream College in REAP 🎓
        </h1>

        <p
          className="hero-subtitle"
          style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.92)',
            marginBottom: '35px',
            lineHeight: '1.6',
            maxWidth: '550px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Get authentic reviews from real seniors. <br />
          Hostel, placements, faculty — ask anything!
        </p>

        <Link
          to="/register"
          className="hero-btn"
          style={{
            background: '#fff',
            color: '#007BFF',
            padding: '14px 40px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.08)';
            e.target.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
          }}
        >
          🚀 Get Started
        </Link>
      </div>
    </section>
  );
};


function HomePage() {
  return (
    <div
      className="homepage"
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#f9fbfd',
        color: '#333',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <Hero />

      {/* Featured Seniors Section */}
      <section
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#007BFF',
          }}
        >
          Featured Seniors
        </h2>
        <p style={{ color: '#555', marginBottom: '40px' }}>
          Connect with top seniors from different colleges and get real guidance.
        </p>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FeaturedSeniors />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          padding: '60px 20px',
          backgroundColor: '#f4f7fb',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#007BFF',
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            color: '#555',
            fontSize: '1rem',
            maxWidth: '700px',
            margin: '0 auto 40px',
          }}
        >
          Just register, choose your preferred senior, and book a session to get answers directly from experienced students.
        </p>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <HowItWorks />
        </div>
      </section>

      {/* Footer CTA */}
      <section
        style={{
          background: '#007BFF',
          color: '#fff',
          textAlign: 'center',
          padding: '60px 20px',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '20px' }}>
          Start your college journey with real guidance.
        </h2>
        <Link
          to="/register"
          style={{
            background: '#fff',
            color: '#007BFF',
            fontWeight: '600',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
