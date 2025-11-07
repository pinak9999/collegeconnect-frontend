import React from 'react';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import FeaturedSeniors from '../components/FeaturedSeniors';

const Hero = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #007BFF 0%, #0056b3 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <h1
          style={{
            fontSize: '2.3rem',
            fontWeight: '700',
            marginBottom: '15px',
            lineHeight: '1.3',
          }}
        >
          Choose Your Best College in REAP
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          Hostel, Faculty, Placements? <br />
          Ask a senior from that college directly.
        </p>

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
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: '0.3s ease',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#f8f9fa')}
          onMouseLeave={(e) => (e.target.style.background = '#fff')}
        >
          🚀 Get Started Now
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
