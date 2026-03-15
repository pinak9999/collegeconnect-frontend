import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import FeaturedSeniors from "../components/FeaturedSeniors";
import CollegeMap from "../components/CollegeMap";
import { colleges } from "../components/colleges";
import AIMatchmaker from '../components/AIMatchmaker';

function HomePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resizeHandler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resizeHandler);

    // fade animation observer
    const fadeElements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        }),
      { threshold: 0.2 }
    );
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // --- एडवांस्ड और मॉडर्न इनलाइन स्टाइल्स ---

  const primaryColor = "#4F46E5"; 
  const gradient = "linear-gradient(135deg, #4F46E5, #3B82F6)"; 
  const lightBg = "#f9fafb"; 
  const darkText = "#111827"; 
  const lightText = "#4B5563"; 

  // 🚀 फिक्स: हीरो सेक्शन की टाइपोग्राफी मोबाइल के लिए परफेक्ट कर दी गई है
  const heroTitle = {
    fontSize: isMobile ? "1.6rem" : "3rem", // 2.2rem से घटाकर 1.6rem किया (मोबाइल के लिए बेस्ट)
    fontWeight: 800,
    margin: isMobile ? "0 0 12px 0" : "0 0 20px 0",
    lineHeight: 1.3,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    padding: isMobile ? "0 10px" : "0", // किनारों से ना चिपके
  };
  
  const heroDesc = {
    fontSize: isMobile ? "0.9rem" : "1.2rem", // थोड़ा छोटा किया
    color: "rgba(255, 255, 255, 0.95)",
    maxWidth: 600,
    margin: isMobile ? "0 auto 25px auto" : "0 auto 40px auto", // गैप कम किया
    lineHeight: 1.5,
    padding: isMobile ? "0 15px" : "0",
  };
  
  const ctaBtn = {
    background: "#ffffff",
    color: primaryColor,
    fontWeight: 700,
    padding: isMobile ? "12px 28px" : "16px 40px", // मोबाइल पर बटन थोड़ा कॉम्पैक्ट
    borderRadius: 50,
    fontSize: isMobile ? "0.95rem" : "1.1rem",
    textDecoration: "none",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.25s ease",
    display: "inline-block",
  };
  
  const sectionBase = {
    padding: isMobile ? "50px 15px" : "90px 25px", // मोबाइल पर पैडिंग कम की
    textAlign: "center",
    opacity: 0,
    transform: "translateY(40px)",
    transition: "all 1s ease",
  };
  
  const sectionTitle = {
    fontSize: isMobile ? "1.5rem" : "2.4rem", // सेक्शन टाइटल्स भी मोबाइल फ्रेंडली
    fontWeight: 800,
    color: primaryColor,
    margin: "0 0 15px 0",
  };
  
  const sectionDesc = {
    color: lightText,
    margin: "0 auto 30px auto",
    fontSize: isMobile ? "0.95rem" : "1.1rem",
    maxWidth: 800,
    lineHeight: 1.6,
    padding: isMobile ? "0 10px" : "0",
  };
  
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(auto-fit, minmax(280px, 1fr))"
      : "repeat(auto-fit, minmax(320px, 1fr))",
    gap: isMobile ? "20px" : "35px",
    maxWidth: 1200,
    margin: "0 auto",
  };
  
  const cardBaseShadow = "0 8px 30px rgba(0, 0, 0, 0.06)";
  const cardHoverShadow = `0 12px 35px rgba(79, 70, 229, 0.15)`;

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: lightBg,
        color: darkText,
        overflowX: "hidden",
      }}
    >
      {/* 🌟 HERO */}
      <section
        style={{
          background: gradient,
          color: "white",
          textAlign: "center",
          // 🚀 फिक्स: मोबाइल पर टॉप/बॉटम पैडिंग 80px से 50px कर दी
          padding: isMobile ? "50px 15px" : "120px 20px",
          position: "relative",
        }}
        className="fade-in-up"
      >
        <h1 style={heroTitle}>🎓 Choose Your Best College in REAP</h1>
        <p style={heroDesc}>
          Hostel, Faculty, Placements? <br /> Ask a senior from that college
          directly.
        </p>
        <Link
          to="/register"
          style={ctaBtn}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🚀 Get Started Now
        </Link>
      </section>

      {/* 🤖 AI MATCHMAKER SECTION */}
      <section className="fade-in-up" style={{ padding: isMobile ? "40px 10px" : "60px 20px", background: "rgb(234 235 253)" }}>
        <AIMatchmaker />
      </section>

      {/* 🏛️ TOP COLLEGES */}
      <section className="fade-in-up" style={{ ...sectionBase, background: "#e3e8fd" }}>
        <h2 style={sectionTitle}>🏛️ Explore Top Colleges in Rajasthan</h2>
        <p style={sectionDesc}>Get a glimpse of the top institutions participating in REAP.</p>
        <div style={gridStyle}>
          {colleges.slice(0, 6).map((college) => (
            <div
              key={college.name}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                boxShadow: cardBaseShadow,
                overflow: "hidden",
                textAlign: "left",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = cardHoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = cardBaseShadow;
              }}
            >
              <img
                src={college.image}
                alt={college.name}
                style={{
                  width: "100%",
                  height: isMobile ? "180px" : "220px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "20px 22px" }}>
                <h3 style={{ margin: "0 0 8px 0", color: primaryColor, fontSize: '1.25rem' }}>
                  {college.name}
                </h3>
                <p style={{ margin: 0, color: lightText, fontSize: "0.95rem" }}>
                  📍 {college.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🗺️ MAP */}
      <section className="fade-in-up" style={{ 
        ...sectionBase, 
        background: "linear-gradient(rgb(201 209 255) 0%, rgb(243 209 235) 100%)",
        paddingBottom: isMobile ? "50px" : "80px"
      }}>
        <h2 style={{ ...sectionTitle, color: "#2e1065" }}>
          🗺️ Find Colleges on the Map
        </h2>
        
        <p style={{ ...sectionDesc, color: "#4b5563" }}>
          Visually explore the locations of all major REAP colleges across Rajasthan.
        </p>

        <div style={{ 
          maxWidth: 1100, 
          margin: "0 auto", 
          borderRadius: '24px',
          overflow: 'hidden', 
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          padding: "10px", 
        }}>
          <CollegeMap />
        </div>
      </section>

      {/* FEATURED SENIORS */}
      <section
        className="fade-in-up"
        style={{
          ...sectionBase,
          padding: isMobile ? "0" : "40px 0px",
          background: "rgb(234 235 253)"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FeaturedSeniors />
        </div>
      </section>

     {/* 💡 HOW IT WORKS */}
      <section 
        className="fade-in-up" 
        style={{ 
          opacity: 0, 
          transform: "translateY(40px)",
          transition: "all 1s ease",
          background: "linear-gradient(rgb(232 232 255) 0%, rgb(197 220 255) 100%)",
          padding: isMobile ? "50px 15px" : "90px 20px", 
          textAlign: "center"
        }}
      >
        <h2 style={sectionTitle}>💡 How It Works</h2>
        <p style={sectionDesc}>
          Just register, choose your preferred senior, and book a call. Real advice. Real
          students. Real experiences.
        </p>
        
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <HowItWorks />
        </div>
      </section>

      {/* 🌠 CTA */}
      <section
        className="fade-in-up"
        style={{
          background: gradient, 
          color: "#fff",
          textAlign: "center",
          padding: isMobile ? "50px 15px" : "90px 20px",
          transition: "all 1s ease",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.4rem" : "2rem",
            fontWeight: 700,
            marginBottom: isMobile ? "20px" : "30px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          Your college journey starts with the right guidance 🌟
        </h2>
        <Link
          to="/register"
          style={ctaBtn}
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