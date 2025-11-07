// src/pages/HomePage.js

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import FeaturedSeniors from "../components/FeaturedSeniors";
import CollegeMap from "../components/CollegeMap";
import { colleges } from "../components/colleges";

function HomePage() {
  // आपका IntersectionObserver (Fade-in-up) इफ़ेक्ट
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 }
    );
    fadeElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // --- 🎨 इनलाइन स्टाइल्स ---

  const collegeSectionStyle = {
    padding: "80px 20px",
    textAlign: "center",
    backgroundColor: "#fff",
    opacity: 0,
    transform: "translateY(40px)",
    transition: "all 1s ease",
  };

  const sectionTitleStyle = {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#007BFF",
    marginBottom: "15px",
  };

  const sectionDescStyle = {
    color: "#555",
    marginBottom: "50px",
    fontSize: "1.05rem",
    maxWidth: "800px",
    margin: "0 auto 50px auto",
  };

  const collegeGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const collegeCardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    textAlign: "left",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardImageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  };

  const cardContentStyle = {
    padding: "20px",
  };

  // ⭐ 1. (एरर फिक्स) दोनों बटनों के लिए स्टाइल ऑब्जेक्ट
  const ctaButtonStyle = {
    background: "#fff",
    color: "#007BFF",
    fontWeight: "600",
    padding: "14px 35px",
    borderRadius: "50px",
    fontSize: "1.1rem",
    textDecoration: "none",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    transition: "0.3s ease",
    display: "inline-block",
  };
return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f9fbfd",
        color: "#333",
        // 'overflowX: "hidden"' को यहाँ से हटा दिया गया है
      }}
    >
      {/* 🌟 HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #007BFF, #00B4D8)",
          color: "white",
          textAlign: "center",
          padding: "100px 20px",
          position: "relative",
          overflow: "hidden", // ⭐ यह सही जगह है
        }}  ></section>
      {/* 🌟 HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #007BFF, #00B4D8)",
          color: "white",
          textAlign: "center",
          padding: "100px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Motion Blobs... */}
        
        {/* ⭐ 2. (एरर फिक्स) एनीमेशन को ठीक किया गया */}
        <style>
          {`
            @keyframes floatBlob {
              0%,100% { transform: translateY(0); }
              50% { transform: translateY(-30px); }
            }
          `}
        </style>

        <div
          className="fade-in-up"
          style={{
            opacity: 0,
            transform: "translateY(40px)",
            transition: "all 1s ease",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "20px" }}>
            🎓 Choose Your Best College in REAP
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", marginBottom: "40px" }}>
            Hostel, Faculty, Placements? <br /> Ask a senior from that college directly.
          </p>
          
          {/* ⭐ 3. (एरर फिक्स) Link पर सही स्टाइल लगाया गया */}
          <Link 
            to="/register" 
            style={ctaButtonStyle}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            🚀 Get Started Now
          </Link>
        </div>
      </section>

      {/* 🏛️ नया सेक्शन: TOP COLLEGES */}
      <section className="fade-in-up" style={collegeSectionStyle}>
        <h2 style={sectionTitleStyle}>🏛️ Explore Top Colleges in Rajasthan</h2>
        <p style={sectionDescStyle}>
          Get a glimpse of the top institutions participating in REAP.
        </p>
        <div style={collegeGridStyle}>
          {colleges.slice(0, 6).map((college) => (
            <div
              key={college.name}
              style={collegeCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
              }}
            >
              {/* !! जरूरी !!
                नीचे दी गई <img src={college.image}> लाइन तभी काम करेगी 
                जब आप 'colleges.js' फ़ाइल में असली इमेज URL डालेंगे। 
              */}
              <img src={college.image} alt={college.name} style={cardImageStyle} />
              <div style={cardContentStyle}>
                <h3 style={{ margin: "0 0 5px 0", color: "#007BFF" }}>
                  {college.name}
                </h3>
                <p style={{ margin: 0, color: "#555" }}>📍 {college.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ नया सेक्शन: INTERACTIVE MAP */}
      <section
        className="fade-in-up"
        style={{
          padding: "80px 20px",
          backgroundColor: "#f0f6ff",
          textAlign: "center",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2 style={sectionTitleStyle}>🗺️ Find Colleges on the Map</h2>
        <p style={sectionDescStyle}>
          Visually explore the locations of all major REAP colleges across Rajasthan.
        </p>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <CollegeMap />
        </div>
      </section>

      {/* ⭐ FEATURED SENIORS */}
      <section
        className="fade-in-up"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          backgroundColor: "#fff",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2 style={sectionTitleStyle}>⭐ Featured Seniors</h2>
        <p style={sectionDescStyle}>
          Get insights from real students who’ve experienced your dream college.
        </p>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FeaturedSeniors />
        </div>
      </section>

      {/* 💡 HOW IT WORKS */}
      <section
        className="fade-in-up"
        style={{
          padding: "80px 20px",
          backgroundColor: "#f0f6ff",
          textAlign: "center",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2 style={sectionTitleStyle}>💡 How It Works</h2>
        <p style={sectionDescStyle}>
          Just register, choose your preferred senior, and book a call. Real
          advice. Real students. Real experiences.
        </p>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <HowItWorks />
        </div>
      </section>

      {/* 🌠 CALL TO ACTION */}
      <section
        className="fade-in-up"
        style={{
          background: "linear-gradient(135deg, #007BFF, #00B4D8)",
          color: "#fff",
          textAlign: "center",
          padding: "80px 20px",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2 style={{ fontSize: "1.9rem", fontWeight: "600", marginBottom: "25px" }}>
          Your college journey starts with the right guidance 🌟
        </h2>
        
        {/* ⭐ 4. (एरर फिक्स) दूसरे Link पर भी सही स्टाइल लगाया गया */}
        <Link 
          to="/register" 
          style={ctaButtonStyle}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}

export default HomePage;