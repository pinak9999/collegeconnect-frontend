import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0); // पेज खुलने पर हमेशा टॉप पर रहे
  }, []);

  return (
    <>
      {/* 🌌 Cosmic & Glassmorphism Styles specifically for About Page */}
      <style>
        {`
          .about-container {
            font-family: 'Poppins', sans-serif;
            background-color: #030014;
            background-image: 
              radial-gradient(circle at 20% 40%, rgba(79, 70, 229, 0.15), transparent 50%),
              radial-gradient(circle at 80% 60%, rgba(139, 92, 246, 0.15), transparent 50%),
              url('https://images.unsplash.com/photo-1534796636912-3652c7112006?q=80&w=2560&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-blend-mode: screen;
            color: #ffffff;
            min-height: 100vh;
            padding: 120px 20px 80px 20px;
            text-align: center;
          }

          .about-glass-card {
            background: rgba(10, 10, 25, 0.4);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            border-left: 1px solid rgba(255, 255, 255, 0.15);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 
                        inset 0 0 20px rgba(139, 92, 246, 0.1);
            padding: 40px;
            margin: 20px auto;
            max-width: 800px;
            text-align: left;
            transition: transform 0.3s ease;
          }

          .about-glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(79, 70, 229, 0.3), 
                        inset 0 0 30px rgba(139, 92, 246, 0.2);
          }

          .text-gradient {
            background: linear-gradient(to right, #ffffff, #A5B4FC, #C084FC);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
            filter: drop-shadow(0 0 10px rgba(165, 180, 252, 0.3));
          }
        `}
      </style>

      <div className="about-container">
        <h1 className="text-gradient" style={{ fontSize: "3rem", marginBottom: "10px" }}>
          About Reapify
        </h1>
        <p style={{ color: "#aaa", fontSize: "1.2rem", marginBottom: "50px" }}>
          Simplifying engineering admission & beyond.
        </p>

        {/* 🚀 Mission Card */}
        <div className="about-glass-card">
          <h2 style={{ color: "#A5B4FC", marginBottom: "15px", fontSize: "1.8rem" }}>🎯 Our Mission</h2>
          <p style={{ color: "#ddd", lineHeight: "1.8", fontSize: "1.05rem" }}>
            Every year, thousands of students in Rajasthan struggle to find the right college through REAP. 
            They rely on outdated information or biased agents. At <strong>Reapify</strong>, our mission is to bring 
            100% transparency to college admissions. We connect you directly with real seniors who have lived 
            the experience, so you can make the most important decision of your life with confidence.
          </p>
        </div>

        {/* 🚀 The Story Card */}
        <div className="about-glass-card">
          <h2 style={{ color: "#34D399", marginBottom: "15px", fontSize: "1.8rem" }}>💡 The Story Behind Reapify</h2>
          <p style={{ color: "#ddd", lineHeight: "1.8", fontSize: "1.05rem" }}>
            Reapify was founded by <strong>Pinak Dave</strong>, a student who realized the massive gap between 
            college brochures and college reality. What started as a simple idea to help juniors has now evolved 
            into a premium platform aiming to revolutionize how Indian students choose their engineering destiny.
          </p>
        </div>

        {/* 🚀 CTA */}
        <div style={{ marginTop: "50px" }}>
          <Link to="/register" style={{
            background: "linear-gradient(135deg, #4F46E5, #9333EA)",
            color: "white",
            padding: "15px 40px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)"
          }}>
            Join the Revolution 🚀
          </Link>
        </div>
      </div>
    </>
  );
}

export default About;