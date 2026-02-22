import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import FeaturedSeniors from "../components/FeaturedSeniors";
import CollegeMap from "../components/CollegeMap";
import { colleges } from "../components/colleges";

function HomePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resizeHandler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // --- डार्क स्पेस थीम और ग्लासमॉर्फिज़्म स्टाइल्स ---

  const lightText = "#9ca3af"; 

  const heroTitle = {
    fontSize: isMobile ? "2rem" : "3.5rem", // मोबाइल पर फॉन्ट थोड़ा और बैलेंस किया
    fontWeight: 800,
    margin: "0 0 15px 0",
    lineHeight: 1.3,
    background: "linear-gradient(to right, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 20px rgba(139, 92, 246, 0.5)", 
  };
  
  const heroDesc = {
    fontSize: isMobile ? "0.95rem" : "1.2rem",
    color: "#d1d5db", 
    marginBottom: isMobile ? "25px" : "40px", // गैप कम किया
    maxWidth: 600,
    margin: isMobile ? "0 auto 25px auto" : "0 auto 40px auto",
    lineHeight: 1.6,
  };

  const ctaBtn = {
    background: "linear-gradient(90deg, #312e81, #4338ca)", 
    color: "#ffffff",
    fontWeight: 600,
    padding: isMobile ? "12px 28px" : "16px 45px",
    borderRadius: 50,
    fontSize: isMobile ? "0.95rem" : "1.1rem",
    textDecoration: "none",
    border: "1px solid rgba(139, 92, 246, 0.5)", 
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.4)", 
    transition: "all 0.3s ease",
    display: "inline-block",
  };

  // 🔴 सबसे बड़ा बदलाव: यहाँ पैडिंग (Gap) बहुत कम कर दी गई है!
  const sectionBase = {
    padding: isMobile ? "35px 15px" : "90px 25px", // मोबाइल पर गैप 60px से घटाकर 35px किया
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  };

  const sectionTitle = {
    fontSize: isMobile ? "1.5rem" : "2.4rem",
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 10px 0",
    textShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
  };

  const sectionDesc = {
    color: lightText,
    margin: isMobile ? "0 auto 25px auto" : "0 auto 40px auto", // गैप कम किया
    fontSize: isMobile ? "0.9rem" : "1.1rem",
    maxWidth: 800,
    lineHeight: 1.6,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(auto-fit, minmax(260px, 1fr))"
      : "repeat(auto-fit, minmax(320px, 1fr))",
    gap: isMobile ? "20px" : "35px", // कार्ड्स के बीच का गैप भी कम किया
    maxWidth: 1200,
    margin: "0 auto",
  };
  
  const glassCardStyle = {
    background: "rgba(17, 24, 39, 0.4)", 
    backdropFilter: "blur(12px)", 
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(139, 92, 246, 0.3)", 
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(139, 92, 246, 0.1)",
    overflow: "hidden",
    textAlign: "left",
    transition: "all 0.4s ease",
  };

  const cardHoverShadow = "0 0 25px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.2)";

  return (
    <>
      <style>
        {`
          .space-container {
            position: relative;
            background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
            min-height: 100vh;
            color: white;
            overflow-x: hidden;
            font-family: 'Poppins', sans-serif;
          }
          .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
              radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 200px 200px;
            animation: twinkle 5s infinite;
            opacity: 0.5;
            z-index: 0;
          }
          .glow-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            z-index: 1;
            opacity: 0.4;
          }
        `}
      </style>

      <div className="space-container">
        <div className="stars"></div>
        <div className="glow-orb" style={{ top: '10%', left: '20%', width: '300px', height: '300px', background: '#4c1d95' }}></div>
        <div className="glow-orb" style={{ top: '50%', right: '10%', width: '400px', height: '400px', background: '#1e3a8a' }}></div>

        {/* 🌟 HERO (यहाँ भी पैडिंग कम कर दी गई है) */}
        <section
          style={{
            textAlign: "center",
            padding: isMobile ? "40px 15px 40px" : "120px 20px 80px", // बहुत बड़ा बदलाव: 120px से घटाकर 40px कर दिया
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1 style={heroTitle}>🎓 Choose Your Best College in REAP</h1>
          <p style={heroDesc}>
            Hostel, Faculty, Placements? <br /> Ask a senior from that college directly.
          </p>
          <Link
            to="/register"
            style={ctaBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.7), inset 0 0 15px rgba(139, 92, 246, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 0 20px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.4)";
            }}
          >
            🚀 Get Started Now
          </Link>
        </section>

        {/* 🏛️ TOP COLLEGES */}
        <section style={{ ...sectionBase, background: "transparent" }}>
          <h2 style={sectionTitle}>🏛️ Explore Top Colleges in Rajasthan</h2>
          <p style={sectionDesc}>Discover the major REAP institutions across Rajasthan.</p>
          <div style={gridStyle}>
            {colleges.slice(0, 6).map((college) => (
              <div
                key={college.name}
                style={glassCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = cardHoverShadow;
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = glassCardStyle.boxShadow;
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                }}
              >
                <img
                  src={college.image}
                  alt={college.name}
                  style={{
                    width: "100%",
                    height: isMobile ? "160px" : "220px", // इमेजेज थोड़ी छोटी कीं ताकि स्क्रीन पर फिट आएँ
                    objectFit: "cover",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <div style={{ padding: "15px 18px" }}>
                  <h3 style={{ margin: "0 0 6px 0", color: "#ffffff", fontSize: '1.15rem', fontWeight: '600' }}>
                    {college.name}
                  </h3>
                  <p style={{ margin: 0, color: lightText, fontSize: "0.85rem" }}>
                    📍 {college.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🗺️ MAP */}
        <section style={{ ...sectionBase, background: "transparent" }}>
          <h2 style={sectionTitle}>🗺️ Find Colleges on the Map</h2>
          <p style={sectionDesc}>
            Visually explore the locations of all major REAP colleges across Rajasthan.
          </p>
          <div style={{ ...glassCardStyle, maxWidth: 1100, margin: "0 auto", padding: isMobile ? '10px' : '15px' }}>
            <CollegeMap />
          </div>
        </section>

        {/* ⭐ SENIORS */}
        <section style={{ ...sectionBase, background: "transparent" }}>
          <h2 style={sectionTitle}>✨ Featured Seniors</h2>
          <p style={sectionDesc}>
            Get insights from real students who’ve experienced your dream college.
          </p>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FeaturedSeniors />
          </div>
        </section>

        {/* 💡 HOW IT WORKS */}
        <section style={{ ...sectionBase, background: "transparent" }}>
          <h2 style={sectionTitle}>🚀 In 3 Easy Steps</h2>
          <p style={sectionDesc}>
            Just register, choose your preferred senior, and book a call. Real advice.
          </p>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <HowItWorks />
          </div>
        </section>

        {/* 🌠 CTA */}
        <section
          style={{
            background: "transparent",
            textAlign: "center",
            padding: isMobile ? "40px 15px 60px" : "90px 20px 120px", // नीचे का गैप भी कम किया
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{
            ...glassCardStyle,
            maxWidth: '800px',
            margin: '0 auto',
            padding: isMobile ? '35px 15px' : '50px 20px',
            background: "linear-gradient(135deg, rgba(30, 20, 60, 0.6), rgba(17, 24, 39, 0.8))"
          }}>
            <h2 style={{
              fontSize: isMobile ? "1.4rem" : "2rem",
              fontWeight: 700,
              marginBottom: isMobile ? "20px" : "30px",
              color: "#fff",
              lineHeight: 1.4,
              textShadow: "0 0 15px rgba(255,255,255,0.4)",
            }}>
              Your college journey starts with the right guidance 🌟
            </h2>
            <Link
              to="/register"
              style={ctaBtn}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.7), inset 0 0 15px rgba(139, 92, 246, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 0 20px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.4)";
              }}
            >
              Join Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;