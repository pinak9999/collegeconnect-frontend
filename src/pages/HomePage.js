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

  const primaryColor = "#4F46E5"; // एक ज़्यादा एडवांस्ड, रिच Indigo/Violet
  const gradient = "linear-gradient(135deg, #4F46E5, #3B82F6)"; // नया ग्रेडिएंट
  const lightBg = "#f9fafb"; // हल्का ग्रे बैकग्राउंड
  const darkText = "#111827"; // डार्क टेक्स्ट
  const lightText = "#4B5563"; // हल्का टेक्स्ट

  const heroTitle = {
    fontSize: isMobile ? "2.2rem" : "3rem", // थोड़ा बड़ा और ज़्यादा इम्पैक्टफुल
    fontWeight: 800,
    margin: "0 0 20px 0",
    lineHeight: 1.3,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // टेक्स्ट को पॉप करने के लिए शैडो
  };
  const heroDesc = {
    fontSize: isMobile ? "1rem" : "1.2rem",
    color: "rgba(255, 255, 255, 0.95)", // थोड़ी ज़्यादा विजिबिलिटी
    marginBottom: "40px",
    maxWidth: 600,
    margin: "0 auto 40px auto",
  };
  const ctaBtn = {
    background: "#ffffff",
    color: primaryColor, // प्राइमरी कलर का टेक्स्ट
    fontWeight: 700, // ज़्यादा बोल्ड
    padding: isMobile ? "14px 30px" : "16px 40px", // थोड़ा बड़ा बटन
    borderRadius: 50,
    fontSize: isMobile ? "1rem" : "1.1rem",
    textDecoration: "none",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", // ज़्यादा सॉफ्ट शैडो
    transition: "all 0.25s ease",
    display: "inline-block",
  };
  const sectionBase = {
    padding: isMobile ? "60px 20px" : "90px 25px", // ज़्यादा वर्टिकल पैडिंग
    textAlign: "center",
    opacity: 0,
    transform: "translateY(40px)",
    transition: "all 1s ease",
  };
  const sectionTitle = {
    fontSize: isMobile ? "1.8rem" : "2.4rem", // ज़्यादा प्रमुख टाइटल
    fontWeight: 700,
    color: primaryColor, // नया प्राइमरी कलर
    margin: "0 0 15px 0",
  };
  const sectionDesc = {
    color: lightText, // नया लाइट टेक्स्ट कलर
    margin: "0 auto 40px auto",
    fontSize: isMobile ? "1rem" : "1.1rem",
    maxWidth: 800,
    lineHeight: 1.7, // बेहतर रीडेबिलिटी
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(auto-fit, minmax(280px, 1fr))"
      : "repeat(auto-fit, minmax(320px, 1fr))", // थोड़े बड़े कार्ड्स
    gap: isMobile ? "25px" : "35px", // ज़्यादा गैप
    maxWidth: 1200,
    margin: "0 auto",
  };
  
  // कार्ड के लिए बेस शैडो
  const cardBaseShadow = "0 8px 30px rgba(0, 0, 0, 0.06)";
  // कार्ड के लिए एडवांस्ड कलर्ड होवर शैडो
  const cardHoverShadow = `0 12px 35px rgba(79, 70, 229, 0.15)`; // ${primaryColor} का हल्का शैडो

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: lightBg, // बेस बैकग्राउंड
        color: darkText, // बेस टेक्स्ट
        overflowX: "hidden",
      }}
    >
      {/* 🌟 HERO */}
      <section
        style={{
          background: gradient, // नया ग्रेडिएंट
          color: "white",
          textAlign: "center",
          padding: isMobile ? "80px 20px" : "120px 20px", // ज़्यादा पैडिंग
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

      {/* 🏛️ TOP COLLEGES */}
      <section className="fade-in-up" style={{ ...sectionBase, background: "#ffffff" }}>
        <h2 style={sectionTitle}>🏛️ Explore Top Colleges in Rajasthan</h2>
        <p style={sectionDesc}>Get a glimpse of the top institutions participating in REAP.</p>
        <div style={gridStyle}>
          {colleges.slice(0, 6).map((college) => (
            <div
              key={college.name}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                boxShadow: cardBaseShadow, // बेस शैडो
                overflow: "hidden",
                textAlign: "left",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"; // ज़्यादा लिफ़्ट
                e.currentTarget.style.boxShadow = cardHoverShadow; // कलर्ड शैडो
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = cardBaseShadow; // वापस बेस शैडो
              }}
            >
              <img
                src={college.image}
                alt={college.name}
                style={{
                  width: "100%",
                  height: isMobile ? "180px" : "220px", // थोड़ी ज़्यादा हाइट
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "20px 22px" }}> {/* ज़्यादा पैडिंग */}
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
      <section className="fade-in-up" style={{ ...sectionBase, background: lightBg }}>
        <h2 style={sectionTitle}>🗺️ Find Colleges on the Map</h2>
        <p style={sectionDesc}>
          Visually explore the locations of all major REAP colleges across Rajasthan.
        </p>
        <div style={{ maxWidth: 1100, margin: "0 auto", borderRadius: '16px', overflow: 'hidden', boxShadow: cardBaseShadow }}>
          <CollegeMap />
        </div>
      </section>

      {/* ⭐ SENIORS */}
      <section className="fade-in-up" style={{ ...sectionBase, background: "#ffffff" }}>
        <h2 style={sectionTitle}>⭐ Featured Seniors</h2>
        <p style={sectionDesc}>
          Get insights from real students who’ve experienced your dream college.
        </p>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FeaturedSeniors />
        </div>
      </section>

      {/* 💡 HOW IT WORKS */}
      <section className="fade-in-up" style={{ ...sectionBase, background: lightBg }}>
        <h2 style={sectionTitle}>💡 How It Works</h2>
        <p style={sectionDesc}>
          Just register, choose your preferred senior, and book a call. Real advice. Real
          students. Real experiences.
        </p>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <HowItWorks />
        </div>
      </section>

      {/* 🌠 CTA */}
      <section
        className="fade-in-up"
        style={{
          background: gradient, // नया ग्रेडिएंट
          color: "#fff",
          textAlign: "center",
          padding: isMobile ? "70px 20px" : "90px 20px",
          transition: "all 1s ease",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.6rem" : "2rem", // ज़्यादा इम्पैक्टफुल
            fontWeight: 700, // ज़्यादा बोल्ड
            marginBottom: "30px", // ज़्यादा स्पेस
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