import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import FeaturedSeniors from '../components/FeaturedSeniors';

// Scroll animation (simple fade effect)
const useScrollAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const Hero = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #007BFF, #00B4D8)',
        color: 'white',
        textAlign: 'center',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating circles animation */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float1 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float2 8s ease-in-out infinite',
        }}
      />

      <style>
        {`
          @keyframes float1 { 0% { transform: translateY(0);} 50% {transform: translateY(-30px);} 100% {transform: translateY(0);} }
          @keyframes float2 { 0% { transform: translateY(0);} 50% {transform: translateY(40px);} 100% {transform: translateY(0);} }
        `}
      </style>

      <div className="fade-in-up" style={{ opacity: 0, transform: 'translateY(30px)', transition: 'all 1s ease' }}>
        <h1
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
          style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            lineHeight: '1.5',
          }}
        >
          Get authentic reviews from real seniors. <br />
          Hostel, placements, faculty — ask anything!
        </p>

        <Link
          to="/register"
          style={{
            background: '#fff',
            color: '#007BFF',
            padding: '14px 35px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
            transition: '0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          🚀 Get Started
        </Link>
      </div>
    </section>
  );
};

function HomePage() {
  useScrollAnimation();

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#f8fbff',
        color: '#333',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Section */}
      <Hero />

      {/* Featured Seniors Section */}
      <section
        className="fade-in-up"
        style={{
          padding: '80px 20px',
          textAlign: 'center',
          background: '#fff',
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'all 0.8s ease',
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#007BFF',
            marginBottom: '15px',
          }}
        >
          ⭐ Featured Seniors
        </h2>
        <p style={{ color: '#555', marginBottom: '40px', fontSize: '1.05rem' }}>
          Talk with top students who’ve been where you want to go.
        </p>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FeaturedSeniors />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="fade-in-up"
        style={{
          padding: '80px 20px',
          background: '#f0f6ff',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'all 0.8s ease',
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#007BFF',
            marginBottom: '20px',
          }}
        >
          💡 How It Works
        </h2>
        <p
          style={{
            color: '#555',
            fontSize: '1rem',
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: '1.6',
          }}
        >
          Just register, pick your preferred senior, and book a call.
          Real insights. Real guidance. No more confusion!
        </p>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <HowItWorks />
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="fade-in-up"
        style={{
          background: 'linear-gradient(135deg, #007BFF, #00B4D8)',
          color: '#fff',
          textAlign: 'center',
          padding: '80px 20px',
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'all 0.8s ease',
        }}
      >
        <h2 style={{ fontSize: '1.9rem', fontWeight: '600', marginBottom: '25px' }}>
          Your future starts with the right guidance 🌟
        </h2>
        <Link
          to="/register"
          style={{
            background: '#fff',
            color: '#007BFF',
            fontWeight: '600',
            padding: '14px 35px',
            borderRadius: '50px',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: '0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
